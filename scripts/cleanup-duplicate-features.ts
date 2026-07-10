/**
 * Clean up duplicate Feature documents.
 * Run: npx tsx scripts/cleanup-duplicate-features.ts
 */

import { MongoClient, ObjectId } from 'mongodb'

const ATLAS_URI =
  'mongodb+srv://sean_db_user:g8WAJYmNq81UwDeY@abs-test-cluster.9e90qjq.mongodb.net/abs-website?appName=abs-test-cluster'

// IDs to delete outright (0 uses, superseded by a better entry)
const DELETE_IDS = [
  '6a318d4d36e3309d087420d5', // Air Conditioning  → Air conditioning
  '6a318d4d36e3309d087420ad', // Audio System       → Audio system
  '6a318d4d36e3309d08742105', // Bow Thruster       → Bow thruster
  '6a318d4d36e3309d087420dd', // Cockpit Table      → Cockpit table
  '6a318d4d36e3309d087420a9', // Depth Sounder      → Depth sounder
  '6a318d4d36e3309d08742109', // Electric Windlass  → Electric windlass (mooring)
  '6a318d4d36e3309d087420b1', // Fire Extinguisher  → Fire extinguisher
  '6a318d4d36e3309d087420fd', // Hydraulic Steering → Hydraulic steering
  '6a318d4d36e3309d087420b5', // Life Raft          → Liferaft
  '6a318d4d36e3309d087420b9', // Navigation Lights  → Navigation lights (electronics)
  '6a318d4d36e3309d087420d1', // Swim Platform      → Swim platform
  '6a318d4d36e3309d087420cd', // Teak Deck          → Teak flooring
  '6a318d4d36e3309d087420e5', // Fridge             → Refrigerator
  '6a318d4d36e3309d0874209d', // VHF Radio          → VHF radio
  '6a318d4d36e3309d087420bd', // Bilge Pump         → replaced by specific types
  '6a318d4d36e3309d087420e1', // Shower             → Freshwater shower
]

// Merge: replace FROM id with TO id in all boat feature arrays, then delete FROM
const MERGES: { from: string; to: string; label: string }[] = [
  {
    from:  '6a5164d575497fa72029a2c7', // Bath platform (3 uses)
    to:    '6a5164d775497fa72029a2db', // Swim platform (4 uses)
    label: 'Bath platform → Swim platform',
  },
]

async function main() {
  const client = new MongoClient(ATLAS_URI)
  await client.connect()
  const db = client.db('abs-website')

  try {
    const featuresCol = db.collection('features')
    const boatsCol    = db.collection('boats')

    // 1. Merges — update boat refs first, then delete the old feature
    for (const { from, to, label } of MERGES) {
      const fromId = new ObjectId(from)
      const toId   = new ObjectId(to)

      const affected = await boatsCol.find({ features: fromId }).toArray()
      for (const boat of affected) {
        // Replace fromId with toId, removing any resulting duplicates
        const updated = [...new Set(
          boat.features.map((id: any) =>
            id.toString() === from ? toId : id
          ).map((id: any) => id.toString())
        )].map((id: string) => new ObjectId(id))

        await boatsCol.updateOne({ _id: boat._id }, { $set: { features: updated } })
        console.log(`  ↳ updated boat "${boat.title?.en}" (${label})`)
      }

      await featuresCol.deleteOne({ _id: fromId })
      console.log(`✓ Merged & deleted: ${label} (${affected.length} boats updated)`)
    }

    // 2. Simple deletes (all have 0 boat uses)
    const deleteIds = DELETE_IDS.map(id => new ObjectId(id))
    const names = await featuresCol
      .find({ _id: { $in: deleteIds } })
      .project({ 'name.en': 1 })
      .toArray()

    const result = await featuresCol.deleteMany({ _id: { $in: deleteIds } })
    for (const n of names) console.log(`✓ Deleted: ${n.name?.en}`)
    console.log(`\n✅ Deleted ${result.deletedCount} duplicates, merged ${MERGES.length} feature(s)`)

    // 3. Final count
    const remaining = await featuresCol.countDocuments()
    console.log(`   Features remaining: ${remaining}`)
  } finally {
    await client.close()
  }
}

main().catch(err => { console.error(err); process.exit(1) })

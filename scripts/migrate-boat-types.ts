/**
 * Re-map boats from the old boat_type values (rib, bow_rider, power_boat,
 * sailboat, aluminium_hull, ...) to the new broad classes in
 * src/lib/boatTypes.ts. RIB / aluminium are hull materials, so they also fill
 * hull_material when it is empty (never overwritten).
 *
 * Dry run by default — prints the plan. Writes only with --apply.
 * NOTE: the Atlas DB is shared with production, so --apply is live at once.
 * Run it together with deploying the matching code.
 *
 *   npx tsx --env-file=.env.local scripts/migrate-boat-types.ts
 *   npx tsx --env-file=.env.local scripts/migrate-boat-types.ts --apply
 */
import { MongoClient } from 'mongodb'

const APPLY = process.argv.includes('--apply')

const BY_OLD_TYPE: Record<string, string> = {
  rib: 'power_speed',
  bow_rider: 'power_speed',
  power_boat: 'power_speed',
  aluminium_hull: 'power_speed',
  sailboat: 'sailing_yacht',
  sports_cruiser: 'sports_cruiser',
  pwc: 'pwc',
}
const DEFAULT_TYPE = 'power_speed' // boats with no type set

// Slug-specific judgement calls that beat the generic mapping above.
const OVERRIDES: Record<string, string> = {
  'williams-turbojet-325': 'tender',
  Mastercraft_xstar_2006: 'wake_ski',
  mastercraft_xt22: 'wake_ski',
  mastercraft_xt22_24: 'wake_ski',
}

const HULL_FROM_OLD_TYPE: Record<string, string> = { rib: 'rib', aluminium_hull: 'aluminium' }

;(async () => {
  const client = new MongoClient(process.env.DATABASE_URI as string)
  await client.connect()
  const boats = client.db().collection('boats')
  const docs = await boats.find({}, { projection: { slug: 1, boat_type: 1, hull_material: 1 } }).toArray()

  let changes = 0
  for (const b of docs) {
    const oldType: string = b.boat_type || ''
    const newType = OVERRIDES[b.slug] ?? BY_OLD_TYPE[oldType] ?? DEFAULT_TYPE
    const set: Record<string, string> = {}
    if (newType !== oldType) set.boat_type = newType
    const hullFill = HULL_FROM_OLD_TYPE[oldType]
    if (hullFill && !b.hull_material) set.hull_material = hullFill

    if (Object.keys(set).length === 0) continue
    changes++
    console.log(`${b.slug.padEnd(36)} type: ${(oldType || '∅').padEnd(15)} -> ${newType.padEnd(15)}${set.hull_material ? ` hull: ∅ -> ${set.hull_material}` : ''}`)
    if (APPLY) await boats.updateOne({ _id: b._id }, { $set: set })
  }

  console.log(`\n${changes} of ${docs.length} boats ${APPLY ? 'updated' : 'would change (dry run — pass --apply to write)'}`)
  await client.close()
})()

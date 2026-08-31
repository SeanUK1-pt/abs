/**
 * Fix the 'brands' CMS page: "Exclusive Brands" -> "Our Brands" (title field
 * and the matching richtext heading), per user request that ABS isn't
 * "exclusive" on MasterCraft.
 * Run: npx tsx scripts/fix-brands-title.ts
 */
import { MongoClient } from 'mongodb'

const ATLAS_URI =
  'mongodb+srv://sean_db_user:g8WAJYmNq81UwDeY@abs-test-cluster.9e90qjq.mongodb.net/abs-website?appName=abs-test-cluster'

async function main() {
  const client = new MongoClient(ATLAS_URI)
  await client.connect()
  const db = client.db('abs-website')
  try {
    const col = db.collection('pages')
    const doc = await col.findOne({ slug: 'brands' })
    if (!doc) { console.log('brands page not found'); return }

    let json = JSON.stringify(doc)
    // Longer/more specific patterns first — 'Exclusive Brands' is a
    // substring of 'Our Exclusive Brands', so doing the short form first
    // would double up ("Our Our Brands") when it hits the longer string.
    const replacements: [string, string][] = [
      ['Our Exclusive Brands', 'Our Brands'],
      ['As Nossas Marcas Exclusivas', 'As Nossas Marcas'],
      ['Exclusive Brands', 'Our Brands'],
      ['Marcas Exclusivas', 'As Nossas Marcas'],
    ]
    for (const [from, to] of replacements) {
      json = json.split(from).join(to)
    }
    const updated = JSON.parse(json)
    delete updated._id

    const result = await col.updateOne({ slug: 'brands' }, { $set: updated })
    console.log('Matched:', result.matchedCount, 'Modified:', result.modifiedCount)

    const after = await col.findOne({ slug: 'brands' })
    console.log('title after:', after?.title)
  } finally {
    await client.close()
  }
}

main().catch(err => { console.error(err); process.exit(1) })

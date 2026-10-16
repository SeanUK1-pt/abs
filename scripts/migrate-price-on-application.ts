/**
 * Backfill the price_on_application flag on every boat: true where the price
 * is 0 or blank (e.g. the MasterCraft boats), false everywhere else. Every
 * boat needs an explicit value so price sorting can put POA boats last.
 *
 * Dry run by default; writes only with --apply. The Atlas DB is shared with
 * production, so --apply is live at once (harmless to the old code, which
 * ignores the field).
 *
 *   npx tsx --env-file=.env.local scripts/migrate-price-on-application.ts
 *   npx tsx --env-file=.env.local scripts/migrate-price-on-application.ts --apply
 */
import { MongoClient } from 'mongodb'

const APPLY = process.argv.includes('--apply')

;(async () => {
  const client = new MongoClient(process.env.DATABASE_URI as string)
  await client.connect()
  const boats = client.db().collection('boats')
  const docs = await boats.find({}, { projection: { slug: 1, price: 1, price_on_application: 1 } }).toArray()

  let changes = 0
  for (const b of docs) {
    const shouldBe = !b.price
    if (b.price_on_application === shouldBe) continue
    changes++
    console.log(`${b.slug.padEnd(36)} price: ${String(b.price ?? '∅').padEnd(8)} price_on_application: ${String(b.price_on_application ?? '∅')} -> ${shouldBe}`)
    if (APPLY) await boats.updateOne({ _id: b._id }, { $set: { price_on_application: shouldBe } })
  }

  console.log(`\n${changes} of ${docs.length} boats ${APPLY ? 'updated' : 'would change (dry run — pass --apply to write)'}`)
  await client.close()
})()

/**
 * Run once to populate the Features collection with the standard library.
 * Usage: npx tsx src/migrations/seed-features.ts
 */

import { getPayload } from 'payload'
import config from '../payload.config'

const FEATURES: { name: string; category: string; filterable: boolean }[] = [
  // Electronics
  { name: 'GPS', category: 'electronics', filterable: true },
  { name: 'Chartplotter', category: 'electronics', filterable: true },
  { name: 'VHF Radio', category: 'electronics', filterable: true },
  { name: 'Radar', category: 'electronics', filterable: true },
  { name: 'AIS', category: 'electronics', filterable: false },
  { name: 'Depth Sounder', category: 'electronics', filterable: false },
  { name: 'Audio System', category: 'electronics', filterable: false },
  // Safety
  { name: 'Fire Extinguisher', category: 'safety', filterable: false },
  { name: 'Life Raft', category: 'safety', filterable: true },
  { name: 'Navigation Lights', category: 'safety', filterable: false },
  { name: 'Bilge Pump', category: 'safety', filterable: false },
  { name: 'EPIRB', category: 'safety', filterable: false },
  { name: 'Flares', category: 'safety', filterable: false },
  // Comfort
  { name: 'Bimini', category: 'comfort', filterable: true },
  { name: 'Teak Deck', category: 'comfort', filterable: true },
  { name: 'Swim Platform', category: 'comfort', filterable: true },
  { name: 'Air Conditioning', category: 'comfort', filterable: true },
  { name: 'Cabin Cushions', category: 'comfort', filterable: false },
  { name: 'Cockpit Table', category: 'comfort', filterable: false },
  { name: 'Shower', category: 'comfort', filterable: true },
  // Galley
  { name: 'Fridge', category: 'galley', filterable: true },
  { name: 'Stove', category: 'galley', filterable: false },
  { name: 'Sink', category: 'galley', filterable: false },
  { name: 'Freshwater Tank', category: 'galley', filterable: false },
  { name: 'Microwave', category: 'galley', filterable: false },
  { name: 'Coffee Machine', category: 'galley', filterable: false },
  // Mechanical
  { name: 'Hydraulic Steering', category: 'mechanical', filterable: false },
  { name: 'Trim Tabs', category: 'mechanical', filterable: false },
  { name: 'Bow Thruster', category: 'mechanical', filterable: true },
  { name: 'Electric Windlass', category: 'mechanical', filterable: false },
  { name: 'Generator', category: 'mechanical', filterable: true },
  { name: 'Autopilot', category: 'mechanical', filterable: true },
  // Mooring
  { name: 'Anchor', category: 'mooring', filterable: false },
  { name: 'Fenders', category: 'mooring', filterable: false },
  { name: 'Dock Lines', category: 'mooring', filterable: false },
  { name: 'Mooring Lines', category: 'mooring', filterable: false },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding features...')
  let created = 0, skipped = 0

  for (const feat of FEATURES) {
    const { docs } = await payload.find({
      collection: 'features',
      where: { name: { equals: feat.name } },
      limit: 1,
    })

    if (docs.length > 0) {
      skipped++
      continue
    }

    await payload.create({
      collection: 'features',
      data: {
        name: feat.name,
        category: feat.category as any,
        filterable: feat.filterable,
      },
    })
    created++
  }

  console.log(`Done. Created: ${created}, Skipped (existing): ${skipped}`)
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})

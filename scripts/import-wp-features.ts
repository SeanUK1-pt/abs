/**
 * Import boat features from WordPress into Payload CMS.
 *
 * What it does:
 *  1. Reads the WP features extracted from MySQL (hardcoded below)
 *  2. Creates Feature documents in the features collection (deduplicated)
 *  3. Updates each Boat's `features` and `custom_features` fields
 *
 * Run from project root:
 *   npx tsx scripts/import-wp-features.ts
 */

import { MongoClient, ObjectId } from 'mongodb'

const ATLAS_URI =
  'mongodb+srv://sean_db_user:g8WAJYmNq81UwDeY@abs-test-cluster.9e90qjq.mongodb.net/abs-website?appName=abs-test-cluster'

// ── WP feature data per woocommerce_product_id ───────────────────────────────

const WP_BOAT_FEATURES: Record<number, string[]> = {
  4743: ['Yamaha Drive By Wire throttle system','Electric Windlass','Console and Seat Covers','Refrigerator','Sink','Wrap around seating','Bimini','Bow Sundeck'],
  4876: ['Garmin GPS','Jessen audio system','Toilet','Bimini','Boat cover','Fresh water shower','Removable bow sunbed','Removable table','Teak flooring'],
  4922: ['Audio system with speakers','Electric bilge pump','Cup holders','Bimini','Overall cover','Swim platform','Swimming ladder'],
  4958: ['Fusion audio system','SIMRAD GPS system','Twin battery system','Anchor','Electric bilge pump','Fire extinguisher','Water ski pole','Windshield in tempered glass','Flagpole','Hydraulic steering','Ambient lighting inside console','Portable toilet','Cockpit sunbed','Cup holders','Stern fresh water shower','Swim platform','Swimming ladder','Storage for fenders','Canopy','Canopy storage/garage'],
  4999: ['Chartplotter','Joystick control for engines','Radar','Sleipner bow thruster control','Yamaha multifunction screen','ZipWake automatic trim system','Garmin GPS','Garmin GHS 11i VHF','12 DVC/220 VAC Electrical system','220VAC Shore power inlet','Air conditioning','Batteries for motor and domestics','Battery charger','Cruisair in all cabins','Fischer Panda generator','Danforth anchor with chain','Electric bilge pump','Electric Windlass','Manual bilge pump','Aft cabin with double berth and sofa','Electrical WC','Hand basin','Separate shower','2 x bath platform','Bow Sundeck','Cockpit seating','Cockpit Table','Covers for seating','Electric galley appliances','Electric opening sun awning','Electric side platform','Electric stove','Hardtop with electronic opening hatch','Sink','Swimming ladder','Kenyon electric grill','2 x Isotherm fridges'],
  5609: ['Audio system with speakers','Chartplotter','Depth sounder','GPS','Mechanical steering system and wheel','Navigation lights','Radio','Yamarin Q10 display','Automatic bilge pump','Anchor','Anchor and mooring rope lockers','Bimini','Fire extinguisher','Overall cover','Safety gear','Ski arch'],
  5819: ['Chartplotter','Depth sounder','Fusion audio system','Garmin GPS','Garmin VHF','Helmmaster EX by YAMAHA','Hydraulic steering','Joystick control for engines','Radar','Tilt steering wheel','Bow thruster','Bow windlass','Built-in fuel tank','Power outlet 12V / USB','Shore power inlet','Cockpit seating','Cup holders','Refrigerator','Stove','Toilet','Anchor','Canvas T-top','SeaDek flooring'],
  7089: ['Audio system with speakers','Depth sounder','Engine monitoring display','Fusion audio system','Garmin GPS','Hydraulic steering','Log-speedometer','Navigation lights','Stainless steel propeller','Battery','Built-in fuel tank','Electric bilge pump','Electric Windlass','Fuel filter','Power outlet 12V / USB','Cup holders','Fresh water shower','Freshwater set with shower','Removable table','2 x bath platform','Anchor','Boat cover','Bow Sundeck','Canvas T-top','Navigation & waterski mast','Rainwater draining cockpit','Removable bow sunbed','SeaDek flooring'],
  7103: ['Fusion audio system','Garmin GPS','Battery','Cup holders','Freshwater set with shower','Stern fresh water shower','Aft sunbed (flippable backrest)','Anchor','Canvas T-top','Navigation & waterski mast','Navigation lights','Overall cover','Rainwater draining cockpit','SeaDek flooring','Swim platform','Swimming ladder'],
  7113: ['Bluetooth audio','Navigation lights','Stainless steel propeller','Yamaha Y-COP immobilizer','Yamarin Q10 display','Battery','Built-in fuel tank','Electric bilge pump','Twin battery system','Cup holders','Removable table','Aft sunbed (flippable backrest)','Anchor','Bimini','Bimini cover','Rainwater draining cockpit','SeaDek flooring','Swim platform','Swimming ladder'],
  7118: ['Audio system with speakers','Bluetooth audio','Chartplotter','Compass','Depth sounder','Fusion audio system','GPS','Navigation lights','Automatic bilge pump','Battery','Electric bilge pump','Electric Windlass','Cup holders','Freshwater set with shower','2 x bath platform','Bimini','Bimini cover','Bow Sundeck','Fire extinguisher','Liferaft','Navigation & waterski mast','Overall cover','Rainwater draining cockpit','Safety gear','SeaDek flooring','Ski mast','Swimming ladder'],
}

// WP features that are too specific to go in the library → custom_features
const CUSTOM_WP_FEATURES = new Set([
  'Yamaha Drive By Wire throttle system',
  'Helmmaster EX by YAMAHA',
  'Sleipner bow thruster control',
  'Yamaha multifunction screen',
  'ZipWake automatic trim system',
  'Jessen audio system',
  'Tilt steering wheel',
  'Yamaha Y-COP immobilizer',
  'Cruisair in all cabins',
  'Fischer Panda generator',
  'Covers for seating',
  'Canopy',
  'Canopy storage/garage',
  'Flagpole',
  'Water ski pole',
  'Ski arch',
  'Ski mast',
  'Aft cabin with double berth and sofa',
  'Separate shower',
  'Hand basin',
  'Electrical WC',
])

// ── Canonical feature catalog ─────────────────────────────────────────────────

interface FeatureDef {
  name: string
  category: 'electronics' | 'safety' | 'comfort' | 'galley' | 'mechanical' | 'mooring' | 'other'
  filterable: boolean
}

const FEATURE_CATALOG: FeatureDef[] = [
  // Electronics
  { name: 'Audio system',                 category: 'electronics', filterable: true  },
  { name: 'Bluetooth audio',              category: 'electronics', filterable: false },
  { name: 'Chartplotter',                 category: 'electronics', filterable: true  },
  { name: 'Compass',                      category: 'electronics', filterable: false },
  { name: 'Depth sounder',                category: 'electronics', filterable: false },
  { name: 'Engine monitoring display',    category: 'electronics', filterable: false },
  { name: 'Garmin GPS',                   category: 'electronics', filterable: false },
  { name: 'Garmin VHF radio',             category: 'electronics', filterable: false },
  { name: 'GPS',                          category: 'electronics', filterable: false },
  { name: 'Log / speedometer',            category: 'electronics', filterable: false },
  { name: 'Navigation lights',            category: 'electronics', filterable: false },
  { name: 'Joystick control',             category: 'electronics', filterable: false },
  { name: 'Radar',                        category: 'electronics', filterable: true  },
  { name: 'Radio',                        category: 'electronics', filterable: false },
  { name: 'SIMRAD navigation system',     category: 'electronics', filterable: false },
  { name: 'VHF radio',                    category: 'electronics', filterable: false },
  { name: 'Yamarin Q10 display',          category: 'electronics', filterable: false },
  // Safety
  { name: 'Automatic bilge pump',         category: 'safety', filterable: false },
  { name: 'Electric bilge pump',          category: 'safety', filterable: false },
  { name: 'Fire extinguisher',            category: 'safety', filterable: false },
  { name: 'Liferaft',                     category: 'safety', filterable: true  },
  { name: 'Manual bilge pump',            category: 'safety', filterable: false },
  { name: 'Safety equipment',             category: 'safety', filterable: false },
  { name: 'Twin battery system',          category: 'mechanical', filterable: false },
  // Comfort
  { name: 'Air conditioning',             category: 'comfort', filterable: true  },
  { name: 'Ambient lighting',             category: 'comfort', filterable: false },
  { name: 'Bath platform',                category: 'comfort', filterable: true  },
  { name: 'Bimini',                       category: 'comfort', filterable: true  },
  { name: 'Bimini cover',                 category: 'comfort', filterable: false },
  { name: 'Boat cover',                   category: 'comfort', filterable: false },
  { name: 'Bow sundeck',                  category: 'comfort', filterable: true  },
  { name: 'Cabin',                        category: 'comfort', filterable: true  },
  { name: 'Canvas T-top',                 category: 'comfort', filterable: true  },
  { name: 'Cockpit seating',              category: 'comfort', filterable: false },
  { name: 'Cockpit table',                category: 'comfort', filterable: false },
  { name: 'Console & seat covers',        category: 'comfort', filterable: false },
  { name: 'Cup holders',                  category: 'comfort', filterable: false },
  { name: 'Electric opening sun awning',  category: 'comfort', filterable: false },
  { name: 'Electric side platform',       category: 'comfort', filterable: false },
  { name: 'Hardtop',                      category: 'comfort', filterable: true  },
  { name: 'Overall cover',               category: 'comfort', filterable: false },
  { name: 'Portable toilet',             category: 'comfort', filterable: false },
  { name: 'Rainwater draining cockpit',  category: 'comfort', filterable: false },
  { name: 'Removable bow sunbed',        category: 'comfort', filterable: false },
  { name: 'Removable table',             category: 'comfort', filterable: false },
  { name: 'SeaDek flooring',             category: 'comfort', filterable: false },
  { name: 'Sunbed',                       category: 'comfort', filterable: true  },
  { name: 'Swim platform',               category: 'comfort', filterable: true  },
  { name: 'Swimming ladder',             category: 'comfort', filterable: true  },
  { name: 'Teak flooring',               category: 'comfort', filterable: false },
  { name: 'Toilet',                       category: 'comfort', filterable: true  },
  { name: 'Windshield',                   category: 'comfort', filterable: false },
  { name: 'Wrap around seating',          category: 'comfort', filterable: false },
  // Galley
  { name: 'Electric grill',              category: 'galley', filterable: false },
  { name: 'Electric stove',              category: 'galley', filterable: false },
  { name: 'Freshwater shower',           category: 'galley', filterable: true  },
  { name: 'Galley appliances',           category: 'galley', filterable: false },
  { name: 'Refrigerator',                category: 'galley', filterable: true  },
  { name: 'Sink',                        category: 'galley', filterable: false },
  { name: 'Stove',                       category: 'galley', filterable: false },
  // Mechanical
  { name: 'Battery',                     category: 'mechanical', filterable: false },
  { name: 'Battery charger',             category: 'mechanical', filterable: false },
  { name: 'Bow thruster',                category: 'mechanical', filterable: true  },
  { name: 'Built-in fuel tank',          category: 'mechanical', filterable: false },
  { name: 'Fuel filter',                 category: 'mechanical', filterable: false },
  { name: 'Generator',                   category: 'mechanical', filterable: false },
  { name: 'Hydraulic steering',          category: 'mechanical', filterable: false },
  { name: 'Mechanical steering',         category: 'mechanical', filterable: false },
  { name: 'Shore power inlet',           category: 'mechanical', filterable: false },
  { name: 'Stainless steel propeller',   category: 'mechanical', filterable: false },
  { name: 'USB / 12V power outlet',      category: 'mechanical', filterable: false },
  // Mooring
  { name: 'Anchor',                      category: 'mooring', filterable: false },
  { name: 'Anchor & mooring lockers',    category: 'mooring', filterable: false },
  { name: 'Bow windlass',                category: 'mooring', filterable: false },
  { name: 'Electric windlass',           category: 'mooring', filterable: false },
  { name: 'Fender storage',             category: 'mooring', filterable: false },
  // Other
  { name: 'Navigation & waterski mast', category: 'other', filterable: false },
]

// Maps raw WP feature strings → canonical feature name (or null = custom_feature)
const WP_TO_CANONICAL: Record<string, string | null> = {
  'Audio system with speakers':         'Audio system',
  'Bluetooth audio':                    'Bluetooth audio',
  'Chartplotter':                       'Chartplotter',
  'Compass':                            'Compass',
  'Depth sounder':                      'Depth sounder',
  'Engine monitoring display':          'Engine monitoring display',
  'Fusion audio system':                'Audio system',
  'Garmin GPS':                         'Garmin GPS',
  'Garmin GHS 11i VHF':                 'VHF radio',
  'Garmin VHF':                         'Garmin VHF radio',
  'GPS':                                'GPS',
  'Helmmaster EX by YAMAHA':            null,
  'Jessen audio system':                'Audio system',
  'Joystick control for engines':       'Joystick control',
  'Log-speedometer':                    'Log / speedometer',
  'Navigation lights':                  'Navigation lights',
  'Radar':                              'Radar',
  'Radio':                              'Radio',
  'SIMRAD GPS system':                  'SIMRAD navigation system',
  'Sleipner bow thruster control':      null,
  'Stereo system':                      'Audio system',
  'Tilt steering wheel':                null,
  'Yamaha Drive By Wire throttle system': null,
  'Yamaha multifunction screen':        null,
  'Yamaha Y-COP immobilizer':           null,
  'Yamarin Q10 display':               'Yamarin Q10 display',
  'ZipWake automatic trim system':      null,

  'Automatic bilge pump':              'Automatic bilge pump',
  'Electric bilge pump':               'Electric bilge pump',
  'Fire extinguisher':                 'Fire extinguisher',
  'Flagpole':                          null,
  'Liferaft':                          'Liferaft',
  'Manual bilge pump':                 'Manual bilge pump',
  'Safety gear':                       'Safety equipment',
  'Twin battery system':               'Twin battery system',

  'Aft cabin with double berth and sofa': null,
  'Aft sunbed (flippable backrest)':   'Sunbed',
  'Air conditioning':                  'Air conditioning',
  'Ambient lighting inside console':   'Ambient lighting',
  '2 x bath platform':                 'Bath platform',
  'Bimini':                            'Bimini',
  'Bimini cover':                      'Bimini cover',
  'Boat cover':                        'Boat cover',
  'Bow Sundeck':                       'Bow sundeck',
  'Canopy':                            null,
  'Canopy storage/garage':             null,
  'Canvas T-top':                      'Canvas T-top',
  'Cockpit seating':                   'Cockpit seating',
  'Cockpit sunbed':                    'Sunbed',
  'Cockpit Table':                     'Cockpit table',
  'Console and Seat Covers':           'Console & seat covers',
  'Covers for seating':                null,
  'Cruisair in all cabins':            'Air conditioning',
  'Cup holders':                       'Cup holders',
  'Electric opening sun awning':       'Electric opening sun awning',
  'Electric side platform':            'Electric side platform',
  'Electrical WC':                     null,
  'Front V-shaped seating w/ table (converts into a berth)': null,
  'Hardtop with electronic opening hatch': 'Hardtop',
  'Overall cover':                     'Overall cover',
  'Portable toilet':                   'Portable toilet',
  'Rainwater draining cockpit':        'Rainwater draining cockpit',
  'Removable bow sunbed':              'Removable bow sunbed',
  'Removable rear sundeck kit':        null,
  'Removable table':                   'Removable table',
  'Removable table with cupholders':   'Removable table',
  'Seat cushions for open space':      null,
  'SeaDek flooring':                   'SeaDek flooring',
  'Separate shower':                   null,
  'Starboard bathroom':                null,
  'Swim platform':                     'Swim platform',
  'Swimming ladder':                   'Swimming ladder',
  'Teak flooring':                     'Teak flooring',
  'Toilet':                            'Toilet',
  'Twin seat with flipping backrest':  null,
  'U-shaped back seat':                null,
  'Windshield in tempered glass':      'Windshield',
  'Wrap around seating':               'Wrap around seating',

  '2 x Isotherm fridges':             'Refrigerator',
  'Electric galley appliances':        'Galley appliances',
  'Electric stove':                    'Electric stove',
  'Fischer Panda generator':           'Generator',
  'Fresh water shower':                'Freshwater shower',
  'Freshwater set with shower':        'Freshwater shower',
  'Hand basin':                        null,
  'Kenyon electric grill':             'Electric grill',
  'Refrigerator':                      'Refrigerator',
  'Sink':                              'Sink',
  'Stern fresh water shower':          'Freshwater shower',
  'Stove':                             'Stove',

  '12 DVC/220 VAC Electrical system': 'Shore power inlet',
  '220VAC Shore power inlet':          'Shore power inlet',
  'Anchor':                            'Anchor',
  'Anchor and mooring rope lockers':   'Anchor & mooring lockers',
  'Batteries for motor and domestics': 'Battery',
  'Battery':                           'Battery',
  'Battery charger':                   'Battery charger',
  'Bow thruster':                      'Bow thruster',
  'Bow windlass':                      'Bow windlass',
  'Built-in fuel tank':                'Built-in fuel tank',
  'Danforth anchor with chain':        'Anchor',
  'Electric Windlass':                 'Electric windlass',
  'Fuel filter':                       'Fuel filter',
  'Hydraulic steering':                'Hydraulic steering',
  'Mechanical steering system and wheel': 'Mechanical steering',
  'Power outlet 12V / USB':            'USB / 12V power outlet',
  'Shore power inlet':                 'Shore power inlet',
  'Ski arch':                          null,
  'Stainless steel propeller':         'Stainless steel propeller',
  'Stainless Steel Propeller':         'Stainless steel propeller',
  'Storage for fenders':               'Fender storage',

  'Navigation & waterski mast':        'Navigation & waterski mast',
  'Ski mast':                          null,
  'Water ski pole':                    null,
  'Cabin for two':                     'Cabin',
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(ATLAS_URI)
  await client.connect()
  const db = client.db('abs-website')

  try {
    const featuresCol = db.collection('features')
    const boatsCol    = db.collection('boats')

    // 1. Ensure no existing features (or merge if some exist)
    const existingCount = await featuresCol.countDocuments()
    if (existingCount > 0) {
      console.log(`⚠  Features collection already has ${existingCount} docs — merging (no duplicates by name)`)
    }

    // 2. Create Feature docs from catalog (deduplicated by name)
    const featureIdMap = new Map<string, ObjectId>() // canonical name → _id

    for (const def of FEATURE_CATALOG) {
      const existing = await featuresCol.findOne({ 'name.en': def.name })
      if (existing) {
        featureIdMap.set(def.name, existing._id as ObjectId)
        console.log(`  ↳ exists: ${def.name}`)
        continue
      }

      const now = new Date()
      const result = await featuresCol.insertOne({
        name:       { en: def.name, pt: null },
        category:   def.category,
        filterable: def.filterable,
        createdAt:  now,
        updatedAt:  now,
      })
      featureIdMap.set(def.name, result.insertedId)
      console.log(`  ✓ created: ${def.name} [${def.category}]`)
    }

    console.log(`\n✅ Feature catalog: ${featureIdMap.size} entries\n`)

    // 3. Update each Boat
    for (const [wpId, rawFeatures] of Object.entries(WP_BOAT_FEATURES)) {
      const boat = await boatsCol.findOne({ woocommerce_product_id: { $in: [wpId, Number(wpId)] } })
      if (!boat) {
        console.warn(`⚠  No boat found for woocommerce_product_id=${wpId}`)
        continue
      }

      const featureIds: ObjectId[] = []
      const customFeatures: { feature: string }[] = []
      const seen = new Set<string>()

      for (const raw of rawFeatures) {
        const canonical = WP_TO_CANONICAL[raw]
        if (canonical === undefined) {
          // Not in map — treat as custom
          customFeatures.push({ feature: raw })
          continue
        }
        if (canonical === null) {
          // Explicitly marked custom
          customFeatures.push({ feature: raw })
          continue
        }
        if (!seen.has(canonical)) {
          seen.add(canonical)
          const id = featureIdMap.get(canonical)
          if (id) {
            featureIds.push(id)
          } else {
            console.warn(`  ⚠  No catalog entry for canonical name: "${canonical}"`)
          }
        }
      }

      await boatsCol.updateOne(
        { _id: boat._id },
        {
          $set: {
            features:        featureIds,
            custom_features: customFeatures.map(f => ({ feature: f.feature, id: new ObjectId() })),
            updatedAt:       new Date(),
          },
        },
      )

      console.log(
        `  ✓ [wp${wpId}] ${boat.title?.en ?? boat._id}: ` +
        `${featureIds.length} features, ${customFeatures.length} custom`,
      )
    }

    console.log('\n✅ Done')
  } finally {
    await client.close()
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

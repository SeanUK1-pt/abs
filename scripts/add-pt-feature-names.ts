/**
 * Add Portuguese translations to all Feature documents.
 * Run: npx tsx scripts/add-pt-feature-names.ts
 */

import { MongoClient } from 'mongodb'

const ATLAS_URI =
  'mongodb+srv://sean_db_user:g8WAJYmNq81UwDeY@abs-test-cluster.9e90qjq.mongodb.net/abs-website?appName=abs-test-cluster'

const PT: Record<string, string> = {
  // Electronics
  'AIS':                          'AIS',
  'Audio System':                 'Sistema de Áudio',
  'Audio system':                 'Sistema de Áudio',
  'Bluetooth audio':              'Áudio Bluetooth',
  'Chartplotter':                 'Chartplotter',
  'Compass':                      'Bússola',
  'Depth Sounder':                'Sonda',
  'Depth sounder':                'Sonda',
  'Engine monitoring display':    'Painel de Monitorização do Motor',
  'GPS':                          'GPS',
  'Garmin GPS':                   'GPS Garmin',
  'Garmin VHF radio':             'Rádio VHF Garmin',
  'Joystick control':             'Controlo por Joystick',
  'Log / speedometer':            'Log / Velocímetro',
  'Navigation lights':            'Luzes de Navegação',
  'Radar':                        'Radar',
  'Radio':                        'Rádio',
  'SIMRAD navigation system':     'Sistema de Navegação SIMRAD',
  'VHF Radio':                    'Rádio VHF',
  'VHF radio':                    'Rádio VHF',
  'Yamarin Q10 display':          'Painel Yamarin Q10',

  // Safety
  'Automatic bilge pump':         'Bomba de Porão Automática',
  'Bilge Pump':                   'Bomba de Porão',
  'EPIRB':                        'EPIRB',
  'Electric bilge pump':          'Bomba de Porão Elétrica',
  'Fire Extinguisher':            'Extintor de Incêndio',
  'Fire extinguisher':            'Extintor de Incêndio',
  'Flares':                       'Sinalizadores',
  'Life Raft':                    'Balsa Salva-Vidas',
  'Liferaft':                     'Balsa Salva-Vidas',
  'Manual bilge pump':            'Bomba de Porão Manual',
  'Navigation Lights':            'Luzes de Navegação',
  'Safety equipment':             'Equipamento de Segurança',

  // Comfort
  'Air Conditioning':             'Ar Condicionado',
  'Air conditioning':             'Ar Condicionado',
  'Ambient lighting':             'Iluminação Ambiente',
  'Bath platform':                'Plataforma de Banho',
  'Bimini':                       'Bimini',
  'Bimini cover':                 'Capa de Bimini',
  'Boat cover':                   'Capa de Barco',
  'Bow sundeck':                  'Sundeck de Proa',
  'Cabin':                        'Cabina',
  'Cabin Cushions':               'Almofadas de Cabina',
  'Canvas T-top':                 'Toldo T-top',
  'Cockpit Table':                'Mesa de Cockpit',
  'Cockpit seating':              'Assentos de Cockpit',
  'Cockpit table':                'Mesa de Cockpit',
  'Console & seat covers':        'Capas de Consola e Assentos',
  'Cup holders':                  'Porta-Copos',
  'Electric opening sun awning':  'Toldo Solar com Abertura Elétrica',
  'Electric side platform':       'Plataforma Lateral Elétrica',
  'Hardtop':                      'Hardtop',
  'Overall cover':                'Capa Geral',
  'Portable toilet':              'Sanita Portátil',
  'Rainwater draining cockpit':   'Cockpit com Drenagem de Água da Chuva',
  'Removable bow sunbed':         'Espreguiçadeira de Proa Amovível',
  'Removable table':              'Mesa Amovível',
  'SeaDek flooring':              'Pavimento SeaDek',
  'Shower':                       'Duche',
  'Sunbed':                       'Espreguiçadeira',
  'Swim Platform':                'Plataforma de Natação',
  'Swim platform':                'Plataforma de Natação',
  'Swimming ladder':              'Escada de Banho',
  'Teak Deck':                    'Deck de Teca',
  'Teak flooring':                'Soalho de Teca',
  'Toilet':                       'Sanita',
  'Windshield':                   'Para-Brisas',
  'Wrap around seating':          'Assentos em U',

  // Galley
  'Coffee Machine':               'Máquina de Café',
  'Electric grill':               'Grelhador Elétrico',
  'Electric stove':               'Fogão Elétrico',
  'Freshwater Tank':              'Depósito de Água Doce',
  'Freshwater shower':            'Duche de Água Doce',
  'Fridge':                       'Frigorífico',
  'Galley appliances':            'Electrodomésticos de Cozinha',
  'Microwave':                    'Micro-ondas',
  'Refrigerator':                 'Frigorífico',
  'Sink':                         'Lava-Loiças',
  'Stove':                        'Fogão',

  // Mechanical
  'Autopilot':                    'Piloto Automático',
  'Battery':                      'Bateria',
  'Battery charger':              'Carregador de Bateria',
  'Bow Thruster':                 'Propulsor de Proa',
  'Bow thruster':                 'Propulsor de Proa',
  'Built-in fuel tank':           'Depósito de Combustível Integrado',
  'Electric Windlass':            'Molinete Elétrico',
  'Fuel filter':                  'Filtro de Combustível',
  'Generator':                    'Gerador',
  'Hydraulic Steering':           'Direção Hidráulica',
  'Hydraulic steering':           'Direção Hidráulica',
  'Mechanical steering':          'Direção Mecânica',
  'Shore power inlet':            'Tomada de Terra (Shore Power)',
  'Stainless steel propeller':    'Hélice em Aço Inoxidável',
  'Trim Tabs':                    'Aletas de Trim',
  'Twin battery system':          'Sistema de Dupla Bateria',
  'USB / 12V power outlet':       'Tomada USB / 12V',

  // Mooring
  'Anchor':                       'Âncora',
  'Anchor & mooring lockers':     'Compartimentos de Âncora e Amarração',
  'Bow windlass':                 'Molinete de Proa',
  'Dock Lines':                   'Cabos de Atracagem',
  'Electric windlass':            'Molinete Elétrico',
  'Fender storage':               'Armazenamento de Defensas',
  'Fenders':                      'Defensas',
  'Mooring Lines':                'Cabos de Amarração',

  // Other
  'Navigation & waterski mast':   'Mastro de Navegação e Ski Aquático',
}

async function main() {
  const client = new MongoClient(ATLAS_URI)
  await client.connect()
  const db = client.db('abs-website')

  try {
    const col = db.collection('features')
    const features = await col.find({}).toArray()

    let updated = 0
    let skipped = 0
    let missing = 0

    for (const f of features) {
      const enName = f.name?.en ?? f.name
      const pt = PT[enName]

      if (!pt) {
        console.warn(`  ⚠  No PT translation for: "${enName}"`)
        missing++
        continue
      }

      if (f.name?.pt === pt) {
        skipped++
        continue
      }

      await col.updateOne(
        { _id: f._id },
        { $set: { 'name.pt': pt, updatedAt: new Date() } },
      )
      console.log(`  ✓ ${enName} → ${pt}`)
      updated++
    }

    console.log(`\n✅ Updated: ${updated}  Already correct: ${skipped}  Missing translation: ${missing}`)
  } finally {
    await client.close()
  }
}

main().catch(err => { console.error(err); process.exit(1) })

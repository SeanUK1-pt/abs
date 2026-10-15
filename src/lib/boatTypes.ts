export interface BoatOption {
  value: string
  en: string
  pt: string
}

// Broad classes of boat. Hull construction (RIB, steel, GRP...) is a separate
// attribute — see HULL_MATERIALS.
export const BOAT_TYPES: BoatOption[] = [
  { value: 'power_speed', en: 'Power / Speed Boats', pt: 'Lanchas e Barcos de Velocidade' },
  { value: 'sports_cruiser', en: 'Sports & Day Cruisers', pt: 'Cruzadores Desportivos e Day Cruisers' },
  { value: 'motor_yacht', en: 'Motor Yachts', pt: 'Iates a Motor' },
  { value: 'sailing_yacht', en: 'Sailing Yachts', pt: 'Iates à Vela' },
  { value: 'tender', en: 'Tenders', pt: 'Tenders' },
  { value: 'wake_ski', en: 'Wake & Ski Boats', pt: 'Barcos de Wakeboard e Esqui' },
  { value: 'pwc', en: 'Personal Watercraft', pt: 'Motas de Água' },
]

export const HULL_MATERIALS: BoatOption[] = [
  { value: 'grp', en: 'GRP / Fibreglass', pt: 'GRP / Fibra de Vidro' },
  { value: 'rib', en: 'RHIB - Rigid / Inflatable', pt: 'RHIB - Rígido / Insuflável' },
  { value: 'aluminium', en: 'Aluminium', pt: 'Alumínio' },
  { value: 'steel', en: 'Steel', pt: 'Aço' },
  { value: 'wood', en: 'Wood', pt: 'Madeira' },
  { value: 'carbon', en: 'Carbon Fibre', pt: 'Fibra de Carbono' },
]

export function optionLabel(options: BoatOption[], value: string | null | undefined, locale: string): string | null {
  if (!value) return null
  const found = options.find(o => o.value === value)
  if (!found) return value
  return locale === 'pt' ? found.pt : found.en
}

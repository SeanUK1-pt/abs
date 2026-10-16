// A boat is "price on application" when the admin switch is on, and also when
// no real price is set, so a price of 0 or blank never renders as "€0".
export function isPriceOnApplication(boat: Record<string, any>): boolean {
  return Boolean(boat.price_on_application) || !boat.price
}

export const POA_LABEL: Record<string, string> = {
  en: 'Price on Application',
  pt: 'Preço sob consulta',
}

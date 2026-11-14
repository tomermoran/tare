/** SCR-COFFEE, one coffee's screen (STORY-03-06-03). Catalog IDs can hold ":", so it's encoded. */
export const coffeeHref = (beanId: string) => `/beans/coffee/${encodeURIComponent(beanId)}`;

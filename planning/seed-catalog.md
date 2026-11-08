# Milestone 1 seed catalog

The Head of Product's answer to TQ-10: the equipment and coffee that
TASK-01-02-01-BE6 writes into `src/db/seed/hardware.json` and `coffee.json`.
Public catalog facts only. Capabilities follow the S-08 schema comments;
markets are ISO 3166-1 alpha-2 codes (TQ-12).

## Links are stored as they should be compared

A query parameter sometimes picks a colour or plug (same model) and sometimes
a different product on a shared page. So each link below is written the way
`normalizeUrl` should see it:

- **Colour or plug variants are dropped:** the Sage `?sku=` and the Niche
  `?variant=`.
- **Product variants are kept:** Crema sells its single, double and triple
  baskets on one page, told apart only by `?variant=`. Dropping it would make
  them one normalised link and flag different baskets as duplicates. This page
  is a case for TASK-01-06-01-BE1's "must stay distinct" table.

## Hardware

### Machine: Breville Bambino Plus

| Field | Value |
|---|---|
| Maker | Breville (alias "Sage", market GB) |
| Model | Bambino Plus |
| Kind | `machine` |
| Aliases | "Sage Bambino Plus" (GB), "BES500" (shared model number), "SES500BSS4GUK1" (GB), "BES500BSS1BUS1" (US) |
| Links | `https://www.sageappliances.com/en-gb/product/bes500` (GB) |
| | `https://www.breville.com/en-us/product/bes500` (US) |
| | `https://www.breville.com/en-us/my-products/producthub/bes500` (US, owner support page) |

```json
{ "temperature": { "control": "none" },
  "pressure": { "control": "none", "gauge": false } }
```

Sage's page lists a fixed low-pressure pre-infusion followed by 9 bar, with
no brew temperature or pressure setting and no gauge.

### Grinder: Niche Zero

| Field | Value |
|---|---|
| Maker | Niche |
| Model | Zero |
| Kind | `grinder` |
| Links | `https://www.nichecoffee.co.uk/products/niche-zero` (GB) |

```json
{ "grind": { "type": "stepless", "min": 0, "max": 50, "step": 0.5, "coarser": "higher" } }
```

The dial is printed 0 to 50, with 0 the finest, and is set in half steps
(e.g. 21.5). It turns past 50, but only for coarse brews outside the MVP;
raise `max` if a household needs it.

### Basket: Crema Coffee Products 54mm Double Shot Basket

| Field | Value |
|---|---|
| Maker | Crema Coffee Products |
| Model | 54mm Double Shot Basket |
| Kind | `basket` |
| Links | `https://cremacoffeeproducts.com/products/54mm-portafilter-baskets-for-breville?variant=43266907242711` (US) |

```json
{ "dose": { "min": 16, "max": 18 } }
```

Single wall, non-pressurised. Crema lists single 8–11 g, double 16–18 g and
triple 18–22 g; only the double is seeded. The portafilter (Crema 54mm
bottomless) isn't catalogued: per S-01 it doesn't change the recipe.

### Still to add: the Bambino Plus stock baskets

TASK-01-02-01-BE3 seeds every machine maker's stock baskets with a dose
range. The Bambino Plus ships with 1 and 2 cup single wall and dual wall 54 mm
baskets; their ranges need confirming from Breville before they're seeded.

## Coffee

### Portofino Signia

| Field | Value |
|---|---|
| Roaster | Portofino (alias "פורטופינו", market IL) |
| Bean | Signia (aliases "סיגניה", "House Blend", "תערובת הבית") |
| Roast level | `Dark` (Head of Product; the page doesn't say) |
| Tasting notes | `["Nutty", "Chocolate"]` |
| Links | `https://portofino-coffee.com/product/%d7%aa%d7%a2%d7%a8%d7%95%d7%91%d7%aa-%d7%94%d7%91%d7%99%d7%aa-%d7%a1%d7%99%d7%92%d7%a0%d7%99%d7%94-250-%d7%92%d7%a8/` (IL) |

A blend from Asia, Central America and South America; the roaster describes
a heavy, velvety body and gentle bitterness. The link is the 250 g page. Bag
size belongs to the batch, so a 1 kg page would be a second link on this
bean, not a second bean.

### Coffee4U Brazil Cerrado (INSPERATION)

| Field | Value |
|---|---|
| Roaster | Coffee4U |
| Bean | Brazil Cerrado INSPERATION (aliases "Brazil Cerrado Inspiration", "ברזיל סראדו") |
| Roast level | not stated (null until confirmed) |
| Tasting notes | `["Nutty", "Chocolate", "Dark Chocolate"]` |
| Links | `https://www.coffee4u.co.il/product/1-%D7%A7%D7%92-%D7%A4%D7%95%D7%9C%D7%99-%D7%A7%D7%A4%D7%94-%D7%91%D7%A8%D7%96%D7%99%D7%9C-%D7%A1%D7%A8%D7%90%D7%93%D7%95-insperation` (IL) |

INSPERATION (the shop's spelling) is Coffee4U's own locally roasted house
line, sold since 2014. Despite the name it's a blend: a Brazilian base with
Indonesian and Indian beans. The link is the 1 kg page; the shop also sells
250 g and 3 kg bags on their own pages, which would be further links on this
bean.

import { describe, expect, it } from "vitest";
import { normalizeUrl } from "./url";

describe("normalizeUrl", () => {
  // Pairs that must normalise to the same link.
  it.each([
    ["scheme", "http://example.com/products/grinder", "https://example.com/products/grinder"],
    ["www", "https://www.example.com/products/grinder", "https://example.com/products/grinder"],
    ["mobile host", "https://m.example.com/products/grinder", "https://example.com/products/grinder"],
    ["host case", "https://Example.COM/products/grinder", "https://example.com/products/grinder"],
    ["trailing slash", "https://example.com/products/grinder/", "https://example.com/products/grinder"],
    ["fragment", "https://example.com/products/grinder#reviews", "https://example.com/products/grinder"],
    ["utm parameters", "https://example.com/p/grinder?utm_source=x&utm_medium=email&utm_campaign=y", "https://example.com/p/grinder"],
    ["Google click id", "https://example.com/p/grinder?gclid=abc123", "https://example.com/p/grinder"],
    ["Facebook click id", "https://example.com/p/grinder?fbclid=abc", "https://example.com/p/grinder"],
    ["Shopify search tracking", "https://shop.example.com/products/basket?_pos=1&_sid=ab12&_ss=r", "https://shop.example.com/products/basket"],
    ["Google shopping id", "https://example.com/p/grinder?srsltid=xyz", "https://example.com/p/grinder"],
    ["referrer", "https://example.com/p/grinder?ref=newsletter", "https://example.com/p/grinder"],
    ["region path en-gb", "https://example.com/en-gb/product/bes500", "https://example.com/en-us/product/bes500"],
    ["region path en_GB", "https://example.com/en_GB/product/bes500", "https://example.com/product/bes500"],
    ["region path uk", "https://example.com/uk/products/zero", "https://example.com/products/zero"],
    ["parameter order", "https://example.com/p?size=1kg&grind=whole", "https://example.com/p?grind=whole&size=1kg"],
    ["tracking mixed with real parameters", "https://example.com/p?utm_source=x&variant=42", "https://example.com/p?variant=42"],
    ["escape case", "https://example.com/product/%d7%a1%d7%99", "https://example.com/product/%D7%A1%D7%99"],
    ["surrounding spaces", "  https://example.com/p/grinder  ", "https://example.com/p/grinder"],
    ["default port", "https://example.com:443/p/grinder", "https://example.com/p/grinder"],
  ])("treats %s as the same page", (_label, a, b) => {
    expect(normalizeUrl(a)).toBe(normalizeUrl(b));
    expect(normalizeUrl(a)).not.toBeNull();
  });

  // Pairs that must stay distinct.
  it.each([
    [
      "Crema's single and double baskets",
      "https://cremacoffeeproducts.com/products/54mm-portafilter-baskets-for-breville?variant=43266907242711",
      "https://cremacoffeeproducts.com/products/54mm-portafilter-baskets-for-breville?variant=43266907242712",
    ],
    ["different products", "https://example.com/products/grinder-a", "https://example.com/products/grinder-b"],
    ["different shops", "https://shop-a.example.com/p/zero", "https://shop-b.example.com/p/zero"],
    ["different regional brands", "https://www.sageappliances.com/en-gb/product/bes500", "https://www.breville.com/en-us/product/bes500"],
    ["a size parameter", "https://example.com/p/beans?size=250g", "https://example.com/p/beans?size=1kg"],
    ["path case", "https://example.com/products/Zero", "https://example.com/products/zero"],
    ["a two-letter product path", "https://example.com/p", "https://example.com/products"],
    ["a region-like segment that is the whole path", "https://example.com/uk", "https://example.com/us"],
  ])("keeps %s apart", (_label, a, b) => {
    expect(normalizeUrl(a)).not.toBe(normalizeUrl(b));
  });

  it("produces host, path and sorted query without the scheme", () => {
    expect(
      normalizeUrl("HTTPS://www.Example.com/en-gb/product/bes500/?sku=X1&utm_source=y#top"),
    ).toBe("example.com/product/bes500?sku=X1");
  });

  it.each([
    ["empty", ""],
    ["plain text", "Niche Zero grinder"],
    ["no scheme", "example.com/products/zero"],
    ["ftp", "ftp://example.com/file"],
    ["mailto", "mailto:someone@example.com"],
    ["javascript", "javascript:alert(1)"],
    ["a host without a dot", "http://localhost:3000/p"],
  ])("returns null for %s", (_label, raw) => {
    expect(normalizeUrl(raw)).toBeNull();
  });
});

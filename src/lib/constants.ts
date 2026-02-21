export const SITE_NAME = "Maison ISIVIS";
export const SITE_DESCRIPTION =
  "Handcrafted luxury fashion from our London atelier. Prêt-à-couture for the modern woman.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Product categories (what the item IS)
export const CATEGORIES = [
  { label: "Corsets", slug: "corsets", href: "/collections/corsets" },
  { label: "Dresses", slug: "dresses", href: "/collections/dresses" },
  { label: "Tops", slug: "tops", href: "/collections/tops" },
  { label: "Bottoms", slug: "bottoms", href: "/collections/bottoms" },
  { label: "Jumpsuits", slug: "jumpsuits", href: "/collections/jumpsuits" },
  { label: "Co-ords", slug: "co-ords", href: "/collections/co-ords" },
  { label: "Outerwear", slug: "outerwear", href: "/collections/outerwear" },
  { label: "Lounge and Intimates", slug: "lounge-and-intimates", href: "/collections/lounge-and-intimates" },
  { label: "Swimwear", slug: "swimwear", href: "/collections/swimwear" },
  { label: "Active Wear", slug: "active-wear", href: "/collections/active-wear" },
  { label: "Accessories", slug: "accessories", href: "/collections/accessories" },
  { label: "Gift Cards", slug: "gift-cards", href: "/collections/gift-cards" },
] as const;

// Style collections (the vibe/aesthetic)
export const STYLE_COLLECTIONS = [
  { label: "Old Money", slug: "old-money", href: "/collections/old-money" },
  { label: "Fierce", slug: "fierce", href: "/collections/fierce" },
  { label: "Ethereal", slug: "ethereal", href: "/collections/ethereal" },
  { label: "Contemporary", slug: "contemporary", href: "/collections/contemporary" },
] as const;

// Desktop header nav
export const NAV_LINKS = [
  {
    label: "Shop By Category",
    href: "/collections",
    children: [
      { label: "Corsets", href: "/collections/corsets" },
      { label: "Dresses", href: "/collections/dresses" },
      { label: "Tops", href: "/collections/tops" },
      { label: "Bottoms", href: "/collections/bottoms" },
      { label: "Jumpsuits", href: "/collections/jumpsuits" },
      { label: "Co-ords", href: "/collections/co-ords" },
      { label: "Outerwear", href: "/collections/outerwear" },
      { label: "Lounge and Intimates", href: "/collections/lounge-and-intimates" },
      { label: "Swimwear", href: "/collections/swimwear" },
      { label: "Active Wear", href: "/collections/active-wear" },
      { label: "Accessories", href: "/collections/accessories" },
      { label: "Gift Cards", href: "/collections/gift-cards" },
    ],
  },
  {
    label: "New Arrivals",
    href: "/products?filter=new-arrivals",
    children: [
      { label: "Just Dropped", href: "/products?filter=new-arrivals" },
      { label: "Trending Now", href: "/products?filter=trending" },
      { label: "Back In Stock", href: "/products?filter=back-in-stock" },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    children: [
      { label: "Old Money", href: "/collections/old-money" },
      { label: "Fierce", href: "/collections/fierce" },
      { label: "Ethereal", href: "/collections/ethereal" },
      { label: "Contemporary", href: "/collections/contemporary" },
    ],
  },
] as const;

// Mobile nav — flat list of all categories + collections
export const MOBILE_NAV_CATEGORIES = [
  { label: "Corsets", href: "/collections/corsets" },
  { label: "Dresses", href: "/collections/dresses" },
  { label: "Tops", href: "/collections/tops" },
  { label: "Bottoms", href: "/collections/bottoms" },
  { label: "Jumpsuits", href: "/collections/jumpsuits" },
  { label: "Co-ords", href: "/collections/co-ords" },
  { label: "Outerwear", href: "/collections/outerwear" },
  { label: "Lounge and Intimates", href: "/collections/lounge-and-intimates" },
  { label: "Swimwear", href: "/collections/swimwear" },
  { label: "Active Wear", href: "/collections/active-wear" },
  { label: "Accessories", href: "/collections/accessories" },
  { label: "Gift Cards", href: "/collections/gift-cards" },
] as const;

export const MOBILE_NAV_COLLECTIONS = [
  { label: "Old Money", href: "/collections/old-money" },
  { label: "Fierce", href: "/collections/fierce" },
  { label: "Ethereal", href: "/collections/ethereal" },
  { label: "Contemporary", href: "/collections/contemporary" },
] as const;

export const FOOTER_LINKS = {
  help: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Shipment Tracking", href: "/tracking" },
    { label: "Fit Guide", href: "/size-guide" },
    { label: "Fabric Care", href: "/fabric-care" },
    { label: "Join The Queendom", href: "/rewards" },
    { label: "Rewards", href: "/rewards" },
  ],
  info: [
    { label: "About Us", href: "/about" },
    { label: "Blogs", href: "/blogs" },
    { label: "Pre Order Policy", href: "/pre-order-policy" },
    { label: "Shipment Policy", href: "/shipping" },
    { label: "Return Policy", href: "/returns" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
} as const;

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/maisonisivis",
  facebook: "https://facebook.com/maisonisivis",
  twitter: "https://twitter.com/maisonisivis",
  youtube: "",
  tiktok: "https://tiktok.com/@maisonisivis",
} as const;

export const CURRENCY = "GBP";
export const CURRENCY_SYMBOL = "\u00a3";
export const DEFAULT_PAGE_SIZE = 24;
export const MAX_CART_QUANTITY = 10;
export const FREE_SHIPPING_THRESHOLD = 50;
export const STANDARD_SHIPPING_COST = 4.99;
export const EXPRESS_SHIPPING_COST = 9.99;
export const TAX_RATE = 0.2; // 20% UK VAT

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export const COLORS = [
  "Black",
  "White",
  "Ivory",
  "Beige",
  "Red",
  "Diamond",
  "Navy",
  "Blush",
  "Dusty Rose",
  "Cream",
  "Sage",
  "Burgundy",
  "Gold",
  "Emerald",
  "Lavender",
  "Camel",
] as const;

export const ANNOUNCEMENT_MESSAGES = [
  "Turning Fantasy Into Reality",
  "Britain\u2019s Premier Fashion House",
  "Free delivery for all orders over \u00a3150 within the UK",
  "WorldWide Shipping",
] as const;

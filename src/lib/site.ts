export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rajayasingheopticians.com";

export const shop = {
  name: "R.A. Jayasinghe Opticians",
  tagline: "19 years of quality eyewear and trusted optical care.",
  established: 2007,
  address: "No. 327, Galle Road, Ratmalana",
  phones: [
    { display: "011 272 5167", tel: "+94112725167" },
    { display: "077 479 3659", tel: "+94774793659" },
  ],
  whatsappDisplay: "077 479 3659",
  whatsappE164: "94774793659",
  email: "info@rajayasingheopticians.com",
  mapQuery: "No. 327 Galle Road, Ratmalana, Sri Lanka",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=R.A.+Jayasinghe+Opticians+327+Galle+Road+Ratmalana",
  reviewsLink:
    "https://www.google.com/maps/search/?api=1&query=R.A.+Jayasinghe+Opticians+Ratmalana+reviews",
  hours: [
    { days: "Monday to Friday", hours: "9:30 a.m. to 7:00 p.m." },
    { days: "Saturday", hours: "9:30 a.m. to 6:00 p.m." },
    { days: "Sunday", hours: "9:30 a.m. to 1:30 p.m." },
  ],
  closedNote: "Closed on Poya days.",
};

export const aboutParagraphs = [
  "Established in 2007, R.A. Jayasinghe Opticians has spent 19 years caring for our customers' eyesight and style. From our shop on Galle Road, Ratmalana, we offer professional eye testing, a wide range of stylish frames, sunglasses, contact lenses, and quality lenses to suit your needs.",
  "We believe good vision should be easy to get and a pleasure to wear. That's why our team takes the time to listen, test carefully, and help you choose eyewear that suits your prescription, your face, and your lifestyle.",
  "We're proud of the trust our customers have placed in us over the years, and we work hard to keep it. Whether it's your first pair of glasses or your next, visit us in store or message us on WhatsApp, and we'll be happy to help.",
];

export const vision =
  "To be a trusted name in eye care, helping every customer experience a clearer, healthier, and more confident life through quality eyewear and professional optical care.";

export const mission =
  "Our mission is to provide reliable eye care and quality eyewear with personalized service, professional guidance, and affordable solutions, while building lasting relationships with every customer we serve.";

export const social = {
  facebook: "",
  instagram: "",
  tiktok: "",
};

export const audiences = [
  { slug: "men", label: "Men" },
  { slug: "women", label: "Women" },
  { slug: "children", label: "Children" },
] as const;

export const shapes = ["round", "rectangle", "square", "cat-eye", "aviator", "wayfarer", "oval", "browline"] as const;
export const frameTypes = ["plastic", "metal"] as const;

export const categoryMeta = {
  spectacles: { label: "Spectacles", href: "/spectacles" },
  sunglasses: { label: "Sunglasses", href: "/sunglasses" },
  "contact-lenses": { label: "Contact lenses", href: "/contact-lenses" },
  lenses: { label: "Lenses", href: "/lenses" },
} as const;

export type Category = keyof typeof categoryMeta;

export const shopPhotos = [
  { src: "/images/products/20.jpg", alt: "An eye test at R.A. Jayasinghe Opticians" },
  { src: "/video/hero-poster.jpg", alt: "Customers looking at frames in the shop" },
  { src: "/images/products/23.jpg", alt: "Frames on display" },
];

export function labelize(value: string) {
  return value.replace(/(^|[\s-])\w/g, (chunk) => chunk.toUpperCase());
}

export function whatsappLink(message?: string, phone = shop.whatsappE164) {
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function phoneToWa(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `94${digits.slice(1)}`;
  return digits;
}

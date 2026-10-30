import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const spec = [
  "/images/products/01.jpg",
  "/images/products/09.jpg",
  "/images/products/10.jpg",
  "/images/products/15.jpg",
  "/images/products/23.jpg",
];
const sun = [
  "/images/products/03.jpg",
  "/images/products/06.jpg",
  "/images/products/11.jpg",
  "/images/products/14.jpg",
  "/images/products/16.jpg",
  "/images/products/24.jpg",
];
const lens = ["/images/lenses/a.svg", "/images/lenses/b.svg", "/images/lenses/c.svg"];

function gallery(pool: string[], index: number, count = 3) {
  return Array.from({ length: count }, (_, step) => pool[(index + step) % pool.length]);
}

const poya: [string, string][] = [
  ["2026-01-03", "Duruthu Full Moon Poya Day"],
  ["2026-02-01", "Navam Full Moon Poya Day"],
  ["2026-03-02", "Medin Full Moon Poya Day"],
  ["2026-04-01", "Bak Full Moon Poya Day"],
  ["2026-05-01", "Vesak Full Moon Poya Day"],
  ["2026-05-02", "Day following Vesak Full Moon Poya Day"],
  ["2026-05-30", "Adhi Poson Full Moon Poya Day"],
  ["2026-06-29", "Poson Full Moon Poya Day"],
  ["2026-07-29", "Esala Full Moon Poya Day"],
  ["2026-08-27", "Nikini Full Moon Poya Day"],
  ["2026-09-26", "Binara Full Moon Poya Day"],
  ["2026-10-25", "Vap Full Moon Poya Day"],
  ["2026-11-24", "Il Full Moon Poya Day"],
  ["2026-12-23", "Unduvap Full Moon Poya Day"],
  ["2027-01-22", "Duruthu Full Moon Poya Day"],
  ["2027-02-20", "Navam Full Moon Poya Day"],
  ["2027-03-22", "Medin Full Moon Poya Day"],
  ["2027-04-20", "Bak Full Moon Poya Day"],
  ["2027-05-19", "Vesak Full Moon Poya Day"],
  ["2027-05-20", "Day following Vesak Full Moon Poya Day"],
  ["2027-06-18", "Poson Full Moon Poya Day"],
  ["2027-07-18", "Esala Full Moon Poya Day"],
  ["2027-08-16", "Nikini Full Moon Poya Day"],
  ["2027-09-15", "Binara Full Moon Poya Day"],
  ["2027-10-15", "Vap Full Moon Poya Day"],
  ["2027-11-13", "Il Full Moon Poya Day"],
  ["2027-12-13", "Unduvap Full Moon Poya Day"],
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.article.deleteMany();
  await prisma.holiday.deleteMany();
  await prisma.product.deleteMany();
  await prisma.admin.deleteMany();

  const sharedPassword = await bcrypt.hash("RAJ-admin-327", 10);
  const admins = [
    ["owner", "Shop owner"],
    ["staff1", "Staff one"],
    ["staff2", "Staff two"],
  ] as const;
  for (const [username, name] of admins) {
    await prisma.admin.create({
      data: {
        username,
        name,
        role: "admin",
        passwordHash: sharedPassword,
      },
    });
  }

  const products = [
    ["aurelia-round", "Aurelia Round", "Aurelia", "A light round frame with a soft front and a comfortable fit for everyday wear.", 14500, "spectacles", "women", "plastic", "round", "percent", 10, true, true, false, false, gallery(spec, 0)],
    ["aurelia-cat-eye", "Aurelia Cat-Eye", "Aurelia", "A lifted cat-eye shape that sits neatly on smaller and medium faces.", 16800, "spectacles", "women", "plastic", "cat-eye", null, null, false, true, false, false, gallery(spec, 1)],
    ["northline-rectangle", "Northline Rectangle", "Northline", "A slim metal rectangle with a clear view and a light feel on the nose.", 18900, "spectacles", "men", "metal", "rectangle", "price", 15900, true, true, false, false, gallery(spec, 2)],
    ["northline-aviator", "Northline Aviator", "Northline", "A metal aviator spectacle for people who want a wider lens and a classic line.", 17200, "spectacles", "men", "metal", "aviator", null, null, false, true, false, false, gallery(spec, 3)],
    ["harbor-square", "Harbor Square", "Harbor", "A bold square front in acetate, easy to wear with a simple shirt or a sari.", 12500, "spectacles", "men", "plastic", "square", null, null, false, true, false, false, gallery(spec, 4)],
    ["harbor-wayfarer", "Harbor Wayfarer", "Harbor", "A full wayfarer shape with a strong brow line. Currently waiting on the next delivery.", 13200, "spectacles", "men", "plastic", "wayfarer", null, null, false, false, false, false, gallery(spec, 0, 4)],
    ["lumen-oval", "Lumen Oval", "Lumen", "An oval metal frame that softens a stronger jaw and stays light through a long day.", 21000, "spectacles", "women", "metal", "oval", null, null, false, true, false, false, gallery(spec, 1)],
    ["lumen-browline", "Lumen Browline", "Lumen", "A browline frame with a darker top bar. The shop can apply a quiet discount in store.", 19800, "spectacles", "women", "metal", "browline", "percent", 15, false, true, false, false, gallery(spec, 2)],
    ["vivid-round", "Vivid Round", "Vivid", "An easy round plastic frame at a friendly price, sized for a smaller face.", 9800, "spectacles", "men", "plastic", "round", null, null, false, true, false, false, gallery(spec, 3)],
    ["solace-oval", "Solace Oval", "Solace", "A gentle oval in polished acetate, made for long wear and a low-key look.", 15400, "spectacles", "women", "plastic", "oval", null, null, false, true, false, false, gallery(spec, 4)],
    ["kinder-flex-round", "Kinder Flex Round", "Kinderlook", "A flexible round frame for children, with a spring hinge that forgives a busy day.", 7500, "spectacles", "children", "plastic", "round", null, null, false, true, false, false, gallery(spec, 0)],
    ["kinder-flex-rect", "Kinder Flex Rectangle", "Kinderlook", "A light rectangle for school, with a fit we can adjust in the shop.", 7900, "spectacles", "children", "plastic", "rectangle", null, null, false, true, false, false, gallery(spec, 2)],
    ["kinder-sport", "Kinder Sport", "Kinderlook", "A sportier children’s frame that stays put when they are on the move.", 8200, "spectacles", "children", "plastic", "rectangle", null, null, false, true, false, false, gallery(spec, 3)],
    ["clarity-metal-round", "Clarity Metal Round", "Clarity", "A fine round metal frame kept aside as a sample the public cannot see.", 22500, "spectacles", "men", "metal", "round", null, null, false, true, true, false, gallery(spec, 1)],
    ["sol-aviator", "Sol Aviator", "Solace", "A metal aviator sunglass with a wide lens for driving and open roads.", 11200, "sunglasses", "men", "metal", "aviator", null, null, false, true, false, false, gallery(sun, 0)],
    ["sol-classic", "Sol Classic", "Solace", "A dark wayfarer sunglass. The current offer is shown on the card.", 9800, "sunglasses", "men", "plastic", "wayfarer", "percent", 20, true, true, false, false, gallery(sun, 1)],
    ["sol-round", "Sol Round", "Aurelia", "Round sunglasses with a thin metal front and a calm, even tint.", 10500, "sunglasses", "women", "metal", "round", null, null, false, true, false, false, gallery(sun, 2)],
    ["sol-cat-eye", "Sol Cat-Eye", "Aurelia", "A cat-eye sunglass with a lifted corner and a light acetate frame.", 11800, "sunglasses", "women", "plastic", "cat-eye", null, null, false, true, false, false, gallery(sun, 3)],
    ["sol-sport", "Sol Sport", "Northline", "A wrapped rectangle for brighter afternoons and time outdoors.", 13600, "sunglasses", "men", "plastic", "rectangle", null, null, false, true, false, false, gallery(sun, 4)],
    ["sol-kids-round", "Sol Kids Round", "Kinderlook", "Small round sunglasses for children, light enough for a full outing.", 6900, "sunglasses", "children", "plastic", "round", null, null, false, true, false, false, gallery(sun, 5)],
    ["sol-kids-flex", "Sol Kids Flex", "Kinderlook", "A flexible children’s sunglass that we can fit properly in the shop.", 7200, "sunglasses", "children", "plastic", "rectangle", null, null, false, true, false, false, gallery(sun, 1)],
    ["harbor-shade", "Harbor Shade", "Harbor", "A square sunglass that is waiting to come back into stock.", 8900, "sunglasses", "women", "plastic", "square", null, null, false, false, false, false, gallery(sun, 2)],
    ["aquaday-daily", "AquaDay Daily 30", "AquaDay", "Thirty daily disposable contact lenses. A fresh pair each morning, then throw them away.", 3200, "contact-lenses", null, null, null, null, null, false, true, false, false, lens],
    ["aquaday-monthly", "AquaDay Monthly", "AquaDay", "A monthly contact lens for people who prefer one pair through the month, with proper cleaning.", 2800, "contact-lenses", null, null, null, "percent", 10, true, true, false, false, lens],
    ["clearsoft-monthly", "ClearSoft Monthly", "ClearSoft", "A soft monthly lens with a comfortable edge. We can check the fit before you take a box home.", 3500, "contact-lenses", null, null, null, null, null, false, true, false, false, lens],
    ["clearsoft-toric", "ClearSoft Toric", "ClearSoft", "A toric monthly lens for astigmatism. The final choice is made after your eye test.", 6200, "contact-lenses", null, null, null, null, null, false, true, false, false, lens],
    ["globle-single-vision", "Globle", "Globle", "Globle lenses, finished and fitted in our shop to your prescription.", 6500, "lenses", null, null, null, null, null, false, true, false, true, ["/images/lenses/globle.png"]],
    ["globle-blue-filter", "Globle Blue Filter", "Globle", "A single-vision Globle lens with a blue-light filter for days spent on screens.", 9800, "lenses", null, null, null, null, null, false, true, false, false, lens],
    ["novar-anti-reflective", "Novar", "Novar", "Novar lenses, finished and fitted in our shop to your prescription.", 12000, "lenses", null, null, null, null, null, false, true, false, true, ["/images/lenses/novar.jpg"]],
    ["novar-progressive", "Novar Progressive", "Novar", "A progressive Novar lens with a smooth change from distance to near. Fitted in store.", 24500, "lenses", null, null, null, null, null, false, true, false, false, lens],
    ["essilor-single-vision", "Essilor", "Essilor", "Essilor lenses, finished and fitted in our shop to your prescription.", 15000, "lenses", null, null, null, null, null, false, true, false, true, ["/images/lenses/essilor.png"]],
    ["essilor-progressive", "Essilor Progressive", "Essilor", "Essilor progressive lenses for distance, intermediate, and near vision. Not ordered online.", 32000, "lenses", null, null, null, null, null, false, true, false, false, lens],
  ] as const;

  for (const item of products) {
    const [slug, name, brand, description, price, category, audience, frameType, shape, discountType, discountValue, showDiscount, inStock, hidden, featured, images] = item;
    await prisma.product.create({
      data: {
        slug,
        name,
        brand,
        description,
        price,
        category,
        audience,
        frameType,
        shape,
        discountType,
        discountValue,
        showDiscount,
        inStock,
        hidden,
        featured,
        images: JSON.stringify(images),
      },
    });
  }

  await prisma.booking.create({
    data: {
      name: "Nimal Perera",
      phone: "0771234567",
      email: "nimal@example.com",
      age: 42,
      date: "2026-11-02",
      time: "10:00",
      status: "pending",
    },
  });

  await prisma.review.createMany({
    data: [
      { name: "Nethmi", rating: 5, comment: "Careful eye test and frames that actually suit my face.", approved: true },
      { name: "Ruwan", rating: 5, comment: "Been coming here for years. Honest advice and fair prices.", approved: true },
      { name: "Sanduni", rating: 4, comment: "The sunglasses are stylish and the staff take their time.", approved: true },
      { name: "Waiting review", rating: 5, comment: "This one should stay hidden until an admin approves it.", approved: false },
    ],
  });

  await prisma.article.createMany({
    data: [
      {
        slug: "how-often-to-test-your-eyes",
        title: "How often should you book an eye test?",
        excerpt: "Most adults do well with a check every two years, and sooner if vision changes.",
        cover: "/images/products/20.jpg",
        category: "Eye tests",
        published: true,
        date: "2026-10-12",
        content: "An eye test is a quiet half hour that tells us how clearly you see, and whether your current glasses still match that.\n\nMany adults are comfortable with a test every two years. Come sooner if words look soft, headaches turn up in the evening, or your glasses feel wrong. Children and anyone with a changing prescription should follow the date we suggest after the test.\n\nAt the shop, each appointment is 30 minutes and one person at a time. Book a slot online, then we confirm it by WhatsApp or email.",
      },
      {
        slug: "choosing-frames-for-your-face",
        title: "Choosing frames that suit your face",
        excerpt: "Shape, colour, and weight matter more than a logo. We help you try them on properly.",
        cover: "/images/products/01.jpg",
        category: "Frames",
        published: true,
        date: "2026-09-02",
        content: "A frame should sit level, clear your cheeks, and leave a little room at the temples. If it pinches, it is the wrong size, not a frame you need to endure.\n\nRound faces often like a little height in the frame. Longer faces can look balanced in a deeper shape. The useful test is still the mirror in the shop, with your prescription in mind.\n\nBring an old pair if you have one. It tells us what you already like, and what you are ready to leave behind.",
      },
      {
        slug: "caring-for-contact-lenses",
        title: "A simple routine for contact lenses",
        excerpt: "Clean hands, the right solution, and a fresh pair on schedule.",
        cover: "/images/lenses/a.svg",
        category: "Contact lenses",
        published: true,
        date: "2026-08-18",
        content: "Wash and dry your hands before you touch a lens. Use the solution made for your lens type, not tap water.\n\nDaily lenses are thrown away at the end of the day. Monthly lenses need their case cleaned and the solution changed. Sleeping in lenses that are not made for it is a common reason eyes feel sore.\n\nIf an eye turns red, painful, or suddenly blurry, take the lens out and contact us or a doctor. This article is general guidance, not a diagnosis.",
      },
    ],
  });

  await prisma.holiday.createMany({ data: poya.map(([date, reason]) => ({ date, reason })) });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

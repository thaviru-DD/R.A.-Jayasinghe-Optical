import Link from "next/link";
import { EyeMark } from "@/components/EyeMark";
import { shop, social } from "@/lib/site";

const explore = [
  ["Home", "/"],
  ["Spectacles", "/spectacles"],
  ["Sunglasses", "/sunglasses"],
  ["Contact lenses", "/contact-lenses"],
  ["Lenses", "/lenses"],
  ["Book an eye test", "/book"],
  ["Articles", "/articles"],
  ["Favourites", "/favourites"],
  ["Contact", "/contact"],
];

function Social({ name, href }: { name: string; href: string }) {
  if (!href) return <span className="text-ice/80">{name} · coming soon</span>;
  return (
    <a href={href} className="hover:text-aqua" rel="noreferrer">
      {name}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <EyeMark className="h-12 w-24 text-aqua" />
          <p className="mt-4 font-heading text-2xl font-semibold">{shop.name}</p>
          <p className="mt-3 text-ice">{shop.tagline}</p>
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-aqua">Visit</h2>
          <p className="mt-3">{shop.address}</p>
          <ul className="mt-3 space-y-1">
            {shop.hours.map((item) => (
              <li key={item.days}>{item.days}: {item.hours}</li>
            ))}
          </ul>
          <p className="mt-2">{shop.closedNote}</p>
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-aqua">Contact</h2>
          <ul className="mt-3 space-y-2">
            {shop.phones.map((phone) => (
              <li key={phone.tel}><a className="hover:text-aqua" href={`tel:${phone.tel}`}>{phone.display}</a></li>
            ))}
            <li><a className="hover:text-aqua" href={`mailto:${shop.email}`}>{shop.email}</a></li>
          </ul>
          <div className="mt-4 flex flex-col gap-1">
            <Social name="Facebook" href={social.facebook} />
            <Social name="Instagram" href={social.instagram} />
            <Social name="TikTok" href={social.tiktok} />
          </div>
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-aqua">Explore</h2>
          <ul className="mt-3 space-y-2">
            {explore.map(([label, href]) => (
              <li key={href}><Link className="hover:text-aqua" href={href}>{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-ice">
        <p>Delivery is available island-wide. The delivery charge is confirmed on WhatsApp. Returns are not accepted.</p>
        <p className="mt-2">© {new Date().getFullYear()} {shop.name}. One shop, Ratmalana.</p>
      </div>
    </footer>
  );
}

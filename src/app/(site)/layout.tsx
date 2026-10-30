import { Footer } from "@/components/Footer";
import { SiteChrome } from "@/components/SiteChrome";
import { activeBanner } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const banner = await activeBanner();
  return (
    <>
      <SiteChrome banner={banner ? { text: banner.text, link: banner.link, image: banner.image } : null} />
      <main id="content">{children}</main>
      <Footer />
    </>
  );
}

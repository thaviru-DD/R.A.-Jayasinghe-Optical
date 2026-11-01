import { deleteBanner } from "@/lib/admin-actions";
import { BannerForm } from "@/components/admin/BannerForm";
import { OfferBannerForm } from "@/components/admin/OfferBannerForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getOfferBannerSettings } from "@/lib/products";

export default async function Page() {
  await requireAdmin();
  const [banners, offer] = await Promise.all([
    prisma.banner.findMany({ orderBy: { startDate: "desc" } }),
    getOfferBannerSettings(),
  ]);

  return (
    <div className="space-y-10">
      <section className="rounded-[1.8rem] border border-navy/8 bg-white p-5 shadow-[0_12px_30px_rgba(3,4,94,0.04)] md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Homepage</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl">Offer banners</h1>
        <p className="mt-3 max-w-2xl text-navy/70">
          Control the gold offer strip on the hero and the offer banners in the homepage sections. Set the percent, what
          the offer is on, and the end date text (for example 26 November).
        </p>
        <div className="mt-6">
          <OfferBannerForm
            offer={
              offer
                ? {
                    enabled: offer.enabled,
                    percent: offer.percent,
                    title: offer.title,
                    endsLabel: offer.endsLabel,
                    href: offer.href,
                  }
                : null
            }
          />
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl font-semibold">Top notice banners</h2>
          <p className="mt-2 text-navy/70">Optional top-of-site notice whose dates include today.</p>
          <div className="mt-6">
            <BannerForm />
          </div>
        </div>
        <div className="grid gap-4">
          {banners.map((banner) => (
            <article key={banner.id} className="rounded-[1.4rem] border border-navy/8 bg-white p-5">
              <p className="font-semibold">
                {banner.startDate} to {banner.endDate}
              </p>
              <p className="mt-2">{banner.text}</p>
              <form action={deleteBanner} className="mt-3">
                <input type="hidden" name="id" value={banner.id} />
                <button className="font-semibold" type="submit">
                  Delete
                </button>
              </form>
              <div className="mt-4">
                <BannerForm
                  banner={{
                    id: banner.id,
                    text: banner.text,
                    link: banner.link,
                    image: banner.image,
                    startDate: banner.startDate,
                    endDate: banner.endDate,
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
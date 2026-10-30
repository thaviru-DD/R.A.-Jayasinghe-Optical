import { deleteBanner } from "@/lib/admin-actions";
import { BannerForm } from "@/components/admin/BannerForm";
import { prisma } from "@/lib/db";

export default async function Page() {
  const banners = await prisma.banner.findMany({ orderBy: { startDate: "desc" } });
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="font-heading text-4xl font-semibold">Banners</h1>
        <p className="mt-2">The home page shows the latest banner whose dates include today.</p>
        <div className="mt-6"><BannerForm /></div>
      </div>
      <div className="grid gap-4">
        {banners.map((banner) => (
          <article key={banner.id} className="rounded-[1.4rem] bg-white p-5">
            <p className="font-semibold">{banner.startDate} to {banner.endDate}</p>
            <p className="mt-2">{banner.text}</p>
            <form action={deleteBanner} className="mt-3">
              <input type="hidden" name="id" value={banner.id} />
              <button className="font-semibold" type="submit">Delete</button>
            </form>
            <div className="mt-4">
              <BannerForm banner={{ id: banner.id, text: banner.text, link: banner.link, image: banner.image, startDate: banner.startDate, endDate: banner.endDate }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

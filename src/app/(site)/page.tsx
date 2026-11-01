import { Hero } from "@/components/Hero";
import { HomeBody } from "@/components/HomeBody";
import { approvedReviews, getActiveSiteOffer, homeFeaturedProducts } from "@/lib/products";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ review?: string }>;
}) {
  const sp = await searchParams;
  const [reviews, featuredProducts, offer] = await Promise.all([
    approvedReviews(),
    homeFeaturedProducts(),
    getActiveSiteOffer(),
  ]);

  return (
    <>
      <Hero offer={offer} />
      <HomeBody
        reviews={reviews.map((review) => ({
          id: review.id,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
        }))}
        received={sp.review === "received"}
        featuredProducts={featuredProducts}
        offer={offer}
      />
    </>
  );
}

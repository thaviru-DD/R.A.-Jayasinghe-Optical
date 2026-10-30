import { Hero } from "@/components/Hero";
import { HomeBody } from "@/components/HomeBody";
import { shopPhotos } from "@/lib/site";
import { approvedReviews } from "@/lib/products";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ review?: string }>;
}) {
  const sp = await searchParams;
  const reviews = await approvedReviews();

  return (
    <>
      <Hero />
      <HomeBody
        reviews={reviews.map((review) => ({
          id: review.id,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
        }))}
        received={sp.review === "received"}
        aboutImage={shopPhotos[0]}
      />
    </>
  );
}

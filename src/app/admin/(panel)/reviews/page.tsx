import { moderateReview } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function Page() {
  await requireAdmin();
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-heading text-4xl font-semibold">Reviews</h1>
      <div className="mt-6 grid gap-4">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-[1.4rem] bg-white p-5">
            <p className="font-semibold">{review.name} · {review.rating} / 5 · {review.approved ? "Approved" : "Waiting"}{review.hidden ? " · Hidden" : ""}</p>
            <p className="mt-2 text-lg">{review.comment}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {!review.approved ? (
                <form action={moderateReview}><input type="hidden" name="id" value={review.id} /><input type="hidden" name="action" value="approve" /><button className="rounded-full bg-aqua px-4 py-2 font-semibold">Approve</button></form>
              ) : null}
              {review.hidden ? (
                <form action={moderateReview}><input type="hidden" name="id" value={review.id} /><input type="hidden" name="action" value="show" /><button className="rounded-full bg-ice px-4 py-2 font-semibold">Show</button></form>
              ) : (
                <form action={moderateReview}><input type="hidden" name="id" value={review.id} /><input type="hidden" name="action" value="hide" /><button className="rounded-full bg-ice px-4 py-2 font-semibold">Hide</button></form>
              )}
              <form action={moderateReview}><input type="hidden" name="id" value={review.id} /><input type="hidden" name="action" value="delete" /><button className="rounded-full border border-navy/20 px-4 py-2 font-semibold">Delete</button></form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}


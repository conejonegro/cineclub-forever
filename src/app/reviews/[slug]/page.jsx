import { fetchReviewBySlug } from "@/lib/getReviews/reviews";
import ReviewContent from "@/components/ReviewContent";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const review = await fetchReviewBySlug(slug);

  if (!review) {
    return {
      title: "Reseña no encontrada",
      description: "No se encontró esta reseña en el cineclub.",
    };
  }

  return {
    title: `${review.titulo} | Cineclub Forever`,
    description: review.descripcion,
    openGraph: {
      title: review.titulo,
      description: review.descripcion,
      images: [{ url: review.imagenUrl, width: 600, height: 900, alt: review.titulo }],
    },
    twitter: {
      card: "summary_large_image",
      title: review.titulo,
      description: review.descripcion,
      images: [review.imagenUrl],
    },
  };
}

export default async function ReviewPage({ params }) {
  const { slug } = await params;
  const review = await fetchReviewBySlug(slug);

  if (!review) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-white/40">No encontramos esa reseña.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <ReviewContent review={review} />
    </main>
  );
}

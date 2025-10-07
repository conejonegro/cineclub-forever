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
      images: [
        {
          url: review.imagenUrl,
           width: 600,
          height: 900,
          alt: review.titulo,
        },
      ],
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
      <main className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-gray-600">No encontramos esa reseña.</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <ReviewContent review={review} />
      </div>
    </main>
  );
}

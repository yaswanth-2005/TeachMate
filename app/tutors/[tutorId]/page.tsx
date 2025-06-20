"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Using next/navigation for Next.js App Router
import { StarIcon } from "lucide-react"; // Assuming you have Heroicons installed

// Define interfaces for the data structure
interface Tutor {
  _id: string;
  name: string;
  email: string;
  role: "student" | "tutor";
  bio?: string;
  subjectsTaught?: string[];
  pricePerHour?: number;
  experience?: string;
  qualifications?: string;
  availability?: Array<{
    day: string;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      available: boolean;
    }>;
  }>;
  rating?: number;
  reviewCount?: number;
  profileImage?: string;
}

interface Review {
  _id: string;
  studentId: {
    _id: string;
    name: string;
  };
  tutorId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface TutorProfilePageProps {
  // No props needed as tutorId comes from the URL
}

const TutorProfilePage: React.FC<TutorProfilePageProps> = () => {
  const params = useParams();
  const tutorId = params.tutorId as string;

  const [tutorData, setTutorData] = useState<Tutor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!tutorId) {
        setError("Tutor ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch tutor details and reviews concurrently
        const [tutorResponse, reviewsResponse] = await Promise.all([
          fetch(`/api/tutors/${tutorId}`),
          fetch(`/api/tutors/${tutorId}/reviews`),
        ]);

        if (!tutorResponse.ok) {
          const errorData = await tutorResponse.json();
          throw new Error(errorData.error || "Failed to fetch tutor data");
        }
        const tutorResult = await tutorResponse.json();
        setTutorData(tutorResult.tutor);

        if (!reviewsResponse.ok) {
          const errorData = await reviewsResponse.json();
          throw new Error(errorData.error || "Failed to fetch reviews");
        }
        const reviewsResult = await reviewsResponse.json();
        setReviews(reviewsResult.reviews);
      } catch (err: any) {
        console.error("Fetching data failed:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tutorId]); // Re-run effect if tutorId changes

  if (loading) {
    return (
      <div className="container mx-auto p-4">Loading tutor profile...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  if (!tutorData) {
    return <div className="container mx-auto p-4">Tutor not found.</div>;
  }

  // Helper function to render stars
  const renderStars = (rating: number | undefined) => {
    if (rating === undefined) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon
            key={`full-${i}`}
            className="h-5 w-5 text-yellow-400"
            fill="currentColor"
          />
        ))}
        {hasHalfStar && (
          <StarIcon
            key="half"
            className="h-5 w-5 text-yellow-400"
            fill="url(#half)"
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon
            key={`empty-${i}`}
            className="h-5 w-5 text-gray-300"
            fill="currentColor"
          />
        ))}
        {/* SVG for half star gradient */}
        <svg width="0" height="0">
          <linearGradient id="half">
            <stop offset="50%" stopColor="#facc15" /> {/* yellow-400 */}
            <stop offset="50%" stopColor="#d1d5db" /> {/* gray-300 */}
          </linearGradient>
        </svg>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-card p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
          {tutorData.profileImage ? (
            <img
              src={tutorData.profileImage}
              alt={tutorData.name}
              className="w-24 h-24 rounded-full object-cover mr-6"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl mr-6">
              {tutorData.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {tutorData.name}
            </h1>
            <p className="text-muted-foreground">{tutorData.role}</p>
            <div className="flex items-center mt-1">
              {renderStars(tutorData.rating)}
              {tutorData.reviewCount !== undefined && (
                <span className="ml-2 text-muted-foreground">
                  ({tutorData.reviewCount} reviews)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            About Me
          </h2>
          <p className="text-muted-foreground">
            {tutorData.bio || "No bio provided."}
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Subjects Taught
          </h2>
          {tutorData.subjectsTaught && tutorData.subjectsTaught.length > 0 ? (
            <ul className="list-disc list-inside text-muted-foreground">
              {tutorData.subjectsTaught.map((subject, index) => (
                <li key={index}>{subject}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No subjects listed.</p>
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Experience & Qualifications
          </h2>
          <p className="text-muted-foreground mb-2">
            {tutorData.experience || "No experience details provided."}
          </p>
          <p className="text-muted-foreground">
            {tutorData.qualifications || "No qualifications listed."}
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground mb-2">Price</h2>
          <p className="text-muted-foreground">
            $
            {tutorData.pricePerHour !== undefined
              ? tutorData.pricePerHour.toFixed(2)
              : "N/A"}{" "}
            per hour
          </p>
        </div>

        {/* Availability section (can be expanded) */}
        {/*
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground mb-2">Availability</h2>
          {tutorData.availability && tutorData.availability.length > 0 ? (
            // Render availability details here
            <p className="text-muted-foreground">Availability details...</p>
          ) : (
            <p className="text-muted-foreground">Availability not listed.</p>
          )}
        </div>
        */}
      </div>

      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Reviews ({reviews.length})
        </h2>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li
                key={review._id}
                className="border-b border-border py-4 last:border-b-0"
              >
                <div className="flex items-center mb-2">
                  {renderStars(review.rating)}
                  <span className="ml-4 font-semibold text-foreground">
                    {review.studentId.name}
                  </span>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default TutorProfilePage;

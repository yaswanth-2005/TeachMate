"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import ProtectedRoute from "@/components/Layout/ProtectedRoute";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Star, MessageCircle, Send, BookOpen } from "lucide-react";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  studentId: {
    name: string;
  };
}

interface Tutor {
  _id: string;
  name: string;
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    tutorId: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    if (user?.role === "tutor") {
      fetchMyReviews();
    } else {
      fetchTutors();
    }
  }, [user]);

  const fetchMyReviews = async () => {
    try {
      const response = await fetch("/api/tutors/my-reviews", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTutors = async () => {
    try {
      const response = await fetch("/api/tutors");
      if (response.ok) {
        const data = await response.json();
        setTutors(data.tutors);
      }
    } catch (error) {
      console.error("Error fetching tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(reviewForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Review submitted successfully!");
        setShowReviewForm(false);
        setReviewForm({ tutorId: "", rating: 5, comment: "" });
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={
              interactive && onRatingChange
                ? () => onRatingChange(star)
                : undefined
            }
            className={
              interactive ? "hover:scale-110 transition-transform" : ""
            }
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === "tutor" ? "My Reviews" : "Leave a Review"}
            </h1>
            <p className="text-gray-600 mt-2">
              {user?.role === "tutor"
                ? "See what your students are saying about you"
                : "Share your experience with tutors to help other students"}
            </p>
          </div>

          {user?.role === "student" && (
            <>
              {/* Add Review Button */}
              <div className="mb-8">
                <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Write a Review</CardTitle>
                    <CardDescription>
                      Share your experience with a tutor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      <div className="space-y-2">
                        <Label>Select Tutor</Label>
                        <Select
                          value={reviewForm.tutorId}
                          onValueChange={(value) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              tutorId: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a tutor" />
                          </SelectTrigger>
                          <SelectContent>
                            {tutors.map((tutor) => (
                              <SelectItem key={tutor._id} value={tutor._id}>
                                {tutor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Rating</Label>
                        {renderStars(reviewForm.rating, true, (rating) =>
                          setReviewForm((prev) => ({ ...prev, rating }))
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="comment">Your Review</Label>
                        <Textarea
                          id="comment"
                          placeholder="Share your experience with this tutor..."
                          value={reviewForm.comment}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              comment: e.target.value,
                            }))
                          }
                          rows={4}
                          required
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          type="submit"
                          disabled={submitting || !reviewForm.tutorId}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {submitting ? "Submitting..." : "Submit Review"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Reviews List */}
          {user?.role === "tutor" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Student Reviews</span>
                </CardTitle>
                <CardDescription>
                  Reviews from your students ({reviews.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600">
                      Complete some sessions to start receiving reviews from
                      students
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                      >
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {review.studentId.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {review.studentId.name}
                              </h4>
                              <div className="flex items-center space-x-2">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

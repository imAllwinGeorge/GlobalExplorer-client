"use client";

import type React from "react";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import Input from "../Input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import type { ReviewDTO } from "@/shared/types/DTO";
import { userService } from "@/services/UserService";

interface WriteReviewProps {
  entityId: string;
  userId: string;
  onReviewSubmitted?: (review: ReviewDTO) => void;
  className?: string;
}

export function WriteReview({
  entityId,
  userId,
  onReviewSubmitted,
  className = "",
}: WriteReviewProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const resetForm = () => {
    setRating(0);
    setTitle("");
    setComment("");
    setHoveredRating(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (rating === 0) {
    //   toast.custom({
    //     title: "Rating required",
    //     description: "Please select a rating before submitting your review.",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // if (!title.trim()) {
    //   toast({
    //     title: "Title required",
    //     description: "Please provide a title for your review.",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // if (!comment.trim()) {
    //   toast({
    //     title: "Comment required",
    //     description: "Please write a comment for your review.",
    //     variant: "destructive",
    //   })
    //   return
    // }

    setIsSubmitting(true);

    try {
      const reviewData = {
        entityId,
        userId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Replace this with your actual API call
      // const response = await fetch("/api/reviews", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(reviewData),
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to submit review")
      // }

      // const savedReview = await response.json()

      // toast({
      //   title: "Review submitted!",
      //   description: "Thank you for your feedback.",
      // })

      const response = await userService.writeReview(reviewData);

      if (response.status === 201) {
        resetForm();
        onReviewSubmitted?.(response.data.review as ReviewDTO);
        toast.success("review posted successfully`")
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Select a rating";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          Write a Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Rating</Label>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 hover:scale-110 transition-transform"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">
                {getRatingText(hoveredRating || rating)}
              </span>
            </div>
          </div>

          {/* Title Section */}
          <div className="space-y-2">
            <label htmlFor="review-title" className="text-sm font-medium">
              Review Title
            </label>
            <Input
              id="review-title"
              placeholder="Summarize your experience..."
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              maxLength={100}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-right">
              {title.length}/100
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-2 ">
            <label htmlFor="review-comment" className="text-sm font-medium">
              Your Review
            </label>
            <textarea
              id="review-comment"
              placeholder="Share your detailed experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={4}
              className="w-full resize-none border rounded p-6"
            />
            <div className="text-xs text-muted-foreground text-right">
              {comment.length}/500
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={
              isSubmitting || rating === 0 || !title.trim() || !comment.trim()
            }
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

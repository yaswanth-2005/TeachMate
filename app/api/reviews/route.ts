import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/lib/models/Review';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tutorId, rating, comment } = await request.json();

    // Validate input
    if (!tutorId || !rating || !comment) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if tutor exists
    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== 'tutor') {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }

    // Check if student has already reviewed this tutor
    const existingReview = await Review.findOne({
      studentId: decoded.userId,
      tutorId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this tutor' },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      studentId: decoded.userId,
      tutorId,
      rating,
      comment,
    });

    // Update tutor's average rating
    const allReviews = await Review.find({ tutorId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await User.findByIdAndUpdate(tutorId, {
      rating: avgRating,
      reviewCount: allReviews.length,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('studentId', 'name');

    return NextResponse.json({
      message: 'Review submitted successfully',
      review: populatedReview,
    });
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
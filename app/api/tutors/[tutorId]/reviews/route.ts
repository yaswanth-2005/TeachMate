import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/lib/models/Review';

export async function GET(
  request: NextRequest,
  { params }: { params: { tutorId: string } }
) {
  try {
    await dbConnect();
    
    const reviews = await Review.find({ tutorId: params.tutorId })
      .populate('studentId', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
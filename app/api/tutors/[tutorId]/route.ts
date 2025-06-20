import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { tutorId: string } }
) {
  try {
    await dbConnect();
    
    const tutor = await User.findOne({ 
      _id: params.tutorId, 
      role: 'tutor' 
    }).select('-password');

    if (!tutor) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }

    return NextResponse.json({ tutor });
  } catch (error) {
    console.error('Error fetching tutor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
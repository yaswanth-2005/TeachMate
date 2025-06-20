import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/lib/models/Booking';
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

    const { tutorId, date, startTime, endTime, subject } = await request.json();

    // Validate input
    if (!tutorId || !date || !startTime || !endTime || !subject) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get tutor to calculate price
    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== 'tutor') {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }

    // Calculate duration and price
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const price = durationHours * tutor.pricePerHour;

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      tutorId,
      date: new Date(date),
      $or: [
        {
          startTime: { $lt: end },
          endTime: { $gt: start }
        }
      ],
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Time slot is not available' },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      studentId: decoded.userId,
      tutorId,
      date: new Date(date),
      startTime: start,
      endTime: end,
      subject,
      price,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('tutorId', 'name email')
      .populate('studentId', 'name email');

    return NextResponse.json({
      message: 'Booking created successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
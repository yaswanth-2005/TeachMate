import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Review from "@/lib/models/Review";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const [totalSessions, thisMonth, pendingBookings, reviews] =
      await Promise.all([
        Booking.countDocuments({ tutorId: decoded.userId }),
        Booking.countDocuments({
          tutorId: decoded.userId,
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        }),
        Booking.countDocuments({
          tutorId: decoded.userId,
          status: "pending",
        }),
        Review.find({ tutorId: decoded.userId }),
      ]);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return NextResponse.json({
      totalSessions,
      thisMonth,
      pendingBookings,
      avgRating,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

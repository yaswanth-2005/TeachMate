"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Users,
  MessageCircle,
  Star,
  Clock,
  User,
  DollarSign,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner"; // Import toast for notifications
import Link from "next/link";

const TutorDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    thisMonth: 0,
    pendingBookings: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);

  // Function to fetch all necessary data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching starts
      const [bookingsRes, statsRes] = await Promise.all([
        fetch("/api/bookings/tutor", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch("/api/tutor/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: "confirmed" | "cancelled"
  ) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Booking ${newStatus} successfully!`);
        fetchData(); // Re-fetch data to update the UI
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || `Failed to update booking status to ${newStatus}`
        );
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("An error occurred while updating booking status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👨‍🏫
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your tutoring sessions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSessions}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.thisMonth}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingBookings}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgRating.toFixed(1)}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/profile">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Update Profile
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage your info & availability
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/messages">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 rounded-full p-3">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-600">Chat with students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reviews">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Reviews</h3>
                  <p className="text-sm text-gray-600">View student feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Recent Bookings</span>
              </CardTitle>
              <CardDescription>
                Your latest session bookings from students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking: any) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {booking.student?.name?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {booking.student?.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {booking.subject}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(booking.date).toLocaleDateString()}
                            </span>
                            <span>{booking.timeSlot}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant="outline" className="capitalize">
                          {booking.status}
                        </Badge>
                        {booking.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  booking._id,
                                  "cancelled"
                                )
                              }
                            >
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  booking._id,
                                  "confirmed"
                                )
                              }
                            >
                              Accept
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No bookings yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete your profile to start receiving booking requests
                  </p>
                  <Link href="/profile">
                    <Button>Complete Profile</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Profile completeness
                  </span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Add more subjects and availability to improve your profile
                </p>
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="w-full">
                    Update Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-l-4 border-l-yellow-400 pl-4">
                  <div className="flex items-center space-x-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    "Great tutor! Very patient and knowledgeable."
                  </p>
                  <p className="text-xs text-gray-500 mt-1">- Sarah M.</p>
                </div>
                <div className="border-l-4 border-l-yellow-400 pl-4">
                  <div className="flex items-center space-x-1 mb-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-600">
                    "Helpful sessions, would recommend!"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">- John D.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;

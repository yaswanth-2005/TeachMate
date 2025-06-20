'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  BookOpen,
  Star,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface Tutor {
  _id: string;
  name: string;
  subjectsTaught: string[];
  pricePerHour: number;
  rating: number;
  reviewCount: number;
}

export default function BookSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const tutorId = params.tutorId as string;
  
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    subject: '',
    notes: '',
  });

  useEffect(() => {
    if (tutorId) {
      fetchTutor();
    }
  }, [tutorId]);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
    }
  }, [user, router]);

  const fetchTutor = async () => {
    try {
      const response = await fetch(`/api/tutors/${tutorId}`);
      if (response.ok) {
        const data = await response.json();
        setTutor(data.tutor);
      }
    } catch (error) {
      console.error('Error fetching tutor:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    
    if (end <= start) return 0;
    
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const calculatePrice = () => {
    const duration = calculateDuration();
    return duration * (tutor?.pricePerHour || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to book a session');
      return;
    }

    if (calculateDuration() <= 0) {
      toast.error('End time must be after start time');
      return;
    }

    setBooking(true);

    try {
      const bookingDate = new Date(formData.date);
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          tutorId,
          date: bookingDate.toISOString(),
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          subject: formData.subject,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Session booked successfully!');
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Failed to book session');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tutor not found
              </h3>
              <p className="text-gray-600 mb-4">
                The tutor you're trying to book doesn't exist.
              </p>
              <Link href="/tutors">
                <Button>Browse Tutors</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const duration = calculateDuration();
  const totalPrice = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/tutors/${tutorId}`}>
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>

        {/* Tutor Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {tutor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{tutor.name}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{tutor.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({tutor.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">${tutor.pricePerHour}/hr</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {tutor.subjectsTaught.slice(0, 3).map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Book a Session</span>
            </CardTitle>
            <CardDescription>
              Fill in the details below to book your tutoring session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutor.subjectsTaught.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific topics or requirements you'd like to discuss..."
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Summary */}
              {duration > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Session Summary</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{duration} hour{duration !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate:</span>
                        <span>${tutor.pricePerHour}/hr</span>
                      </div>
                      <div className="flex justify-between font-medium text-blue-900 pt-1 border-t border-blue-200">
                        <span>Total:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={booking || duration <= 0}>
                {booking ? 'Booking Session...' : `Book Session${duration > 0 ? ` - $${totalPrice.toFixed(2)}` : ''}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
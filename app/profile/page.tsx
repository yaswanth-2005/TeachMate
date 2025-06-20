'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  User, 
  BookOpen, 
  DollarSign, 
  Plus, 
  X,
  Clock,
  Award
} from 'lucide-react';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor';
  bio: string;
  subjectsTaught: string[];
  pricePerHour: number;
  experience: string;
  qualifications: string;
  rating: number;
  reviewCount: number;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    subjectsTaught: [] as string[],
    pricePerHour: 0,
    experience: '',
    qualifications: '',
  });
  const [newSubject, setNewSubject] = useState('');

  const availableSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
    'History', 'Geography', 'Computer Science', 'Economics', 'Psychology',
    'French', 'Spanish', 'German', 'Art', 'Music'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setFormData({
          name: data.user.name || '',
          bio: data.user.bio || '',
          subjectsTaught: data.user.subjectsTaught || [],
          pricePerHour: data.user.pricePerHour || 0,
          experience: data.user.experience || '',
          qualifications: data.user.qualifications || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSubject = () => {
    if (newSubject && !formData.subjectsTaught.includes(newSubject)) {
      setFormData(prev => ({
        ...prev,
        subjectsTaught: [...prev.subjectsTaught, newSubject]
      }));
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjectsTaught: prev.subjectsTaught.filter(s => s !== subject)
    }));
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
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                      {profile?.name.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {profile?.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{profile?.email}</p>
                  <Badge variant="secondary" className="capitalize">
                    {profile?.role}
                  </Badge>

                  {profile?.role === 'tutor' && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Rating</span>
                          <span className="font-medium">{profile.rating.toFixed(1)} ⭐</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Reviews</span>
                          <span className="font-medium">{profile.reviewCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Rate</span>
                          <span className="font-medium">${profile.pricePerHour}/hr</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                  <CardDescription>
                    Update your profile information to help others find you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell others about yourself..."
                          value={formData.bio}
                          onChange={(e) => handleChange('bio', e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Tutor-specific fields */}
                    {user?.role === 'tutor' && (
                      <>
                        <Separator />
                        
                        {/* Subjects */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Subjects I Teach</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {formData.subjectsTaught.map((subject) => (
                                <Badge key={subject} variant="secondary" className="flex items-center space-x-1">
                                  <span>{subject}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeSubject(subject)}
                                    className="ml-1 hover:text-red-600"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex space-x-2">
                              <select
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select a subject</option>
                                {availableSubjects
                                  .filter(subject => !formData.subjectsTaught.includes(subject))
                                  .map((subject) => (
                                    <option key={subject} value={subject}>
                                      {subject}
                                    </option>
                                  ))}
                              </select>
                              <Button type="button" onClick={addSubject} disabled={!newSubject}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pricePerHour">Price per Hour ($)</Label>
                            <Input
                              id="pricePerHour"
                              type="number"
                              min="0"
                              step="0.01"
                              value={formData.pricePerHour}
                              onChange={(e) => handleChange('pricePerHour', parseFloat(e.target.value) || 0)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="experience">Experience</Label>
                            <Textarea
                              id="experience"
                              placeholder="Describe your teaching experience..."
                              value={formData.experience}
                              onChange={(e) => handleChange('experience', e.target.value)}
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="qualifications">Qualifications</Label>
                            <Textarea
                              id="qualifications"
                              placeholder="List your educational background and certifications..."
                              value={formData.qualifications}
                              onChange={(e) => handleChange('qualifications', e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <Button type="submit" className="w-full" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
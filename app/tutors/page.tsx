"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Star,
  DollarSign,
  BookOpen,
  Filter,
  Users,
  Clock,
} from "lucide-react";

interface Tutor {
  _id: string;
  name: string;
  bio: string;
  subjectsTaught: string[];
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  experience: string;
  qualifications: string;
}

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [minRating, setMinRating] = useState("");

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Computer Science",
    "Economics",
    "Psychology",
  ];

  useEffect(() => {
    fetchTutors();
  }, []);

  useEffect(() => {
    filterTutors();
  }, [tutors, searchTerm, selectedSubject, priceRange, minRating]);

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

  const filterTutors = () => {
    let filtered = [...tutors];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tutor) =>
          tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tutor.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Subject filter
    if (selectedSubject && selectedSubject !== "all") {
      filtered = filtered.filter((tutor) =>
        tutor.subjectsTaught.some((subject) =>
          subject.toLowerCase().includes(selectedSubject.toLowerCase())
        )
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(
        (tutor) => tutor.pricePerHour >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (tutor) => tutor.pricePerHour <= parseFloat(priceRange.max)
      );
    }

    // Rating filter
    if (minRating) {
      filtered = filtered.filter(
        (tutor) => tutor.rating >= parseFloat(minRating)
      );
    }

    setFilteredTutors(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("");
    setPriceRange({ min: "", max: "" });
    setMinRating("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Tutor
          </h1>
          <p className="text-gray-600">
            Browse through our qualified tutors and find the perfect match for
            your learning needs
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Tutors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search tutors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Min Price ($/hr)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Max Price ($/hr)</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Min Rating</Label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any rating</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="2">2+ stars</SelectItem>
                    <SelectItem value="1">1+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                Showing {filteredTutors.length} of {tutors.length} tutors
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tutors Grid */}
        {filteredTutors.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tutors found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to find more tutors
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <Card
                key={tutor._id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {tutor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{tutor.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {tutor.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({tutor.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {tutor.bio ||
                        "Experienced tutor ready to help you achieve your learning goals."}
                    </p>

                    {/* Subjects */}
                    <div>
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjectsTaught.slice(0, 3).map((subject) => (
                          <Badge
                            key={subject}
                            variant="secondary"
                            className="text-xs"
                          >
                            {subject}
                          </Badge>
                        ))}
                        {tutor.subjectsTaught.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tutor.subjectsTaught.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Price and Experience */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-1 text-green-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">
                          ${tutor.pricePerHour}/hr
                        </span>
                      </div>
                      {tutor.experience && (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{tutor.experience}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Link href={`/tutors/${tutor._id}`} className="flex-1">
                        <Button className="w-full">View Profile</Button>
                      </Link>
                      <Link href={`/book/${tutor._id}`}>
                        <Button variant="outline">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

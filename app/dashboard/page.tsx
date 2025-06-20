'use client';

import React from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import StudentDashboard from '@/components/Dashboard/StudentDashboard';
import TutorDashboard from '@/components/Dashboard/TutorDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {user?.role === 'student' ? <StudentDashboard /> : <TutorDashboard />}
      </div>
    </ProtectedRoute>
  );
}
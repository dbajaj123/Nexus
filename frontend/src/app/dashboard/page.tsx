'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { BookOpen, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { data: courses } = useQuery({
    queryKey: ['myCourses'],
    queryFn: async () => {
      const response = await api.get('/courses/my-courses');
      return response.data;
    },
  });

  const { data: upcomingAssignments } = useQuery({
    queryKey: ['upcomingAssignments'],
    queryFn: async () => {
      const response = await api.get('/assignments/upcoming');
      return response.data;
    },
    enabled: user?.role === 'STUDENT',
  });

  const { data: wellnessStats } = useQuery({
    queryKey: ['wellnessStats'],
    queryFn: async () => {
      const response = await api.get('/wellness/stats');
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.profile.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">XP</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.profile.xp}</div>
            <p className="text-xs text-muted-foreground">Level {user?.profile.level}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active enrollments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAssignments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Due soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wellness</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wellnessStats?.averageMood?.toFixed(1) || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Average mood</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses */}
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses?.map((course: any) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{course.name}</h3>
                  <p className="text-sm text-gray-600">{course.code}</p>
                </div>
                <Badge>{course.teacher?.profile?.firstName} {course.teacher?.profile?.lastName}</Badge>
              </div>
            ))}
            {(!courses || courses.length === 0) && (
              <p className="text-gray-500 text-center py-8">No courses enrolled yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assignments */}
      {user?.role === 'STUDENT' && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments?.map((assignment: any) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.course.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Due: {formatDate(assignment.dueDate)}</p>
                    <Badge variant={assignment.submissions?.length > 0 ? 'secondary' : 'destructive'}>
                      {assignment.submissions?.length > 0 ? 'Submitted' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!upcomingAssignments || upcomingAssignments.length === 0) && (
                <p className="text-gray-500 text-center py-8">No upcoming assignments</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

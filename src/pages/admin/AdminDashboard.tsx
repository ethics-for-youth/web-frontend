import { useState, useEffect } from 'react';
import { Calendar, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockEvents, mockCourses, mockRegistrations } from '@/data/mockData';
import { Registration } from '@/types';

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    setRegistrations(mockRegistrations);
  }, []);

  const stats = [
    {
      title: 'Total Events',
      value: mockEvents.length,
      description: 'Active events in the system',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Total Courses',
      value: mockCourses.filter(c => c.isActive).length,
      description: 'Active courses available',
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      title: 'Total Registrations',
      value: registrations.length,
      description: 'All-time registrations',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Growth Rate',
      value: '12%',
      description: 'Monthly growth in registrations',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const getRelatedName = (registration: Registration) => {
    if (registration.type === 'Event' && registration.relatedEventId) {
      const event = mockEvents.find(e => e.id === registration.relatedEventId);
      return event?.title || 'Unknown Event';
    }
    if (registration.type === 'Course' && registration.relatedCourseId) {
      const course = mockCourses.find(c => c.id === registration.relatedCourseId);
      return course?.title || 'Unknown Course';
    }
    return 'General Volunteer';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Event': return 'bg-blue-100 text-blue-800';
      case 'Course': return 'bg-green-100 text-green-800';
      case 'Volunteer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of Ethics For Youth activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Registrations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Registrations</CardTitle>
          <CardDescription>Latest 5 registrations across all programs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {registrations.map((registration) => (
              <div key={registration.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium text-foreground">{registration.name}</h4>
                      <p className="text-sm text-muted-foreground">{registration.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Age: {registration.age}</span>
                    <span>•</span>
                    <span>{registration.gender}</span>
                    <span>•</span>
                    <span>{getRelatedName(registration)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getTypeColor(registration.type)}>
                    {registration.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(registration.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
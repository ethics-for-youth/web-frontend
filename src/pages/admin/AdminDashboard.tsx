import { Calendar, BookOpen, Users, TrendingUp, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminStats } from '@/hooks/useAdminStats';
import { formatDateForDisplay } from '@/utils/dateUtils';

const AdminDashboard = () => {
  const { data: adminStats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading dashboard statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
            <p className="text-destructive mb-4">Failed to load dashboard statistics</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  if (!adminStats) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No statistics available</p>
        </div>
      </div>
    );
  }

  const { stats } = adminStats;

  const dashboardStats = [
    {
      title: 'Total Events',
      value: stats.overview.totalEvents,
      description: `${stats.events.active} active, ${stats.events.upcoming} upcoming`,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Total Courses',
      value: stats.overview.totalCourses,
      description: 'Currently offered courses',
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      title: 'Total Registrations',
      value: stats.overview.totalRegistrations,
      description: `${stats.registrations.recent} recent registrations`,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Messages',
      value: stats.overview.totalMessages,
      description: `${stats.messages.pending} pending review`,
      icon: MessageSquare,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of Ethics For Youth activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => {
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

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Platform Overview</CardTitle>
            <CardDescription>Key metrics and participation statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Volunteers</span>
                <span className="font-medium">{stats.overview.totalVolunteers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Participants</span>
                <span className="font-medium">{stats.overview.totalParticipants}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Competitions</span>
                <span className="font-medium">{stats.overview.totalCompetitions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Upcoming Competitions</span>
                <span className="font-medium">{stats.competitions.upcoming}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Messages by Type</CardTitle>
            <CardDescription>Community feedback and communication breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.messages.byType).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground capitalize">
                    {type.replace('-', ' ')}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Last updated: {formatDateForDisplay(adminStats.lastUpdated)}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
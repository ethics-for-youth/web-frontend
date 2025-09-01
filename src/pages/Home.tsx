import { Link } from 'react-router-dom';
import { Calendar, BookOpen, Users, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEvents } from '@/hooks/useEvents';
import { useCourses } from '@/hooks/useCourses';
import heroImage from '@/assets/hero-bg.jpg';
import { formatDateForDisplay } from '@/utils/dateUtils';
import WeeklyDuaCard from '@/components/ui/default WeeklyDuaCard';

const Home = () => {
  const { data: allEvents = [], isLoading: eventsLoading, error: eventsError } = useEvents();
  const { data: allCourses = [], isLoading: coursesLoading } = useCourses();
  const upcomingEvents = Array.isArray(allEvents) ? allEvents.slice(0, 3) : [];
  const featuredCourses = Array.isArray(allCourses) ? allCourses.filter(course => course.status === 'active').slice(0, 3) : [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Ethics For{' '}
              <span className="text-primary bg-gradient-primary bg-clip-text text-transparent">
                Youth
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Empowering young Muslims with knowledge, ethics, and community engagement
              rooted in Islamic values. Building character for a better tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                <Link to="/events">
                  <Calendar className="w-5 h-5 mr-2" />
                  Explore Events
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/courses">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Courses
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Weekly Dua Section */}
      <WeeklyDuaCard />

      {/* Upcoming Events Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our community events designed to strengthen faith, build character,
              and create lasting connections.
            </p>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center mb-8">
              <Card className="p-8">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading upcoming events...</p>
                </div>
              </Card>
            </div>
          ) : eventsError ? (
            <div className="flex justify-center mb-8">
              <Card className="p-8">
                <div className="text-center">
                  <p className="text-muted-foreground">Unable to load events at the moment.</p>
                  <p className="text-sm text-muted-foreground mt-2">Please check back later.</p>
                </div>
              </Card>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="flex justify-center mb-8">
              <Card className="p-8">
                <div className="text-center">
                  <p className="text-muted-foreground">No upcoming events available.</p>
                </div>
              </Card>
            </div>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="shadow-card hover:shadow-lg transition-shadow bg-gradient-card flex flex-col"
                >
                  <CardHeader>
                    <CardTitle className="text-primary">{event.title}</CardTitle>
                    <CardDescription>
                      <span className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateForDisplay(event.date)}</span>
                      </span>
                      <span className="block mt-1 text-muted-foreground">{event.location}</span>
                    </CardDescription>
                  </CardHeader>

                  {/* Make CardContent take all space and push button down */}
                  <CardContent className="flex flex-col flex-1">
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="mt-auto">
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/events/${event.id}`}>
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/events">
                View All Events
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Deepen your understanding of Islam through our comprehensive courses
              designed for modern Muslim youth.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredCourses.map((course) => (
              <Card
                key={course.id}
                className="shadow-card hover:shadow-lg transition-shadow bg-gradient-card flex flex-col"
              >
                <CardHeader>
                  <CardTitle className="text-primary">{course.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground font-medium">
                        {course.duration}
                      </span>
                      <span className="text-sm font-medium text-accent-foreground bg-accent px-3 py-1 rounded-full">
                        {course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'All Levels'}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>

                {/* Stretch content and push button down */}
                <CardContent className="flex flex-col flex-1">
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="mt-auto">
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/courses/${course.id}`}>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/courses">
                View All Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join our community of young Muslims committed to personal growth,
            community service, and living by Islamic principles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg" className="px-4 py-2">
              <Link to="/volunteer">
                <Users className="w-5 h-5 mr-2" />
                Become a Volunteer
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="px-4 py-2">
              <Link to="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
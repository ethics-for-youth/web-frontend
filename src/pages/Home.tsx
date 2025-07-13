import { Link } from 'react-router-dom';
import { Calendar, BookOpen, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockEvents, mockCourses } from '@/data/mockData';
import heroImage from '@/assets/hero-bg.jpg';

const Home = () => {
  const upcomingEvents = mockEvents.slice(0, 3);
  const featuredCourses = mockCourses.filter(course => course.isActive).slice(0, 3);

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="shadow-card hover:shadow-lg transition-shadow bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-primary">{event.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                    </div>
                    <div className="mt-1 text-muted-foreground">{event.location}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/events/${event.id}`}>
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

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
              <Card key={course.id} className="shadow-card hover:shadow-lg transition-shadow bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-primary">{course.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{course.duration}</span>
                      <span className="text-sm font-medium text-accent-foreground bg-accent px-2 py-1 rounded">
                        {course.mode}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/courses/${course.id}`}>
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
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
            <Button asChild variant="secondary" size="lg">
              <Link to="/volunteer">
                <Users className="w-5 h-5 mr-2" />
                Become a Volunteer
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
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
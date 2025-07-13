import { Link } from 'react-router-dom';
import { BookOpen, Clock, Monitor, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockCourses } from '@/data/mockData';
import coursesImage from '@/assets/courses-illustration.jpg';

const Courses = () => {
  const activeCourses = mockCourses.filter(course => course.isActive);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src={coursesImage} 
              alt="Islamic Education Courses" 
              className="w-64 h-48 object-cover rounded-lg shadow-soft"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Islamic Education Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Deepen your understanding of Islam through our comprehensive courses designed 
            for modern Muslim youth. Learn from qualified instructors in a supportive environment.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCourses.map((course) => (
            <Card key={course.id} className="shadow-card hover:shadow-lg transition-shadow bg-gradient-card group flex flex-col h-full">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-primary group-hover:text-primary-light transition-colors line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    Active
                  </Badge>
                </div>
                <CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Monitor className="w-4 h-4 text-primary" />
                      <span>{course.mode}</span>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-muted-foreground mb-6 line-clamp-4">
                  {course.description}
                </p>
                <div className="mt-auto">
                  <Button asChild className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                    <Link to={`/courses/${course.id}`}>
                      View Details & Enroll
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Active Courses Fallback */}
        {activeCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Active Courses</h3>
            <p className="text-muted-foreground mb-6">
              Check back soon for new course offerings and programs.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">
                Contact Us for Updates
              </Link>
            </Button>
          </div>
        )}

        {/* Course Benefits Section */}
        {activeCourses.length > 0 && (
          <div className="mt-16">
            <div className="bg-muted/50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Why Choose Our Courses?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Expert Instructors</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn from qualified scholars and experienced educators
                  </p>
                </div>
                <div className="text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Comprehensive Curriculum</h3>
                  <p className="text-sm text-muted-foreground">
                    Well-structured programs covering theory and practical application
                  </p>
                </div>
                <div className="text-center">
                  <Monitor className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Flexible Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    Online, in-person, and hybrid options to fit your schedule
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {activeCourses.length > 0 && (
          <div className="mt-16 text-center bg-primary text-primary-foreground rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Begin Your Learning Journey?
            </h2>
            <p className="mb-6 text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of students who have enhanced their Islamic knowledge 
              and strengthened their faith through our courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary">
                <Link to="/volunteer">
                  Join Our Community
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">
                  Ask Questions
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
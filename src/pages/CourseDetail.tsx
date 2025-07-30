import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, Monitor, ArrowLeft, Users, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RegistrationForm from '@/components/RegistrationForm';
import { useCourse } from '@/hooks/useCourses';
import { courseBenefits } from '@/data/mockData';
import { formatDateForDisplay } from '@/utils/dateUtils';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading, error } = useCourse(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Failed to Load Course</h1>
          <p className="text-muted-foreground mb-6">
            There was an error loading the course details. Please try again.
          </p>
          <Button asChild>
            <Link to="/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link to="/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-card bg-gradient-card">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {course.title}
                  </h1>
                  <Badge variant={course.status === 'active' ? "default" : "secondary"} className="ml-4">
                    {course.status === 'active' ? 'Active' : course.status === 'inactive' ? 'Inactive' : 'Completed'}
                  </Badge>
                </div>

                {/* Course Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Duration</p>
                      <p className="text-muted-foreground">{course.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Instructor</p>
                      <p className="text-muted-foreground">{course.instructor || 'TBA'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Level</p>
                      <p className="text-muted-foreground">{course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'All Levels'}</p>
                    </div>
                  </div>
                </div>

                {/* Course Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Course Overview</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {courseBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Requirements */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Requirements</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Basic knowledge of Arabic letters (helpful but not required)</li>
                    <li>• Commitment to attend weekly sessions</li>
                    <li>• Open mind and willingness to learn</li>
                    <li>• Note-taking materials</li>
                    {course.materials && <li>• Required Materials: {course.materials}</li>}
                  </ul>
                </div>

                {/* Course Schedule */}
                <div className="p-6 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">Course Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    {course.startDate && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Start Date:</p>
                        <p>{formatDateForDisplay(course.startDate)}</p>
                      </div>
                    )}
                    {course.endDate && (
                      <div>
                        <p className="font-medium text-foreground mb-1">End Date:</p>
                        <p>{formatDateForDisplay(course.endDate)}</p>
                      </div>
                    )}
                    {course.schedule && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Schedule:</p>
                        <p>{course.schedule}</p>
                      </div>
                    )}
                    {course.maxParticipants && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Max Participants:</p>
                        <p>{course.maxParticipants} students</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enrollment Form */}
          <div className="lg:col-span-1">
            {course.status === 'active' ? (
              <RegistrationForm
                type="Course"
                relatedId={course.id}
                title={course.title}
                showPaymentConfirmation={true}
              />
            ) : (
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Course Not Available</h3>
                  <p className="text-muted-foreground mb-4">
                    This course is currently not accepting new enrollments. 
                    Check back later or contact us for updates.
                  </p>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/courses">
                        View Active Courses
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/contact">
                        Get Notified
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
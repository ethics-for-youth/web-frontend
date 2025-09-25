import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEvents } from '@/hooks/useEvents';
import eventsImage from '@/assets/events.png';
import { formatDateForDisplay } from '@/utils/dateUtils';

const Events = () => {
  const { data: events = [], isLoading, error } = useEvents();

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img 
                src={eventsImage} 
                alt="Community Events" 
                className="w-64 h-48 object-cover rounded-lg shadow-soft"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Community Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our inspiring events designed to strengthen your faith, build meaningful 
              connections, and contribute to our community's growth.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Card className="p-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img 
                src={eventsImage} 
                alt="Community Events" 
                className="w-64 h-48 object-cover rounded-lg shadow-soft"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Community Events
            </h1>
          </div>
          
          <div className="flex justify-center">
            <Card className="p-8 border-destructive">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="w-6 h-6" />
                <p>Failed to load events. Please try again later.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src={eventsImage} 
              alt="Community Events" 
              className="w-64 h-48 object-cover rounded-lg shadow-soft"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Community Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our inspiring events designed to strengthen your faith, build meaningful 
            connections, and contribute to our community's growth.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id} className="block">
              <Card className="shadow-card hover:shadow-lg transition-shadow bg-gradient-card group flex flex-col h-full cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-primary group-hover:text-primary-light transition-colors">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <span className="space-y-2 block">
                          <span className="flex items-center space-x-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{formatDateForDisplay(event.date)}</span>
                          </span>
                          <span className="flex items-center space-x-2 text-sm block mt-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{event.location}</span>
                          </span>
                          <span className="flex items-center space-x-2 text-sm block mt-1">
                            <User className="w-4 h-4 text-primary" />
                            <span>Category: {event.category}</span>
                          </span>
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-muted-foreground mb-6 line-clamp-4">
                    {event.description}
                  </p>
                  <div className="mt-auto">
                    <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity group-hover:bg-primary-dark">
                      View Details & Register
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Events Fallback */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Events Available</h3>
            <p className="text-muted-foreground mb-6">
              Check back soon for upcoming events and programs.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">
                Contact Us for Updates
              </Link>
            </Button>
          </div>
        )}

        {/* Call to Action */}
        {events.length > 0 && (
          <div className="mt-16 text-center bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Stay Updated with Our Events
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Don't miss out on our inspiring events. Join our community to receive 
              notifications about upcoming programs and activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/volunteer">
                  Join Our Community
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockEvents } from '@/data/mockData';
import eventsImage from '@/assets/events-illustration.jpg';

const Events = () => {
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
          {mockEvents.map((event) => (
            <Card key={event.id} className="shadow-card hover:shadow-lg transition-shadow bg-gradient-card group flex flex-col h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-primary group-hover:text-primary-light transition-colors">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="w-4 h-4 flex items-center justify-center text-primary font-bold">⏰</span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <User className="w-4 h-4 text-primary" />
                          <span>Speaker: {event.speaker}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-muted-foreground mb-6 line-clamp-4">
                  {event.description}
                </p>
                <div className="mt-auto">
                  <Button asChild className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                    <Link to={`/events/${event.id}`}>
                      View Details & Register
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Events Fallback */}
        {mockEvents.length === 0 && (
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
        {mockEvents.length > 0 && (
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
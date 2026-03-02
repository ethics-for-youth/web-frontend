import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowLeft, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RegistrationForm from '@/components/RegistrationForm';
import EventRegistrationPayment from '@/components/EventRegistrationPayment';
import { useEvent } from '@/hooks/useEvents';
import { formatDateForDisplay, formatTimeForDisplay, isDateInFuture } from '@/utils/dateUtils';
import { RazorpayResponse } from '@/types';
import { useEffect } from 'react';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useEvent(id || '');
  useEffect(() => {
  window.scrollTo(0, 0);  
}, [id]);

  const handleEventRegistrationSuccess = (response: RazorpayResponse) => {
    console.log('Event registration successful:', response);
    // You can add additional success handling here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error ? 'Failed to Load Event' : 'Event Not Found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error ? 'There was an error loading the event details.' : 'The event you\'re looking for doesn\'t exist.'}
          </p>
          <Button asChild>
            <Link to="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Use centralized date utilities
  const isUpcoming = isDateInFuture(event.date);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link to="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-card bg-gradient-card">
              <CardContent className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {event.title || 'Event Title Not Available'}
                </h1>

                {/* Event Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Date</p>
                        <p className="text-muted-foreground">
                          {formatDateForDisplay(event.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Time</p>
                        <p className="text-muted-foreground">
                          {formatTimeForDisplay(event.date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Location</p>
                        <p className="text-muted-foreground">{event.location || 'Location not available'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Category</p>
                        <p className="text-muted-foreground">{event.category || 'Category not available'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Status and Fee */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isUpcoming 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {isUpcoming ? 'Upcoming Event' : 'Past Event'}
                  </span>
                  
                  {/* Registration Fee */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Registration Fee:</span>
                    <span className="text-lg font-bold text-primary">
                      {event.registrationFee && event.registrationFee > 0 
                        ? `₹${event.registrationFee.toLocaleString('en-IN')}` 
                        : 'Free'}
                    </span>
                  </div>
                </div>

                {/* Event Description */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">About This Event</h2>
                  <div className="prose prose-slate max-w-none">
                     <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                       {event.description || 'No description available for this event.'}
                     </p>
                  </div>
                </div>

                {/* Event Guidelines */}
                <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">Event Guidelines</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Please arrive 15 minutes before the event start time</li>
                    <li>• Dress code: Modest Islamic attire</li>
                    <li>• Refreshments will be provided</li>
                    <li>• Bring a notebook for taking notes</li>
                    <li>• Free parking available on-site</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-1">
            {isUpcoming ? (
              <>
                {/* Show payment component if event has registration fee */}
                {event.registrationFee && event.registrationFee > 0 ? (
                  <EventRegistrationPayment
                    event={{
                      ...event,
                      registrationFee: event.registrationFee
                    }}
                    onRegistrationSuccess={handleEventRegistrationSuccess}
                  />
                ) : (
                  /* Fallback to registration form for free events */
                  <RegistrationForm
                    type="Event"
                    relatedId={event.id}
                    title={event.title}
                    showPaymentConfirmation={false}
                  />
                )}
              </>
            ) : (
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Event Has Ended</h3>
                  <p className="text-muted-foreground mb-4">
                    This event has already taken place. Check out our upcoming events.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/events">
                      View Upcoming Events
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
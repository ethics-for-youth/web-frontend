import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Download, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useEvents';
import { Event } from '@/types';
import { formatDateForInput } from '@/utils/dateUtils';

const AdminEvents = () => {
  const navigate = useNavigate();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    maxParticipants: '',
    registrationDeadline: '',
    status: 'active'
  });

  // Use React Query hooks for API calls
  const { data: events = [], isLoading, error } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  useEffect(() => {
    if (!events || !Array.isArray(events)) {
      setFilteredEvents([]);
      return;
    }

    let filtered = [...events];
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (dateFilter) {
      filtered = filtered.filter(event => event.date >= dateFilter);
    }
    setFilteredEvents(filtered);
  }, [events, searchTerm, dateFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent.mutateAsync({
          id: editingEvent.id,
          eventData: {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            location: formData.location,
            category: formData.category,
            maxParticipants: parseInt(formData.maxParticipants) || 0,
            registrationDeadline: formData.registrationDeadline,
            status: formData.status,
          }
        });
      } else {
        await createEvent.mutateAsync({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          location: formData.location,
          category: formData.category,
          maxParticipants: parseInt(formData.maxParticipants) || 0,
          registrationDeadline: formData.registrationDeadline,
          status: formData.status,
        });
      }
      resetForm();
    } catch (error) {
      console.error('Event submission error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      category: '',
      maxParticipants: '',
      registrationDeadline: '',
      status: 'active'
    });
    setEditingEvent(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    const newFormData = {
      title: event.title || '',
      description: event.description || '',
      date: formatDateForInput(event.date),
      location: event.location || '',
      category: event.category || '',
      maxParticipants: event.maxParticipants?.toString() || '',
      registrationDeadline: formatDateForInput(event.registrationDeadline),
      status: event.status || 'active'
    };
    setFormData(newFormData);
    setIsDialogOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent.mutateAsync(eventId);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleEventClick = (event: Event) => {
    navigate('/admin/registrations', {
      state: {
        itemType: 'event',
        title: event.title,
      },
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Title', 'Date', 'Location', 'Category', 'Max Participants', 'Status', 'Description'],
      ...filteredEvents.map(event => [
        event.title,
        new Date(event.date).toLocaleDateString(),
        event.location,
        event.category,
        event.maxParticipants.toString(),
        event.status,
        event.description.replace(/,/g, ';')
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isUpcoming = (date: string) => new Date(date) > new Date();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
            <p className="text-muted-foreground">Manage all community events</p>
          </div>
        </div>
        <Card className="p-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
            <p className="text-muted-foreground">Manage all community events</p>
          </div>
        </div>
        <Card className="p-8 border-destructive">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="w-6 h-6" />
            <p>Failed to load events. Please try again later.</p>
          </div>
        </Card>
      </div>
    );
  }

  const isSubmitting = createEvent.isPending || updateEvent.isPending;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground">Manage all community events</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                <DialogDescription>
                  {editingEvent ? 'Update the event details below.' : 'Fill in the details for the new event.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="religious">Religious</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date & Time *</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                    <Input
                      id="registrationDeadline"
                      type="datetime-local"
                      value={formData.registrationDeadline}
                      onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants *</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-primary hover:opacity-90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingEvent ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingEvent ? 'Update Event' : 'Create Event'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Input
                type="date"
                placeholder="Filter by date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setDateFilter('');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="shadow-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleEventClick(event)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-foreground">{event.title}</CardTitle>
                    <Badge variant={isUpcoming(event.date) ? "default" : "secondary"}>
                      {isUpcoming(event.date) ? 'Upcoming' : 'Past'}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <span><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</span>
                      <span><strong>Category:</strong> {event.category}</span>
                      <span><strong>Max Participants:</strong> {event.maxParticipants}</span>
                    </div>
                    <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <span><strong>Location:</strong> {event.location}</span>
                      <span><strong>Status:</strong> <Badge variant="outline">{event.status}</Badge></span>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(event);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(event.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-muted-foreground">No events found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminEvents;
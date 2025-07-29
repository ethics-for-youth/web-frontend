import { useState, useEffect } from 'react';
import { Eye, Download, Search, Filter, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Registration } from '@/types';
import { mockEvents, mockCourses } from '@/data/mockData';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [communityFilter, setCommunityFilter] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  // Mock registrations data
  useEffect(() => {
    const mockRegistrations: Registration[] = [
      {
        id: '1',
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        whatsappNumber: '+1234567890',
        gender: 'Male',
        age: 22,
        education: 'Bachelor\'s Degree',
        address: '123 Main St, City, State 12345',
        joinCommunity: true,
        type: 'Event',
        relatedEventId: '1',
        createdAt: '2024-07-12T10:30:00Z'
      },
      {
        id: '2',
        name: 'Fatima Al-Zahra',
        email: 'fatima@example.com',
        whatsappNumber: '+1234567891',
        gender: 'Female',
        age: 25,
        education: 'Master\'s Degree',
        address: '456 Oak Ave, City, State 12345',
        joinCommunity: true,
        type: 'Course',
        relatedCourseId: '1',
        createdAt: '2024-07-12T09:15:00Z'
      },
      {
        id: '3',
        name: 'Omar Ibrahim',
        email: 'omar@example.com',
        whatsappNumber: '+1234567892',
        gender: 'Male',
        age: 19,
        education: 'High School',
        address: '789 Pine St, City, State 12345',
        joinCommunity: false,
        type: 'Volunteer',
        createdAt: '2024-07-11T16:45:00Z'
      },
      {
        id: '4',
        name: 'Aisha Khan',
        email: 'aisha@example.com',
        whatsappNumber: '+1234567893',
        gender: 'Female',
        age: 24,
        education: 'Bachelor\'s Degree',
        address: '321 Elm St, City, State 12345',
        joinCommunity: true,
        type: 'Event',
        relatedEventId: '2',
        createdAt: '2024-07-11T14:20:00Z'
      },
      {
        id: '5',
        name: 'Yusuf Ali',
        email: 'yusuf@example.com',
        whatsappNumber: '+1234567894',
        gender: 'Male',
        age: 28,
        education: 'Master\'s Degree',
        address: '654 Cedar Ave, City, State 12345',
        joinCommunity: true,
        type: 'Course',
        relatedCourseId: '2',
        createdAt: '2024-07-10T11:30:00Z'
      },
      {
        id: '6',
        name: 'Maryam Hassan',
        email: 'maryam@example.com',
        whatsappNumber: '+1234567895',
        gender: 'Female',
        age: 21,
        education: 'Bachelor\'s Degree',
        address: '987 Maple Dr, City, State 12345',
        joinCommunity: true,
        type: 'Volunteer',
        createdAt: '2024-07-09T13:10:00Z'
      }
    ];
    
    // Add reviewed status to some registrations
    const registrationsWithReview = mockRegistrations.map((reg, index) => ({
      ...reg,
      reviewed: index % 2 === 0 // Every other registration is reviewed
    }));
    
    setRegistrations(registrationsWithReview);
    setFilteredRegistrations(registrationsWithReview);
  }, []);

  useEffect(() => {
    let filtered = registrations;

    if (searchTerm) {
      filtered = filtered.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(reg => reg.type === typeFilter);
    }

    if (genderFilter && genderFilter !== 'all') {
      filtered = filtered.filter(reg => reg.gender === genderFilter);
    }

    if (communityFilter && communityFilter !== 'all') {
      filtered = filtered.filter(reg => 
        communityFilter === 'yes' ? reg.joinCommunity : !reg.joinCommunity
      );
    }

    setFilteredRegistrations(filtered);
  }, [registrations, searchTerm, typeFilter, genderFilter, communityFilter]);

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

  const toggleReviewed = (registrationId: string) => {
    const updatedRegistrations = registrations.map(reg =>
      reg.id === registrationId
        ? { ...reg, reviewed: !reg.reviewed }
        : reg
    );
    setRegistrations(updatedRegistrations);
    
    const registration = registrations.find(r => r.id === registrationId);
    toast({
      title: registration?.reviewed ? "Marked as Unreviewed" : "Marked as Reviewed",
      description: `Registration has been ${registration?.reviewed ? 'marked as unreviewed' : 'marked as reviewed'}.`,
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'WhatsApp', 'Gender', 'Age', 'Education', 'Address', 'Type', 'Related', 'Join Community', 'Reviewed', 'Submission Date'],
      ...filteredRegistrations.map(reg => [
        reg.name,
        reg.email,
        reg.whatsappNumber,
        reg.gender,
        reg.age.toString(),
        reg.education,
        reg.address.replace(/,/g, ';'),
        reg.type,
        getRelatedName(reg).replace(/,/g, ';'),
        reg.joinCommunity ? 'Yes' : 'No',
        reg.reviewed ? 'Yes' : 'No',
        new Date(reg.createdAt).toLocaleDateString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Completed",
      description: "Registrations have been exported to CSV successfully.",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Registration Management</h1>
          <p className="text-muted-foreground">Manage all user registrations</p>
        </div>
        
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Event">Events</SelectItem>
                <SelectItem value="Course">Courses</SelectItem>
                <SelectItem value="Volunteer">Volunteers</SelectItem>
              </SelectContent>
            </Select>

            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Select value={communityFilter} onValueChange={setCommunityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Join community" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Wants to Join</SelectItem>
                <SelectItem value="no">Doesn't Want to Join</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setGenderFilter('all');
                setCommunityFilter('all');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registrations List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRegistrations.map((registration) => (
          <Card key={registration.id} className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-foreground">{registration.name}</CardTitle>
                    <Badge className={getTypeColor(registration.type)}>
                      {registration.type}
                    </Badge>
                    {registration.joinCommunity && (
                      <Badge variant="outline">Wants Community</Badge>
                    )}
                    {registration.reviewed && (
                      <Badge variant="default">Reviewed</Badge>
                    )}
                  </div>
                  <CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <span><strong>Email:</strong> {registration.email}</span>
                      <span><strong>Age:</strong> {registration.age} ({registration.gender})</span>
                      <span><strong>Education:</strong> {registration.education}</span>
                    </div>
                    <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <span><strong>Related:</strong> {getRelatedName(registration)}</span>
                      <span><strong>Submitted:</strong> {new Date(registration.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleReviewed(registration.id)}
                    title={registration.reviewed ? 'Mark as unreviewed' : 'Mark as reviewed'}
                  >
                    {registration.reviewed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedRegistration(registration)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Registration Details</DialogTitle>
                        <DialogDescription>
                          Complete information for {registration.name}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedRegistration && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-foreground">Personal Information</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Name:</strong> {selectedRegistration.name}</p>
                                <p><strong>Email:</strong> {selectedRegistration.email}</p>
                                <p><strong>WhatsApp:</strong> {selectedRegistration.whatsappNumber}</p>
                                <p><strong>Gender:</strong> {selectedRegistration.gender}</p>
                                <p><strong>Age:</strong> {selectedRegistration.age}</p>
                                <p><strong>Education:</strong> {selectedRegistration.education}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-foreground">Registration Details</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Type:</strong> {selectedRegistration.type}</p>
                                <p><strong>Related:</strong> {getRelatedName(selectedRegistration)}</p>
                                <p><strong>Join Community:</strong> {selectedRegistration.joinCommunity ? 'Yes' : 'No'}</p>
                                <p><strong>Reviewed:</strong> {selectedRegistration.reviewed ? 'Yes' : 'No'}</p>
                                <p><strong>Submitted:</strong> {new Date(selectedRegistration.createdAt).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-foreground">Address</h4>
                            <p className="text-sm text-muted-foreground">{selectedRegistration.address}</p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {filteredRegistrations.length === 0 && (
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-muted-foreground">No registrations found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminRegistrations;
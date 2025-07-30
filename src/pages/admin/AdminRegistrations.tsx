import { useState, useEffect } from 'react';
import { Eye, Download, Search, Filter, CheckCircle, Circle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRegistrations, useUpdateRegistration } from '@/hooks/useRegistrations';
import { Registration } from '@/services';
import { formatDateForDisplay } from '@/utils/dateUtils';

const AdminRegistrations = () => {
  const { data: registrations = [], isLoading, error } = useRegistrations();
  const updateRegistration = useUpdateRegistration();
  
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    if (!registrations || !Array.isArray(registrations)) {
      setFilteredRegistrations([]);
      return;
    }

    let filtered = [...registrations]; // Create a new array to avoid mutations

    if (searchTerm) {
      filtered = filtered.filter(reg =>
        reg.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reg.notes && reg.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(reg => reg.itemType === typeFilter);
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }

    setFilteredRegistrations(filtered);
  }, [registrations, searchTerm, typeFilter, statusFilter]);

  const getTypeColor = (itemType: string) => {
    switch (itemType) {
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'course': return 'bg-green-100 text-green-800';
      case 'competition': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleRegistrationStatus = async (registrationId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'registered' ? 'completed' : 'registered';
      await updateRegistration.mutateAsync({ 
        id: registrationId, 
        updateData: { status: newStatus } 
      });
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to update registration status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading registrations...</p>
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
            <p className="text-destructive mb-4">Failed to load registrations</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  const exportToCSV = () => {
    const csvContent = [
      ['User Name', 'Email', 'Phone', 'User ID', 'Item Type', 'Item ID', 'Status', 'Registration Date', 'Last Updated', 'Notes'],
      ...filteredRegistrations.map(reg => [
        reg.userName,
        reg.userEmail,
        reg.userPhone || '',
        reg.userId,
        reg.itemType,
        reg.itemId,
        reg.status,
        formatDateForDisplay(reg.registeredAt),
        formatDateForDisplay(reg.updatedAt),
        reg.notes ? reg.notes.replace(/,/g, ';') : ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
                <SelectItem value="competition">Competitions</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setStatusFilter('all');
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
                    <CardTitle className="text-foreground">{registration.userName}</CardTitle>
                    <Badge className={getTypeColor(registration.itemType)}>
                      {registration.itemType.charAt(0).toUpperCase() + registration.itemType.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(registration.status)}>
                      {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <span><strong>Email:</strong> {registration.userEmail}</span>
                      {registration.userPhone && (
                        <span><strong>Phone:</strong> {registration.userPhone}</span>
                      )}
                    </div>
                    <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <span><strong>Item ID:</strong> {registration.itemId}</span>
                      <span><strong>Submitted:</strong> {formatDateForDisplay(registration.registeredAt)}</span>
                    </div>
                    {registration.notes && (
                      <div className="mt-2 text-sm">
                        <strong>Notes:</strong> <span className="text-muted-foreground">{registration.notes}</span>
                      </div>
                    )}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleRegistrationStatus(registration.id, registration.status)}
                    title={registration.status === 'registered' ? 'Mark as completed' : 'Mark as registered'}
                    disabled={updateRegistration.isPending}
                  >
                    {registration.status === 'completed' ? (
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
                          Complete information for {registration.userName}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedRegistration && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-foreground">Contact Information</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Name:</strong> {selectedRegistration.userName}</p>
                                <p><strong>Email:</strong> {selectedRegistration.userEmail}</p>
                                {selectedRegistration.userPhone && (
                                  <p><strong>Phone:</strong> {selectedRegistration.userPhone}</p>
                                )}
                                <p><strong>User ID:</strong> {selectedRegistration.userId}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-foreground">Registration Details</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Type:</strong> {selectedRegistration.itemType.charAt(0).toUpperCase() + selectedRegistration.itemType.slice(1)}</p>
                                <p><strong>Item ID:</strong> {selectedRegistration.itemId}</p>
                                <p><strong>Status:</strong> {selectedRegistration.status.charAt(0).toUpperCase() + selectedRegistration.status.slice(1)}</p>
                                <p><strong>Registered:</strong> {formatDateForDisplay(selectedRegistration.registeredAt)}</p>
                                <p><strong>Last Updated:</strong> {formatDateForDisplay(selectedRegistration.updatedAt)}</p>
                              </div>
                            </div>
                          </div>
                          
                          {selectedRegistration.notes && (
                            <div>
                              <h4 className="font-semibold text-foreground">Notes</h4>
                              <p className="text-sm text-muted-foreground">{selectedRegistration.notes}</p>
                            </div>
                          )}
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
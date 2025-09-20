import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom'; // Add useLocation
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
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'event' | 'course' | 'competition'>('all');
  const [titleFilter, setTitleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'registered' | 'completed' | 'cancelled'>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'none'>('none');
  useEffect(() => {
    if (location.state) {
      const { itemType, title } = location.state;
      if (itemType && ['event', 'course', 'competition'].includes(itemType)) {
        setTypeFilter(itemType);
      }
      if (title) {
        setTitleFilter(title);
      }
    }
  }, [location.state]);

  // Backend filters
  const filters: { itemType?: 'event' | 'course' | 'competition'; title?: string; status?: 'registered' | 'completed' | 'cancelled' } = {};
  if (typeFilter !== 'all') filters.itemType = typeFilter as 'event' | 'course' | 'competition';
  if (titleFilter !== 'all') filters.title = titleFilter;
  if (statusFilter !== 'all') filters.status = statusFilter as 'registered' | 'completed' | 'cancelled';

  const { data, isLoading, error, refetch } = useRegistrations(filters);
  const registrations = useMemo(() => data?.registrations || [], [data?.registrations]);
  const availableTitles = useMemo(() => data?.availableTitles || [], [data?.availableTitles]);

  const updateRegistration = useUpdateRegistration();
  // Refetch whenever backend filters change
  useEffect(() => {
    refetch();
  }, [typeFilter, titleFilter, statusFilter, refetch]);

  // Filter registrations on frontend using searchTerm and status
  // Step 1: filter based on searchTerm and status
  const filtered = useMemo(() => {
    return registrations.filter(reg =>
      (searchTerm
        ? reg.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
        : true
      )
      && (statusFilter === 'all' ? true : reg.status === statusFilter)
    );
  }, [registrations, searchTerm, statusFilter]);

  // Step 2: sort separately
  const filteredRegistrations = useMemo(() => {
    const result = [...filtered];

    if (sortBy === 'name') {
      result.sort((a, b) => a.userName.localeCompare(b.userName));
    } else if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
    }

    return result;
  }, [filtered, sortBy]);

  // Compute stats based on filteredRegistrations
  const stats = useMemo(() => {
    const byType: Record<string, number> = {};
    const byItem: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    filtered.forEach(reg => {
      byType[reg.itemType] = (byType[reg.itemType] || 0) + 1;
      byItem[reg.itemTitle] = (byItem[reg.itemTitle] || 0) + 1;
      byStatus[reg.status] = (byStatus[reg.status] || 0) + 1;
    });

    return { byType, byItem, byStatus };
  }, [filtered]);



  console.log("ff", filteredRegistrations)

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
      case 'pending': return 'bg-gray-100 text-gray-800';          // Order/payment created
      case 'authorized': return 'bg-purple-100 text-purple-800';  // Payment authorized
      case 'captured': return 'bg-green-100 text-green-800';      // Payment success
      case 'failed': return 'bg-red-100 text-red-800';            // Payment failed
      case 'refunded': return 'bg-blue-100 text-blue-800';        // Full refund
      case 'paid': return 'bg-green-200 text-green-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';          // Order/payment created
      case 'authorized': return 'bg-purple-100 text-purple-800';  // Payment authorized
      case 'captured': return 'bg-green-100 text-green-800';      // Payment success
      case 'failed': return 'bg-red-100 text-red-800';            // Payment failed
      case 'refunded': return 'bg-blue-100 text-blue-800';        // Full refund
      case 'paid': return 'bg-green-200 text-green-900';          // Order paid 
      default: return 'bg-gray-200 text-gray-900';               // Fallback
    }
  };



  const toggleRegistrationStatus = async (registrationId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'registered' ? 'completed' : 'registered';
      await updateRegistration.mutateAsync({ id: registrationId, updateData: { status: newStatus } });
    } catch (error) {
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
        reg.notes
          ? typeof reg.notes === "object"
            ? `${reg.notes.purpose || ""} - ${reg.notes.extra_info || ""}`
            : reg.notes.replace(/,/g, ';')
          : ''

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
          <Download className="h-4 w-4 mr-2" /> Export CSV
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
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={(value: string) => setTypeFilter(value as 'all' | 'event' | 'course' | 'competition')}>
              <SelectTrigger><SelectValue placeholder="Filter by type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
                <SelectItem value="competition">Competitions</SelectItem>
              </SelectContent>
            </Select>

            <Select value={titleFilter} onValueChange={setTitleFilter} disabled={typeFilter === 'all'}>
              <SelectTrigger><SelectValue placeholder="Filter by title" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Titles</SelectItem>
                {availableTitles.map(title => (
                  <SelectItem key={title.id} value={title.title}>{title.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as 'all' | 'registered' | 'completed' | 'cancelled')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="authorized">Sent but not received</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4">
            <Button variant="outline" onClick={() => { setSearchTerm(''); setTypeFilter('all'); setTitleFilter('all'); setStatusFilter('all'); }}>
              <Filter className="h-4 w-4 mr-2" /> Clear Filters
            </Button>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              onClick={() => setSortBy('name')}
            >
              Sort by Name
            </Button>
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              onClick={() => setSortBy('date')}
            >
              Sort by Date
            </Button>
            <Button
              variant="outline"
              onClick={() => setSortBy('none')}
            >
              Reset Sort
            </Button>
          </div>

        </CardContent>
      </Card>

      <Card className="mb-6 p-4">
        <CardHeader>
          <CardTitle>Registrations Stats</CardTitle>
          <CardDescription>Total Registrations: {filteredRegistrations.length}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* By Type always visible */}
          <div>
            <h4 className="font-semibold">By Type</h4>
            <ul className="text-sm mt-1 space-y-1">
              {Object.entries(stats.byType).map(([type, count]) => (
                <li key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}: {count}</li>
              ))}
            </ul>
          </div>

          {/* By Item only if a title is selected */}
          {titleFilter !== 'all' && Object.keys(stats.byItem).length > 0 && (
            <div>
              <h4 className="font-semibold">By Item</h4>
              <ul className="text-sm mt-1 space-y-1 max-h-40 overflow-y-auto">
                {Object.entries(stats.byItem).map(([title, count]) => (
                  <li key={title}>{title}: {count}</li>
                ))}
              </ul>
            </div>
          )}

          {/* By Status only if a status filter is applied */}
          {statusFilter !== 'all' && Object.keys(stats.byStatus).length > 0 && (
            <div>
              <h4 className="font-semibold">By Status</h4>
              <ul className="text-sm mt-1 space-y-1">
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <li key={status}>{status.charAt(0).toUpperCase() + status.slice(1)}: {count}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>



      {/* Registrations List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRegistrations.map(registration => (
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
                      {registration.userPhone && <span><strong>Phone:</strong> {registration.userPhone}</span>}
                    </div>
                    <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <span><strong>Item ID:</strong> {registration.itemId}</span>
                      <span><strong>Item Title:</strong> {registration.itemTitle}</span>
                      <span><strong>Submitted:</strong> {formatDateForDisplay(registration.registeredAt)}</span>
                      <span><strong>Payment Status:</strong>  <Badge className={getPaymentStatusColor(registration?.paymentStatus)}>
                        {registration?.paymentStatus}
                      </Badge></span>
                    </div>
                    {registration.notes && (
                      <div className="mt-2 text-sm">
                        <strong>Notes:</strong>{" "}
                        <span className="text-muted-foreground">
                          {typeof registration.notes === "object"
                            ? `${registration.notes.purpose || ""} ${registration.notes.extra_info ? `- ${registration.notes.extra_info}` : ""}`
                            : registration.notes}
                        </span>
                      </div>
                    )}

                  </CardDescription>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => toggleRegistrationStatus(registration.id, registration.status)}>
                    {registration.status === 'completed' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Circle className="h-4 w-4 text-gray-400" />}
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setSelectedRegistration(registration)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Registration Details</DialogTitle>
                        <DialogDescription>Complete information for {registration.userName}</DialogDescription>
                      </DialogHeader>

                      {selectedRegistration && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-foreground">Contact Information</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Name:</strong> {selectedRegistration.userName}</p>
                                <p><strong>Email:</strong> {selectedRegistration.userEmail}</p>
                                {selectedRegistration.userPhone && <p><strong>Phone:</strong> {selectedRegistration.userPhone}</p>}
                                <p><strong>User ID:</strong> {selectedRegistration.userId}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-foreground">Registration Details</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Type:</strong> {selectedRegistration.itemType.charAt(0).toUpperCase() + selectedRegistration.itemType.slice(1)}</p>
                                <p><strong>Item ID:</strong> {selectedRegistration.itemId}</p>
                                <p><strong>Item Title:</strong> {selectedRegistration.itemTitle}</p>
                                <p><strong>Status:</strong> {selectedRegistration.status.charAt(0).toUpperCase() + selectedRegistration.status.slice(1)}</p>
                                <p><strong>Payment Status:</strong> {selectedRegistration?.paymentStatus}</p>
                                <p><strong>Registered:</strong> {formatDateForDisplay(selectedRegistration.registeredAt)}</p>
                                <p><strong>Last Updated:</strong> {formatDateForDisplay(selectedRegistration.updatedAt)}</p>
                              </div>
                            </div>
                          </div>

                          {selectedRegistration.notes && (
                            <div>
                              <h4 className="font-semibold text-foreground">Notes</h4>
                              <p className="text-sm text-muted-foreground">{selectedRegistration?.notes}</p>
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
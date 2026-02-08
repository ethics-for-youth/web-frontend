import { useState, useMemo } from 'react';
import {
  Eye,
  Download,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Users,
  Phone,
  Mail,
  Calendar,
  Tag,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useVolunteers, useUpdateVolunteer } from '@/hooks/useVolunteers';
import { useAuth } from '@/contexts/AuthContext';
import { Volunteer } from '@/types';
import { formatDateTimeForDisplay } from '@/utils/dateUtils';

const AdminVolunteers = () => {
  const { admin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'active' | 'inactive'>('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [updateStatusValue, setUpdateStatusValue] = useState<string>('');

  const { data, isLoading, error } = useVolunteers();
  const updateVolunteer = useUpdateVolunteer();

  const volunteers = useMemo(() => data?.volunteers || [], [data?.volunteers]);
  const statusBreakdown = useMemo(() => data?.statusBreakdown || {}, [data?.statusBreakdown]);

  const filteredVolunteers = useMemo(() => {
    return volunteers
      .filter(
        (v) =>
          !searchTerm ||
          v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (v.email && v.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter((v) => (statusFilter === 'all' ? true : v.status === statusFilter))
      .sort((a, b) => new Date(b.appliedAt || b.updatedAt).getTime() - new Date(a.appliedAt || a.updatedAt).getTime());
  }, [volunteers, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (volunteerId: string, newStatus: string) => {
    try {
      await updateVolunteer.mutateAsync({
        id: volunteerId,
        updateData: {
          status: newStatus as 'pending' | 'approved' | 'active' | 'inactive',
          approvedBy: newStatus === 'approved' || newStatus === 'active' ? admin?.email : undefined,
        },
      });
      setUpdateStatusValue('');
      setSelectedVolunteer(null);
    } catch (err) {
      console.error('Failed to update volunteer status:', err);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        'Name',
        'Email',
        'Phone',
        'Status',
        'Skills',
        'Availability',
        'Experience',
        'Motivation',
        'Preferred Roles',
        'Assigned Role',
        'Team',
        'Applied Date',
        'Approved Date',
        'Last Updated',
      ],
      ...filteredVolunteers.map((v) => [
        v.name || '',
        v.email || '',
        v.phone || '',
        v.status || '',
        Array.isArray(v.skills) ? v.skills.join('; ') : '',
        v.availability || '',
        (v.experience || '').replace(/,/g, ';').replace(/"/g, '""'),
        (v.motivation || '').replace(/,/g, ';').replace(/"/g, '""'),
        Array.isArray(v.preferredRoles) ? v.preferredRoles.join('; ') : '',
        v.assignedRole || '',
        v.team || '',
        formatDateTimeForDisplay(v.appliedAt),
        v.approvedAt ? formatDateTimeForDisplay(v.approvedAt) : '',
        formatDateTimeForDisplay(v.updatedAt),
      ]),
    ]
      .map((row) => row.map((field) => `"${String(field)}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volunteers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading volunteers...</p>
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
            <p className="text-destructive mb-4">Failed to load volunteers</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Volunteer Management</h1>
          <p className="text-muted-foreground">View and manage volunteer applications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">{filteredVolunteers.length}</span>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Status Breakdown */}
      {Object.keys(statusBreakdown).length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              {(['pending', 'approved', 'active', 'inactive'] as const).map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <Badge className={getStatusColor(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                  <span className="font-medium">{statusBreakdown[status] ?? 0}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search by name or email</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search volunteers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredVolunteers.map((volunteer) => (
          <Card key={volunteer.id} className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-foreground">{volunteer.name}</CardTitle>
                    <Badge className={getStatusColor(volunteer.status)}>
                      {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <span>
                        <strong>Email:</strong> {volunteer.email}
                      </span>
                      {volunteer.phone && (
                        <span>
                          <strong>Phone:</strong> {volunteer.phone}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <span>
                        <strong>Availability:</strong> {volunteer.availability || '—'}
                      </span>
                      <span>
                        <strong>Applied:</strong> {formatDateTimeForDisplay(volunteer.appliedAt)}
                      </span>
                      {volunteer.assignedRole && (
                        <span>
                          <strong>Role:</strong> {volunteer.assignedRole}
                        </span>
                      )}
                      {volunteer.team && (
                        <span>
                          <strong>Team:</strong> {volunteer.team}
                        </span>
                      )}
                    </div>
                    {Array.isArray(volunteer.skills) && volunteer.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {volunteer.skills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardDescription>
                </div>

                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedVolunteer(volunteer);
                          setUpdateStatusValue('');
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <UserCheck className="h-5 w-5" />
                          <span>Volunteer Details</span>
                        </DialogTitle>
                        <DialogDescription>
                          Complete information for {selectedVolunteer?.name}
                        </DialogDescription>
                      </DialogHeader>

                      {selectedVolunteer && (
                        <div className="space-y-6">
                          {/* Contact Information */}
                          <div>
                            <h3 className="text-lg font-semibold flex items-center space-x-2 mb-3">
                              <Mail className="h-5 w-5" />
                              <span>Contact Information</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Name</Label>
                                <p className="text-sm text-foreground">{selectedVolunteer.name}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Email</Label>
                                <p className="text-sm text-foreground">{selectedVolunteer.email}</p>
                              </div>
                              {selectedVolunteer.phone && (
                                <div>
                                  <Label className="text-sm font-medium">Phone</Label>
                                  <p className="text-sm text-foreground flex items-center space-x-1">
                                    <Phone className="h-4 w-4" />
                                    {selectedVolunteer.phone}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Application Details */}
                          <div>
                            <h3 className="text-lg font-semibold flex items-center space-x-2 mb-3">
                              <Tag className="h-5 w-5" />
                              <span>Application Details</span>
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <Label className="text-sm font-medium">Skills</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {Array.isArray(selectedVolunteer.skills) ? (
                                    selectedVolunteer.skills.map((s, i) => (
                                      <Badge key={i} variant="outline">
                                        {s}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-sm text-muted-foreground">—</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Availability</Label>
                                <p className="text-sm text-foreground">
                                  {selectedVolunteer.availability || '—'}
                                </p>
                              </div>
                              {selectedVolunteer.experience && (
                                <div>
                                  <Label className="text-sm font-medium">Experience</Label>
                                  <p className="text-sm text-foreground">
                                    {selectedVolunteer.experience}
                                  </p>
                                </div>
                              )}
                              {selectedVolunteer.motivation && (
                                <div>
                                  <Label className="text-sm font-medium">Motivation</Label>
                                  <p className="text-sm text-foreground">
                                    {selectedVolunteer.motivation}
                                  </p>
                                </div>
                              )}
                              {Array.isArray(selectedVolunteer.preferredRoles) &&
                                selectedVolunteer.preferredRoles.length > 0 && (
                                  <div>
                                    <Label className="text-sm font-medium">Preferred Roles</Label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {selectedVolunteer.preferredRoles.map((r, i) => (
                                        <Badge key={i} variant="secondary">
                                          {r}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>

                          <Separator />

                          {/* Assignment & Status */}
                          <div>
                            <h3 className="text-lg font-semibold flex items-center space-x-2 mb-3">
                              <UserCheck className="h-5 w-5" />
                              <span>Assignment & Status</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label className="text-sm font-medium">Current Status</Label>
                                <div className="mt-1">
                                  <Badge className={getStatusColor(selectedVolunteer.status)}>
                                    {selectedVolunteer.status.charAt(0).toUpperCase() +
                                      selectedVolunteer.status.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                              {selectedVolunteer.assignedRole && (
                                <div>
                                  <Label className="text-sm font-medium">Assigned Role</Label>
                                  <p className="text-sm text-foreground">
                                    {selectedVolunteer.assignedRole}
                                  </p>
                                </div>
                              )}
                              {selectedVolunteer.team && (
                                <div>
                                  <Label className="text-sm font-medium">Team</Label>
                                  <p className="text-sm text-foreground">{selectedVolunteer.team}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2 items-center">
                              <Label className="text-sm font-medium">Update Status:</Label>
                              <Select
                                value={updateStatusValue}
                                onValueChange={setUpdateStatusValue}
                              >
                                <SelectTrigger className="w-auto min-w-[140px]">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                disabled={
                                  !updateStatusValue ||
                                  updateStatusValue === selectedVolunteer.status ||
                                  updateVolunteer.isPending
                                }
                                onClick={() =>
                                  handleStatusUpdate(selectedVolunteer.id, updateStatusValue)
                                }
                              >
                                {updateVolunteer.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Apply'
                                )}
                              </Button>
                            </div>
                          </div>

                          <Separator />

                          {/* Timeline */}
                          <div>
                            <h3 className="text-lg font-semibold flex items-center space-x-2 mb-3">
                              <Calendar className="h-5 w-5" />
                              <span>Timeline</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Applied At</Label>
                                <p className="text-sm text-foreground">
                                  {formatDateTimeForDisplay(selectedVolunteer.appliedAt)}
                                </p>
                              </div>
                              {selectedVolunteer.approvedAt && (
                                <div>
                                  <Label className="text-sm font-medium">Approved At</Label>
                                  <p className="text-sm text-foreground">
                                    {formatDateTimeForDisplay(selectedVolunteer.approvedAt)}
                                  </p>
                                </div>
                              )}
                              <div>
                                <Label className="text-sm font-medium">Last Updated</Label>
                                <p className="text-sm text-foreground">
                                  {formatDateTimeForDisplay(selectedVolunteer.updatedAt)}
                                </p>
                              </div>
                            </div>
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

      {filteredVolunteers.length === 0 && (
        <Card className="text-center p-8">
          <CardContent>
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-lg font-medium text-foreground">No volunteers found</p>
            <p className="text-muted-foreground">
              Try adjusting your filters or search criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminVolunteers;

import { useState, useMemo } from 'react';
import { Eye, Search, Filter, ChevronDown, MessageSquare, Phone, Mail, Calendar, Tag, Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useMessages } from '@/hooks/useMessages';
import { Message, MessageFilters } from '@/services';
import { formatDateTimeForDisplay } from '@/utils/dateUtils';

const AdminMessages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Build filters based on current state
  const filters: MessageFilters = useMemo(() => {
    const f: MessageFilters = { admin: true };
    if (selectedCategory && selectedCategory !== 'all') f.messageType = selectedCategory as 'feedback' | 'complaint' | 'thank-you' | 'suggestion' | 'general';
    if (selectedStatus && selectedStatus !== 'all') f.status = selectedStatus as 'new' | 'read' | 'responded' | 'archived';
    if (selectedPriority && selectedPriority !== 'all') f.priority = selectedPriority as 'low' | 'normal' | 'high' | 'urgent';
    return f;
  }, [selectedCategory, selectedStatus, selectedPriority]);

  const { data: messages = [], isLoading, error } = useMessages(filters);

  // Filter messages based on search query and public filter
  const filteredMessages = useMemo(() => {
    let filtered = messages;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (message) =>
          message.senderName.toLowerCase().includes(query) ||
          message.senderEmail.toLowerCase().includes(query) ||
          message.content.toLowerCase().includes(query)
      );
    }

    // Public messages filter
    if (showPublicOnly) {
      filtered = filtered.filter((message) => message.isPublic);
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messages, searchQuery, showPublicOnly]);

  // Helper functions
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: 'default' as const, label: 'New' },
      read: { variant: 'secondary' as const, label: 'Read' },
      responded: { variant: 'default' as const, label: 'Responded' },
      archived: { variant: 'outline' as const, label: 'Archived' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { variant: 'outline' as const, label: 'Low' },
      normal: { variant: 'secondary' as const, label: 'Normal' },
      high: { variant: 'default' as const, label: 'High' },
      urgent: { variant: 'destructive' as const, label: 'Urgent' },
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels = {
      feedback: 'Feedback',
      complaint: 'Complaint',
      'thank-you': 'Testimonial',
      suggestion: 'Suggestion',
      general: 'General'
    };
    return categoryLabels[category as keyof typeof categoryLabels] || category;
  };

  const truncateMessage = (message: string, maxLength: number = 100) => {
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Sender Name', 'Email', 'Phone', 'Category', 'Priority', 'Status', 'Public', 'Content', 'Submitted At', 'Last Updated'],
      ...filteredMessages.map(message => [
        message.senderName,
        message.senderEmail,
        message.senderPhone || '',
        getCategoryLabel(message.messageType),
        message.priority,
        message.status,
        message.isPublic ? 'Yes' : 'No',
        message.content.replace(/,/g, ';').replace(/"/g, '""'), // Escape CSV special characters
        formatDateTimeForDisplay(message.createdAt),
        formatDateTimeForDisplay(message.updatedAt)
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading messages: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Manage and respond to user messages and inquiries
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">{filteredMessages.length}</span>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search by Name or Email</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="thank-you">Testimonial</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filter Options</Label>
              <div className="flex items-center space-x-2 h-10">
                <Checkbox
                  id="publicOnly"
                  checked={showPublicOnly}
                  onCheckedChange={(checked) => setShowPublicOnly(!!checked)}
                />
                <Label htmlFor="publicOnly" className="text-sm">
                  Public Messages Only
                </Label>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSelectedPriority('all');
                setShowPublicOnly(false);
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card className="text-center p-8">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-lg font-medium text-foreground">No messages found</p>
          <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className="shadow-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-foreground">{message.senderName}</CardTitle>
                      {getStatusBadge(message.status)}
                      {getPriorityBadge(message.priority)}
                      {message.isPublic && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Public
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <span><strong>Email:</strong> {message.senderEmail}</span>
                        {message.senderPhone && (
                          <span><strong>Phone:</strong> {message.senderPhone}</span>
                        )}
                      </div>
                      <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <span><strong>Category:</strong> {getCategoryLabel(message.messageType)}</span>
                        <span><strong>Submitted:</strong> {formatDateTimeForDisplay(message.createdAt)}</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <strong>Message:</strong> <span className="text-muted-foreground">{truncateMessage(message.content)}</span>
                      </div>
                    </CardDescription>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5" />
                            <span>Message Details</span>
                          </DialogTitle>
                          <DialogDescription>
                            Complete information for {message.senderName}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedMessage && (
                          <div className="space-y-6">
                            {/* Sender Information */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center space-x-2">
                                <Mail className="h-5 w-5" />
                                <span>Sender Information</span>
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Full Name</Label>
                                  <p className="text-sm text-foreground">{selectedMessage.senderName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Email</Label>
                                  <p className="text-sm text-foreground">{selectedMessage.senderEmail}</p>
                                </div>
                                {selectedMessage.senderPhone && (
                                  <div>
                                    <Label className="text-sm font-medium">Phone</Label>
                                    <p className="text-sm text-foreground flex items-center space-x-1">
                                      <Phone className="h-4 w-4" />
                                      <span>{selectedMessage.senderPhone}</span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <Separator />

                            {/* Message Details */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5" />
                                <span>Message Details</span>
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Category</Label>
                                  <p className="text-sm text-foreground">{getCategoryLabel(selectedMessage.messageType)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Priority</Label>
                                  <div className="mt-1">{getPriorityBadge(selectedMessage.priority)}</div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Status</Label>
                                  <div className="mt-1">{getStatusBadge(selectedMessage.status)}</div>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Public Message</Label>
                                <p className="text-sm text-foreground">
                                  {selectedMessage.isPublic ? 'Yes - Can be published as testimonial' : 'No - Private message'}
                                </p>
                              </div>
                            </div>

                            <Separator />

                            {/* Message Content */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">Message Content</h3>
                              <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm whitespace-pre-wrap">{selectedMessage.content}</p>
                              </div>
                            </div>

                            <Separator />

                            {/* Timestamps */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center space-x-2">
                                <Calendar className="h-5 w-5" />
                                <span>Timeline</span>
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Submitted At</Label>
                                  <p className="text-sm text-foreground">{formatDateTimeForDisplay(selectedMessage.createdAt)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Last Updated</Label>
                                  <p className="text-sm text-foreground">{formatDateTimeForDisplay(selectedMessage.updatedAt)}</p>
                                </div>
                              </div>
                            </div>

                            {/* Tags if available */}
                            {selectedMessage.tags && selectedMessage.tags.length > 0 && (
                              <>
                                <Separator />
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                                    <Tag className="h-5 w-5" />
                                    <span>Tags</span>
                                  </h3>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedMessage.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline">{tag}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </>
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
      )}
    </div>
  );
};

export default AdminMessages;
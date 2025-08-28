import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, ToggleLeft, ToggleRight, Loader2, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '@/services';
import { formatDateForInput } from '@/utils/dateUtils';

const AdminCourses = () => {
  const navigate = useNavigate();
  const { data: courses = [], isLoading, error } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    category: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    maxParticipants: '',
    registrationFee: '',
    startDate: '',
    endDate: '',
    schedule: '',
    materials: ''
  });

  useEffect(() => {
    if (!courses || !Array.isArray(courses)) {
      setFilteredCourses([]);
      return;
    }

    let filtered = [...courses];
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (levelFilter && levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level === levelFilter);
    }
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }
    setFilteredCourses(filtered);
  }, [courses, searchTerm, levelFilter, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const updateData: UpdateCourseRequest = {
          title: formData.title,
          description: formData.description,
          instructor: formData.instructor,
          duration: formData.duration,
          category: formData.category || undefined,
          level: formData.level,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
          registrationFee: formData.registrationFee ? parseFloat(formData.registrationFee) : undefined,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          schedule: formData.schedule || undefined,
          materials: formData.materials || undefined,
        };
        await updateCourse.mutateAsync({ id: editingCourse.id, courseData: updateData });
      } else {
        const courseData: CreateCourseRequest = {
          title: formData.title,
          description: formData.description,
          instructor: formData.instructor,
          duration: formData.duration,
          category: formData.category || undefined,
          level: formData.level,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
          registrationFee: formData.registrationFee ? parseFloat(formData.registrationFee) : undefined,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          schedule: formData.schedule || undefined,
          materials: formData.materials || undefined,
        };
        await createCourse.mutateAsync(courseData);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save course:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      duration: '',
      category: '',
      level: 'beginner',
      maxParticipants: '',
      registrationFee: '',
      startDate: '',
      endDate: '',
      schedule: '',
      materials: ''
    });
    setEditingCourse(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      instructor: course.instructor || '',
      duration: course.duration || '',
      category: course.category || '',
      level: course.level || 'beginner',
      maxParticipants: course.maxParticipants?.toString() || '',
      registrationFee: course.registrationFee?.toString() || '',
      startDate: formatDateForInput(course.startDate) || '',
      endDate: formatDateForInput(course.endDate) || '',
      schedule: course.schedule || '',
      materials: course.materials || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse.mutateAsync(courseId);
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  const toggleActive = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    try {
      const newStatus = course.status === 'active' ? 'inactive' : 'active';
      await updateCourse.mutateAsync({
        id: courseId,
        courseData: { status: newStatus }
      });
    } catch (error) {
      console.error('Failed to toggle course status:', error);
    }
  };

  const handleCourseClick = (course: Course) => {
    navigate('/admin/registrations', {
      state: {
        itemType: 'course',
        title: course.title,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading courses...</p>
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
            <p className="text-destructive mb-4">Failed to load courses</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  const levels = ['beginner', 'intermediate', 'advanced'];
  const statuses = ['active', 'inactive', 'completed'];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
          <p className="text-muted-foreground">Manage all educational courses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 [&>button]:hidden">
            {/* Fixed Header */}
            <div className="relative bg-background p-6 pb-4 flex-shrink-0">
              <DialogHeader className="pb-2">
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
                <DialogDescription>
                  {editingCourse ? 'Update the course details below.' : 'Fill in the details for the new course.'}
                </DialogDescription>
              </DialogHeader>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none h-4 w-4 active:bg-transparent hover:bg-transparent"
                onClick={resetForm}
              >

                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor *</Label>
                    <Input
                      id="instructor"
                      placeholder="e.g., Dr. Ahmed Al-Hafiz"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 8 weeks"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value as 'beginner' | 'intermediate' | 'advanced' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., religious-studies"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      placeholder="e.g., 30"
                      value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
                  <Input
                    id="registrationFee"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 500 (leave blank for free)"
                    value={formData.registrationFee}
                    onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                    />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input
                    id="schedule"
                    placeholder="e.g., Tuesdays & Thursdays 6-8 PM"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materials">Required Materials</Label>
                  <Textarea
                    id="materials"
                    placeholder="e.g., Mushaf, notebook, recording app"
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    rows={3}
                  />
            </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-primary hover:opacity-90"
                  disabled={createCourse.isPending || updateCourse.isPending}
                >
                  {(createCourse.isPending || updateCourse.isPending) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingCourse ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingCourse ? 'Update Course' : 'Create Course'
                  )}
                </Button>
              </div>
            </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search courses by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setLevelFilter('all');
                setStatusFilter('all');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="shadow-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCourseClick(course)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-foreground">{course.title}</CardTitle>
                    <Badge variant={course.status === 'active' ? "default" : "secondary"}>
                      {course.status === 'active' ? 'Active' : course.status === 'inactive' ? 'Inactive' : 'Completed'}
                    </Badge>
                    {course.level && (
                      <Badge variant="outline">
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <span><strong>Duration:</strong> {course.duration}</span>
                      <span><strong>Instructor:</strong> {course.instructor}</span>
                      {course.maxParticipants && (
                        <span><strong>Max Participants:</strong> {course.maxParticipants}</span>
                      )}
                      {course.category && (
                        <span><strong>Category:</strong> {course.category}</span>
                      )}
                      <span><strong>Registration Fee:</strong> {course.registrationFee && course.registrationFee > 0 ? `₹${course.registrationFee.toLocaleString('en-IN')}` : 'Free'}</span>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleActive(course.id);
                    }}
                    title={course.status === 'active' ? 'Deactivate course' : 'Activate course'}
                    disabled={updateCourse.isPending}
                  >
                    {course.status === 'active' ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(course);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(course.id);
                    }}
                    disabled={deleteCourse.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2">{course.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCourses;
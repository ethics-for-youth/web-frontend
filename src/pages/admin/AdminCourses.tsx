import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Course } from '@/types';
import { mockCourses } from '@/data/mockData';

const AdminCourses = () => {
  console.log('AdminCourses component rendering...');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    description: '',
    mode: '',
    enrollmentLink: '',
    isActive: true
  });

  useEffect(() => {
    setCourses(mockCourses);
    setFilteredCourses(mockCourses);
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (modeFilter) {
      filtered = filtered.filter(course => course.mode === modeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(course => 
        statusFilter === 'active' ? course.isActive : !course.isActive
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, modeFilter, statusFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCourse) {
      // Update existing course
      const updatedCourses = courses.map(course =>
        course.id === editingCourse.id
          ? { ...course, ...formData }
          : course
      );
      setCourses(updatedCourses);
      toast({
        title: "Course Updated",
        description: "Course has been successfully updated.",
      });
    } else {
      // Create new course
      const newCourse: Course = {
        id: Date.now().toString(),
        ...formData
      };
      setCourses([newCourse, ...courses]);
      toast({
        title: "Course Created",
        description: "New course has been successfully created.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      duration: '',
      description: '',
      mode: '',
      enrollmentLink: '',
      isActive: true
    });
    setEditingCourse(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      duration: course.duration,
      description: course.description,
      mode: course.mode,
      enrollmentLink: course.enrollmentLink,
      isActive: course.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId));
      toast({
        title: "Course Deleted",
        description: "Course has been successfully deleted.",
      });
    }
  };

  const toggleActive = (courseId: string) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? { ...course, isActive: !course.isActive }
        : course
    );
    setCourses(updatedCourses);
    
    const course = courses.find(c => c.id === courseId);
    toast({
      title: course?.isActive ? "Course Deactivated" : "Course Activated",
      description: `Course has been ${course?.isActive ? 'deactivated' : 'activated'} successfully.`,
    });
  };

  const modes = ['Online', 'In-person', 'Hybrid', 'Hybrid (Online + In-person)'];

  console.log('AdminCourses: About to render, courses count:', courses.length);
  console.log('AdminCourses: Filtered courses count:', filteredCourses.length);

  return (
    <div className="p-6" style={{ minHeight: '100vh', backgroundColor: '#fefefe' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ color: '#000000' }}>Course Management</h1>
          <p className="text-muted-foreground" style={{ color: '#666666' }}>Manage all educational courses</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
              <DialogDescription>
                {editingCourse ? 'Update the course details below.' : 'Fill in the details for the new course.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 8 weeks"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mode">Mode *</Label>
                  <Select value={formData.mode} onValueChange={(value) => setFormData({...formData, mode: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {modes.map((mode) => (
                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="enrollmentLink">Enrollment Link</Label>
                  <Input
                    id="enrollmentLink"
                    type="url"
                    placeholder="https://..."
                    value={formData.enrollmentLink}
                    onChange={(e) => setFormData({...formData, enrollmentLink: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded border-border"
                />
                <Label htmlFor="isActive">Course is active and accepting enrollments</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </form>
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
              <Select value={modeFilter} onValueChange={setModeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Modes</SelectItem>
                  {modes.map((mode) => (
                    <SelectItem key={mode} value={mode}>{mode}</SelectItem>
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
                  <SelectItem value="">All Courses</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setModeFilter('');
                setStatusFilter('');
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
          <Card key={course.id} className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-foreground">{course.title}</CardTitle>
                    <Badge variant={course.isActive ? "default" : "secondary"}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {course.mode}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <span><strong>Duration:</strong> {course.duration}</span>
                      <span><strong>Enrollment:</strong> {course.enrollmentLink || 'No link'}</span>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleActive(course.id)}
                    title={course.isActive ? 'Deactivate course' : 'Activate course'}
                  >
                    {course.isActive ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(course.id)}
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
# 🔍 Missing API Analysis - Frontend vs OpenAPI Spec

Based on frontend codebase analysis, here are the APIs that are **currently being used** but **missing from your OpenAPI specification**.

---

## 🚨 **Critical Missing APIs**

### **1. Registrations API** ⚠️ **HIGH PRIORITY**
**Frontend Usage:**
- `src/services/registrationsApi.ts` - Implements registration endpoints
- `src/components/RegistrationForm.tsx` - Used for event/course registration forms
- `src/hooks/useRegistrations.ts` - React Query hooks for registrations

**Missing Endpoints:**
```yaml
/registrations:
  post:
    summary: Create new registration
    description: Register for events or courses
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [name, email, type]
            properties:
              name: { type: string }
              email: { type: string, format: email }
              whatsappNumber: { type: string }
              gender: { type: string }
              age: { type: integer }
              education: { type: string }
              address: { type: string }
              joinCommunity: { type: boolean }
              type: { type: string, enum: [Event, Course, Volunteer] }
              relatedEventId: { type: string }
              relatedCourseId: { type: string }
    responses:
      '200':
        description: Registration created successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                success: { type: boolean }
                message: { type: string }
                data:
                  type: object
                  properties:
                    registrationId: { type: string }

/registrations:
  get:
    summary: Get all registrations (Admin only)
    description: Retrieve list of all registrations with filtering
    parameters:
      - name: type
        in: query
        schema: { type: string, enum: [Event, Course, Volunteer] }
      - name: status
        in: query  
        schema: { type: string, enum: [pending, approved, rejected] }
    responses:
      '200':
        description: Registrations retrieved successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                success: { type: boolean }
                data:
                  type: object
                  properties:
                    registrations: 
                      type: array
                      items: { $ref: '#/components/schemas/Registration' }
                    count: { type: integer }

/registrations/{id}:
  put:
    summary: Update registration status (Admin only)
    description: Approve/reject registration or update details
    parameters:
      - name: id
        in: path
        required: true
        schema: { type: string }
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              reviewed: { type: boolean }
              status: { type: string, enum: [pending, approved, rejected] }
              adminNotes: { type: string }
```

---

### **2. Courses API** ⚠️ **HIGH PRIORITY**
**Frontend Usage:**
- `src/pages/Courses.tsx` - Lists all courses
- `src/pages/CourseDetail.tsx` - Shows individual course details  
- `src/pages/admin/AdminCourses.tsx` - Admin CRUD for courses
- `src/pages/Home.tsx` - Featured courses section

**Missing Endpoints:**
```yaml
/courses:
  get:
    summary: Get all courses
    description: Retrieve list of all courses
    responses:
      '200':
        content:
          application/json:
            schema:
              type: object
              properties:
                success: { type: boolean }
                data:
                  type: object
                  properties:
                    courses:
                      type: array
                      items: { $ref: '#/components/schemas/Course' }
                    count: { type: integer }
  post:
    summary: Create new course (Admin only)
    description: Create a new course
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/CourseRequest'

/courses/{id}:
  get:
    summary: Get course by ID
    description: Retrieve a specific course
    parameters:
      - name: id
        in: path
        required: true
        schema: { type: string }
    responses:
      '200':
        content:
          application/json:
            schema:
              type: object
              properties:
                success: { type: boolean }
                data:
                  type: object
                  properties:
                    course: { $ref: '#/components/schemas/Course' }
  put:
    summary: Update course (Admin only)
  delete:
    summary: Delete course (Admin only)
```

---

### **3. Contact/Messages API** 🔶 **MEDIUM PRIORITY**
**Frontend Usage:**
- `src/pages/Contact.tsx` - Contact form submission (currently simulated)

**Missing Endpoints:**
```yaml
/messages:
  post:
    summary: Submit contact message
    description: Send a message through contact form
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [name, email, message]
            properties:
              name: { type: string }
              email: { type: string, format: email }
              message: { type: string }
              subject: { type: string }
    responses:
      '200':
        description: Message sent successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                success: { type: boolean }
                message: { type: string }
                data:
                  type: object
                  properties:
                    messageId: { type: string }

/messages:
  get:
    summary: Get all messages (Admin only)
    description: Retrieve contact messages for admin review
```

---

### **4. Dashboard/Analytics API** 🔶 **MEDIUM PRIORITY**
**Frontend Usage:**
- `src/pages/admin/AdminDashboard.tsx` - Shows statistics and metrics

**Missing Endpoints:**
```yaml
/admin/stats:
  get:
    summary: Get dashboard statistics
    description: Retrieve key metrics for admin dashboard
    responses:
      '200':
        content:
          application/json:
            schema:
              type: object
              properties:
                success: { type: boolean }
                data:
                  type: object
                  properties:
                    totalEvents: { type: integer }
                    totalCourses: { type: integer }
                    totalRegistrations: { type: integer }
                    totalVolunteers: { type: integer }
                    pendingRegistrations: { type: integer }
                    recentRegistrations:
                      type: array
                      items: { $ref: '#/components/schemas/Registration' }
```

---

## 📋 **Additional Missing Schema Definitions**

### **Course Schema:**
```yaml
Course:
  type: object
  properties:
    id: { type: string }
    title: { type: string }
    description: { type: string }
    duration: { type: string }
    mode: { type: string, enum: [Online, In-person, Hybrid] }
    enrollmentLink: { type: string, format: uri }
    isActive: { type: boolean }
    instructor: { type: string }
    maxParticipants: { type: integer }
    currentEnrollments: { type: integer }
    startDate: { type: string, format: date-time }
    endDate: { type: string, format: date-time }
    createdAt: { type: string, format: date-time }
    updatedAt: { type: string, format: date-time }
```

### **Registration Schema:**
```yaml
Registration:
  type: object
  properties:
    id: { type: string }
    name: { type: string }
    email: { type: string, format: email }
    whatsappNumber: { type: string }
    gender: { type: string, enum: [Male, Female, Other] }
    age: { type: integer }
    education: { type: string }
    address: { type: string }
    joinCommunity: { type: boolean }
    type: { type: string, enum: [Event, Course, Volunteer] }
    relatedEventId: { type: string }
    relatedCourseId: { type: string }
    reviewed: { type: boolean }
    status: { type: string, enum: [pending, approved, rejected] }
    adminNotes: { type: string }
    createdAt: { type: string, format: date-time }
    updatedAt: { type: string, format: date-time }
```

---

## 🎯 **Implementation Priority**

### **Phase 1: Critical (Must Have)**
1. ✅ **Registrations API** - Forms are broken without this
2. ✅ **Courses API** - Multiple pages depend on this

### **Phase 2: Important (Should Have)**  
3. 🔶 **Contact/Messages API** - Contact form currently simulated
4. 🔶 **Dashboard Stats API** - Admin dashboard using mock data

### **Phase 3: Enhancement (Nice to Have)**
5. 🔷 **File Upload API** - For course materials, event images
6. 🔷 **Notifications API** - Email/SMS notifications
7. 🔷 **Reports API** - Export functionality for registrations

---

## 🔧 **Current Workarounds in Frontend**

1. **Courses**: Using `mockCourses` from static data
2. **Registrations**: Using `mockRegistrations` from static data  
3. **Contact Form**: Simulated with `setTimeout`
4. **Dashboard Stats**: Calculated from mock data
5. **Admin Functions**: Limited to events only

---

## ⚡ **Quick Fix Recommendations**

### **Option 1: Extend Existing APIs**
- Add registration functionality to existing `/events/{id}/register`
- Extend `/events` to include course-like events

### **Option 2: Add New APIs**  
- Implement the missing endpoints listed above
- Create separate course management system

### **Option 3: Hybrid Approach**
- Use existing volunteer system for general registrations
- Add courses as a special type of event
- Implement minimal contact API

---

## 🎉 **Impact Assessment**

**Without Missing APIs:**
- ❌ Course pages show static data only
- ❌ Registration forms don't actually register users
- ❌ Contact form doesn't send messages  
- ❌ Admin dashboard shows fake statistics
- ❌ No way to manage registrations in admin panel

**With Complete API Implementation:**
- ✅ Full end-to-end user registration flow
- ✅ Real-time admin dashboard with live data
- ✅ Dynamic course catalog management
- ✅ Functional contact system
- ✅ Complete admin panel for all entities

**Your frontend is 80% ready - just needs these APIs to be fully functional! 🚀**
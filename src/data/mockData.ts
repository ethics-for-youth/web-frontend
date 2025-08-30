import { Event, Course, Competition, Volunteer, Suggestion, Registration } from '../types';

export const mockEvents: Event[] = [
  {
    id: 'event_1706123456_abc123',
    title: 'Islamic History Workshop',
    description: 'Learn about the golden age of Islamic civilization and its contributions to modern society. This interactive session will explore historical achievements and their relevance today.',
    date: '2024-02-15T14:00:00Z',
    location: 'Community Center, Room 101',
    category: 'educational',
    maxParticipants: 50,
    registrationDeadline: '2024-02-10T23:59:59Z',
    status: 'active',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  },
  {
    id: 'event_1706123457_def456',
    title: 'Youth Leadership Workshop',
    description: 'Empower yourself with leadership skills rooted in Islamic values. This hands-on workshop will cover effective communication, team building, and leading with integrity.',
    date: '2024-08-22T14:00:00Z',
    location: 'Ethics For Youth Center',
    category: 'educational',
    maxParticipants: 30,
    registrationDeadline: '2024-08-20T23:59:59Z',
    status: 'active',
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2024-08-01T10:00:00Z'
  },
  {
    id: 'event_1706123458_ghi789',
    title: 'Quran Study Circle',
    description: 'Weekly Quran study sessions focusing on understanding and reflection. This week we will be studying Surah Al-Baqarah and its teachings on community, faith, and personal development.',
    date: '2024-08-29T18:30:00Z',
    location: 'Local Mosque',
    category: 'religious',
    maxParticipants: 25,
    registrationDeadline: '2024-08-27T23:59:59Z',
    status: 'active',
    createdAt: '2024-08-15T10:00:00Z',
    updatedAt: '2024-08-15T10:00:00Z'
  }
];

export const mockCompetitions: Competition[] = [
  {
    id: 'comp_1706123456_xyz789',
    title: 'Quran Recitation Competition',
    description: 'Annual Quran recitation competition for youth',
    category: 'religious',
    startDate: '2024-03-01T09:00:00Z',
    endDate: '2024-03-01T17:00:00Z',
    registrationDeadline: '2024-02-25T23:59:59Z',
    rules: ['Participants must be between 13-25 years old', 'Maximum 5 minutes recitation'],
    prizes: ['First Place: $500', 'Second Place: $300', 'Third Place: $200'],
    maxParticipants: 50,
    status: 'open',
    participants: [],
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  }
];

export const mockVolunteers: Volunteer[] = [
  {
    id: 'volunteer_1706123456_vol123',
    name: 'Fatima Rahman',
    email: 'fatima.rahman@example.com',
    phone: '+1234567890',
    skills: ['Event Management', 'Social Media', 'Teaching'],
    availability: 'Weekends and evenings',
    status: 'pending',
    appliedAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  }
];

export const mockSuggestions: Suggestion[] = [
  {
    id: 'suggestion_1706123456_sug456',
    title: 'Mobile App Development',
    description: 'Develop a mobile app to better engage youth with Islamic content',
    category: 'technology',
    submitterName: 'Omar Hassan',
    submitterEmail: 'omar.hassan@example.com',
    priority: 'medium',
    tags: ['mobile', 'technology', 'youth-engagement'],
    status: 'submitted',
    votes: 0,
    submittedAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  }
];

export const mockRegistrations: Registration[] = [
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
    relatedEventId: 'event_1706123456_abc123',
    createdAt: '2024-07-12T10:30:00Z',
    reviewed: true
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
    createdAt: '2024-07-12T09:15:00Z',
    reviewed: false
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
    createdAt: '2024-07-11T16:45:00Z',
    reviewed: true
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
    relatedEventId: 'event_1706123457_def456',
    createdAt: '2024-07-11T14:20:00Z',
    reviewed: false
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
    createdAt: '2024-07-10T11:30:00Z',
    reviewed: true
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
    createdAt: '2024-07-09T13:10:00Z',
    reviewed: false
  }
];

export const volunteerOpportunities = [
  {
    icon: 'BookOpen',
    title: 'Educational Support',
    description: 'Help with course preparation, student mentoring, and educational material development.'
  },
  {
    icon: 'Users',
    title: 'Event Organization',
    description: 'Assist in planning and executing community events, workshops, and gatherings.'
  },
  {
    icon: 'Heart',
    title: 'Community Outreach',
    description: 'Engage with the community through social media, newsletters, and local partnerships.'
  },
  {
    icon: 'Hand',
    title: 'Youth Mentoring',
    description: 'Guide and support younger community members in their personal and spiritual growth.'
  },
  {
    icon: 'Globe',
    title: 'Digital Dawah',
    description: 'Help spread Islamic knowledge through online platforms and digital content creation.'
  },
  {
    icon: 'Star',
    title: 'Special Projects',
    description: 'Contribute to unique initiatives and seasonal programs throughout the year.'
  }
];

export const volunteerBenefits = [
  'Personal and spiritual growth opportunities',
  'Skill development and leadership training',
  'Networking with like-minded individuals',
  'Flexible commitment based on your availability',
  'Recognition and appreciation for your contributions',
  'Making a meaningful impact in the community'
];

export const courseBenefits = [
  'Structured learning path with clear objectives',
  'Interactive sessions and Q&A opportunities', 
  'Course materials and resources included',
  'Certificate of completion',
  'Access to course community',
  'Lifetime access to course materials'
];

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Foundations of Islamic Ethics',
    duration: '8 weeks',
    description: 'A comprehensive course covering the fundamental principles of Islamic ethics, including the sources of Islamic law, moral philosophy, and practical applications in contemporary life. Perfect for beginners and those seeking to deepen their understanding.',
    mode: 'Hybrid (Online + In-person)',
    enrollmentLink: '#',
    isActive: true
  },
  {
    id: '2',
    title: 'Leadership in Islam',
    duration: '6 weeks',
    description: 'Develop your leadership potential through Islamic principles. This course covers servant leadership, decision-making in Islam, conflict resolution, and building ethical organizations. Includes case studies and practical exercises.',
    mode: 'Online',
    enrollmentLink: '#',
    isActive: true
  },
  {
    id: '3',
    title: 'Islamic Finance and Business Ethics',
    duration: '10 weeks',
    description: 'Learn about halal business practices, Islamic banking principles, and ethical entrepreneurship. This course is ideal for business students and professionals looking to align their careers with Islamic values.',
    mode: 'In-person',
    enrollmentLink: '#',
    isActive: true
  },
  {
    id: '4',
    title: 'Digital Dawah Training',
    duration: '4 weeks',
    description: 'Master the art of spreading Islamic knowledge through digital platforms. Learn content creation, social media strategy, and effective online communication while maintaining Islamic etiquette.',
    mode: 'Online',
    enrollmentLink: '#',
    isActive: false
  }
];
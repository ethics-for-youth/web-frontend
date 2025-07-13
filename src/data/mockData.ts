import { Event, Course } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Islamic Ethics in Modern Society',
    date: '2024-08-15',
    time: '19:00',
    location: 'Community Center, Downtown',
    speaker: 'Dr. Ahmad Hassan',
    description: 'Join us for an enlightening discussion on how Islamic ethics can guide us through modern societal challenges. This interactive session will explore practical applications of Islamic principles in daily life, covering topics such as honesty in business, social justice, and community responsibility.'
  },
  {
    id: '2',
    title: 'Youth Leadership Workshop',
    date: '2024-08-22',
    time: '14:00',
    location: 'Ethics For Youth Center',
    speaker: 'Sister Fatima Al-Zahra',
    description: 'Empower yourself with leadership skills rooted in Islamic values. This hands-on workshop will cover effective communication, team building, and leading with integrity. Perfect for young Muslims looking to make a positive impact in their communities.'
  },
  {
    id: '3',
    title: 'Quran Study Circle',
    date: '2024-08-29',
    time: '18:30',
    location: 'Local Mosque',
    speaker: 'Imam Abdullah',
    description: 'Weekly Quran study sessions focusing on understanding and reflection. This week we will be studying Surah Al-Baqarah and its teachings on community, faith, and personal development. All levels welcome.'
  }
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
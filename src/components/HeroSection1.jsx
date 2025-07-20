import React, { useState, useEffect, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import clsx from 'clsx';
import eventImage from '../assets/Event1.jpeg'; 

export default function EventPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [activeMonth, setActiveMonth] = useState(new Date());

  const dummyData = [
    {
      date: '2025-07-11',
      title: 'Islamic Morals - Day 1',
      time: '1:15 hours',
      description: 'Introduction to manners in Islam.',
      capacity: '50 boys, 50 girls',
      // image: 'https://plus.unsplash.com/premium_photo-1678553965644-e71fbdd64acd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      image: eventImage
    },
    {
      date: '2025-07-12',
      title: 'Islamic Morals - Day 2',
      time: '1:15 hours',
      description: 'Spiritual connection & character building.',
      capacity: '50 boys, 50 girls',
      image: 'https://images.unsplash.com/photo-1639897657022-ec5ecb8efd94?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      date: '2025-08-25',
      // title: 'Community Iftar',
      // time: '6:30 PM',
      // description: 'Join us for a community gathering.',
      // capacity: 'Open to all',
      image: eventImage,
    }
  ];

  useEffect(() => {
    const formattedEvents = {};
    dummyData.forEach((event) => {
      formattedEvents[event.date] = event;
    });
    setEvents(formattedEvents);

    if (dummyData.length > 0) {
      const sortedEvents = [...dummyData].sort((a, b) => new Date(a.date) - new Date(b.date));
      const firstEventDate = sortedEvents[0].date;
      setSelectedDate(firstEventDate);
      setActiveMonth(new Date(firstEventDate));
    }
  }, []);

  const monthlyEvents = useMemo(() => {
    return Object.values(events)
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === activeMonth.getMonth() && eventDate.getFullYear() === activeMonth.getFullYear();
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [activeMonth, events]);

  const event = selectedDate ? events[selectedDate] : null;

  const toISOString = (date) => date.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-6 py-10 font-sans">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Islamic Morals and Manners for Young Minds</h1>
        <p className="text-lg text-gray-600 mb-10">Deepen your understanding of Islam through our online learning journeys designed especially for youth.</p>

     <div className="w-full max-w-4xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
    {/* Event Detail Card */}
    <motion.div
      key={selectedDate}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 text-left flex flex-col justify-between h-full"
    >
      {event ? (
    <div className="relative w-full h-64 perspective">
  <div className="w-full h-auto transform rotate-[-4deg] skew-y-1 scale-115 transition duration-300 shadow-xxl">
    <img
      src={event.image}
      alt={event.title}
      className="rounded-xl object-cover w-full h-full"
    />
  </div>
</div>


      ) : (
        <div className="text-gray-600 italic h-full flex items-center justify-center">
          Select a date to view event details.
        </div>
      )}
    </motion.div>

    {/* Calendar and Upcoming Events Card */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-200 h-full flex flex-col justify-between"
    >
      <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-indigo-600" /> Event Calendar
      </h2>
            
            <Calendar
              onChange={(date) => setSelectedDate(toISOString(date))}
              onActiveStartDateChange={({ activeStartDate }) => setActiveMonth(activeStartDate)}
              value={selectedDate ? new Date(selectedDate) : new Date()}
              
              // --- Tailwind CSS Styling Props ---
              className="w-full border-none"
              nextLabel={<ChevronRight size={24} className="text-gray-600 hover:text-indigo-600"/>}
              prevLabel={<ChevronLeft size={24} className="text-gray-600 hover:text-indigo-600"/>}
              next2Label={null}
              prev2Label={null}
              navigationLabel={({ date }) => (
                <span className="text-lg font-semibold text-indigo-600">
                  {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
              )}
              tileClassName={({ date, view }) => {
                if (view === 'month') {
                  const isoDate = toISOString(date);
                  const isToday = isoDate === toISOString(new Date());
                  const isSelected = isoDate === selectedDate;
                  
                  return clsx(
                    'flex items-center justify-center h-10 rounded-full relative transition-colors',
                    'hover:bg-gray-100',
                    {'bg-indigo-600 text-white hover:bg-indigo-700': isToday},
                    {'ring-2 ring-indigo-400': isSelected && !isToday},
                    {'text-indigo-800 font-semibold': events[isoDate] && !isToday && !isSelected},
                    {'text-gray-400': date.getMonth() !== activeMonth.getMonth()}
                  );
                }
              }}
              tileContent={({ date, view }) => {
                const isoDate = toISOString(date);
                if (view === 'month' && events[isoDate]) {
                  const isToday = isoDate === toISOString(new Date());
                  return (
                    <div className={clsx(
                      "h-1.5 w-1.5 rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2",
                      isToday ? 'bg-white' : 'bg-pink-500'
                    )} />
                  );
                }
              }}
            />

            {/* Upcoming Events Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Upcoming in {activeMonth.toLocaleString('default', { month: 'long' })}</h3>
              <div className="space-y-3 h-32 overflow-y-auto pr-2">
                <AnimatePresence>
                  {monthlyEvents.length > 0 ? (
                    monthlyEvents.map((event, index) => (
                      <motion.div
                        key={event.date}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={clsx(
                          "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                          selectedDate === event.date ? 'bg-indigo-100' : 'hover:bg-gray-100'
                        )}
                        onClick={() => setSelectedDate(event.date)}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-200 text-indigo-700 rounded-md flex items-center justify-center font-bold text-sm">
                          {new Date(event.date).getDate()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{event.title}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-gray-500 italic text-center pt-4">
                      No events scheduled for this month.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
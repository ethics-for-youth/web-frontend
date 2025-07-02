import React from 'react';
import bgImage from '../assets/bg.jpeg';
import bgImage2 from '../assets/bg2.jpeg'; 

const EventDetails = () => {
  return (
    <div
      className="w-full min-h-[500px] bg-cover bg-center rounded-lg relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center px-6 py-10">
        <h2 className="text-4xl font-bold mb-2">Short Course</h2>
        <p className="text-lg mb-6 italic">Empowering Youth with Islamic Knowledge</p>

        <div className="text-left max-w-xl space-y-2">
          <p><strong>📅 Dates:</strong> 11th, 12th, and 13th June</p>
          <p><strong>⏱ Duration:</strong> 1 hour 15 minutes class each day</p>
          <p><strong>💬 Q&A:</strong> 30-minute session after the class on 13th June</p>
          <p><strong>🕒 Total Time:</strong> 2 hours 30 minutes for classes + 30 minutes for discussion</p>
          <p><strong>🌐 Mode:</strong> Online</p>
          <p><strong>👥 Capacity:</strong> 50 Boys | 50 Girls</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

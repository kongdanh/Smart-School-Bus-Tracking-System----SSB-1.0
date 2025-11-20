import React from 'react';
import '../../pages/parent/styles/TripTimeline.css';

const TripTimeline = ({ timeline }) => {
  return (
    <div className="trip-timeline">
      {timeline.map((item, index) => (
        <div key={index} className={`timeline-item ${item.status}`}>
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <div className="timeline-time">{item.time}</div>
            <div className="timeline-location">{item.location}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripTimeline;

'use client';

import React, { useState } from 'react';
import styles from './Training.module.scss';

const Training = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingSessions = [
    { date: '25-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
    { date: '27-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
    { date: '29-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
    { date: '31-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
  ];

  return (
    <div className={styles['training-container']}>
      <h1 className={styles.heading}>TRAINING SCHEDULE</h1>

      <div className={styles.tabs}>
        <span
          className={activeTab === 'upcoming' ? styles.active : ''}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Sessions
        </span>
        <span
          className={activeTab === 'past' ? styles.active : ''}
          onClick={() => setActiveTab('past')}
        >
          Past Sessions
        </span>
      </div>

      {activeTab === 'upcoming' &&
        upcomingSessions.map((session, index) => (
          <div key={index} className={styles['session-card']}>
            <span className={styles['session-info']}>
              {`${session.date} | ${session.topic} | ${session.coach}`}
            </span>
            <button className={styles['join-button']}>JOIN</button>
          </div>
        ))}

      {activeTab === 'past' && (
        <div className={styles['no-sessions']}>
          <p>No past sessions available yet.</p>
        </div>
      )}
    </div>
  );
};

export default Training;

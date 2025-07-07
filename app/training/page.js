'use client';

import React, { useState } from 'react';
import styles from './Training.module.scss';

const SessionCard = ({ session, status }) => {
  return (
    <div className={styles['session-card']}>
      <span className={styles['session-info']}>
        {`${session.date} | ${session.topic} | ${session.coach}`}
      </span>
      {status ? (
        <span
          className={`${styles['status-badge']} ${
            status === 'present' ? styles.present : styles.absent
          }`}
        >
          {status.toUpperCase()}
        </span>
      ) : (
        <button className={styles['join-button']}>JOIN</button>
      )}
    </div>
  );
};

const Training = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingSessions = [
    { date: '25-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
    { date: '27-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
    { date: '29-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
    { date: '31-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
  ];

  const pastSessions = [
    { date: '25-Jun-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov', status: 'present' },
    { date: '27-Jun-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov', status: 'absent' },
    { date: '29-Jun-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov', status: 'present' },
    { date: '31-Jun-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov', status: 'present' },
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
          <SessionCard key={index} session={session} />
        ))}

      {activeTab === 'past' &&
        pastSessions.map((session, index) => (
          <SessionCard key={index} session={session} status={session.status} />
        ))}
    </div>
  );
};

export default Training;

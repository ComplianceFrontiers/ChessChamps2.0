'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Lessons.module.scss';

const lessonsData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: 'Basics of Chess',
  category: 'Opening',
  level: 'Beginner',
  views: '106',
  type: 'Free',
  img: '/lessonimages/lesson2.png',
}));

export default function Lessons() {
  const [activeTab, setActiveTab] = useState('available');

  const availableLessons = lessonsData;
  const completedLessons = []; // ✅ MUST be an array

  const lessonsToDisplay = activeTab === 'available' ? availableLessons : completedLessons;

  return (
    <div className={styles.lessonContainer}>
      <h1 className={styles.heading}>LESSONS</h1>

      <div className={styles.tabs}>
        <span
          className={activeTab === 'available' ? styles.active : ''}
          onClick={() => setActiveTab('available')}
        >
          Available
        </span>
        <span
          className={activeTab === 'complete' ? styles.active : ''}
          onClick={() => setActiveTab('complete')}
        >
          Complete
        </span>
      </div>

      <div className={styles.grid}>
        {lessonsToDisplay.map((lesson) => (
          <div className={styles.card} key={lesson.id}>
            <div className={styles.lessonImageWrapper}>
              <Image
                src={lesson.img}
                alt={lesson.title}
                width={300}
                height={140}
                className={styles.lessonImage}
              />
            </div>
            <div className={styles.lessonInfo}>
              <span className={styles.category}>{lesson.category}</span>
              <h3 className={styles.title}>{lesson.title}</h3>
              <div className={styles.meta}>
                <span>{lesson.level}</span>
                <span>{lesson.views} views</span>
              </div>
              <div className={styles.bottom}>
                <span className={styles.free}>{lesson.type}</span>
                <button className={styles.completeBtn}>MARK COMPLETE</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

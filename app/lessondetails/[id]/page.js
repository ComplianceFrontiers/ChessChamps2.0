'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import styles from './LessonDetails.module.scss';
  import {lessonContent, universalLessons} from './lessonData';

const LessonDetail = () => {
  const router = useRouter();
  const params = useParams();

  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const lesson = lessonContent[id];

  const lessonKeys = Object.keys(lessonContent);
  const currentIndex = lessonKeys.indexOf(id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < lessonKeys.length - 1;

  const [status, setStatus] = useState(lesson?.status || 'In Progress');

  useEffect(() => {
    // Reset status when lesson changes
    setStatus(lesson?.status || 'In Progress');
  }, [id]);

  if (!lesson) {
    return <div className={styles.lessonNotFound}>Lesson not found for ID: {id}</div>;
  }

  const handlePrev = () => {
    if (hasPrev) {
      const prevId = lessonKeys[currentIndex - 1];
      router.push(`/lessondetails/${prevId}`);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const nextId = lessonKeys[currentIndex + 1];
      router.push(`/lessondetails/${nextId}`);
    }
  };

  const handleMarkComplete = () => {
    setStatus('Completed');
  };

  return (
    <div className={styles.lessonDetailContainer}>
      <div className={styles.lessonHeader}>
        <img src={lesson.image} alt={lesson.title} className={styles.lessonImage} />
      </div>

      <div className={styles.lessonBody}>
        <div className={styles.lessonMeta}>
          <h5>{lesson.category}</h5>
          <h2>{lesson.title}</h2>
          <div className={styles.lessonInfo}>
            <span className={styles.duration}>{lesson.duration}</span>
            <span className={styles.status}>
              {status === 'Completed' ? '✅ Completed' : (
                <button className={styles.completeBtn} onClick={handleMarkComplete}>
                  Mark as Complete
                </button>
              )}
            </span>
          </div>
        </div>

        <p className={styles.lessonDescription}>{lesson.description}</p>

        <div className={styles.lessonResources}>
          <h4>Lesson Resources</h4>
          <ul>
            {lesson.resources.map((res, index) => (
              <li key={index}>
                <a href={res.link} target="_blank" rel="noopener noreferrer">
                  {res.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.lessonActions}>
          <button
            className={styles.prevBtn}
            onClick={handlePrev}
            disabled={!hasPrev}
          >
            Previous Lesson
          </button>

          <button
            className={styles.practiceBtn}
            onClick={() => router.push(`/practicepuzzle/${id}`)}
          >
            Practice
          </button>

          <button
            className={styles.nextBtn}
            onClick={handleNext}
            disabled={!hasNext}
          >
            Next Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;

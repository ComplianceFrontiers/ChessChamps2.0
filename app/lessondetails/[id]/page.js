'use client';
import React from 'react';
import styles from './LessonDetails.module.scss';

const LessonDetail = () => {
  return (
    <div className={styles.lessonDetailContainer}>
      <div className={styles.lessonHeader}>
        <img
          src="/lessonimages/lessond.png"
          alt="Lesson Visual"
          className={styles.lessonImage}
        />
      </div>

      <div className={styles.lessonBody}>
        <div className={styles.lessonMeta}>
          <h5>EDITING SECRETS TRAINING & TOOLKIT</h5>
          <h2>Lesson 1: Welcome</h2>
          <div className={styles.lessonInfo}>
            <span className={styles.duration}>6:58</span>
            <span className={styles.status}>Completed</span>
          </div>
        </div>

        <p className={styles.lessonDescription}>
          Learn what Film Editing Pro is all about and hear how our lead trainer, Chris,
          unlocked the skills that took him from intern to senior editor at a major Hollywood studio.
        </p>

        <div className={styles.lessonResources}>
          <h4>Lesson Resources</h4>
          <ul>
            <li>
              <a href="#">Beginner Course - Premiere Pro Software Quickstart</a>
            </li>
            <li>
              <a href="#">Beginner Course - DaVinci Resolve Software Quickstart</a>
            </li>
          </ul>
        </div>

        <div className={styles.lessonActions}>
          <button className={styles.prevBtn}>Previous Lesson</button>
          <button className={styles.practiceBtn}>Practice</button>
          <button className={styles.nextBtn}>Next Lesson</button>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;

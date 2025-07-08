// app/classroom/page.js or components/Classroom.js
'use client';

import React from 'react';
import styles from './Classroom.module.scss'; // create this SCSS file

const Classroom = () => {
  return (
    <div className={styles.classroomContainer}>
      <h2>Overview</h2>
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <div>
            <div className={styles.label}>Attendance</div>
            <div className={styles.value}>0%</div>
          </div>
          <div className={styles.stats}>
            <div>Classes invited: 0</div>
            <div>Classes attended: 0</div>
            <div>Total hours spent: 0</div>
          </div>
        </div>

        <div className={styles.card}>
          <div>
            <div className={styles.label}>Total classes joined</div>
            <div className={styles.value}>0</div>
          </div>
          <div className={styles.stats}>
            <div>Individual classes: 0</div>
            <div>Group classes: 0</div>
          </div>
        </div>
      </div>

      <h2>Performance</h2>
      <div className={styles.medals}>
        <div className={styles.medal}>
          <span role="img" aria-label="silver">🥈</span>
          <div>Silver</div>
          <div>0</div>
        </div>
        <div className={styles.medal}>
          <span role="img" aria-label="gold">🥇</span>
          <div>Gold</div>
          <div>0</div>
        </div>
        <div className={styles.medal}>
          <span role="img" aria-label="bronze">🥉</span>
          <div>Bronze</div>
          <div>0</div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;

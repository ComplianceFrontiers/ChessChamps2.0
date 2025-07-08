'use client';

import React from 'react';
import styles from './Quiz.module.scss';

const Quiz = () => {
  return (
    <div className={styles.quizContainer}>
      <h2>Performance</h2>

      <div className={styles.section}>
        <h3>Quizzes</h3>
        <p>Total quizzes completed: 0</p>
        <p>Total problems solved: 0</p>
        <p>Total time taken: -</p>
        <p>Total points scored: 0</p>
      </div>

      <div className={styles.section}>
        <h3>Puzzles</h3>
        <p>Total puzzles completed: 0</p>
        <p>Total problems solved: 0</p>
        <p>Total time taken: -</p>
        <p>Total points scored: 0</p>
      </div>
    </div>
  );
};

export default Quiz;

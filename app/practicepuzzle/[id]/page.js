/* eslint-disable react/no-unescaped-entities */
'use client';

import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { lessonContent } from '../../../app/lessondetails/[id]/lessonData';
import styles from './practicepuzzle.module.scss';

const PracticePage = () => {
  const router = useRouter();
  const params = useParams();

  const id = typeof params.id === 'string' ? params.id : '';
  const lesson = lessonContent[id];

  if (!lesson) {
    return <div className={styles.notFound}>Practice not found for ID: {id}</div>;
  }

  const fens = lesson.practice || [];
  const fenCount = fens.length;

  const handleStart = () => {
    const fenString = lesson.practice?.join(',') ?? '';
    // Encode URI component to avoid breaking with `/`, spaces etc.
    const encodedFens = encodeURIComponent(fenString);
    // router.push(`/practice/${encodedFens}`); must be reverted
  };
  
  return (
    <div className={styles.practiceContainer}>
      <h2>🎉 Practice Time!</h2>
      <p>
        Hi Champion! You're about to solve <strong>{fenCount}</strong> fun chess puzzles from{' '}
        <strong>{lesson.title}</strong>.
      </p>
      <p>Click below to begin your practice adventure!</p>

      <button className={styles.startBtn} onClick={handleStart}>
        🚀 Let's Start!
      </button>
    </div>
  );
};

export default PracticePage;

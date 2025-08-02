'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Lessons.module.scss';
export default function Lessons() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('available');
  const currentLevel = 'Pawn'; // You can make this dynamic later

  const levelToIdMap = {
    Pawn: 1,
    Knight: 2,
    Bishop: 3,
    Rook: 4,
    Queen: 5,
    King: 6,
  };

  const universalLessons = [
    {
      id: 1,
      title: "Opening Principles",
      description: "Smart moves to start the game.",
    },
    {
      id: 2,
      title: "Development of Pieces",
      description: "Bring your team into action early.",
    },
    {
      id: 3,
      title: "Route Planner",
      description: "Plan your piece’s journey carefully.",
    },
    {
      id: 4,
      title: "The Pin",
      description: "Freeze a piece that can't move.",
    },
    {
      id: 5,
      title: "Skewer",
      description: "Stronger piece escapes, weaker one falls.",
    },
    {
      id: 6,
      title: "Double Attack",
      description: "One move, two threats at once.",
    },
    {
      id: 7,
      title: "Deflection",
      description: "Pull a defender away from duty.",
    },
    {
      id: 8,
      title: "Defensive Move",
      description: "Protect your pieces with smart play.",
    },
    {
      id: 9,
      title: "Draws",
      description: "When no one wins the game.",
    },
    {
      id: 10,
      title: "Stalemate",
      description: "King is stuck but not in danger.",
    },
    {
      id: 11,
      title: "Back Rank Mate",
      description: "Trapped king gets checkmated on back rank.",
    },
    {
      id: 12,
      title: "Smothered Mate",
      description: "King trapped by its own team.",
    },
    {
      id: 13,
      title: "Anastasia’s Mate",
      description: "Knight and rook trap the king beautifully.",
    },
    {
      id: 14,
      title: "Mate in One",
      description: "Win the game in one move!",
    },
    {
      id: 15,
      title: "Mate in Two",
      description: "Plan two perfect moves to win.",
    },
    {
      id: 16,
      title: "Mating with the Rook",
      description: "Use your rook to checkmate simply.",
    },
    {
      id: 17,
      title: "Mating with the Queen",
      description: "The queen finishes the game proudly.",
    },
    {
      id: 18,
      title: "The Passed Pawn",
      description: "A pawn with a clear path forward.",
    },
    {
      id: 19,
      title: "Promotion",
      description: "Pawn transforms into a powerful piece.",
    },
    {
      id: 20,
      title: "Winning Material",
      description: "Gain more valuable pieces than your opponent.",
    },
  ];
  
  
  
  

  const levelLessons = {
    Pawn: universalLessons,
    Knight: universalLessons,
    Bishop: universalLessons,
    Rook: universalLessons,
    Queen: universalLessons,
    King: universalLessons,
  };

  const levelId = levelToIdMap[currentLevel];
  const lessonsData = levelLessons[currentLevel].map((lesson, index) => {
    return {
      id: `${levelId}.${index + 1}`,
      title: `Lesson ${index + 1}: ${lesson.title}`,
      desc: lesson.description,
      img: `/lessonimages/${index + 1}.png`, // <-- changed here
    };
  });


  const handleStartLesson = (lessonId) => {
    router.push(`/lessondetails/${lessonId}`);
  };

  return (
    <div className={styles.lessonContainer}>
      <h1 className={styles.heading}>LESSONS</h1>

      <div className={styles.tabs}>
        <span
          className={`${activeTab === 'available' ? styles.active : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available
        </span>
        <span
          className={`${activeTab === 'complete' ? styles.active : ''}`}
          onClick={() => setActiveTab('complete')}
        >
          Complete
        </span>
      </div>

      <div className={styles.moduleTitle}>
        MODULE {levelId} | {currentLevel.toUpperCase()} LESSONS
      </div>

      <div className={styles.grid}>
        {lessonsData.map((lesson) => (
          <div className={styles.card} key={lesson.id}>
            <Image src={lesson.img} alt={lesson.title} width={400} height={200} />

            <div className={styles.cardContent}>
              <h3 className={styles.title}>{lesson.title}</h3>
              <p className={styles.desc}>{lesson.desc}</p>
              <button
                className={styles.startBtn}
                onClick={() => handleStartLesson(lesson.id)}
              >
                START LESSON
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

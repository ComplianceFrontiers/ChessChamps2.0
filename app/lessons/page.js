'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // ✅ for App Router
import styles from './Lessons.module.scss';

export default function Lessons() {
  const router = useRouter(); // ✅ init router
  const [activeTab, setActiveTab] = useState('available');
  const currentLevel = 'Pawn';

  const levelLessons = {
    Pawn: [
      "The Board and the Pieces",
      "How the Pieces Move",
      "Attack and Capture",
      "The Pawn",
      "Defending Check",
      "Mate in One",
      "Mate in Two",
      "Castling",
      "The Profitable Exchange",
      "The Two-Fold Attack",
      "Draws",
      "Mating with the Queen",
      "Capturing En Passant",
      "Winning Material",
      "Defending",
      "Defending Against Mate",
      "The Passed Pawn",
    ],
    Knight: [
      "Double Attack",
      "The Pin",
      "Eliminating the Defense",
      "The Three Golden Rules",
      "Mate in Two",
      "Mating with the Rook",
      "Discovered Attack",
      "Defending Against Mate",
      "The Intermediate Move",
      "Pawn Endings",
      "The Opening",
      "Route Planner",
      "Stalemate",
      "Winning Material",
    ],
    Bishop: [
      "The Opening",
      "Discovered and Double Check",
      "Attacking a Pinned Piece",
      "Meet After Gaining Access",
      "The Square of the Pawn",
      "Eliminating the Defense",
      "Defending Against a Double Attack",
      "Mini Plans",
      "Draws",
      "X-ray",
      "Defending Against a Pin",
      "Mobility",
      "Key Squares",
      "The Rook Pawn",
      "The Intermediate Move",
      "Vulnerability in the Opening",
      "Underpromotion",
      "Development",
      "Pinning",
      "Defending Against Mate",
      "The Discovered Attack",
    ],
    Rook: [
      "Opening Advantage",
      "Interfering",
      "Luring",
      "Blocking",
      "Thinking Ahead",
      "The Pin: Luring",
      "The Passed Pawn",
      "Eliminating the Defense",
      "The Magnet",
      "Weak Pawns",
      "Material Advantage",
      "Chasing and Targeting",
      "Attacking the King",
      "7th Rank",
      "Endgame Strategy",
      "Clearing",
      "Queen Against Pawn",
      "Draws",
      "Trapping",
    ],
    Queen: [
      "Material and Time",
      "Mate",
      "Breakthrough",
      "How to Use Pawns",
      "Pawn Race",
      "The 7th Rank",
      "Discovered Attack",
      "The Pin",
      "The Opening",
      "Rook Against Pawn",
      "Strong Square",
      "Defending",
      "Rook Ending",
      "Attacking the King",
      "Open File",
      "Draws",
      "Activity",
      "King in the Middle",
      "The Wrong Bishop",
      "Vulnerability",
      "Queen Endings",
      "Eternal Pins",
      "Bishop Against Pawns",
      "Zugzwang",
    ],
    King: [
      "King in the Middle",
      "The Passed Pawn",
      "Strategy",
      "Mobility",
      "Draws",
      "The Opening",
      "Tactics",
      "Pawn Endings",
      "Bishop or Knight",
      "Attacking the King",
      "Endgame Advantage",
      "Bishops",
      "Defending",
      "Rook Endings",
    ],
  };

const lessonsData = levelLessons[currentLevel].map((title, index) => ({
    id: index + 1,
    title: `Lesson ${index + 1}: ${title}`,
    length: `${5 + (index % 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    img: `/lessonimages/lesson2.png`,
  }));

  const handleStartLesson = (lessonId) => {
    // redirect to lesson details page
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

      <div className={styles.moduleTitle}>MODULE 1 | {currentLevel.toUpperCase()} LESSONS</div>

      <div className={styles.grid}>
        {lessonsData.map((lesson) => (
          <div className={styles.card} key={lesson.id}>
            <Image
              src={lesson.img}
              alt={lesson.title}
              width={300}
              height={160}
              className={styles.image}
            />
            <div className={styles.cardContent}>
              <p className={styles.length}>Length {lesson.length}</p>
              <h3 className={styles.title}>{lesson.title}</h3>
              <p className={styles.desc}>Learn and improve your chess skills with this lesson.</p>
              <button
                className={styles.startBtn}
                onClick={() => handleStartLesson(lesson.id)} // ✅ click handler
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
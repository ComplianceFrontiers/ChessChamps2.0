'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Lessons.module.scss';

export default function Lessons() {
  const [activeTab, setActiveTab] = useState('available');

  // Set current level (change this manually or link with a dropdown)
  const currentLevel = "Pawn";

  // All levels and their lessons
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

  // Map lessons for the selected level
  const lessonsData = levelLessons[currentLevel].map((title, index) => ({
    id: index + 1,
    title,
    category: 'Lesson',
    level: currentLevel,
    views: Math.floor(Math.random() * 200 + 50).toString(),
    type: 'Free',
    img: '/lessonimages/lesson2.png',
  }));

  const lessonsToDisplay = lessonsData;

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

      {lessonsToDisplay.length === 0 ? (
        <p style={{ color: 'white', textAlign: 'center' }}>No lessons to show.</p>
      ) : (
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
                  {activeTab === 'available' ? (
                    <button className={styles.completeBtn}>MARK COMPLETE</button>
                  ) : (
                    <span className={styles.completedLabel}>COMPLETED</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

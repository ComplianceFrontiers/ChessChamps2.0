"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./PracticeHome.module.scss";

const categoryStyles = {
  "Opening Fundamentals": styles.openingFundamentals,
  "Core Tactics": styles.openingFundamentals,
  "Defensive Concepts": styles.openingFundamentals,
  "Endgame Basics": styles.openingFundamentals,
  "Middlegame Strategy": styles.openingFundamentals,
};

// Each lesson now carries FENs for beginner/intermediate/advanced
const lessons = [
  {
    category: "Opening Fundamentals",
    items: [
      {
        number: 1,
        title: "The Opening Principles",
        fens: {
          beginner: [
            "7k/3Q3p/8/5K2/6p1/6P1/7P/8 w - - 0 1",
            "1rb5/4r3/3p1npb/3kp1P1/1P3P1P/5nR1/2Q1BK2/bN4NR w - - 3 61"
            
          ],
          intermediate: ["8/3r3k/NP1p4/p2QP1P1/1BB3Pp/1R4n1/6K1/5R2 w - - 5 82"],
          advanced: ["1nr1r3/n4Q2/P1kp2N1/2p3B1/1pp3P1/6P1/1R2P2R/K5N1 w - - 3 43"],
        },
      },
      {
        number: 2,
        title: "Development of Pieces",
        fens: {
          beginner: [
            "7k/3Q3p/8/5K2/6p1/6P1/7P/8 w - - 0 1",
            "1rb5/4r3/3p1npb/3kp1P1/1P3P1P/5nR1/2Q1BK2/bN4NR w - - 3 61"
            
          ],
          intermediate: ["8/3r3k/NP1p4/p2QP1P1/1BB3Pp/1R4n1/6K1/5R2 w - - 5 82"],
          advanced: ["1nr1r3/n4Q2/P1kp2N1/2p3B1/1pp3P1/6P1/1R2P2R/K5N1 w - - 3 43"],
        },
      },
      {
        number: 3,
        title: "Route Planner",
        fens: {
          beginner: [
            "7k/3Q3p/8/5K2/6p1/6P1/7P/8 w - - 0 1",
            "1rb5/4r3/3p1npb/3kp1P1/1P3P1P/5nR1/2Q1BK2/bN4NR w - - 3 61"
            
          ],
          intermediate: ["8/3r3k/NP1p4/p2QP1P1/1BB3Pp/1R4n1/6K1/5R2 w - - 5 82"],
          advanced: ["1nr1r3/n4Q2/P1kp2N1/2p3B1/1pp3P1/6P1/1R2P2R/K5N1 w - - 3 43"],
        },
      },
    ],
  },
  {
    category: "Core Tactics",
    items: [
      {
        number: 4,
        title: "The Pin",
        fens: {
          beginner: [
            "7k/3Q3p/8/5K2/6p1/6P1/7P/8 w - - 0 1",
            "1rb5/4r3/3p1npb/3kp1P1/1P3P1P/5nR1/2Q1BK2/bN4NR w - - 3 61"
            
          ],
          intermediate: ["8/3r3k/NP1p4/p2QP1P1/1BB3Pp/1R4n1/6K1/5R2 w - - 5 82"],
          advanced: ["1nr1r3/n4Q2/P1kp2N1/2p3B1/1pp3P1/6P1/1R2P2R/K5N1 w - - 3 43"],
        },
      },
      {
        number: 5,
        title: "Skewer",
        fens: {
          beginner: [
            "7k/3Q3p/8/5K2/6p1/6P1/7P/8 w - - 0 1",
            "1rb5/4r3/3p1npb/3kp1P1/1P3P1P/5nR1/2Q1BK2/bN4NR w - - 3 61"
            
          ],
          intermediate: ["8/3r3k/NP1p4/p2QP1P1/1BB3Pp/1R4n1/6K1/5R2 w - - 5 82"],
          advanced: ["1nr1r3/n4Q2/P1kp2N1/2p3B1/1pp3P1/6P1/1R2P2R/K5N1 w - - 3 43"],
        },
      },
    ],
  },
  {
    category: "Defensive Concepts",
    items: [
      {
        number: 8,
        title: "Defensive Move",
        fens: {
          beginner: [
            "7k/3Q3p/8/5K2/6p1/6P1/7P/8 w - - 0 1",
            "1rb5/4r3/3p1npb/3kp1P1/1P3P1P/5nR1/2Q1BK2/bN4NR w - - 3 61"
            
          ],
          intermediate: ["8/3r3k/NP1p4/p2QP1P1/1BB3Pp/1R4n1/6K1/5R2 w - - 5 82"],
          advanced: ["1nr1r3/n4Q2/P1kp2N1/2p3B1/1pp3P1/6P1/1R2P2R/K5N1 w - - 3 43"],
        },
      },
    ],
  },
  {
    category: "Endgame Basics",
    items: [
      {
        number: 14,
        title: "Mate in One",
        fens: {
          beginner: [
            "7k/3Q3p/8/5K2/6p1/6P1/7P/8 w - - 0 1",
            "1rb5/4r3/3p1npb/3kp1P1/1P3P1P/5nR1/2Q1BK2/bN4NR w - - 3 61"
            
          ],
          intermediate: ["8/3r3k/NP1p4/p2QP1P1/1BB3Pp/1R4n1/6K1/5R2 w - - 5 82"],
          advanced: ["1nr1r3/n4Q2/P1kp2N1/2p3B1/1pp3P1/6P1/1R2P2R/K5N1 w - - 3 43"],
        },
      },
      {
        number: 15,
        title: "Mate in Two",
        fens: {
          beginner: [
            "7k/3Q3p/8/5K2/6p1/6P1/7P/8 w - - 0 1",
            "1rb5/4r3/3p1npb/3kp1P1/1P3P1P/5nR1/2Q1BK2/bN4NR w - - 3 61"
            
          ],
          intermediate: ["8/3r3k/NP1p4/p2QP1P1/1BB3Pp/1R4n1/6K1/5R2 w - - 5 82"],
          advanced: ["1nr1r3/n4Q2/P1kp2N1/2p3B1/1pp3P1/6P1/1R2P2R/K5N1 w - - 3 43"],
        },
      },
    ],
  },
];

const PracticeHome = () => {
  const router = useRouter();

  const handleStartLesson = (fens, lessonTitle, level) => {
    if (!fens || fens.length === 0) return;
    const encodedFens = encodeURIComponent(fens.join(","));
    const encodedTitle = encodeURIComponent(`${lessonTitle} | ${level}`);
    router.push(`/practice?fens=${encodedFens}&title=${encodedTitle}`);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Practice</h1>
      <table className={styles.lessonTable}>
        <tbody>
          {lessons.map((section, index) => (
            <React.Fragment key={index}>
              <tr>
                <td
                  colSpan={5}
                  className={`${styles.category} ${
                    categoryStyles[section.category] || ""
                  }`}
                >
                  {section.category}
                </td>
              </tr>
              {section.items.map((lesson, idx) => (
                <tr key={idx}>
                  <td colSpan={2} className={styles.lessonTitle}>
                    Lesson {lesson.number}: {lesson.title}
                  </td>
                  <td colSpan={3} className={styles.buttonGroup}>
                    <button
                      className={styles.btn}
                      onClick={() =>
                        handleStartLesson(lesson.fens.beginner, lesson.title, "beginner")
                      }
                    >
                      Beginner
                    </button>
                    <button
                      className={styles.btn}
                      onClick={() =>
                        handleStartLesson(lesson.fens.intermediate, lesson.title, "intermediate")
                      }
                    >
                      Intermediate
                    </button>
                    <button
                      className={styles.btn}
                      onClick={() =>
                        handleStartLesson(lesson.fens.advanced, lesson.title, "advanced")
                      }
                    >
                      Advanced
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PracticeHome;

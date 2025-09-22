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
            "6k1/6pp/8/8/8/8/6PP/6KQ w - - 0 1",
            "6k1/6pp/6Q1/8/8/8/6PP/6K1 w - - 0 1"
          ],
          intermediate: ["rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"],
          advanced: ["r1bqkbnr/pppppppp/2n5/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 2"],
        },
      },
      {
        number: 2,
        title: "Development of Pieces",
        fens: {
          beginner: ["rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1"],
          intermediate: ["rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2"],
          advanced: ["r1bqkb1r/pppppppp/2n2n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 2 3"],
        },
      },
      {
        number: 3,
        title: "Route Planner",
        fens: {
          beginner: ["8/8/8/8/8/8/8/8 w - - 0 1"], // placeholder
          intermediate: ["8/8/8/8/8/8/8/8 w - - 0 1"], // placeholder
          advanced: ["8/8/8/8/8/8/8/8 w - - 0 1"], // placeholder
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
          beginner: ["rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/R1BQKBNR b KQkq - 0 1"],
          intermediate: ["r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 2 2"],
          advanced: ["r1bqkbnr/pppppppp/2n5/8/8/2N2N2/PPPPPPPP/R1BQKB1R b KQkq - 3 2"],
        },
      },
      {
        number: 5,
        title: "Skewer",
        fens: {
          beginner: ["8/8/8/8/8/8/8/8 w - - 0 1"],
          intermediate: ["8/8/8/8/8/8/8/8 w - - 0 1"],
          advanced: ["8/8/8/8/8/8/8/8 w - - 0 1"],
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
          beginner: ["8/8/8/8/8/8/8/8 w - - 0 1"],
          intermediate: ["8/8/8/8/8/8/8/8 w - - 0 1"],
          advanced: ["8/8/8/8/8/8/8/8 w - - 0 1"],
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
          beginner: ["6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1"],
          intermediate: ["6k1/6pp/8/8/8/8/5PPP/6K1 w - - 0 1"],
          advanced: ["6k1/8/8/8/8/8/5PPP/6K1 w - - 0 1"],
        },
      },
      {
        number: 15,
        title: "Mate in Two",
        fens: {
          beginner: ["6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1"],
          intermediate: ["6k1/6pp/8/8/8/8/5PPP/6K1 w - - 0 1"],
          advanced: ["6k1/8/8/8/8/8/5PPP/6K1 w - - 0 1"],
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

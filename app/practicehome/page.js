import React from "react";
import styles from "./PracticeHome.module.scss";

const lessons = [
  {
    category: "Opening Fundamentals",
    items: [
      { number: 1, title: "The Opening Principles", beginner: "Complete", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 2, title: "Development of Pieces", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 3, title: "Route Planner", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
    ],
  },
  {
    category: "Core Tactics",
    items: [
      { number: 4, title: "The Pin", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 5, title: "Skewer", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 6, title: "Double Attack", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 7, title: "Deflection", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
    ],
  },
  {
    category: "Defensive Concepts",
    items: [
      { number: 8, title: "Defensive Move", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 9, title: "Draws", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 10, title: "Stalemate", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
    ],
  },
  {
    category: "Endgame Basics",
    items: [
      { number: 11, title: "Back Rank Mate", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 12, title: "Smothered Mate", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 13, title: "Anastasia mate", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 14, title: "Mate in One", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 15, title: "Mate in Two", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 16, title: "Mating with the Rook", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 17, title: "Mating with the Queen", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 18, title: "The Passed Pawn", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      { number: 19, title: "Promotion", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
    ],
  },
  {
    category: "Middlegame Strategy",
    items: [
      { number: 20, title: "Winning Material", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
    ],
  },
];

const PracticeHome = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Practice</h1>
      <table className={styles.lessonTable}>
        <tbody>
          {lessons.map((section, index) => (
            <React.Fragment key={index}>
              <tr>
                <td colSpan={5} className={styles.category}>{section.category}</td>
              </tr>
              {section.items.map((lesson, idx) => (
                <tr key={idx}>
                  <td className={styles.lessonNumber}>Lesson - {lesson.number}</td>
                  <td className={styles.lessonTitle}>{lesson.title}</td>
                  <td>
                    <button className={lesson.beginner === "Complete" ? styles.completeBtn : styles.btn}>
                      {lesson.beginner}
                    </button>
                  </td>
                  <td><button className={styles.btn}>{lesson.intermediate}</button></td>
                  <td><button className={styles.btn}>{lesson.advanced}</button></td>
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

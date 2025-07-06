'use client';

import Link from "next/link";
import {
  School,
  BookOpenCheck,
  Puzzle,
  Monitor,
  Trophy,
  PieChart,
  Phone,
  Mail,
  LogOut,
} from "lucide-react";
import styles from './Home.module.scss';

export default function Home1() {
  const modules = [
    { name: "Training", path: "/training", icon: <School size={82} /> },
    { name: "Lessons", path: "/lessons", icon: <BookOpenCheck size={82} /> },
    { name: "Practice", path: "/practice", icon: <Puzzle size={82} /> },
    { name: "Online Learning", path: "/online-learning", icon: <Monitor size={82} /> },
    { name: "Tournaments", path: "/tournaments", icon: <Trophy size={82} /> },
    { name: "Performance", path: "/performance", icon: <PieChart size={82} /> },
    { name: "Support", path: "/support", icon: <Mail size={82}/> },
    { name: "Log Out", path: "/logout", icon: <LogOut size={82} /> },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.grid}>
        {modules.map((module, index) => (
          <Link key={index} href={module.path} className={styles.card}>
            {module.icon}
            <span>{module.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

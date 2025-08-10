'use client';

import Link from "next/link";
import Image from "next/image";
import {
  School,
  BookOpenCheck,
  Puzzle,
  Monitor,
  Trophy,
  PieChart,
  Mail,
  LogOut,
} from "lucide-react";
import styles from './Home.module.scss';

export default function Home1() {
  const modules = [
    { name: "Training", path: "/training", icon: <School size={82} /> },
    { name: "Lessons", path: "/lessons", icon: <BookOpenCheck size={82} /> },
    { name: "Practice", path: "/practicehome", icon: <Puzzle size={82} /> },
    { name: "Online Learning", path: "/online-learning", icon: <Monitor size={82} /> },
    { name: "Tournaments", path: "/tournaments", icon: <Trophy size={82} /> },
    { name: "Performance", path: "/performance", icon: <PieChart size={82} /> },
    { name: "Support", path: "/support", icon: <Mail size={82}/> },
    { name: "Log Out", path: "/logout", icon: <LogOut size={82} /> },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.topRightBlock}>
        <Image
          src="/chesschamps.png"
          alt="Chess Champs Logo"
          width={60}
          height={60}
          className={styles.dashboardLogo}
        />
        <Image
          src="/contentbelowlogo.png"
          alt="Chess Kids Playing"
          width={150}
          height={100}
          className={styles.belowLogo}
        />
      </div>
  
      <div className={styles.dashboardHeader}>
        <h1 className={styles.title}>Dashboard</h1>
      </div>
  
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

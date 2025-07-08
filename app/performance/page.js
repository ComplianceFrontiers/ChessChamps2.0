'use client';

import React, { useState } from 'react';
import styles from './Performance.module.scss';
import Classroom from '../components/Classroom'; 
import GameArena from '../components/GameArena'; 
import Tournament from '../components/Tournament.js'; 
import Quiz from '../components/Quiz.js'; 

const Performance = () => {
  const [activeTab, setActiveTab] = useState('overall');

  return (
    <div className={styles.performanceContainer}>
      <div className={styles.header}>
        <h1>Performance</h1>
      </div>

      <div className={styles.tabs}>
        <span
          className={activeTab === 'overall' ? styles.active : ''}
          onClick={() => setActiveTab('overall')}
        >
          Overall
        </span>
        <span
          className={activeTab === 'classroom' ? styles.active : ''}
          onClick={() => setActiveTab('classroom')}
        >
          Classroom
        </span>
        <span
          className={activeTab === 'quiz' ? styles.active : ''}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz
        </span>
        <span
          className={activeTab === 'gamearena' ? styles.active : ''}
          onClick={() => setActiveTab('gamearena')}
        >
          Game Area
        </span>
        <span
          className={activeTab === 'tournament' ? styles.active : ''}
          onClick={() => setActiveTab('tournament')}
        >
          Tournament
        </span>
      </div>

      {/* Render based on activeTab */}
      {activeTab === 'overall' && (
        <div>
          <div className={styles.section}>
            <h2>Classroom</h2>
            <div className={styles.card}>
              <div className={styles.left}>
                <div className={styles.statBig}>0%</div>
                <div>Attendance</div>
              </div>
              <div className={styles.right}>
                <div>Total classes attended: 0</div>
                <div>Total hours spent in classroom: 0</div>
                <div>Total leaderboard points: 0</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Quiz</h2>
            <div className={styles.card}>
              <div className={styles.left}>
                <div className={styles.statBig}>0 / 0</div>
                <div>Total quizzes completed</div>
              </div>
              <div className={styles.right}>
                <div>Total problems solved: 0</div>
                <div>Total time taken: -</div>
                <div>Total points scored: 0</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Game Arena</h2>
            <div className={styles.card}>
              <div className={styles.left}>
                <div>Total games played: 0</div>
                <div>Total time spent playing: -</div>
              </div>
              <div className={styles.middle}>
                <div>Wins: 0 (0%)</div>
                <div>Lost: 0 (0%)</div>
                <div>Draw: 0 (0%)</div>
              </div>
              <div className={styles.chartBox}>
                <div className={styles.chartLegend}><span className={styles.green}></span> Win: 0 | 0%</div>
                <div className={styles.chartLegend}><span className={styles.red}></span> Lost: 0 | 0%</div>
                <div className={styles.chartLegend}><span className={styles.yellow}></span> Draw: 0 | 0%</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Tournament</h2>
            <div className={styles.card}>
              <div className={styles.left}>
                <div>Total games played: 0</div>
                <div>Total time spent playing: -</div>
              </div>
              <div className={styles.middle}>
                <div>Wins: 0 (0%)</div>
                <div>Lost: 0 (0%)</div>
                <div>Draw: 0 (0%)</div>
              </div>
              <div className={styles.chartBox}>
                <div className={styles.chartLegend}><span className={styles.green}></span> Win: 0 | 0%</div>
                <div className={styles.chartLegend}><span className={styles.red}></span> Lost: 0 | 0%</div>
                <div className={styles.chartLegend}><span className={styles.yellow}></span> Draw: 0 | 0%</div>
              </div>
            </div>

            <div className={styles.rankingBox}>
              <div className={styles.rankingItem}>🥈<div>2nd</div><div>0</div></div>
              <div className={styles.rankingItem}>🥇<div>1st</div><div>0</div></div>
              <div className={styles.rankingItem}>🥉<div>3rd</div><div>0</div></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'classroom' && <Classroom />}
      {activeTab === 'gamearena' && <GameArena />}
      {activeTab === 'quiz' && <Quiz />}
      {activeTab === 'tournament' && <Tournament />}
    </div>
  );
};

export default Performance;

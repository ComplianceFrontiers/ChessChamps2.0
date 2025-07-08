'use client';

import React from 'react';
import styles from './GameArena.module.scss'; // You can customize the styles here
import { Medal, Clock } from 'lucide-react';

const GameArena = () => {
  return (
    <div className={styles.gameArenaContainer}>
      <h2 className={styles.sectionTitle}>Performance</h2>

      <div className={styles.topStats}>
        <div className={styles.cardLeft}>
          <h3>Total games</h3>
          <div className={styles.bigStat}>0</div>
          <div className={styles.bottomStats}>
            <span>Total wins: 0</span>
            <span>Total lost: 0</span>
            <span>Total drawn: 0</span>
          </div>
        </div>
        <div className={styles.cardRight}>
          <h3>Total time spent playing</h3>
          <div className={styles.time}>–</div>
          <Clock size={40} />
        </div>
      </div>

      <div className={styles.section}>
        <h3>Total games with white</h3>
        <div className={styles.breakdown}>
          <div>
            <p>Total games</p>
            <p className={styles.statValue}>0</p>
            <p>Total wins</p>
            <p>Total lost</p>
            <p>Total drawn</p>
          </div>
          <div>
            <p>Game</p>
            <p>0</p>
            <p>0</p>
            <p>0</p>
          </div>
          <div>
            <p>Percentage</p>
            <p>0%</p>
            <p>0%</p>
            <p>0%</p>
          </div>
          <div className={styles.chartIcon}>
            <Medal />
            <p>Charts</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Total games with black</h3>
        <div className={styles.breakdown}>
          <div>
            <p>Total games</p>
            <p className={styles.statValue}>0</p>
            <p>Total wins</p>
            <p>Total lost</p>
            <p>Total drawn</p>
          </div>
          <div>
            <p>Game</p>
            <p>0</p>
            <p>0</p>
            <p>0</p>
          </div>
          <div>
            <p>Percentage</p>
            <p>0%</p>
            <p>0%</p>
            <p>0%</p>
          </div>
          <div className={styles.chartIcon}>
            <Medal />
            <p>Charts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameArena;

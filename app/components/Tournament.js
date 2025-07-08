'use client';

import React from 'react';
import styles from './Tournament.module.scss';
import { Trophy, Clock, Medal } from 'lucide-react';

const Tournament = () => {
  return (
    <div className={styles.tournamentContainer}>
      <h2>Performance</h2>
      <div className={styles.topStats}>
        <div className={styles.leftCard}>
          <h3>Total games</h3>
          <p className={styles.bigStat}>0</p>
          <div className={styles.bottom}>
            <span>Total wins: 0</span>
            <span>Total lost: 0</span>
            <span>Total drawn: 0</span>
          </div>
        </div>
        <div className={styles.rightCard}>
          <h3>Total time spent playing</h3>
          <div className={styles.time}>–</div>
          <Clock size={40} />
        </div>
      </div>

      <h2 className={styles.subHeader}>Tournament rankings</h2>
      <div className={styles.rankings}>
        <div className={styles.rankBox}>🥈<div>2nd</div><div>0</div></div>
        <div className={styles.rankBox}>🥇<div>1st</div><div>0</div></div>
        <div className={styles.rankBox}>🥉<div>3rd</div><div>0</div></div>
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
          <div className={styles.legend}>
            <div><span className={styles.green}></span> Win: 0 | 0%</div>
            <div><span className={styles.red}></span> Lost: 0 | 0%</div>
            <div><span className={styles.yellow}></span> Draw: 0 | 0%</div>
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
          <div className={styles.legend}>
            <div><span className={styles.green}></span> Win: 0 | 0%</div>
            <div><span className={styles.red}></span> Lost: 0 | 0%</div>
            <div><span className={styles.yellow}></span> Draw: 0 | 0%</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Best performances</h3>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Tournament name</div>
            <div>Final ranking</div>
            <div>Points scored</div>
            <div>Date</div>
          </div>
          <div className={styles.noData}>🪑 No Data</div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Bad performances</h3>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Tournament name</div>
            <div>Final ranking</div>
            <div>Points scored</div>
            <div>Date</div>
          </div>
          <div className={styles.noData}>🪑 No Data</div>
        </div>
      </div>
    </div>
  );
};

export default Tournament;

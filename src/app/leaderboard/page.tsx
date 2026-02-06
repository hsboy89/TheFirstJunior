'use client';

import Sidebar from '@/components/Sidebar';
import styles from './leaderboard.module.css';

// Sample leaderboard data
const leaderboardData = [
    { rank: 1, name: '김영웅', level: 15, xp: 2450, badge: '🥇' },
    { rank: 2, name: '이지혜', level: 14, xp: 2280, badge: '🥈' },
    { rank: 3, name: '최민준', level: 14, xp: 2150, badge: '🥉' },
    { rank: 4, name: '박서연', level: 13, xp: 1980, badge: '⭐' },
    { rank: 5, name: '정우진', level: 13, xp: 1850, badge: '⭐' },
    { rank: 6, name: '한소희', level: 12, xp: 1720, badge: '' },
    { rank: 7, name: '박민수', level: 12, xp: 1240, badge: '', isMe: true },
    { rank: 8, name: '김하늘', level: 11, xp: 1180, badge: '' },
    { rank: 9, name: '이준호', level: 11, xp: 1050, badge: '' },
    { rank: 10, name: '송유나', level: 10, xp: 980, badge: '' },
];

export default function LeaderboardPage() {
    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>📊 리더보드</h1>
                    <p className={styles.subtitle}>최고의 학습자를 확인하세요!</p>
                </header>

                {/* Top 3 Podium */}
                <div className={styles.podium}>
                    <div className={styles.podiumItem} data-rank="2">
                        <div className={styles.podiumAvatar}>🥈</div>
                        <p className={styles.podiumName}>{leaderboardData[1].name}</p>
                        <p className={styles.podiumXP}>{leaderboardData[1].xp} XP</p>
                        <div className={styles.podiumBase}></div>
                    </div>

                    <div className={styles.podiumItem} data-rank="1">
                        <div className={styles.crown}>👑</div>
                        <div className={styles.podiumAvatar}>🥇</div>
                        <p className={styles.podiumName}>{leaderboardData[0].name}</p>
                        <p className={styles.podiumXP}>{leaderboardData[0].xp} XP</p>
                        <div className={styles.podiumBase}></div>
                    </div>

                    <div className={styles.podiumItem} data-rank="3">
                        <div className={styles.podiumAvatar}>🥉</div>
                        <p className={styles.podiumName}>{leaderboardData[2].name}</p>
                        <p className={styles.podiumXP}>{leaderboardData[2].xp} XP</p>
                        <div className={styles.podiumBase}></div>
                    </div>
                </div>

                {/* Rankings List */}
                <div className={styles.rankingsList}>
                    {leaderboardData.slice(3).map((user) => (
                        <div
                            key={user.rank}
                            className={`${styles.rankingItem} ${user.isMe ? styles.myRank : ''}`}
                        >
                            <span className={styles.rankNumber}>{user.rank}</span>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{user.name}</span>
                                <span className={styles.userLevel}>LV. {user.level}</span>
                            </div>
                            <span className={styles.userXP}>{user.xp.toLocaleString()} XP</span>
                            {user.isMe && <span className={styles.meTag}>나</span>}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

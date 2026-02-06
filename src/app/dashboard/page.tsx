'use client';

import Sidebar from '@/components/Sidebar';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>마이 페이지</h1>
                    <div className={styles.headerRight}>
                        <div className={styles.pointsBadge}>
                            <span className={styles.pointsIcon}>⭐</span>
                            <span className={styles.pointsValue}>1,240 Pts</span>
                        </div>
                        <button className={styles.notificationBtn}>
                            🔔
                        </button>
                    </div>
                </header>

                {/* Content Grid */}
                <div className={styles.grid}>
                    {/* Today's Progress Card */}
                    <div className={styles.progressCard}>
                        <h2 className={styles.cardTitle}>오늘의 학습 현황</h2>

                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>리딩</span>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: '80%' }}></div>
                                </div>
                                <span className={styles.statValue}>80%</span>
                            </div>

                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>퀴즈</span>
                                <span className={styles.quizScore}>2/5</span>
                            </div>
                        </div>

                        {/* Character Illustration */}
                        <div className={styles.illustration}>
                            <div className={styles.illustrationPlaceholder}>
                                <span className={styles.characterEmoji}>📚✨</span>
                                <p>열심히 공부하는 중!</p>
                            </div>
                        </div>
                    </div>

                    {/* Level Progress Card */}
                    <div className={styles.levelCard}>
                        <h2 className={styles.cardTitle}>다음 레벨까지</h2>
                        <p className={styles.levelSubtext}>240 XP가 더 필요해요!</p>

                        <div className={styles.levelProgress}>
                            <div className={styles.levelLabels}>
                                <span>LV. 12</span>
                                <span>LV. 13</span>
                            </div>
                            <div className={styles.levelBar}>
                                <div className={styles.levelFill} style={{ width: '60%' }}></div>
                            </div>
                        </div>

                        <button className={styles.rankingBtn}>
                            랭킹 확인하기
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActions}>
                    <h2 className={styles.sectionTitle}>오늘의 추천 학습</h2>
                    <div className={styles.actionCards}>
                        <div className={styles.actionCard} style={{ background: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)' }}>
                            <span className={styles.actionIcon}>📖</span>
                            <h3>Unit 15</h3>
                            <p>The Amazing Animals</p>
                        </div>
                        <div className={styles.actionCard} style={{ background: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)' }}>
                            <span className={styles.actionIcon}>💎</span>
                            <h3>단어 복습</h3>
                            <p>12개 단어 대기중</p>
                        </div>
                        <div className={styles.actionCard} style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' }}>
                            <span className={styles.actionIcon}>🏆</span>
                            <h3>퀴즈 도전</h3>
                            <p>3개 퀴즈 남음</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

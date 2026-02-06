'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import styles from './reading.module.css';

// Sample unit data
const sampleUnits = [
    { id: 1, title: 'The Amazing Animals', module: 1, completed: true, progress: 100 },
    { id: 2, title: 'My Family Tree', module: 1, completed: true, progress: 100 },
    { id: 3, title: 'A Day at School', module: 1, completed: false, progress: 60 },
    { id: 4, title: 'Weather and Seasons', module: 2, completed: false, progress: 0 },
    { id: 5, title: 'Food Around the World', module: 2, completed: false, progress: 0 },
    { id: 6, title: 'My Neighborhood', module: 2, completed: false, progress: 0 },
];

export default function ReadingPage() {
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>📚 리딩 아카이브</h1>
                    <p className={styles.subtitle}>재미있는 영어 이야기를 읽어보세요!</p>
                </header>

                <div className={styles.unitsGrid}>
                    {sampleUnits.map((unit) => (
                        <div
                            key={unit.id}
                            className={`${styles.unitCard} ${unit.completed ? styles.completed : ''}`}
                            onClick={() => setSelectedUnit(unit.id)}
                        >
                            <div className={styles.unitHeader}>
                                <span className={styles.moduleTag}>Module {unit.module}</span>
                                {unit.completed && <span className={styles.checkMark}>✓</span>}
                            </div>
                            <h3 className={styles.unitTitle}>Unit {unit.id}</h3>
                            <p className={styles.unitName}>{unit.title}</p>
                            <div className={styles.progressWrapper}>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${unit.progress}%` }}
                                    ></div>
                                </div>
                                <span className={styles.progressText}>{unit.progress}%</span>
                            </div>
                            <button className={styles.startBtn}>
                                {unit.completed ? '다시 읽기' : unit.progress > 0 ? '이어 읽기' : '시작하기'}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

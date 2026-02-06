'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import styles from './vocabulary.module.css';

// Sample vocabulary data
const sampleVocab = [
    { id: 1, word: 'adventure', meaning: '모험', example: 'Going to the jungle is an adventure.', mastered: true },
    { id: 2, word: 'curious', meaning: '호기심이 많은', example: 'The curious cat explored the garden.', mastered: true },
    { id: 3, word: 'discover', meaning: '발견하다', example: 'Scientists discover new things every day.', mastered: false },
    { id: 4, word: 'explore', meaning: '탐험하다', example: 'We love to explore new places.', mastered: false },
    { id: 5, word: 'imagine', meaning: '상상하다', example: 'Close your eyes and imagine a beautiful beach.', mastered: false },
    { id: 6, word: 'wonderful', meaning: '멋진, 훌륭한', example: 'What a wonderful surprise!', mastered: false },
];

export default function VocabularyPage() {
    const [activeCard, setActiveCard] = useState<number | null>(null);
    const [showMeaning, setShowMeaning] = useState(false);

    const handleCardClick = (id: number) => {
        if (activeCard === id) {
            setShowMeaning(!showMeaning);
        } else {
            setActiveCard(id);
            setShowMeaning(false);
        }
    };

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>💎 단어 보물창고</h1>
                    <p className={styles.subtitle}>오늘의 단어를 마스터하세요!</p>

                    <div className={styles.stats}>
                        <div className={styles.statBox}>
                            <span className={styles.statValue}>{sampleVocab.filter(v => v.mastered).length}</span>
                            <span className={styles.statLabel}>마스터</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statValue}>{sampleVocab.filter(v => !v.mastered).length}</span>
                            <span className={styles.statLabel}>학습 중</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statValue}>{sampleVocab.length}</span>
                            <span className={styles.statLabel}>전체</span>
                        </div>
                    </div>
                </header>

                <div className={styles.vocabGrid}>
                    {sampleVocab.map((vocab) => (
                        <div
                            key={vocab.id}
                            className={`${styles.vocabCard} ${vocab.mastered ? styles.mastered : ''} ${activeCard === vocab.id ? styles.active : ''}`}
                            onClick={() => handleCardClick(vocab.id)}
                        >
                            <div className={styles.cardFront}>
                                <span className={styles.wordNumber}>#{vocab.id}</span>
                                <h3 className={styles.word}>{vocab.word}</h3>
                                <p className={styles.hint}>👆 탭하여 뜻 보기</p>
                                {vocab.mastered && <span className={styles.masteredBadge}>✓ 마스터</span>}
                            </div>

                            {activeCard === vocab.id && (
                                <div className={styles.cardBack}>
                                    <p className={styles.meaning}>{vocab.meaning}</p>
                                    <p className={styles.example}>"{vocab.example}"</p>
                                    <div className={styles.cardActions}>
                                        <button className={styles.speakBtn}>🔊 발음 듣기</button>
                                        <button className={styles.masterBtn}>
                                            {vocab.mastered ? '복습 완료!' : '마스터!'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.practiceSection}>
                    <button className={styles.practiceBtn}>
                        🎯 단어 테스트 시작하기
                    </button>
                </div>
            </main>
        </div>
    );
}

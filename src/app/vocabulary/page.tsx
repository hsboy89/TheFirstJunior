'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase, Unit, VocabItem } from '@/lib/supabase';
import styles from './vocabulary.module.css';

interface UnitWithVocab extends Unit {
    unit_contents?: {
        vocab: VocabItem[];
    };
}

const grades = [
    { id: 1, name: 'Grade 3', label: '3학년' },
    { id: 2, name: 'Grade 4', label: '4학년' },
    { id: 3, name: 'Grade 5', label: '5학년' },
    { id: 4, name: 'Grade 6', label: '6학년' },
];

export default function VocabularyPage() {
    const [selectedGrade, setSelectedGrade] = useState(1);
    const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
    const [units, setUnits] = useState<UnitWithVocab[]>([]);
    const [vocabulary, setVocabulary] = useState<VocabItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCard, setActiveCard] = useState<number | null>(null);

    useEffect(() => {
        fetchUnits();
    }, [selectedGrade]);

    useEffect(() => {
        if (selectedUnitId) {
            const unit = units.find(u => u.id === selectedUnitId);
            if (unit?.unit_contents?.vocab) {
                setVocabulary(unit.unit_contents.vocab);
            }
        }
    }, [selectedUnitId, units]);

    const fetchUnits = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('units')
            .select(`
                *,
                unit_contents (vocab)
            `)
            .eq('level_id', selectedGrade)
            .order('order_no');

        if (!error && data) {
            setUnits(data);
            if (data.length > 0) {
                setSelectedUnitId(data[0].id);
            }
        }
        setLoading(false);
    };

    const handleCardClick = (index: number) => {
        setActiveCard(activeCard === index ? null : index);
    };

    const speakWord = (word: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            speechSynthesis.speak(utterance);
        }
    };

    const selectedUnit = units.find(u => u.id === selectedUnitId);

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>💎 단어 보물창고</h1>
                    <p className={styles.subtitle}>오늘의 단어를 마스터하세요!</p>

                    {/* 학년 선택 탭 */}
                    <div className={styles.gradeTabs}>
                        {grades.map((grade) => (
                            <button
                                key={grade.id}
                                className={`${styles.gradeTab} ${selectedGrade === grade.id ? styles.activeTab : ''}`}
                                onClick={() => setSelectedGrade(grade.id)}
                            >
                                {grade.label}
                            </button>
                        ))}
                    </div>

                    {/* 유닛 선택 */}
                    {!loading && units.length > 0 && (
                        <div className={styles.unitSelector}>
                            <select
                                value={selectedUnitId || ''}
                                onChange={(e) => setSelectedUnitId(Number(e.target.value))}
                                className={styles.unitSelect}
                            >
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        Unit {unit.order_no}: {unit.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className={styles.stats}>
                        <div className={styles.statBox}>
                            <span className={styles.statValue}>{vocabulary.length}</span>
                            <span className={styles.statLabel}>단어 수</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statValue}>{selectedUnit?.title || '-'}</span>
                            <span className={styles.statLabel}>현재 유닛</span>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className={styles.loading}>로딩 중...</div>
                ) : (
                    <div className={styles.vocabGrid}>
                        {vocabulary.map((vocab, index) => (
                            <div
                                key={index}
                                className={`${styles.vocabCard} ${activeCard === index ? styles.active : ''}`}
                                onClick={() => handleCardClick(index)}
                            >
                                <div className={styles.cardFront}>
                                    <span className={styles.wordNumber}>#{index + 1}</span>
                                    <h3 className={styles.word}>{vocab.word}</h3>
                                    <p className={styles.hint}>👆 탭하여 뜻 보기</p>
                                </div>

                                {activeCard === index && (
                                    <div className={styles.cardBack}>
                                        <p className={styles.meaning}>{vocab.meaning}</p>
                                        <p className={styles.example}>"{vocab.example}"</p>
                                        <div className={styles.cardActions}>
                                            <button
                                                className={styles.speakBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    speakWord(vocab.word);
                                                }}
                                            >
                                                🔊 발음 듣기
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase, Unit } from '@/lib/supabase';
import styles from './reading.module.css';

interface UnitWithContent extends Unit {
    unit_contents?: {
        reading_text: string;
    };
}

const grades = [
    { id: 1, name: 'Grade 3', label: '3학년' },
    { id: 2, name: 'Grade 4', label: '4학년' },
    { id: 3, name: 'Grade 5', label: '5학년' },
    { id: 4, name: 'Grade 6', label: '6학년' },
];

export default function ReadingPage() {
    const [selectedGrade, setSelectedGrade] = useState(1);
    const [units, setUnits] = useState<UnitWithContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUnit, setSelectedUnit] = useState<UnitWithContent | null>(null);

    useEffect(() => {
        fetchUnits();
    }, [selectedGrade]);

    const fetchUnits = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('units')
            .select(`
                *,
                unit_contents (reading_text)
            `)
            .eq('level_id', selectedGrade)
            .order('order_no');

        if (!error && data) {
            setUnits(data);
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>📚 리딩 아카이브</h1>
                    <p className={styles.subtitle}>재미있는 영어 이야기를 읽어보세요!</p>

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
                </header>

                {loading ? (
                    <div className={styles.loading}>로딩 중...</div>
                ) : selectedUnit ? (
                    <div className={styles.readingView}>
                        <button className={styles.backBtn} onClick={() => setSelectedUnit(null)}>
                            ← 목록으로
                        </button>
                        <h2 className={styles.readingTitle}>
                            Unit {selectedUnit.order_no}: {selectedUnit.title}
                        </h2>
                        <div className={styles.readingContent}>
                            {selectedUnit.unit_contents?.reading_text || '콘텐츠를 불러오는 중...'}
                        </div>
                    </div>
                ) : (
                    <div className={styles.unitsGrid}>
                        {units.map((unit) => (
                            <div
                                key={unit.id}
                                className={styles.unitCard}
                                onClick={() => setSelectedUnit(unit)}
                            >
                                <div className={styles.unitHeader}>
                                    <span className={styles.moduleTag}>Module {unit.module_no}</span>
                                </div>
                                <h3 className={styles.unitTitle}>Unit {unit.order_no}</h3>
                                <p className={styles.unitName}>{unit.title}</p>
                                <button className={styles.startBtn}>
                                    읽기 시작
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

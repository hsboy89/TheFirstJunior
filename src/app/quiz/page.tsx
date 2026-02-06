'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase, Quiz } from '@/lib/supabase';
import styles from './quiz.module.css';

interface QuizWithUnit extends Quiz {
    units?: {
        title: string;
        order_no: number;
    };
}

const grades = [
    { id: 1, name: 'Grade 3', label: '3학년' },
    { id: 2, name: 'Grade 4', label: '4학년' },
    { id: 3, name: 'Grade 5', label: '5학년' },
    { id: 4, name: 'Grade 6', label: '6학년' },
];

export default function QuizPage() {
    const [selectedGrade, setSelectedGrade] = useState(1);
    const [quizzes, setQuizzes] = useState<QuizWithUnit[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);

    useEffect(() => {
        fetchQuizzes();
    }, [selectedGrade]);

    const fetchQuizzes = async () => {
        setLoading(true);
        setCurrentQuestion(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsAnswered(false);

        const { data, error } = await supabase
            .from('quizzes')
            .select(`
                *,
                units!inner (title, order_no, level_id)
            `)
            .eq('units.level_id', selectedGrade)
            .order('id')
            .limit(10);

        if (!error && data) {
            setQuizzes(data);
        }
        setLoading(false);
    };

    const handleAnswerSelect = (answer: string) => {
        if (isAnswered) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        const correctAnswer = quizzes[currentQuestion].answer.toLowerCase();
        if (answer.toLowerCase() === correctAnswer ||
            answer.toLowerCase() === 'true' && correctAnswer === 'true' ||
            answer.toLowerCase() === 'false' && correctAnswer === 'false') {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < quizzes.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    const handleRestart = () => {
        fetchQuizzes();
    };

    const current = quizzes[currentQuestion];
    const options = current?.options?.length > 0
        ? current.options
        : ['True', 'False'];

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>🏆 도전! 퀴즈왕</h1>

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

                    {!loading && quizzes.length > 0 && !showResult && (
                        <div className={styles.progress}>
                            <span>문제 {currentQuestion + 1} / {quizzes.length}</span>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${((currentQuestion + 1) / quizzes.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </header>

                {loading ? (
                    <div className={styles.loading}>로딩 중...</div>
                ) : quizzes.length === 0 ? (
                    <div className={styles.noQuiz}>이 학년에는 아직 퀴즈가 없습니다.</div>
                ) : !showResult ? (
                    <div className={styles.quizCard}>
                        <div className={styles.questionNumber}>Q{currentQuestion + 1}</div>
                        <h2 className={styles.question}>{current.question}</h2>

                        <div className={styles.options}>
                            {options.map((option: string, index: number) => (
                                <button
                                    key={index}
                                    className={`${styles.optionBtn} 
                                        ${selectedAnswer === option ? styles.selected : ''} 
                                        ${isAnswered && option.toLowerCase() === current.answer.toLowerCase() ? styles.correct : ''}
                                        ${isAnswered && selectedAnswer === option && option.toLowerCase() !== current.answer.toLowerCase() ? styles.wrong : ''}
                                    `}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={isAnswered}
                                >
                                    <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
                                    <span className={styles.optionText}>{option}</span>
                                </button>
                            ))}
                        </div>

                        {isAnswered && (
                            <div className={styles.feedback}>
                                {selectedAnswer?.toLowerCase() === current.answer.toLowerCase() ? (
                                    <p className={styles.correctFeedback}>🎉 정답입니다! +10 XP</p>
                                ) : (
                                    <p className={styles.wrongFeedback}>❌ 아쉬워요! 정답: {current.answer}</p>
                                )}
                                <button className={styles.nextBtn} onClick={handleNext}>
                                    {currentQuestion < quizzes.length - 1 ? '다음 문제 →' : '결과 보기'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.resultCard}>
                        <div className={styles.resultEmoji}>
                            {score === quizzes.length ? '🏆' : score >= quizzes.length / 2 ? '🎉' : '💪'}
                        </div>
                        <h2 className={styles.resultTitle}>퀴즈 완료!</h2>
                        <p className={styles.resultScore}>
                            {quizzes.length}문제 중 <strong>{score}문제</strong> 정답!
                        </p>
                        <p className={styles.resultXP}>획득 XP: +{score * 10}</p>
                        <button className={styles.restartBtn} onClick={handleRestart}>
                            다시 도전하기
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

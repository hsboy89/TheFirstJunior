'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import styles from './quiz.module.css';

// Sample quiz data
const sampleQuiz = [
    {
        id: 1,
        question: 'What does "adventure" mean in Korean?',
        options: ['여행', '모험', '운동', '공부'],
        answer: '모험',
    },
    {
        id: 2,
        question: 'Choose the correct word: The cat is very ___. It always wants to know new things.',
        options: ['sleepy', 'curious', 'angry', 'sad'],
        answer: 'curious',
    },
    {
        id: 3,
        question: 'Which sentence is correct?',
        options: [
            'She go to school yesterday.',
            'She went to school yesterday.',
            'She going to school yesterday.',
            'She goes to school yesterday.',
        ],
        answer: 'She went to school yesterday.',
    },
];

export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleAnswerSelect = (answer: string) => {
        if (isAnswered) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        if (answer === sampleQuiz[currentQuestion].answer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < sampleQuiz.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResult(false);
        setIsAnswered(false);
    };

    const current = sampleQuiz[currentQuestion];

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>🏆 도전! 퀴즈왕</h1>
                    <div className={styles.progress}>
                        <span>문제 {currentQuestion + 1} / {sampleQuiz.length}</span>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${((currentQuestion + 1) / sampleQuiz.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </header>

                {!showResult ? (
                    <div className={styles.quizCard}>
                        <div className={styles.questionNumber}>Q{currentQuestion + 1}</div>
                        <h2 className={styles.question}>{current.question}</h2>

                        <div className={styles.options}>
                            {current.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`${styles.optionBtn} 
                    ${selectedAnswer === option ? styles.selected : ''} 
                    ${isAnswered && option === current.answer ? styles.correct : ''}
                    ${isAnswered && selectedAnswer === option && option !== current.answer ? styles.wrong : ''}
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
                                {selectedAnswer === current.answer ? (
                                    <p className={styles.correctFeedback}>🎉 정답입니다! +10 XP</p>
                                ) : (
                                    <p className={styles.wrongFeedback}>❌ 아쉬워요! 정답: {current.answer}</p>
                                )}
                                <button className={styles.nextBtn} onClick={handleNext}>
                                    {currentQuestion < sampleQuiz.length - 1 ? '다음 문제 →' : '결과 보기'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.resultCard}>
                        <div className={styles.resultEmoji}>
                            {score === sampleQuiz.length ? '🏆' : score >= sampleQuiz.length / 2 ? '🎉' : '💪'}
                        </div>
                        <h2 className={styles.resultTitle}>퀴즈 완료!</h2>
                        <p className={styles.resultScore}>
                            {sampleQuiz.length}문제 중 <strong>{score}문제</strong> 정답!
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

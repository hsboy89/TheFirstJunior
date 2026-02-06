'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import styles from './grammar.module.css';

// Sample grammar data
const grammarTopics = [
    {
        id: 1,
        title: 'Present Simple (현재 시제)',
        description: '매일 하는 일, 습관, 사실을 표현해요',
        examples: ['I go to school.', 'She plays tennis.', 'They eat breakfast.'],
        completed: true,
    },
    {
        id: 2,
        title: 'Past Simple (과거 시제)',
        description: '이미 끝난 일을 표현해요',
        examples: ['I went to school.', 'She played tennis.', 'They ate breakfast.'],
        completed: false,
    },
    {
        id: 3,
        title: 'Can / Cannot (능력)',
        description: '할 수 있는 것과 없는 것을 표현해요',
        examples: ['I can swim.', 'She cannot fly.', 'Can you help me?'],
        completed: false,
    },
    {
        id: 4,
        title: 'Comparative (비교급)',
        description: '두 가지를 비교할 때 사용해요',
        examples: ['This is bigger than that.', 'She is taller than me.'],
        completed: false,
    },
];

export default function GrammarPage() {
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>🔮 문법 시크릿</h1>
                    <p className={styles.subtitle}>영어 문법의 비밀을 풀어보세요!</p>
                </header>

                <div className={styles.topicsGrid}>
                    {grammarTopics.map((topic) => (
                        <div
                            key={topic.id}
                            className={`${styles.topicCard} ${topic.completed ? styles.completed : ''} ${selectedTopic === topic.id ? styles.expanded : ''}`}
                            onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                        >
                            <div className={styles.topicHeader}>
                                <div className={styles.topicNumber}>{topic.id}</div>
                                <div className={styles.topicInfo}>
                                    <h3 className={styles.topicTitle}>{topic.title}</h3>
                                    <p className={styles.topicDesc}>{topic.description}</p>
                                </div>
                                {topic.completed && <span className={styles.completedBadge}>✓</span>}
                            </div>

                            {selectedTopic === topic.id && (
                                <div className={styles.examples}>
                                    <h4>예문 Examples</h4>
                                    <ul>
                                        {topic.examples.map((example, idx) => (
                                            <li key={idx}>
                                                <span className={styles.exampleIcon}>💬</span>
                                                {example}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={styles.learnBtn}>
                                        {topic.completed ? '복습하기' : '학습 시작'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

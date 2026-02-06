'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

// 샘플 계정 정보
const SAMPLE_CREDENTIALS = {
    email: 'student@edupulse.com',
    password: '1234'
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // 샘플 계정 자동 입력
    const fillSampleCredentials = () => {
        setEmail(SAMPLE_CREDENTIALS.email);
        setPassword(SAMPLE_CREDENTIALS.password);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // 샘플 계정 체크 (Supabase 연동 전 임시)
        if (email === SAMPLE_CREDENTIALS.email && password === SAMPLE_CREDENTIALS.password) {
            setTimeout(() => {
                router.push('/dashboard');
            }, 800);
        } else {
            setIsLoading(false);
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className={styles.container}>
            {/* Background with books pattern */}
            <div className={styles.background}>
                <div className={styles.overlay}></div>
            </div>

            {/* Login Card */}
            <div className={styles.card}>
                {/* Rocket Icon */}
                <div className={styles.iconWrapper}>
                    <div className={styles.rocketIcon}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L13.09 8.26L19 9L14.14 12.14L15.64 18.36L12 15L8.36 18.36L9.86 12.14L5 9L10.91 8.26L12 2Z" fill="white" />
                            <path d="M12 5L12.76 8.87L16.5 9.32L13.38 11.38L14.26 15.18L12 13.5L9.74 15.18L10.62 11.38L7.5 9.32L11.24 8.87L12 5Z" fill="white" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className={styles.title}>The First Junior!</h1>
                <p className={styles.subtitle}>초등학생 전문 학습 플랫폼!</p>

                {/* Sample Credentials Hint */}
                <div className={styles.sampleHint} onClick={fillSampleCredentials}>
                    <span>💡 샘플 계정:</span>
                    <code>student@edupulse.com / 1234</code>
                    <span className={styles.autoFillTag}>클릭하여 자동입력</span>
                </div>

                {/* Error Message */}
                {error && <div className={styles.errorMessage}>{error}</div>}

                {/* Login Form */}
                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            placeholder="아이디를 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? '로그인 중...' : '공부 시작하기!'}
                    </button>
                </form>

                {/* Links */}
                <div className={styles.links}>
                    <a href="#" className={styles.link}>아이디 찾기</a>
                    <a href="/signup" className={styles.link}>회원가입</a>
                </div>
            </div>
        </div>
    );
}

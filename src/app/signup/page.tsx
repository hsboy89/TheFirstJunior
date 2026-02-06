'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login/login.module.css';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);

        // TODO: Supabase 회원가입 연동
        setTimeout(() => {
            router.push('/login');
        }, 1000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <div className={styles.overlay}></div>
            </div>

            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <div className={styles.rocketIcon}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L13.09 8.26L19 9L14.14 12.14L15.64 18.36L12 15L8.36 18.36L9.86 12.14L5 9L10.91 8.26L12 2Z" fill="white" />
                        </svg>
                    </div>
                </div>

                <h1 className={styles.title}>회원가입</h1>
                <p className={styles.subtitle}>EduPulse와 함께 영어 모험을 시작하세요!</p>

                {error && <div style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSignup} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="username"
                            placeholder="닉네임을 입력하세요"
                            value={formData.username}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일 주소"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="비밀번호 확인"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? '가입 중...' : '가입하기'}
                    </button>
                </form>

                <div className={styles.links}>
                    <span></span>
                    <a href="/login" className={styles.link}>이미 계정이 있으신가요? 로그인</a>
                </div>
            </div>
        </div>
    );
}

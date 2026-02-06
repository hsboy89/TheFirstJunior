'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
    username?: string;
    level?: number;
    levelTitle?: string;
}

const menuItems = [
    { icon: '🏠', label: '마이 페이지', path: '/dashboard' },
    { icon: '📚', label: '리딩 아카이브', path: '/reading' },
    { icon: '💎', label: '단어 보물창고', path: '/vocabulary' },
    { icon: '🔮', label: '문법 시크릿', path: '/grammar' },
    { icon: '🏆', label: '도전! 퀴즈왕', path: '/quiz' },
    { icon: '📊', label: '리더보드', path: '/leaderboard' },
];

export default function Sidebar({
    username = '박민수 학생',
    level = 12,
    levelTitle = 'Adventurer'
}: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        // TODO: Supabase 로그아웃 연동
        router.push('/login');
    };

    return (
        <aside className={styles.sidebar}>
            {/* Profile Section */}
            <div className={styles.profile}>
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatar}>
                        <span className={styles.avatarEmoji}>👦</span>
                    </div>
                    <div className={styles.badge}>⭐</div>
                </div>
                <h3 className={styles.username}>{username}</h3>
                <div className={styles.levelBadge}>
                    LV. {level} {levelTitle}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className={styles.nav}>
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
                        onClick={() => router.push(item.path)}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span className={styles.navLabel}>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Logout Button */}
            <button className={styles.logoutBtn} onClick={handleLogout}>
                <span className={styles.navIcon}>🚪</span>
                <span className={styles.navLabel}>로그아웃</span>
            </button>
        </aside>
    );
}

/**
 * 커리큘럼 데이터 파서 및 Supabase 삽입 스크립트
 * 사용법: node scripts/seed-curriculum.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 설정
const supabaseUrl = 'https://whmizlgpnuxvrmsanaov.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndobWl6bGdwbnV4dnJtc2FuYW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDk0NjUsImV4cCI6MjA4NTkyNTQ2NX0.o_-Y7FiwV8BDIgWY_ZvENO6CZppxIK3K6USP37tdLkA';

const supabase = createClient(supabaseUrl, supabaseKey);

// 파일 경로
const files = [
    { path: 'C:/Users/DKSYSTEMS/Desktop/gd3.txt', grade: 3, levelId: 1 },
    { path: 'C:/Users/DKSYSTEMS/Desktop/gd4.txt', grade: 4, levelId: 2 },
    { path: 'C:/Users/DKSYSTEMS/Desktop/gd5.txt', grade: 5, levelId: 3 },
    { path: 'C:/Users/DKSYSTEMS/Desktop/gd6.txt', grade: 6, levelId: 4 },
];

/**
 * 텍스트 파일에서 유닛 데이터를 파싱
 */
function parseUnitsFromText(content) {
    const units = [];
    
    // 유닛 구분 패턴: 📘 Unit X: 또는 📒 Unit X: 또는 Unit X: 등
    const unitPattern = /(?:📘|📒|🌊|🔄|👤|🚀|🏘️|⚽|🎨|🚀|🎨|🎵|🕊️|⚛️|🔊|🤖|🌬️|💧|🏛️|🌲|🚌|🪐|🖨️|🌋|💧|🦊|🔋|✊|🔄|🐫|💸|🕊️|✊|👩‍|🔄|⚛️|🔊|🤖|🌬️|💧|🚂|🧬|🎭|⚖️|📘|⚛️|🌌|🧬|🔭|🇫🇷|💰|🌍|🇺🇳|⛓️|🛡️|🕶️|✂️|🔒)?\s*Unit\s+(\d+):\s*(.+?)(?=\r?\n)/gi;
    
    let matches = [...content.matchAll(unitPattern)];
    
    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const unitNumber = parseInt(match[1]);
        const rawTitle = match[2].trim();
        
        // 다음 유닛 시작 위치 또는 파일 끝
        const startIndex = match.index;
        const endIndex = i < matches.length - 1 ? matches[i + 1].index : content.length;
        const unitContent = content.substring(startIndex, endIndex);
        
        // Review 유닛은 건너뛰기 (선택적)
        if (rawTitle.toLowerCase().includes('review')) {
            continue;
        }
        
        const unit = parseUnitContent(unitNumber, rawTitle, unitContent);
        if (unit) {
            units.push(unit);
        }
    }
    
    return units;
}

/**
 * 개별 유닛 콘텐츠 파싱
 */
function parseUnitContent(unitNumber, rawTitle, content) {
    // 제목에서 괄호 안의 한국어 제거
    const title = rawTitle.replace(/\s*\([^)]+\)\s*$/, '').trim();
    
    // Reading 텍스트 추출
    const readingMatch = content.match(/1\.\s*Reading\s*\r?\n?([\s\S]*?)(?=\r?\n\s*2\.\s*(?:Core\s+)?Vocabulary|\r?\n\s*$)/i);
    const readingText = readingMatch ? readingMatch[1].trim() : '';
    
    // Vocabulary 추출
    const vocabMatch = content.match(/2\.\s*(?:Core\s+)?Vocabulary\s*([\s\S]*?)(?=\r?\n\s*3\.\s*Grammar|\r?\n\s*$)/i);
    const vocabSection = vocabMatch ? vocabMatch[1] : '';
    const vocabulary = parseVocabulary(vocabSection);
    
    // Grammar 추출
    const grammarMatch = content.match(/3\.\s*Grammar\s*Point\s*([\s\S]*?)(?=\r?\n\s*4\.\s*Quiz|\r?\n\s*$)/i);
    const grammarSection = grammarMatch ? grammarMatch[1] : '';
    const grammar = parseGrammar(grammarSection);
    
    // Quiz 추출
    const quizMatch = content.match(/4\.\s*Quiz\s*([\s\S]*?)(?=\r?\n\s*📘|\r?\n\s*📒|\r?\n\s*Unit\s+\d+|\r?\n\s*주인님|\s*$)/i);
    const quizSection = quizMatch ? quizMatch[1] : '';
    const quizzes = parseQuizzes(quizSection);
    
    return {
        unitNumber,
        title,
        readingText,
        vocabulary,
        grammar,
        quizzes
    };
}

/**
 * Vocabulary 파싱
 */
function parseVocabulary(section) {
    const vocab = [];
    // 패턴: Word: Definition (한국어)
    const vocabPattern = /([A-Za-z\s\-]+):\s*(.+?)\s*\(([^)]+)\)/g;
    
    let match;
    while ((match = vocabPattern.exec(section)) !== null) {
        vocab.push({
            word: match[1].trim(),
            meaning: match[3].trim(), // 한국어 뜻
            example: match[2].trim()  // 영어 설명
        });
    }
    
    return vocab;
}

/**
 * Grammar 파싱
 */
function parseGrammar(section) {
    // 문법 제목과 설명 추출
    const lines = section.trim().split(/\r?\n/).filter(l => l.trim());
    
    if (lines.length === 0) {
        return { title: '', explanation: '', examples: [] };
    }
    
    const title = lines[0].trim();
    const examples = [];
    let explanation = '';
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.toLowerCase().startsWith('example:')) {
            examples.push(line.replace(/^example:\s*/i, ''));
        } else if (line.toLowerCase().startsWith('mission:')) {
            explanation = line;
        } else if (line) {
            explanation += (explanation ? ' ' : '') + line;
        }
    }
    
    return { title, explanation, examples };
}

/**
 * Quiz 파싱
 */
function parseQuizzes(section) {
    const quizzes = [];
    const lines = section.trim().split(/\r?\n/).filter(l => l.trim());
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        // T/F 문제 패턴
        const tfMatch = trimmedLine.match(/\(T\/F\)\s*(.+?)\s*\((\w+)\)/i);
        if (tfMatch) {
            quizzes.push({
                question: tfMatch[1].trim(),
                options: ['True', 'False'],
                answer: tfMatch[2].trim(),
                type: 'tf'
            });
            continue;
        }
        
        // 일반 문제 패턴: Question? (Answer)
        const qaMatch = trimmedLine.match(/^(.+\?)\s*\(([^)]+)\)/);
        if (qaMatch) {
            quizzes.push({
                question: qaMatch[1].trim(),
                options: [], // 객관식 옵션은 나중에 생성
                answer: qaMatch[2].trim(),
                type: 'short'
            });
            continue;
        }
        
        // 빈칸 채우기 패턴: "Text ___." (Answer)
        const fillMatch = trimmedLine.match(/^[""](.+?)[""]\.?\s*\(([^)]+)\)/);
        if (fillMatch) {
            quizzes.push({
                question: fillMatch[1].trim(),
                options: [],
                answer: fillMatch[2].trim(),
                type: 'fill'
            });
        }
    }
    
    return quizzes;
}

/**
 * Supabase에 데이터 삽입
 */
async function seedDatabase() {
    console.log('🚀 커리큘럼 데이터 시딩 시작...\n');
    
    for (const file of files) {
        console.log(`📖 Grade ${file.grade} 처리 중...`);
        
        try {
            const content = fs.readFileSync(file.path, 'utf-8');
            const units = parseUnitsFromText(content);
            
            console.log(`   ✓ ${units.length}개 유닛 파싱 완료`);
            
            for (const unit of units) {
                // 1. Unit 삽입
                const { data: unitData, error: unitError } = await supabase
                    .from('units')
                    .upsert({
                        level_id: file.levelId,
                        module_no: Math.ceil(unit.unitNumber / 6), // 6개씩 모듈 구분
                        title: unit.title,
                        order_no: unit.unitNumber
                    }, { onConflict: 'level_id,order_no' })
                    .select()
                    .single();
                
                if (unitError) {
                    // upsert 실패 시 insert 시도
                    const { data: insertedUnit, error: insertError } = await supabase
                        .from('units')
                        .insert({
                            level_id: file.levelId,
                            module_no: Math.ceil(unit.unitNumber / 6),
                            title: unit.title,
                            order_no: unit.unitNumber
                        })
                        .select()
                        .single();
                    
                    if (insertError) {
                        console.log(`   ⚠️ Unit ${unit.unitNumber} 삽입 실패:`, insertError.message);
                        continue;
                    }
                    unit.dbId = insertedUnit.id;
                } else {
                    unit.dbId = unitData.id;
                }
                
                // 2. Unit Content 삽입
                const { error: contentError } = await supabase
                    .from('unit_contents')
                    .upsert({
                        unit_id: unit.dbId,
                        reading_text: unit.readingText,
                        vocab: unit.vocabulary,
                        grammar: unit.grammar
                    }, { onConflict: 'unit_id' });
                
                if (contentError) {
                    console.log(`   ⚠️ Unit ${unit.unitNumber} 콘텐츠 삽입 실패:`, contentError.message);
                }
                
                // 3. Quizzes 삽입
                for (let i = 0; i < unit.quizzes.length; i++) {
                    const quiz = unit.quizzes[i];
                    const { error: quizError } = await supabase
                        .from('quizzes')
                        .insert({
                            unit_id: unit.dbId,
                            question: quiz.question,
                            options: quiz.options,
                            answer: quiz.answer,
                            order_no: i + 1
                        });
                    
                    if (quizError && !quizError.message.includes('duplicate')) {
                        // 중복이 아닌 에러만 로그
                    }
                }
            }
            
            console.log(`   ✅ Grade ${file.grade} 완료!\n`);
            
        } catch (err) {
            console.log(`   ❌ Grade ${file.grade} 오류:`, err.message);
        }
    }
    
    console.log('🎉 모든 데이터 시딩 완료!');
}

// 실행
seedDatabase().catch(console.error);

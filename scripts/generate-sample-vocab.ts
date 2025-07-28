#!/usr/bin/env tsx

/**
 * 샘플 한국어 어휘 데이터 생성 스크립트
 * 실제 국립국어원 데이터 수집 전 테스트용
 */

import fs from 'fs/promises';
import path from 'path';
import { KoreanVocabularyData, KoreanWord } from '../src/types/korean-vocabulary';

// 국립국어원 기준 품사별 정의 템플릿
const DEFINITIONS: Record<string, string[]> = {
  '명사': ['{word}를 가리키는 말', '{word}라는 사물이나 개념'],
  '동사': ['{word}하는 행위', '{word}라는 동작을 나타내는 말'],
  '형용사': ['{word}한 상태나 성질', '{word}라는 특성을 나타내는 말'],
  '부사': ['동작이나 상태를 {word}하게 꾸미는 말'],
  '대명사': ['사람이나 사물을 가리키는 말'],
  '관형사': ['체언을 꾸미는 말'],
  '조사': ['단어들의 관계를 나타내는 말'],
  '의존명사': ['다른 말에 기대어 쓰이는 명사'],
  '접사': ['다른 말에 붙어 새로운 의미를 만드는 말'],
  '접속부사': ['문장과 문장을 연결하는 부사']
};

// 품사별 예시 문장 패턴
const EXAMPLE_PATTERNS: Record<string, string[]> = {
  '명사': ['{word}가 있다.', '{word}를 보았다.', '그 {word}는 크다.'],
  '동사': ['나는 {word}.', '{word}고 싶다.', '{word}지 않았다.'],
  '형용사': ['날씨가 {word}.', '{word}한 사람', '매우 {word}다.'],
  '부사': ['{word} 좋다.', '{word} 빠르다.', '{word} 해보자.'],
  '대명사': ['{word}는 학생이다.', '{word}가 좋다.'],
  '관형사': ['{word} 사람', '{word} 것'],
  '조사': ['사과{word} 먹다.', '학교{word} 가다.'],
  '의존명사': ['할 {word} 있다.', '좋은 {word}이다.'],
  '접사': ['친구{word}', '예쁘{word}'],
  '접속부사': ['{word} 좋다.', '{word} 가야 한다.']
};

async function generateSampleVocabulary(): Promise<void> {
  console.log('📚 샘플 한국어 어휘 데이터 생성 시작...');
  
  // 샘플 데이터 로드
  const sampleDataPath = path.join(__dirname, 'sample-korean-words.json');
  const sampleData = JSON.parse(await fs.readFile(sampleDataPath, 'utf-8'));
  
  const words: KoreanWord[] = [];
  
  for (const item of sampleData) {
    const definition = generateDefinition(item.word, item.pos);
    const example = generateExample(item.word, item.pos);
    
    const word: KoreanWord = {
      id: words.length + 1,
      word: item.word,
      pos: item.pos,
      frequency_rank: item.rank,
      level: item.level,
      meanings: [{
        definition,
        example
      }],
      source: '국립국어원_한국어학습용어휘_샘플',
      tags: getWordTags(item.word, item.pos)
    };
    
    words.push(word);
  }
  
  // 메타데이터 생성
  const vocabularyData: KoreanVocabularyData = {
    metadata: {
      title: '한국어 자주 사용되는 단어 샘플 (50개)',
      source: '국립국어원 한국어 학습용 어휘 목록 기반 샘플',
      last_updated: new Date().toISOString(),
      total_count: words.length,
      version: '0.1.0-sample',
      methodology: '위키낱말사전 + 샘플 정의 생성',
      license: 'CC BY-SA 4.0'
    },
    words
  };
  
  // 출력 디렉토리 생성
  const outputDir = './data';
  await fs.mkdir(outputDir, { recursive: true });
  
  // JSON 파일 저장
  const outputPath = path.join(outputDir, 'korean-vocabulary-sample.json');
  await fs.writeFile(
    outputPath, 
    JSON.stringify(vocabularyData, null, 2), 
    'utf-8'
  );
  
  console.log(`✅ 샘플 데이터 생성 완료: ${outputPath}`);
  console.log(`📊 총 ${words.length}개 단어 포함`);
  
  // 통계 출력
  const stats = generateStats(words);
  console.log('\n📈 단어 통계:');
  console.log(`- 1단계 (초급): ${stats.level1}개`);
  console.log(`- 2단계 (중급): ${stats.level2}개`);
  console.log(`- 3단계 (고급): ${stats.level3}개`);
  console.log('\n📋 품사별 분포:');
  Object.entries(stats.pos).forEach(([pos, count]) => {
    console.log(`- ${pos}: ${count}개`);
  });
}

function generateDefinition(word: string, pos: string): string {
  const templates = DEFINITIONS[pos] || ['{word}를 나타내는 말'];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace(/{word}/g, word);
}

function generateExample(word: string, pos: string): string {
  const patterns = EXAMPLE_PATTERNS[pos] || ['{word}'];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  return pattern.replace(/{word}/g, word);
}

function getWordTags(word: string, pos: string): string[] {
  const tags: string[] = [];
  
  // 품사 기반 태그
  if (['명사', '대명사', '수사'].includes(pos)) {
    tags.push('체언');
  } else if (['동사', '형용사'].includes(pos)) {
    tags.push('용언');
  } else if (['관형사', '부사'].includes(pos)) {
    tags.push('수식언');
  }
  
  // 단어 길이 기반 태그
  if (word.length === 1) {
    tags.push('단음절');
  } else if (word.length === 2) {
    tags.push('이음절');
  } else {
    tags.push('다음절');
  }
  
  return tags;
}

function generateStats(words: KoreanWord[]) {
  return {
    level1: words.filter(w => w.level === 1).length,
    level2: words.filter(w => w.level === 2).length,
    level3: words.filter(w => w.level === 3).length,
    pos: words.reduce((acc, w) => {
      acc[w.pos] = (acc[w.pos] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSampleVocabulary().catch(console.error);
}
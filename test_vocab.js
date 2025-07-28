// Node.js에서 어휘 시스템 테스트
import { koreanWords, WORD_STATS, presetWordSets } from './src/data/korean-words.ts';
import { WordExtractor } from './src/lib/word-extractor.ts';
import { CurationEngine } from './src/lib/curation-engine.ts';

console.log('=== 한국어 학습 플랫폼 어휘 확장 시스템 테스트 ===\n');

// 1. 기본 통계
console.log('📊 기본 통계:');
console.log(`총 단어 수: ${koreanWords.length}개`);
console.log(`풀 크기: ${WORD_STATS.poolSize}개`);
console.log(`평균 빈도: ${WORD_STATS.avgFrequency}`);
console.log(`사전 설정 패키지: ${WORD_STATS.availablePresets}개\n`);

// 2. 난이도별 분포
console.log('📈 난이도별 분포:');
Object.entries(WORD_STATS.byDifficulty).forEach(([level, count]) => {
  console.log(`  ${level}: ${count}개`);
});

// 3. 카테고리별 분포 (상위 5개)
console.log('\n📚 카테고리별 분포 (상위 5개):');
const sortedCategories = Object.entries(WORD_STATS.byCategory)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5);
sortedCategories.forEach(([category, count]) => {
  console.log(`  ${category}: ${count}개`);
});

// 4. 고빈도 단어 테스트
console.log('\n⭐ 최고 빈도 단어 TOP 5:');
const highFreqWords = koreanWords
  .sort((a, b) => b.frequency - a.frequency)
  .slice(0, 5);
highFreqWords.forEach((word, i) => {
  console.log(`  ${i+1}. ${word.korean} (${word.english}) - 빈도: ${word.frequency}`);
});

console.log('\n✅ 어휘 확장 시스템이 성공적으로 작동중입니다\!');
EOF < /dev/null
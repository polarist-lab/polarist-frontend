#!/usr/bin/env tsx

/**
 * 빠른 한국어 어휘 크롤링 스크립트
 * 지연 시간을 줄이고 효율성을 높인 버전
 */

import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { KoreanVocabularyData, KoreanWord, WordMeaning } from '../src/types/korean-vocabulary';

interface TestWord {
  rank: number;
  word: string;
  pos: string;
  level: number;
}

class FastCrawler {
  private words: KoreanWord[] = [];
  private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  private delay = 800; // 줄어든 지연 시간

  async crawlDefinition(word: string): Promise<WordMeaning[]> {
    try {
      const searchUrl = `https://stdict.korean.go.kr/search/searchResult.do?search_part=word&searchKeyword=${encodeURIComponent(word)}`;
      
      const response = await axios.get(searchUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 8000 // 줄어든 타임아웃
      });

      const $ = cheerio.load(response.data);
      const meanings: WordMeaning[] = [];

      // 빠른 정의 추출
      $('dt').each((index, element) => {
        if (index >= 2) return false; // 최대 2개만
        
        const fullText = $(element).text().trim();
        
        if (fullText.includes(word)) {
          const defMatch = fullText.match(/「(.+?)」(.+)/);
          if (defMatch) {
            const definition = defMatch[2].replace(/전체\s*보기.*/, '').trim();
            
            if (definition && definition.length > 5) {
              meanings.push({
                definition: definition.substring(0, 150), // 더 짧게
                category: defMatch[1]
              });
            }
          }
        }
      });

      return meanings;
      
    } catch (error) {
      // 에러는 조용히 처리
      return [];
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runFastCrawling(limit: number = 50): Promise<void> {
    console.log(`🚀 빠른 크롤링 시작: ${limit}개 단어`);
    console.log(`⏱️  예상 시간: ${Math.ceil(limit * this.delay / 1000 / 60)}분`);
    
    // 단어 리스트 로드
    const wordsDataPath = path.join(__dirname, 'extended-korean-words.json');
    const wordsData: TestWord[] = JSON.parse(await fs.readFile(wordsDataPath, 'utf-8'));
    
    const testWords = wordsData.slice(0, limit);
    const startTime = Date.now();
    
    for (let i = 0; i < testWords.length; i++) {
      const testWord = testWords[i];
      const progress = `[${i + 1}/${testWords.length}]`;
      
      process.stdout.write(`${progress} "${testWord.word}" 처리 중...`);
      
      try {
        const koreanWord: KoreanWord = {
          id: i + 1,
          word: testWord.word,
          pos: testWord.pos,
          frequency_rank: testWord.rank,
          level: testWord.level as 1 | 2 | 3,
          meanings: [{ definition: `${testWord.word}을/를 나타내는 말` }],
          source: '기본_정의',
          tags: this.generateTags(testWord.word, testWord.pos, testWord.rank)
        };

        // 크롤링 시도
        const meanings = await this.crawlDefinition(testWord.word);
        if (meanings.length > 0) {
          koreanWord.meanings = meanings;
          koreanWord.source = '표준국어대사전_크롤링';
          console.log(` ✅ ${meanings.length}개 정의`);
        } else {
          console.log(` ⚡ 기본 정의`);
        }

        this.words.push(koreanWord);
        await this.sleep(this.delay);

      } catch (error) {
        console.log(` ❌ 오류`);
        
        // 오류 시에도 기본 정보 추가
        this.words.push({
          id: i + 1,
          word: testWord.word,
          pos: testWord.pos,
          frequency_rank: testWord.rank,
          level: testWord.level as 1 | 2 | 3,
          meanings: [{ definition: `${testWord.word}을/를 나타내는 말` }],
          source: '기본_정의',
          tags: ['오류']
        });
      }

      // 진행률 업데이트
      if ((i + 1) % 10 === 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = ((elapsed / (i + 1)) * (testWords.length - i - 1)) / 60;
        console.log(`📊 진행률: ${Math.round((i + 1) / testWords.length * 100)}% (남은 시간: ${remaining.toFixed(1)}분)`);
      }
    }

    // 결과 저장
    await this.saveResults(limit);
    this.printStatistics();
  }

  private generateTags(word: string, pos: string, rank: number): string[] {
    const tags: string[] = [];

    // 품사 태그
    if (['명사', '대명사'].includes(pos)) tags.push('체언');
    else if (['동사', '형용사'].includes(pos)) tags.push('용언');
    else if (['부사', '관형사'].includes(pos)) tags.push('수식언');

    // 빈도 태그
    if (rank <= 50) tags.push('초고빈도');
    else if (rank <= 100) tags.push('고빈도');
    else tags.push('중빈도');

    // 길이 태그
    if (word.length <= 2) tags.push('단어');
    else tags.push('복합어');

    return tags;
  }

  private async saveResults(limit: number): Promise<void> {
    const vocabularyData: KoreanVocabularyData = {
      metadata: {
        title: `한국어 자주 사용되는 단어 ${this.words.length}개`,
        source: '표준국어대사전 + 기본 정의',
        last_updated: new Date().toISOString(),
        total_count: this.words.length,
        version: '1.0.0-fast',
        methodology: '빠른 웹 크롤링 + 기본 정의 보완',
        license: 'CC BY-SA 4.0'
      },
      words: this.words
    };

    const outputPath = `./data/korean-vocabulary-${limit}.json`;
    await fs.mkdir('./data', { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(vocabularyData, null, 2), 'utf-8');
    
    console.log(`💾 결과 저장: ${outputPath}`);
  }

  private printStatistics(): void {
    const crawledWords = this.words.filter(w => w.source.includes('크롤링')).length;
    const totalMeanings = this.words.reduce((sum, w) => sum + w.meanings.length, 0);
    
    console.log('\n📈 크롤링 결과:');
    console.log(`- 총 단어: ${this.words.length}개`);
    console.log(`- 크롤링 성공: ${crawledWords}개 (${Math.round(crawledWords / this.words.length * 100)}%)`);
    console.log(`- 총 정의: ${totalMeanings}개`);
    console.log(`- 평균 정의: ${(totalMeanings / this.words.length).toFixed(1)}개/단어`);

    // 품사 통계
    const posStats = this.words.reduce((acc, w) => {
      acc[w.pos] = (acc[w.pos] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📋 품사별 분포:');
    Object.entries(posStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([pos, count]) => {
        console.log(`- ${pos}: ${count}개`);
      });
  }
}

// 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  const crawler = new FastCrawler();
  const limit = parseInt(process.argv[2]) || 50;
  crawler.runFastCrawling(limit).catch(console.error);
}
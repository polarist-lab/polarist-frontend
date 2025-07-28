#!/usr/bin/env tsx

/**
 * 실제 크롤링 테스트 - 100개 단어로 테스트
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

class CrawlingTester {
  private words: KoreanWord[] = [];
  private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  async crawlStandardDictDefinition(word: string): Promise<WordMeaning[]> {
    try {
      const searchUrl = `https://stdict.korean.go.kr/search/searchResult.do?search_part=word&searchKeyword=${encodeURIComponent(word)}`;
      
      const response = await axios.get(searchUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const meanings: WordMeaning[] = [];

      // dt 태그에서 정의 추출 (테스트에서 확인됨)
      $('dt').each((index, element) => {
        if (index >= 3) return false; // 최대 3개만
        
        const fullText = $(element).text().trim();
        
        // 단어가 포함된 정의만 필터링
        if (fullText.includes(word)) {
          // 품사와 정의 분리
          const defMatch = fullText.match(/「(.+?)」(.+)/);
          if (defMatch) {
            const pos = defMatch[1];
            const definition = defMatch[2].replace(/전체\s*보기.*/, '').trim();
            
            if (definition && definition.length > 5) {
              meanings.push({
                definition: definition.substring(0, 200), // 너무 긴 정의는 자름
                category: pos
              });
            }
          }
        }
      });

      return meanings;
      
    } catch (error) {
      console.warn(`⚠️  ${word} 정의 크롤링 실패:`, error.message);
      return [];
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runTest(limit: number = 20): Promise<void> {
    console.log(`🧪 ${limit}개 단어 크롤링 테스트 시작`);
    
    // 확장된 단어 리스트 로드
    const wordsDataPath = path.join(__dirname, 'extended-korean-words.json');
    const wordsData: TestWord[] = JSON.parse(await fs.readFile(wordsDataPath, 'utf-8'));
    
    const testWords = wordsData.slice(0, limit);
    
    for (let i = 0; i < testWords.length; i++) {
      const testWord = testWords[i];
      console.log(`[${i + 1}/${testWords.length}] "${testWord.word}" 처리 중...`);
      
      try {
        // 기본 단어 객체 생성
        const koreanWord: KoreanWord = {
          id: i + 1,
          word: testWord.word,
          pos: testWord.pos,
          frequency_rank: testWord.rank,
          level: testWord.level as 1 | 2 | 3,
          meanings: [{ definition: '정의를 불러오는 중...' }],
          source: '테스트_크롤링',
          tags: []
        };

        // 표준국어대사전에서 정의 크롤링
        const meanings = await this.crawlStandardDictDefinition(testWord.word);
        if (meanings.length > 0) {
          koreanWord.meanings = meanings;
          koreanWord.source = '표준국어대사전_크롤링';
          console.log(`  ✅ ${meanings.length}개 정의 수집`);
        } else {
          // 기본 정의 생성
          koreanWord.meanings = [{
            definition: `${testWord.word}을/를 나타내는 말`,
            category: testWord.pos
          }];
          console.log(`  ⚠️  기본 정의 사용`);
        }

        this.words.push(koreanWord);

        // 서버 부하 방지를 위한 지연
        await this.delay(1500);

      } catch (error) {
        console.error(`❌ "${testWord.word}" 처리 실패:`, error);
      }

      // 진행률 출력
      if ((i + 1) % 5 === 0) {
        console.log(`📊 진행률: ${i + 1}/${testWords.length} (${Math.round((i + 1) / testWords.length * 100)}%)`);
      }
    }

    // 결과 저장
    await this.saveResults();
    this.printStatistics();
  }

  private async saveResults(): Promise<void> {
    const vocabularyData: KoreanVocabularyData = {
      metadata: {
        title: `한국어 자주 사용되는 단어 크롤링 테스트 (${this.words.length}개)`,
        source: '표준국어대사전 크롤링 테스트',
        last_updated: new Date().toISOString(),
        total_count: this.words.length,
        version: '0.2.0-test',
        methodology: '표준국어대사전 웹 크롤링',
        license: 'CC BY-SA 4.0'
      },
      words: this.words
    };

    const outputPath = './data/korean-vocabulary-crawling-test.json';
    await fs.mkdir('./data', { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(vocabularyData, null, 2), 'utf-8');
    
    console.log(`💾 테스트 결과 저장: ${outputPath}`);
  }

  private printStatistics(): void {
    const successfulCrawls = this.words.filter(w => w.source.includes('크롤링')).length;
    const totalMeanings = this.words.reduce((sum, w) => sum + w.meanings.length, 0);
    
    console.log('\n📈 크롤링 테스트 결과:');
    console.log(`- 총 처리된 단어: ${this.words.length}개`);
    console.log(`- 성공적으로 크롤링된 단어: ${successfulCrawls}개`);
    console.log(`- 크롤링 성공률: ${Math.round(successfulCrawls / this.words.length * 100)}%`);
    console.log(`- 총 수집된 정의: ${totalMeanings}개`);
    console.log(`- 평균 정의 수: ${(totalMeanings / this.words.length).toFixed(1)}개/단어`);

    // 품사별 통계
    const posStats = this.words.reduce((acc, w) => {
      acc[w.pos] = (acc[w.pos] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📋 품사별 분포:');
    Object.entries(posStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([pos, count]) => {
        console.log(`- ${pos}: ${count}개`);
      });
  }
}

// 테스트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new CrawlingTester();
  const limit = parseInt(process.argv[2]) || 20; // 명령행 인자로 개수 지정 가능
  tester.runTest(limit).catch(console.error);
}
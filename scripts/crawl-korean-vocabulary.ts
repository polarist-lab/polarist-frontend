#!/usr/bin/env tsx

/**
 * 크롤링 기반 한국어 어휘 데이터 수집 스크립트
 * API 키 없이 웹 크롤링으로 5000개 한국어 단어 수집
 */

import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { KoreanVocabularyData, KoreanWord, WordMeaning } from '../src/types/korean-vocabulary';

const CONFIG = {
  OUTPUT_DIR: './data',
  OUTPUT_FILE: 'korean-vocabulary-5000-crawled.json',
  MAX_WORDS: 5000,
  DELAY_MS: 2000, // 크롤링 간격 (서버 부하 방지)
  
  // 크롤링 대상 URL들
  SOURCES: {
    WIKTIONARY_FREQUENCY: 'https://ko.wiktionary.org/wiki/부록:자주_쓰이는_한국어_낱말_5800',
    STDICT_SEARCH_BASE: 'https://stdict.korean.go.kr/search/searchResult.do',
    KRDICT_SEARCH_BASE: 'https://krdict.korean.go.kr/searchResult'
  }
};

interface WiktionaryWord {
  rank: number;
  word: string;
  pos?: string;
  note?: string;
}

class KoreanVocabularyCrawler {
  private words: KoreanWord[] = [];
  private processedCount = 0;
  private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  constructor() {
    console.log('🕷️  크롤링 기반 한국어 어휘 수집기 초기화');
  }

  /**
   * 위키낱말사전에서 자주 쓰이는 한국어 낱말 5800개 크롤링
   */
  async crawlWiktionaryFrequencyList(): Promise<WiktionaryWord[]> {
    console.log('📚 위키낱말사전 빈도 리스트 크롤링 중...');
    
    try {
      const response = await axios.get(CONFIG.SOURCES.WIKTIONARY_FREQUENCY, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 30000
      });

      const $ = cheerio.load(response.data);
      const words: WiktionaryWord[] = [];

      // 순서 있는 목록(ol)에서 단어 추출
      $('ol li').each((index, element) => {
        const text = $(element).text().trim();
        
        // 단어와 품사 정보 파싱
        const wordMatch = text.match(/^(.+?)(?:\s*\((.+?)\))?(?:\s*[-–](.+))?$/);
        if (wordMatch) {
          const word = wordMatch[1].trim();
          const pos = wordMatch[2]?.trim();
          const note = wordMatch[3]?.trim();
          
          // 한글 단어만 필터링 (영어, 숫자 제외)
          if (word && /^[가-힣]+$/.test(word) && word.length <= 10) {
            words.push({
              rank: words.length + 1,
              word,
              pos,
              note
            });
          }
        }
      });

      console.log(`✅ 위키낱말사전에서 ${words.length}개 단어 추출 완료`);
      return words.slice(0, CONFIG.MAX_WORDS); // 상위 5000개만 선택
      
    } catch (error) {
      console.error('❌ 위키낱말사전 크롤링 실패:', error);
      return [];
    }
  }

  /**
   * 표준국어대사전에서 단어 정의 크롤링
   */
  async crawlStandardDictDefinition(word: string): Promise<WordMeaning[]> {
    try {
      const searchUrl = `${CONFIG.SOURCES.STDICT_SEARCH_BASE}?search_part=word&searchKeyword=${encodeURIComponent(word)}`;
      
      const response = await axios.get(searchUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      const meanings: WordMeaning[] = [];

      // 검색 결과에서 정의 추출
      $('.search_result .result_contents').each((index, element) => {
        const $elem = $(element);
        
        // 표제어 확인
        const headword = $elem.find('.search_title a').text().trim();
        if (headword === word) {
          
          // 뜻풀이 추출
          $elem.find('.mean_list li').each((idx, meaningElem) => {
            const definition = $(meaningElem).find('.mean').text().trim();
            const example = $(meaningElem).find('.exam').text().trim();
            
            if (definition) {
              meanings.push({
                definition: definition.replace(/^\d+\.\s*/, ''), // 번호 제거
                example: example || undefined,
                category: undefined
              });
            }
          });
        }
      });

      return meanings.slice(0, 3); // 최대 3개 의미만 선택
      
    } catch (error) {
      console.warn(`⚠️  ${word} 정의 크롤링 실패:`, error.message);
      return [];
    }
  }

  /**
   * 한국어기초사전에서 학습자용 정보 크롤링
   */
  async crawlBasicDictInfo(word: string): Promise<Partial<KoreanWord>> {
    try {
      const searchUrl = `${CONFIG.SOURCES.KRDICT_SEARCH_BASE}?nation=kr&nationCode=kr&ParaWordNo=&mainSearchWord=${encodeURIComponent(word)}`;
      
      const response = await axios.get(searchUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      const info: Partial<KoreanWord> = {};

      // 첫 번째 검색 결과에서 정보 추출
      const $firstResult = $('.search_result_item').first();
      if ($firstResult.length > 0) {
        
        // 발음 정보
        const pronunciation = $firstResult.find('.pronunciation').text().trim();
        if (pronunciation) {
          info.pronunciation = pronunciation;
        }

        // 품사 정보
        const pos = $firstResult.find('.word_class').text().trim();
        if (pos) {
          info.pos = pos;
        }

        // 학습 등급 (있는 경우)
        const level = $firstResult.find('.level').text().trim();
        if (level) {
          info.level = this.mapToLevel(level);
        }
      }

      return info;
      
    } catch (error) {
      console.warn(`⚠️  ${word} 기초사전 정보 크롤링 실패:`, error.message);
      return {};
    }
  }

  /**
   * 학습 단계 매핑
   */
  private mapToLevel(levelText: string): 1 | 2 | 3 {
    if (levelText.includes('초급') || levelText.includes('1')) return 1;
    if (levelText.includes('중급') || levelText.includes('2')) return 2;
    if (levelText.includes('고급') || levelText.includes('3')) return 3;
    return 2; // 기본값
  }

  /**
   * 품사 정보 정규화
   */
  private normalizePos(pos?: string): string {
    if (!pos) return '명사'; // 기본값

    const posMap: Record<string, string> = {
      '명': '명사',
      '동': '동사', 
      '형': '형용사',
      '부': '부사',
      '대': '대명사',
      '관': '관형사',
      '조': '조사',
      '감': '감탄사',
      '의명': '의존명사',
      '접': '접사'
    };

    return posMap[pos] || pos || '명사';
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 모든 단어에 대해 상세 정보 크롤링
   */
  async enrichAllWords(wiktionaryWords: WiktionaryWord[]): Promise<void> {
    console.log(`🔍 ${wiktionaryWords.length}개 단어 상세 정보 크롤링 중...`);
    console.log('⏱️  예상 소요 시간:', Math.ceil(wiktionaryWords.length * CONFIG.DELAY_MS / 1000 / 60), '분');

    for (let i = 0; i < wiktionaryWords.length; i++) {
      const wiktionaryWord = wiktionaryWords[i];
      const word = wiktionaryWord.word;
      
      console.log(`[${i + 1}/${wiktionaryWords.length}] "${word}" 처리 중...`);

      try {
        // 기본 단어 객체 생성
        const koreanWord: KoreanWord = {
          id: i + 1,
          word,
          pos: this.normalizePos(wiktionaryWord.pos),
          frequency_rank: wiktionaryWord.rank,
          level: 2, // 기본값, 나중에 업데이트
          meanings: [{ definition: '정의를 불러오는 중...' }],
          source: '위키낱말사전_크롤링',
          tags: []
        };

        // 표준국어대사전에서 정의 크롤링
        const meanings = await this.crawlStandardDictDefinition(word);
        if (meanings.length > 0) {
          koreanWord.meanings = meanings;
          koreanWord.source = '표준국어대사전_크롤링';
        }

        await this.delay(CONFIG.DELAY_MS / 2);

        // 기초사전에서 추가 정보 크롤링
        const basicInfo = await this.crawlBasicDictInfo(word);
        Object.assign(koreanWord, basicInfo);

        // 태그 생성
        koreanWord.tags = this.generateTags(koreanWord);

        this.words.push(koreanWord);

        await this.delay(CONFIG.DELAY_MS);

        // 진행률 출력
        if ((i + 1) % 50 === 0) {
          console.log(`✅ ${i + 1}개 단어 처리 완료 (${Math.round((i + 1) / wiktionaryWords.length * 100)}%)`);
          
          // 중간 저장 (복구용)
          await this.saveIntermediateResults(i + 1);
        }

      } catch (error) {
        console.error(`❌ "${word}" 처리 중 오류:`, error);
        
        // 오류 발생 시에도 기본 정보로 추가
        this.words.push({
          id: i + 1,
          word,
          pos: this.normalizePos(wiktionaryWord.pos),
          frequency_rank: wiktionaryWord.rank,
          level: 2,
          meanings: [{ definition: `${word}을/를 나타내는 말` }],
          source: '위키낱말사전_기본정보',
          tags: ['크롤링_오류']
        });
      }

      this.processedCount = i + 1;
    }

    console.log('✅ 모든 단어 상세 정보 크롤링 완료');
  }

  /**
   * 중간 결과 저장 (복구용)
   */
  private async saveIntermediateResults(count: number): Promise<void> {
    const partialData = {
      metadata: {
        title: `한국어 자주 사용되는 단어 (중간저장: ${count}개)`,
        source: '크롤링 기반 수집',
        last_updated: new Date().toISOString(),
        total_count: this.words.length,
        version: `0.5.0-partial-${count}`,
        methodology: '위키낱말사전 + 표준국어대사전 + 한국어기초사전 크롤링',
        license: 'CC BY-SA 4.0'
      },
      words: this.words
    };

    const backupPath = path.join(CONFIG.OUTPUT_DIR, `backup-${count}-words.json`);
    await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
    await fs.writeFile(backupPath, JSON.stringify(partialData, null, 2), 'utf-8');
    console.log(`💾 중간 저장 완료: ${backupPath}`);
  }

  /**
   * 단어별 태그 생성
   */
  private generateTags(word: KoreanWord): string[] {
    const tags: string[] = [];

    // 품사 기반 태그
    if (['명사', '대명사', '수사'].includes(word.pos)) {
      tags.push('체언');
    } else if (['동사', '형용사'].includes(word.pos)) {
      tags.push('용언');
    } else if (['관형사', '부사'].includes(word.pos)) {
      tags.push('수식언');
    }

    // 빈도 기반 태그
    if (word.frequency_rank <= 100) {
      tags.push('초고빈도');
    } else if (word.frequency_rank <= 500) {
      tags.push('고빈도');
    } else if (word.frequency_rank <= 1500) {
      tags.push('중빈도');
    } else {
      tags.push('저빈도');
    }

    // 단어 길이 기반 태그
    if (word.word.length === 1) {
      tags.push('단음절');
    } else if (word.word.length === 2) {
      tags.push('이음절');
    } else {
      tags.push('다음절');
    }

    return tags;
  }

  /**
   * 최종 JSON 파일 저장
   */
  async saveToJson(): Promise<void> {
    console.log('💾 최종 JSON 파일 저장 중...');

    const vocabularyData: KoreanVocabularyData = {
      metadata: {
        title: '한국어 자주 사용되는 단어 5000개 (크롤링)',
        source: '위키낱말사전 + 표준국어대사전 + 한국어기초사전',
        last_updated: new Date().toISOString(),
        total_count: this.words.length,
        version: '1.0.0-crawled',
        methodology: '웹 크롤링 기반 데이터 수집 (API 키 불필요)',
        license: 'CC BY-SA 4.0'
      },
      words: this.words
    };

    await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
    
    const outputPath = path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_FILE);
    await fs.writeFile(
      outputPath, 
      JSON.stringify(vocabularyData, null, 2), 
      'utf-8'
    );

    console.log(`✅ 최종 JSON 파일 저장 완료: ${outputPath}`);
    console.log(`📊 총 ${vocabularyData.words.length}개 단어 저장됨`);

    // 통계 출력
    this.printStatistics();
  }

  /**
   * 수집 통계 출력
   */
  private printStatistics(): void {
    const stats = {
      level1: this.words.filter(w => w.level === 1).length,
      level2: this.words.filter(w => w.level === 2).length,
      level3: this.words.filter(w => w.level === 3).length,
      posStats: this.words.reduce((acc, w) => {
        acc[w.pos] = (acc[w.pos] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      sourceStats: this.words.reduce((acc, w) => {
        acc[w.source] = (acc[w.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    console.log('\n📈 수집 통계:');
    console.log(`- 1단계 (초급): ${stats.level1}개`);
    console.log(`- 2단계 (중급): ${stats.level2}개`);
    console.log(`- 3단계 (고급): ${stats.level3}개`);
    
    console.log('\n📋 품사별 분포:');
    Object.entries(stats.posStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([pos, count]) => {
        console.log(`- ${pos}: ${count}개`);
      });

    console.log('\n📚 출처별 분포:');
    Object.entries(stats.sourceStats).forEach(([source, count]) => {
      console.log(`- ${source}: ${count}개`);
    });
  }

  /**
   * 메인 실행 함수
   */
  async run(): Promise<void> {
    console.log('🚀 크롤링 기반 한국어 어휘 수집 시작');
    console.log(`목표: 상위 ${CONFIG.MAX_WORDS}개 단어`);
    console.log(`지연시간: ${CONFIG.DELAY_MS}ms`);
    console.log('=' .repeat(60));

    try {
      // 1. 위키낱말사전에서 기본 단어 목록 크롤링
      const wiktionaryWords = await this.crawlWiktionaryFrequencyList();
      
      if (wiktionaryWords.length === 0) {
        throw new Error('위키낱말사전에서 단어를 추출할 수 없습니다.');
      }

      // 2. 각 단어에 대해 상세 정보 크롤링
      await this.enrichAllWords(wiktionaryWords);

      // 3. 최종 JSON 파일 저장
      await this.saveToJson();

      console.log('=' .repeat(60));
      console.log('🎉 크롤링 기반 한국어 어휘 수집 완료!');
      console.log(`📁 결과 파일: ${path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_FILE)}`);

    } catch (error) {
      console.error('❌ 크롤링 중 오류 발생:', error);
      
      // 오류 발생 시에도 지금까지 수집된 데이터 저장
      if (this.words.length > 0) {
        console.log(`💾 오류 발생으로 인한 부분 저장: ${this.words.length}개 단어`);
        await this.saveToJson();
      }
      
      process.exit(1);
    }
  }
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  const crawler = new KoreanVocabularyCrawler();
  crawler.run().catch(console.error);
}

export { KoreanVocabularyCrawler };
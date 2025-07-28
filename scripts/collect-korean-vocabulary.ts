#!/usr/bin/env tsx

/**
 * 한국어 자주 사용되는 단어 5000개 수집 스크립트
 * 국립국어원 API 및 공식 자료를 활용하여 데이터 수집
 */

import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { KoreanVocabularyData, KoreanWord, WordMeaning } from '../src/types/korean-vocabulary';

// 설정 상수
const CONFIG = {
  OUTPUT_DIR: './data',
  OUTPUT_FILE: 'korean-vocabulary-5000.json',
  MAX_WORDS: 5000,
  DELAY_MS: 1000, // API 요청 간격
  
  // 국립국어원 API 설정
  NIKL_API: {
    BASE_URL: 'https://stdict.korean.go.kr/api',
    KEY: process.env.NIKL_API_KEY || '', // 환경변수에서 API 키 읽기
  },
  
  // 한국어기초사전 API 설정  
  KRDICT_API: {
    BASE_URL: 'https://krdict.korean.go.kr/api',
    KEY: process.env.KRDICT_API_KEY || '',
  }
};

class KoreanVocabularyCollector {
  private words: KoreanWord[] = [];
  private processedCount = 0;
  
  constructor() {
    this.validateConfig();
  }
  
  private validateConfig(): void {
    if (!CONFIG.NIKL_API.KEY && !CONFIG.KRDICT_API.KEY) {
      console.warn('경고: API 키가 설정되지 않았습니다. 일부 기능이 제한될 수 있습니다.');
      console.log('환경변수 NIKL_API_KEY 또는 KRDICT_API_KEY를 설정해주세요.');
    }
  }
  
  /**
   * 위키낱말사전에서 기본 단어 목록 수집
   */
  async collectFromWiktionary(): Promise<void> {
    console.log('📚 위키낱말사전에서 기본 데이터 수집 중...');
    
    try {
      // 위키낱말사전 페이지에서 단어 목록 스크래핑
      const response = await axios.get(
        'https://ko.wiktionary.org/wiki/부록:자주_쓰이는_한국어_낱말_5800'
      );
      
      console.log('✅ 위키낱말사전 페이지 로드 완료');
      // TODO: HTML 파싱하여 단어 목록 추출
      // cheerio를 사용하여 구현 예정
      
    } catch (error) {
      console.error('❌ 위키낱말사전 접근 실패:', error);
      throw error;
    }
  }
  
  /**
   * 국립국어원 표준국어대사전 API에서 단어 상세 정보 수집
   */
  async enrichWithStandardDict(word: string): Promise<WordMeaning[]> {
    if (!CONFIG.NIKL_API.KEY) {
      return [];
    }
    
    try {
      const response = await axios.get(`${CONFIG.NIKL_API.BASE_URL}/search.do`, {
        params: {
          certkey_no: CONFIG.NIKL_API.KEY,
          key: word,
          req_type: 'json',
          part: 'word',
          sort: 'dict',
          start: 1,
          num: 10
        }
      });
      
      const meanings: WordMeaning[] = [];
      const results = response.data?.channel?.item || [];
      
      for (const item of results) {
        if (item.word === word) {
          meanings.push({
            definition: item.definition || '',
            example: item.example || undefined,
            category: item.pos || undefined
          });
        }
      }
      
      // API 요청 제한 준수를 위한 지연
      await this.delay(CONFIG.DELAY_MS);
      
      return meanings;
      
    } catch (error) {
      console.error(`단어 "${word}" 정보 수집 실패:`, error);
      return [];
    }
  }
  
  /**
   * 한국어기초사전 API에서 학습자용 정보 수집
   */
  async enrichWithBasicDict(word: string): Promise<Partial<KoreanWord>> {
    if (!CONFIG.KRDICT_API.KEY) {
      return {};
    }
    
    try {
      const response = await axios.get(`${CONFIG.KRDICT_API.BASE_URL}/search`, {
        params: {
          key: CONFIG.KRDICT_API.KEY,
          q: word,
          sort: 'popular',
          part: 'word',
          translated: 'y',
          trans_lang: 'english'
        }
      });
      
      const data = response.data?.data?.[0];
      if (!data) return {};
      
      await this.delay(CONFIG.DELAY_MS);
      
      return {
        pronunciation: data.pronunciation,
        level: this.mapToLevel(data.level),
        topik_level: data.topik_level,
        hanja: data.hanja
      };
      
    } catch (error) {
      console.error(`기초사전 정보 수집 실패 (${word}):`, error);
      return {};
    }
  }
  
  /**
   * 학습 단계 매핑 (API 응답을 우리 형식으로 변환)
   */
  private mapToLevel(apiLevel: string): 1 | 2 | 3 {
    switch (apiLevel) {
      case 'beginner':
      case '초급':
        return 1;
      case 'intermediate':  
      case '중급':
        return 2;
      case 'advanced':
      case '고급':
        return 3;
      default:
        return 2; // 기본값
    }
  }
  
  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * 국립국어원 한국어 학습용 어휘 목록 파일 처리
   * (수동으로 다운로드한 엑셀 파일 기준)
   */
  async loadNiklVocabularyList(): Promise<void> {
    console.log('📋 국립국어원 어휘 목록 로드 중...');
    
    // TODO: xlsx 라이브러리로 엑셀 파일 파싱
    // 현재는 예시 데이터로 대체
    const sampleWords = [
      { word: '나', pos: '대명사', level: 1, frequency_rank: 1 },
      { word: '이', pos: '관형사', level: 1, frequency_rank: 2 },
      { word: '있다', pos: '동사', level: 1, frequency_rank: 3 },
      { word: '하다', pos: '동사', level: 1, frequency_rank: 4 },
      { word: '것', pos: '의존명사', level: 1, frequency_rank: 5 },
    ];
    
    for (const wordData of sampleWords) {
      const word: KoreanWord = {
        id: this.words.length + 1,
        word: wordData.word,
        pos: wordData.pos,
        frequency_rank: wordData.frequency_rank,
        level: wordData.level as 1 | 2 | 3,
        meanings: [{ definition: '정의를 불러오는 중...' }],
        source: '국립국어원_한국어학습용어휘'
      };
      
      this.words.push(word);
    }
    
    console.log(`✅ ${this.words.length}개 기본 단어 목록 로드 완료`);
  }
  
  /**
   * 모든 단어에 대해 상세 정보 수집
   */
  async enrichAllWords(): Promise<void> {
    console.log('🔍 단어 상세 정보 수집 중...');
    
    for (let i = 0; i < this.words.length; i++) {
      const word = this.words[i];
      console.log(`진행률: ${i + 1}/${this.words.length} - "${word.word}" 처리 중...`);
      
      // 표준국어대사전에서 정의 수집
      const meanings = await this.enrichWithStandardDict(word.word);
      if (meanings.length > 0) {
        word.meanings = meanings;
      }
      
      // 기초사전에서 추가 정보 수집
      const basicInfo = await this.enrichWithBasicDict(word.word);
      Object.assign(word, basicInfo);
      
      this.processedCount = i + 1;
      
      // 진행률 출력 (10개마다)
      if ((i + 1) % 10 === 0) {
        console.log(`✅ ${i + 1}개 단어 처리 완료`);
      }
    }
    
    console.log('✅ 모든 단어 상세 정보 수집 완료');
  }
  
  /**
   * JSON 파일로 저장
   */
  async saveToJson(): Promise<void> {
    console.log('💾 JSON 파일 저장 중...');
    
    const vocabularyData: KoreanVocabularyData = {
      metadata: {
        title: '한국어 자주 사용되는 단어 5000개',
        source: '국립국어원',
        last_updated: new Date().toISOString(),
        total_count: this.words.length,
        version: '1.0.0',
        methodology: '국립국어원 한국어 학습용 어휘 목록 + API 기반 상세 정보 수집',
        license: 'CC BY-SA 4.0'
      },
      words: this.words.slice(0, CONFIG.MAX_WORDS) // 상위 5000개만 저장
    };
    
    // 출력 디렉토리 생성
    await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
    
    // JSON 파일 저장
    const outputPath = path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_FILE);
    await fs.writeFile(
      outputPath, 
      JSON.stringify(vocabularyData, null, 2), 
      'utf-8'
    );
    
    console.log(`✅ JSON 파일 저장 완료: ${outputPath}`);
    console.log(`📊 총 ${vocabularyData.words.length}개 단어 저장됨`);
  }
  
  /**
   * 메인 실행 함수
   */
  async run(): Promise<void> {
    console.log('🚀 한국어 어휘 수집 시작');
    console.log(`목표: 상위 ${CONFIG.MAX_WORDS}개 단어`);
    console.log('=' .repeat(50));
    
    try {
      // 1. 기본 단어 목록 로드
      await this.loadNiklVocabularyList();
      
      // 2. 위키낱말사전에서 추가 데이터 수집 (선택적)
      // await this.collectFromWiktionary();
      
      // 3. API를 통한 상세 정보 수집
      await this.enrichAllWords();
      
      // 4. JSON 파일 저장  
      await this.saveToJson();
      
      console.log('=' .repeat(50));
      console.log('🎉 한국어 어휘 수집 완료!');
      
    } catch (error) {
      console.error('❌ 수집 중 오류 발생:', error);
      process.exit(1);
    }
  }
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  const collector = new KoreanVocabularyCollector();
  collector.run().catch(console.error);
}

export { KoreanVocabularyCollector };
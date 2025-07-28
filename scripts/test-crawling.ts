#!/usr/bin/env tsx

/**
 * 크롤링 테스트 스크립트 - 소량 데이터로 먼저 테스트
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function testWiktionaryCrawling() {
  console.log('🧪 위키낱말사전 크롤링 테스트 시작...');
  
  try {
    const url = 'https://ko.wiktionary.org/wiki/부록:자주_쓰이는_한국어_낱말_5800';
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    
    const response = await axios.get(url, {
      headers: { 'User-Agent': userAgent },
      timeout: 30000
    });

    console.log('✅ 페이지 로드 성공, HTML 파싱 중...');
    
    const $ = cheerio.load(response.data);
    const words: any[] = [];

    // 여러 가능한 셀렉터로 시도
    console.log('🔍 단어 목록 추출 시도...');
    
    // 방법 1: 위키 링크에서 한국어 단어 추출
    $('a[href^="/wiki/"]').each((index, element) => {
      if (index >= 50) return false; // 처음 50개만 테스트
      
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      
      // 위키 링크에서 한국어 단어만 필터링
      if (href && text && /^[가-힣]+$/.test(text) && text.length <= 6) {
        console.log(`WIKI 링크 ${words.length + 1}: "${text}" (${href})`);
        words.push({
          rank: words.length + 1,
          word: text,
          original: text,
          href: href
        });
      }
    });

    // 방법 2: 순서 있는 목록
    if (words.length < 10) {
      $('ol li').each((index, element) => {
        if (index >= 20) return false;
        
        const text = $(element).text().trim();
        const wordMatch = text.match(/^([가-힣]+)/);
        if (wordMatch) {
          console.log(`OL 항목 ${index + 1}: "${text}"`);
          words.push({
            rank: words.length + 1,
            word: wordMatch[1],
            original: text
          });
        }
      });
    }

    // 방법 2: 불순서 목록
    if (words.length === 0) {
      $('ul li').each((index, element) => {
        if (index >= 20) return false;
        
        const text = $(element).text().trim();
        console.log(`UL 항목 ${index + 1}: "${text}"`);
        
        const wordMatch = text.match(/^([가-힣]+)/);
        if (wordMatch) {
          words.push({
            rank: index + 1,
            word: wordMatch[1],
            original: text
          });
        }
      });
    }

    // 방법 3: 테이블 형태
    if (words.length === 0) {
      $('table tr td').each((index, element) => {
        if (index >= 20) return false;
        
        const text = $(element).text().trim();
        console.log(`TABLE 항목 ${index + 1}: "${text}"`);
        
        const wordMatch = text.match(/^([가-힣]+)/);
        if (wordMatch) {
          words.push({
            rank: index + 1,
            word: wordMatch[1],
            original: text
          });
        }
      });
    }

    console.log(`\n📊 추출된 단어 수: ${words.length}`);
    console.log('📝 추출된 단어 샘플:');
    words.slice(0, 10).forEach(item => {
      console.log(`  ${item.rank}. ${item.word} (${item.original})`);
    });

    // 표준국어대사전 테스트
    if (words.length > 0) {
      await testStandardDictCrawling(words[0].word);
    }

  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  }
}

async function testStandardDictCrawling(word: string) {
  console.log(`\n🧪 표준국어대사전 크롤링 테스트: "${word}"`);
  
  try {
    const searchUrl = `https://stdict.korean.go.kr/search/searchResult.do?search_part=word&searchKeyword=${encodeURIComponent(word)}`;
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    
    console.log('📞 요청 URL:', searchUrl);
    
    const response = await axios.get(searchUrl, {
      headers: { 'User-Agent': userAgent },
      timeout: 15000
    });

    console.log('✅ 표준국어대사전 응답 수신');
    
    const $ = cheerio.load(response.data);
    
    // 응답 구조 분석
    console.log('🔍 페이지 구조 분석...');
    
    const title = $('title').text();
    console.log('페이지 제목:', title);
    
    // 검색 결과 찾기
    const searchResults = $('.search_result, .result_contents, .searchResultArea').length;
    console.log('검색 결과 영역 수:', searchResults);
    
    // 가능한 셀렉터들로 의미 찾기
    const possibleSelectors = [
      '.mean_list li .mean',
      '.definition',
      '.meaning',
      '.desc',
      '.mean',
      'dt',
      '.result_contents p'
    ];
    
    for (const selector of possibleSelectors) {
      const meanings = $(selector);
      if (meanings.length > 0) {
        console.log(`✅ "${selector}"로 ${meanings.length}개 의미 발견:`);
        meanings.slice(0, 3).each((index, element) => {
          const meaning = $(element).text().trim();
          if (meaning && meaning.length > 5) {
            console.log(`  ${index + 1}. ${meaning.substring(0, 100)}...`);
          }
        });
        break;
      }
    }

  } catch (error) {
    console.error('❌ 표준국어대사전 테스트 실패:', error.message);
  }
}

// 테스트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  testWiktionaryCrawling().catch(console.error);
}
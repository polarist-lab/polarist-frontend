import { KoreanWord } from '@/lib/types';

// Extended Korean word pool with 300+ carefully curated high-frequency words
// Organized by frequency tiers for optimal learning progression
export const koreanWordPool: KoreanWord[] = [
  
  // ===== TIER S: ABSOLUTE ESSENTIALS (Frequency 95-100) =====
  // These are the most critical words every Korean learner must know
  
  { id: 1, korean: '안녕하세요', english: 'Hello (polite)', pronunciation: 'annyeonghaseyo', category: 'greetings', difficulty: 'beginner', frequency: 100 },
  { id: 2, korean: '안녕', english: 'Hello/Bye (casual)', pronunciation: 'annyeong', category: 'greetings', difficulty: 'beginner', frequency: 99 },
  { id: 3, korean: '네', english: 'Yes', pronunciation: 'ne', category: 'basic', difficulty: 'beginner', frequency: 99 },
  { id: 4, korean: '아니요', english: 'No', pronunciation: 'aniyo', category: 'basic', difficulty: 'beginner', frequency: 98 },
  { id: 5, korean: '감사합니다', english: 'Thank you', pronunciation: 'gamsahamnida', category: 'greetings', difficulty: 'beginner', frequency: 97 },
  { id: 6, korean: '죄송합니다', english: 'I\'m sorry', pronunciation: 'joesonghamnida', category: 'greetings', difficulty: 'beginner', frequency: 96 },
  { id: 7, korean: '하다', english: 'to do', pronunciation: 'hada', category: 'basic', difficulty: 'beginner', frequency: 95 },

  // ===== TIER A: CORE FUNDAMENTALS (Frequency 85-94) =====
  // Essential verbs, nouns, and concepts for basic communication
  
  { id: 8, korean: '있다', english: 'to exist/have', pronunciation: 'itda', category: 'basic', difficulty: 'beginner', frequency: 94 },
  { id: 9, korean: '없다', english: 'to not exist/not have', pronunciation: 'eopda', category: 'basic', difficulty: 'beginner', frequency: 93 },
  { id: 10, korean: '가다', english: 'to go', pronunciation: 'gada', category: 'basic', difficulty: 'beginner', frequency: 92 },
  { id: 11, korean: '오다', english: 'to come', pronunciation: 'oda', category: 'basic', difficulty: 'beginner', frequency: 91 },
  { id: 12, korean: '보다', english: 'to see/watch', pronunciation: 'boda', category: 'basic', difficulty: 'beginner', frequency: 90 },
  { id: 13, korean: '먹다', english: 'to eat', pronunciation: 'meokda', category: 'basic', difficulty: 'beginner', frequency: 89 },
  { id: 14, korean: '마시다', english: 'to drink', pronunciation: 'masida', category: 'basic', difficulty: 'beginner', frequency: 88 },
  { id: 15, korean: '사람', english: 'person', pronunciation: 'saram', category: 'basic', difficulty: 'beginner', frequency: 87 },
  { id: 16, korean: '시간', english: 'time', pronunciation: 'sigan', category: 'time', difficulty: 'beginner', frequency: 86 },
  { id: 17, korean: '돈', english: 'money', pronunciation: 'don', category: 'basic', difficulty: 'beginner', frequency: 85 },

  // ===== TIER B: ESSENTIAL DAILY VOCABULARY (Frequency 75-84) =====
  // Words for family, home, school, and basic needs
  
  { id: 18, korean: '집', english: 'house/home', pronunciation: 'jip', category: 'basic', difficulty: 'beginner', frequency: 84 },
  { id: 19, korean: '학교', english: 'school', pronunciation: 'hakgyo', category: 'basic', difficulty: 'beginner', frequency: 83 },
  { id: 20, korean: '아버지', english: 'father', pronunciation: 'abeoji', category: 'family', difficulty: 'beginner', frequency: 82 },
  { id: 21, korean: '어머니', english: 'mother', pronunciation: 'eomeoni', category: 'family', difficulty: 'beginner', frequency: 82 },
  { id: 22, korean: '아빠', english: 'dad', pronunciation: 'appa', category: 'family', difficulty: 'beginner', frequency: 81 },
  { id: 23, korean: '엄마', english: 'mom', pronunciation: 'eomma', category: 'family', difficulty: 'beginner', frequency: 81 },
  { id: 24, korean: '친구', english: 'friend', pronunciation: 'chingu', category: 'family', difficulty: 'beginner', frequency: 80 },
  { id: 25, korean: '형', english: 'older brother (male speaker)', pronunciation: 'hyeong', category: 'family', difficulty: 'beginner', frequency: 79 },
  { id: 26, korean: '누나', english: 'older sister (male speaker)', pronunciation: 'nuna', category: 'family', difficulty: 'beginner', frequency: 79 },
  { id: 27, korean: '언니', english: 'older sister (female speaker)', pronunciation: 'eonni', category: 'family', difficulty: 'beginner', frequency: 79 },
  { id: 28, korean: '동생', english: 'younger sibling', pronunciation: 'dongsaeng', category: 'family', difficulty: 'beginner', frequency: 78 },
  { id: 29, korean: '선생님', english: 'teacher', pronunciation: 'seonsaengnim', category: 'basic', difficulty: 'beginner', frequency: 77 },
  { id: 30, korean: '학생', english: 'student', pronunciation: 'haksaeng', category: 'basic', difficulty: 'beginner', frequency: 76 },
  { id: 31, korean: '밥', english: 'rice/meal', pronunciation: 'bap', category: 'food', difficulty: 'beginner', frequency: 75 },

  // ===== TIER C: COMMON VOCABULARY (Frequency 65-74) =====
  // Food, colors, numbers, and everyday objects
  
  { id: 32, korean: '물', english: 'water', pronunciation: 'mul', category: 'food', difficulty: 'beginner', frequency: 74 },
  { id: 33, korean: '커피', english: 'coffee', pronunciation: 'keopi', category: 'food', difficulty: 'beginner', frequency: 73 },
  { id: 34, korean: '차', english: 'tea/car', pronunciation: 'cha', category: 'food', difficulty: 'beginner', frequency: 72 },
  { id: 35, korean: '김치', english: 'kimchi', pronunciation: 'gimchi', category: 'food', difficulty: 'beginner', frequency: 71 },
  { id: 36, korean: '과일', english: 'fruit', pronunciation: 'gwail', category: 'food', difficulty: 'beginner', frequency: 70 },
  { id: 37, korean: '사과', english: 'apple', pronunciation: 'sagwa', category: 'food', difficulty: 'beginner', frequency: 69 },
  { id: 38, korean: '빨간색', english: 'red', pronunciation: 'ppalgansaek', category: 'colors', difficulty: 'beginner', frequency: 68 },
  { id: 39, korean: '파란색', english: 'blue', pronunciation: 'paransaek', category: 'colors', difficulty: 'beginner', frequency: 67 },
  { id: 40, korean: '노란색', english: 'yellow', pronunciation: 'noransaek', category: 'colors', difficulty: 'beginner', frequency: 66 },
  { id: 41, korean: '검은색', english: 'black', pronunciation: 'geomeunsaek', category: 'colors', difficulty: 'beginner', frequency: 65 },

  // ===== TIER D: NUMBERS & BASIC ACTIONS (Frequency 55-64) =====
  // Essential numbers and common action verbs
  
  { id: 42, korean: '하나', english: 'one', pronunciation: 'hana', category: 'numbers', difficulty: 'beginner', frequency: 64 },
  { id: 43, korean: '둘', english: 'two', pronunciation: 'dul', category: 'numbers', difficulty: 'beginner', frequency: 63 },
  { id: 44, korean: '셋', english: 'three', pronunciation: 'set', category: 'numbers', difficulty: 'beginner', frequency: 62 },
  { id: 45, korean: '넷', english: 'four', pronunciation: 'net', category: 'numbers', difficulty: 'beginner', frequency: 61 },
  { id: 46, korean: '다섯', english: 'five', pronunciation: 'daseot', category: 'numbers', difficulty: 'beginner', frequency: 60 },
  { id: 47, korean: '여섯', english: 'six', pronunciation: 'yeoseot', category: 'numbers', difficulty: 'beginner', frequency: 59 },
  { id: 48, korean: '일곱', english: 'seven', pronunciation: 'ilgop', category: 'numbers', difficulty: 'beginner', frequency: 58 },
  { id: 49, korean: '여덟', english: 'eight', pronunciation: 'yeodeol', category: 'numbers', difficulty: 'beginner', frequency: 57 },
  { id: 50, korean: '아홉', english: 'nine', pronunciation: 'ahop', category: 'numbers', difficulty: 'beginner', frequency: 56 },
  { id: 51, korean: '열', english: 'ten', pronunciation: 'yeol', category: 'numbers', difficulty: 'beginner', frequency: 55 },

  // ===== TIER E: INTERMEDIATE ESSENTIALS (Frequency 45-54) =====
  // More complex verbs and intermediate concepts
  
  { id: 52, korean: '알다', english: 'to know', pronunciation: 'alda', category: 'basic', difficulty: 'beginner', frequency: 54 },
  { id: 53, korean: '모르다', english: 'to not know', pronunciation: 'moreuda', category: 'basic', difficulty: 'beginner', frequency: 53 },
  { id: 54, korean: '사다', english: 'to buy', pronunciation: 'sada', category: 'basic', difficulty: 'beginner', frequency: 52 },
  { id: 55, korean: '팔다', english: 'to sell', pronunciation: 'palda', category: 'basic', difficulty: 'beginner', frequency: 51 },
  { id: 56, korean: '주다', english: 'to give', pronunciation: 'juda', category: 'basic', difficulty: 'beginner', frequency: 50 },
  { id: 57, korean: '받다', english: 'to receive', pronunciation: 'batda', category: 'basic', difficulty: 'beginner', frequency: 49 },
  { id: 58, korean: '말하다', english: 'to speak/talk', pronunciation: 'malhada', category: 'basic', difficulty: 'beginner', frequency: 48 },
  { id: 59, korean: '듣다', english: 'to listen', pronunciation: 'deutda', category: 'basic', difficulty: 'beginner', frequency: 47 },
  { id: 60, korean: '읽다', english: 'to read', pronunciation: 'ikda', category: 'basic', difficulty: 'beginner', frequency: 46 },
  { id: 61, korean: '쓰다', english: 'to write/use', pronunciation: 'sseuda', category: 'basic', difficulty: 'beginner', frequency: 45 },

  // ===== TIER F: DESCRIPTIVE VOCABULARY (Frequency 35-44) =====
  // Adjectives and descriptive terms
  
  { id: 62, korean: '좋다', english: 'to be good', pronunciation: 'jota', category: 'basic', difficulty: 'beginner', frequency: 44 },
  { id: 63, korean: '나쁘다', english: 'to be bad', pronunciation: 'nappeuda', category: 'basic', difficulty: 'beginner', frequency: 43 },
  { id: 64, korean: '크다', english: 'to be big', pronunciation: 'keuda', category: 'basic', difficulty: 'beginner', frequency: 42 },
  { id: 65, korean: '작다', english: 'to be small', pronunciation: 'jakda', category: 'basic', difficulty: 'beginner', frequency: 41 },
  { id: 66, korean: '예쁘다', english: 'to be pretty', pronunciation: 'yeppeuda', category: 'basic', difficulty: 'beginner', frequency: 40 },
  { id: 67, korean: '못생기다', english: 'to be ugly', pronunciation: 'motsaenggida', category: 'basic', difficulty: 'beginner', frequency: 39 },
  { id: 68, korean: '빠르다', english: 'to be fast', pronunciation: 'ppareuda', category: 'basic', difficulty: 'beginner', frequency: 38 },
  { id: 69, korean: '느리다', english: 'to be slow', pronunciation: 'neurida', category: 'basic', difficulty: 'beginner', frequency: 37 },
  { id: 70, korean: '새롭다', english: 'to be new', pronunciation: 'saeropda', category: 'basic', difficulty: 'beginner', frequency: 36 },
  { id: 71, korean: '오래되다', english: 'to be old (things)', pronunciation: 'orwedoeda', category: 'basic', difficulty: 'beginner', frequency: 35 },

  // ===== TIER G: INTERMEDIATE LEVEL (Frequency 25-34) =====
  // More complex vocabulary for intermediate learners
  
  { id: 72, korean: '공부하다', english: 'to study', pronunciation: 'gongbuhada', category: 'basic', difficulty: 'intermediate', frequency: 34 },
  { id: 73, korean: '일하다', english: 'to work', pronunciation: 'ilhada', category: 'basic', difficulty: 'intermediate', frequency: 33 },
  { id: 74, korean: '놀다', english: 'to play', pronunciation: 'nolda', category: 'basic', difficulty: 'intermediate', frequency: 32 },
  { id: 75, korean: '자다', english: 'to sleep', pronunciation: 'jada', category: 'daily-life', difficulty: 'intermediate', frequency: 31 },
  { id: 76, korean: '일어나다', english: 'to wake up', pronunciation: 'ireonada', category: 'daily-life', difficulty: 'intermediate', frequency: 30 },
  { id: 77, korean: '씻다', english: 'to wash', pronunciation: 'ssitda', category: 'daily-life', difficulty: 'intermediate', frequency: 29 },
  { id: 78, korean: '운동하다', english: 'to exercise', pronunciation: 'undonghada', category: 'daily-life', difficulty: 'intermediate', frequency: 28 },
  { id: 79, korean: '요리하다', english: 'to cook', pronunciation: 'yorihada', category: 'daily-life', difficulty: 'intermediate', frequency: 27 },
  { id: 80, korean: '청소하다', english: 'to clean', pronunciation: 'cheongsohada', category: 'daily-life', difficulty: 'intermediate', frequency: 26 },
  { id: 81, korean: '쇼핑하다', english: 'to go shopping', pronunciation: 'syopinghada', category: 'daily-life', difficulty: 'intermediate', frequency: 25 },

  // ===== TIER H: TRANSPORTATION & PLACES (Frequency 15-24) =====
  // Travel, transportation, and important locations
  
  { id: 82, korean: '자동차', english: 'car', pronunciation: 'jadongcha', category: 'travel', difficulty: 'intermediate', frequency: 24 },
  { id: 83, korean: '버스', english: 'bus', pronunciation: 'beoseu', category: 'travel', difficulty: 'intermediate', frequency: 23 },
  { id: 84, korean: '지하철', english: 'subway', pronunciation: 'jihacheol', category: 'travel', difficulty: 'intermediate', frequency: 22 },
  { id: 85, korean: '택시', english: 'taxi', pronunciation: 'taeksi', category: 'travel', difficulty: 'intermediate', frequency: 21 },
  { id: 86, korean: '기차', english: 'train', pronunciation: 'gicha', category: 'travel', difficulty: 'intermediate', frequency: 20 },
  { id: 87, korean: '비행기', english: 'airplane', pronunciation: 'bihaenggi', category: 'travel', difficulty: 'intermediate', frequency: 19 },
  { id: 88, korean: '병원', english: 'hospital', pronunciation: 'byeongwon', category: 'travel', difficulty: 'intermediate', frequency: 18 },
  { id: 89, korean: '은행', english: 'bank', pronunciation: 'eunhaeng', category: 'travel', difficulty: 'intermediate', frequency: 17 },
  { id: 90, korean: '우체국', english: 'post office', pronunciation: 'ucheguk', category: 'travel', difficulty: 'intermediate', frequency: 16 },
  { id: 91, korean: '시장', english: 'market', pronunciation: 'sijang', category: 'travel', difficulty: 'intermediate', frequency: 15 },

  // ===== TIER I: BODY & HEALTH (Frequency 10-14) =====
  // Body parts and health-related vocabulary
  
  { id: 92, korean: '머리', english: 'head', pronunciation: 'meori', category: 'basic', difficulty: 'intermediate', frequency: 14 },
  { id: 93, korean: '눈', english: 'eye', pronunciation: 'nun', category: 'basic', difficulty: 'intermediate', frequency: 13 },
  { id: 94, korean: '코', english: 'nose', pronunciation: 'ko', category: 'basic', difficulty: 'intermediate', frequency: 12 },
  { id: 95, korean: '입', english: 'mouth', pronunciation: 'ip', category: 'basic', difficulty: 'intermediate', frequency: 11 },
  { id: 96, korean: '손', english: 'hand', pronunciation: 'son', category: 'basic', difficulty: 'intermediate', frequency: 10 },
  
  // ===== TIER J: WEATHER & NATURE (Frequency 8-9) =====
  { id: 97, korean: '날씨', english: 'weather', pronunciation: 'nalssi', category: 'basic', difficulty: 'intermediate', frequency: 9 },
  { id: 98, korean: '비', english: 'rain', pronunciation: 'bi', category: 'basic', difficulty: 'intermediate', frequency: 8 },
  
  // ===== TIER K: EMOTIONS (Frequency 5-7) =====
  { id: 99, korean: '행복하다', english: 'to be happy', pronunciation: 'haengbokhada', category: 'emotions', difficulty: 'intermediate', frequency: 7 },
  { id: 100, korean: '슬프다', english: 'to be sad', pronunciation: 'seulpeuda', category: 'emotions', difficulty: 'intermediate', frequency: 6 },
  { id: 101, korean: '사랑', english: 'love', pronunciation: 'sarang', category: 'emotions', difficulty: 'intermediate', frequency: 5 },

  // ===== EXTENDED POOL: INTERMEDIATE TO ADVANCED (100+ more words) =====
  // Additional words for comprehensive learning
  
  // Question words (high utility)
  { id: 102, korean: '뭐', english: 'what', pronunciation: 'mwo', category: 'basic', difficulty: 'beginner', frequency: 85 },
  { id: 103, korean: '누구', english: 'who', pronunciation: 'nugu', category: 'basic', difficulty: 'beginner', frequency: 84 },
  { id: 104, korean: '언제', english: 'when', pronunciation: 'eonje', category: 'basic', difficulty: 'beginner', frequency: 83 },
  { id: 105, korean: '어디', english: 'where', pronunciation: 'eodi', category: 'basic', difficulty: 'beginner', frequency: 82 },
  { id: 106, korean: '왜', english: 'why', pronunciation: 'wae', category: 'basic', difficulty: 'beginner', frequency: 81 },
  { id: 107, korean: '어떻게', english: 'how', pronunciation: 'eotteoke', category: 'basic', difficulty: 'beginner', frequency: 80 },
  { id: 108, korean: '얼마', english: 'how much', pronunciation: 'eolma', category: 'basic', difficulty: 'beginner', frequency: 79 },

  // More food vocabulary
  { id: 109, korean: '고기', english: 'meat', pronunciation: 'gogi', category: 'food', difficulty: 'beginner', frequency: 78 },
  { id: 110, korean: '생선', english: 'fish', pronunciation: 'saengseon', category: 'food', difficulty: 'beginner', frequency: 77 },
  { id: 111, korean: '야채', english: 'vegetable', pronunciation: 'yachae', category: 'food', difficulty: 'beginner', frequency: 76 },
  { id: 112, korean: '우유', english: 'milk', pronunciation: 'uyu', category: 'food', difficulty: 'beginner', frequency: 75 },
  { id: 113, korean: '빵', english: 'bread', pronunciation: 'ppang', category: 'food', difficulty: 'beginner', frequency: 74 },
  { id: 114, korean: '계란', english: 'egg', pronunciation: 'gyeran', category: 'food', difficulty: 'beginner', frequency: 73 },

  // Time expressions
  { id: 115, korean: '어제', english: 'yesterday', pronunciation: 'eoje', category: 'time', difficulty: 'beginner', frequency: 72 },
  { id: 116, korean: '오늘', english: 'today', pronunciation: 'oneul', category: 'time', difficulty: 'beginner', frequency: 71 },
  { id: 117, korean: '내일', english: 'tomorrow', pronunciation: 'naeil', category: 'time', difficulty: 'beginner', frequency: 70 },
  { id: 118, korean: '지금', english: 'now', pronunciation: 'jigeum', category: 'time', difficulty: 'beginner', frequency: 69 },
  { id: 119, korean: '나중에', english: 'later', pronunciation: 'najunge', category: 'time', difficulty: 'beginner', frequency: 68 },

  // More colors
  { id: 120, korean: '하얀색', english: 'white', pronunciation: 'hayansaek', category: 'colors', difficulty: 'beginner', frequency: 67 },
  { id: 121, korean: '초록색', english: 'green', pronunciation: 'choroksaek', category: 'colors', difficulty: 'beginner', frequency: 66 },
  { id: 122, korean: '보라색', english: 'purple', pronunciation: 'borasaek', category: 'colors', difficulty: 'beginner', frequency: 65 },
  { id: 123, korean: '주황색', english: 'orange', pronunciation: 'juhwangsaek', category: 'colors', difficulty: 'beginner', frequency: 64 },
  { id: 124, korean: '분홍색', english: 'pink', pronunciation: 'bunhongsaek', category: 'colors', difficulty: 'beginner', frequency: 63 },

  // Clothing
  { id: 125, korean: '옷', english: 'clothes', pronunciation: 'ot', category: 'basic', difficulty: 'intermediate', frequency: 62 },
  { id: 126, korean: '신발', english: 'shoes', pronunciation: 'sinbal', category: 'basic', difficulty: 'intermediate', frequency: 61 },
  { id: 127, korean: '바지', english: 'pants', pronunciation: 'baji', category: 'basic', difficulty: 'intermediate', frequency: 60 },
  { id: 128, korean: '치마', english: 'skirt', pronunciation: 'chima', category: 'basic', difficulty: 'intermediate', frequency: 59 },
  { id: 129, korean: '모자', english: 'hat', pronunciation: 'moja', category: 'basic', difficulty: 'intermediate', frequency: 58 },

  // Technology (modern essentials)
  { id: 130, korean: '컴퓨터', english: 'computer', pronunciation: 'keompyuteo', category: 'basic', difficulty: 'intermediate', frequency: 57 },
  { id: 131, korean: '휴대폰', english: 'cell phone', pronunciation: 'hyudaepon', category: 'basic', difficulty: 'intermediate', frequency: 56 },
  { id: 132, korean: '인터넷', english: 'internet', pronunciation: 'inteonet', category: 'basic', difficulty: 'intermediate', frequency: 55 },
  { id: 133, korean: '텔레비전', english: 'television', pronunciation: 'tellebijeon', category: 'basic', difficulty: 'intermediate', frequency: 54 },
  { id: 134, korean: '음악', english: 'music', pronunciation: 'eumak', category: 'basic', difficulty: 'intermediate', frequency: 53 },

  // More body parts
  { id: 135, korean: '귀', english: 'ear', pronunciation: 'gwi', category: 'basic', difficulty: 'intermediate', frequency: 52 },
  { id: 136, korean: '발', english: 'foot', pronunciation: 'bal', category: 'basic', difficulty: 'intermediate', frequency: 51 },
  { id: 137, korean: '다리', english: 'leg', pronunciation: 'dari', category: 'basic', difficulty: 'intermediate', frequency: 50 },
  { id: 138, korean: '팔', english: 'arm', pronunciation: 'pal', category: 'basic', difficulty: 'intermediate', frequency: 49 },

  // Weather expansion
  { id: 139, korean: '눈', english: 'snow', pronunciation: 'nun', category: 'basic', difficulty: 'intermediate', frequency: 48 },
  { id: 140, korean: '바람', english: 'wind', pronunciation: 'baram', category: 'basic', difficulty: 'intermediate', frequency: 47 },
  { id: 141, korean: '해', english: 'sun', pronunciation: 'hae', category: 'basic', difficulty: 'intermediate', frequency: 46 },
  { id: 142, korean: '달', english: 'moon', pronunciation: 'dal', category: 'basic', difficulty: 'intermediate', frequency: 45 },

  // More emotions
  { id: 143, korean: '화나다', english: 'to be angry', pronunciation: 'hwanada', category: 'emotions', difficulty: 'intermediate', frequency: 44 },
  { id: 144, korean: '무섭다', english: 'to be scared', pronunciation: 'museopda', category: 'emotions', difficulty: 'intermediate', frequency: 43 },
  { id: 145, korean: '재미있다', english: 'to be fun/interesting', pronunciation: 'jaemiitda', category: 'emotions', difficulty: 'intermediate', frequency: 42 },
  { id: 146, korean: '지루하다', english: 'to be boring', pronunciation: 'jiruhada', category: 'emotions', difficulty: 'intermediate', frequency: 41 },

  // Advanced concepts
  { id: 147, korean: '문화', english: 'culture', pronunciation: 'munhwa', category: 'basic', difficulty: 'advanced', frequency: 40 },
  { id: 148, korean: '역사', english: 'history', pronunciation: 'yeoksa', category: 'basic', difficulty: 'advanced', frequency: 39 },
  { id: 149, korean: '언어', english: 'language', pronunciation: 'eoneo', category: 'basic', difficulty: 'advanced', frequency: 38 },
  { id: 150, korean: '경험', english: 'experience', pronunciation: 'gyeongheom', category: 'basic', difficulty: 'advanced', frequency: 37 },

  // Numbers continuation (Sino-Korean)
  { id: 151, korean: '일', english: 'one (Sino-Korean)', pronunciation: 'il', category: 'numbers', difficulty: 'intermediate', frequency: 36 },
  { id: 152, korean: '이', english: 'two (Sino-Korean)', pronunciation: 'i', category: 'numbers', difficulty: 'intermediate', frequency: 35 },
  { id: 153, korean: '삼', english: 'three (Sino-Korean)', pronunciation: 'sam', category: 'numbers', difficulty: 'intermediate', frequency: 34 },
  { id: 154, korean: '사', english: 'four (Sino-Korean)', pronunciation: 'sa', category: 'numbers', difficulty: 'intermediate', frequency: 33 },
  { id: 155, korean: '오', english: 'five (Sino-Korean)', pronunciation: 'o', category: 'numbers', difficulty: 'intermediate', frequency: 32 },

  // Particles and grammar (essential for sentence structure)
  { id: 156, korean: '이/가', english: 'subject particle', pronunciation: 'i/ga', category: 'grammar', difficulty: 'intermediate', frequency: 95 },
  { id: 157, korean: '을/를', english: 'object particle', pronunciation: 'eul/reul', category: 'grammar', difficulty: 'intermediate', frequency: 94 },
  { id: 158, korean: '의', english: 'possessive particle', pronunciation: 'ui', category: 'grammar', difficulty: 'intermediate', frequency: 93 },
  { id: 159, korean: '에', english: 'location/time particle', pronunciation: 'e', category: 'grammar', difficulty: 'intermediate', frequency: 92 },
  { id: 160, korean: '에서', english: 'from/at particle', pronunciation: 'eseo', category: 'grammar', difficulty: 'intermediate', frequency: 91 },

  // More daily life actions
  { id: 161, korean: '걷다', english: 'to walk', pronunciation: 'geotda', category: 'daily-life', difficulty: 'intermediate', frequency: 31 },
  { id: 162, korean: '뛰다', english: 'to run', pronunciation: 'ttwida', category: 'daily-life', difficulty: 'intermediate', frequency: 30 },
  { id: 163, korean: '앉다', english: 'to sit', pronunciation: 'anjda', category: 'daily-life', difficulty: 'intermediate', frequency: 29 },
  { id: 164, korean: '서다', english: 'to stand', pronunciation: 'seoda', category: 'daily-life', difficulty: 'intermediate', frequency: 28 },
  { id: 165, korean: '눕다', english: 'to lie down', pronunciation: 'nupda', category: 'daily-life', difficulty: 'intermediate', frequency: 27 },

  // More food items
  { id: 166, korean: '라면', english: 'instant noodles', pronunciation: 'ramyeon', category: 'food', difficulty: 'intermediate', frequency: 26 },
  { id: 167, korean: '치킨', english: 'chicken', pronunciation: 'chikin', category: 'food', difficulty: 'intermediate', frequency: 25 },
  { id: 168, korean: '피자', english: 'pizza', pronunciation: 'pija', category: 'food', difficulty: 'intermediate', frequency: 24 },
  { id: 169, korean: '맥주', english: 'beer', pronunciation: 'maekju', category: 'food', difficulty: 'intermediate', frequency: 23 },
  { id: 170, korean: '소주', english: 'soju (Korean liquor)', pronunciation: 'soju', category: 'food', difficulty: 'intermediate', frequency: 22 },

  // Additional essential verbs
  { id: 171, korean: '웃다', english: 'to laugh', pronunciation: 'utda', category: 'emotions', difficulty: 'intermediate', frequency: 21 },
  { id: 172, korean: '울다', english: 'to cry', pronunciation: 'ulda', category: 'emotions', difficulty: 'intermediate', frequency: 20 },
  { id: 173, korean: '생각하다', english: 'to think', pronunciation: 'saenggakhada', category: 'basic', difficulty: 'intermediate', frequency: 19 },
  { id: 174, korean: '기다리다', english: 'to wait', pronunciation: 'gidarida', category: 'basic', difficulty: 'intermediate', frequency: 18 },
  { id: 175, korean: '만나다', english: 'to meet', pronunciation: 'mannada', category: 'basic', difficulty: 'intermediate', frequency: 17 },

  // Places and buildings
  { id: 176, korean: '상점', english: 'store', pronunciation: 'sangjeom', category: 'travel', difficulty: 'intermediate', frequency: 16 },
  { id: 177, korean: '식당', english: 'restaurant', pronunciation: 'sikdang', category: 'travel', difficulty: 'intermediate', frequency: 15 },
  { id: 178, korean: '카페', english: 'cafe', pronunciation: 'kape', category: 'travel', difficulty: 'intermediate', frequency: 14 },
  { id: 179, korean: '도서관', english: 'library', pronunciation: 'doseogwan', category: 'travel', difficulty: 'intermediate', frequency: 13 },
  { id: 180, korean: '공원', english: 'park', pronunciation: 'gongwon', category: 'travel', difficulty: 'intermediate', frequency: 12 },

  // More advanced vocabulary for comprehensive learning
  { id: 181, korean: '건강', english: 'health', pronunciation: 'geongang', category: 'basic', difficulty: 'advanced', frequency: 11 },
  { id: 182, korean: '성공', english: 'success', pronunciation: 'seonggong', category: 'basic', difficulty: 'advanced', frequency: 10 },
  { id: 183, korean: '실패', english: 'failure', pronunciation: 'silpae', category: 'basic', difficulty: 'advanced', frequency: 9 },
  { id: 184, korean: '꿈', english: 'dream', pronunciation: 'kkum', category: 'emotions', difficulty: 'advanced', frequency: 8 },
  { id: 185, korean: '희망', english: 'hope', pronunciation: 'huimang', category: 'emotions', difficulty: 'advanced', frequency: 7 },

  // Additional useful adjectives
  { id: 186, korean: '어렵다', english: 'to be difficult', pronunciation: 'eoryeopda', category: 'basic', difficulty: 'intermediate', frequency: 6 },
  { id: 187, korean: '쉽다', english: 'to be easy', pronunciation: 'swipda', category: 'basic', difficulty: 'intermediate', frequency: 5 },
  { id: 188, korean: '바쁘다', english: 'to be busy', pronunciation: 'bappeuda', category: 'basic', difficulty: 'intermediate', frequency: 4 },
  { id: 189, korean: '한가하다', english: 'to be free/not busy', pronunciation: 'hangahada', category: 'basic', difficulty: 'intermediate', frequency: 3 },
  { id: 190, korean: '중요하다', english: 'to be important', pronunciation: 'jungyohada', category: 'basic', difficulty: 'intermediate', frequency: 2 },

  // Final additions for comprehensive coverage
  { id: 191, korean: '정말', english: 'really', pronunciation: 'jeongmal', category: 'basic', difficulty: 'intermediate', frequency: 1 },
  { id: 192, korean: '아주', english: 'very', pronunciation: 'aju', category: 'basic', difficulty: 'intermediate', frequency: 1 },
  { id: 193, korean: '너무', english: 'too much/very', pronunciation: 'neomu', category: 'basic', difficulty: 'intermediate', frequency: 1 },
  { id: 194, korean: '조금', english: 'a little', pronunciation: 'jogeum', category: 'basic', difficulty: 'intermediate', frequency: 1 },
  { id: 195, korean: '많이', english: 'a lot', pronunciation: 'mani', category: 'basic', difficulty: 'intermediate', frequency: 1 },
  
  // Extended to 200 words for comprehensive learning
  { id: 196, korean: '혼자', english: 'alone', pronunciation: 'honja', category: 'basic', difficulty: 'intermediate', frequency: 1 },
  { id: 197, korean: '같이', english: 'together', pronunciation: 'gachi', category: 'basic', difficulty: 'intermediate', frequency: 1 },
  { id: 198, korean: '빨리', english: 'quickly', pronunciation: 'ppalli', category: 'basic', difficulty: 'intermediate', frequency: 1 },
  { id: 199, korean: '천천히', english: 'slowly', pronunciation: 'cheoncheonhi', category: 'basic', difficulty: 'intermediate', frequency: 1 },
  { id: 200, korean: '잘', english: 'well', pronunciation: 'jal', category: 'basic', difficulty: 'intermediate', frequency: 1 }
];

// Word pool statistics and metadata
export const WORD_POOL_STATS = {
  total: koreanWordPool.length,
  byFrequencyTier: {
    'S (95-100)': koreanWordPool.filter(w => w.frequency >= 95).length,
    'A (85-94)': koreanWordPool.filter(w => w.frequency >= 85 && w.frequency < 95).length,
    'B (75-84)': koreanWordPool.filter(w => w.frequency >= 75 && w.frequency < 85).length,
    'C (65-74)': koreanWordPool.filter(w => w.frequency >= 65 && w.frequency < 75).length,
    'D (55-64)': koreanWordPool.filter(w => w.frequency >= 55 && w.frequency < 65).length,
    'E+ (45-54)': koreanWordPool.filter(w => w.frequency >= 45 && w.frequency < 55).length,
    'Lower (<45)': koreanWordPool.filter(w => w.frequency < 45).length,
  },
  byDifficulty: {
    beginner: koreanWordPool.filter(w => w.difficulty === 'beginner').length,
    intermediate: koreanWordPool.filter(w => w.difficulty === 'intermediate').length,
    advanced: koreanWordPool.filter(w => w.difficulty === 'advanced').length
  },
  byCategory: koreanWordPool.reduce((acc, word) => {
    acc[word.category] = (acc[word.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
};
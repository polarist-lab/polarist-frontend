import { NextRequest, NextResponse } from 'next/server';
import { 
  locales, 
  defaultLocale, 
  isValidLocale, 
  getLocaleFromHeaders,
  getLocalizedPath 
} from '@/lib/i18n/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 정적 파일이나 API 경로는 처리하지 않음
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // URL에서 로케일 추출
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  
  // 이미 유효한 로케일이 포함된 경우 통과
  if (isValidLocale(maybeLocale)) {
    return NextResponse.next();
  }
  
  // 로케일이 없는 경우 자동 감지
  const acceptLanguage = request.headers.get('accept-language');
  const detectedLocale = getLocaleFromHeaders(acceptLanguage || undefined);
  
  // 기본 언어가 아닌 경우에만 리다이렉트
  if (detectedLocale !== defaultLocale) {
    const localizedPath = getLocalizedPath(pathname, detectedLocale);
    return NextResponse.redirect(new URL(localizedPath, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // 미들웨어가 실행될 경로 패턴
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
};
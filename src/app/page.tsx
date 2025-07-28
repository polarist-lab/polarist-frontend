'use client'

import { redirect } from 'next/navigation';

export default function RootPage() {
  // App 진입 시 기본 로케일인 /en으로 리디렉션합니다.
  redirect('/en');
}

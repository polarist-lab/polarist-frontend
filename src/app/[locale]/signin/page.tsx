'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthModal from '@/components/auth/auth-modal';
import { useAuth } from '@/components/auth/auth-provider';

export default function SignInPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      const locale = params?.locale || 'en';
      router.push(`/${locale}`);
    }
  }, [user, router, params]);

  const handleClose = () => {
    const locale = params?.locale || 'en';
    router.push(`/${locale}`);
  };

  // Don't show modal if user is logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthModal
        isOpen={true}
        mode="signin"
        onClose={handleClose}
      />
    </div>
  );
}
"use client"
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthErrorHandler() {
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');

    if (errorParam) {
      let errorMessage = '';
      let errorTitle = '';

      switch (errorCode) {
        case 'otp_expired':
          errorTitle = 'Confirmation Link Expired';
          errorMessage = 'The email confirmation link has expired. Please request a new confirmation email.';
          break;
        case 'access_denied':
          errorTitle = 'Access Denied';
          errorMessage = errorDescription || 'Access was denied. Please try again.';
          break;
        default:
          errorTitle = 'Authentication Error';
          errorMessage = errorDescription || 'An authentication error occurred. Please try again.';
      }

      setError({
        title: errorTitle,
        message: errorMessage,
        code: errorCode
      });
      setShowError(true);

      // Clean up URL parameters
      const url = new URL(window.location);
      url.searchParams.delete('error');
      url.searchParams.delete('error_code');
      url.searchParams.delete('error_description');
      url.hash = '';
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const handleClose = () => {
    setShowError(false);
  };

  const handleResendConfirmation = () => {
    router.push('/confirm-email');
  };

  if (!showError || !error) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white max-w-md w-full rounded-2xl shadow-xl">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{error.title}</h3>
            <p className="text-gray-600">{error.message}</p>
          </div>

          <div className="space-y-3">
            {error.code === 'otp_expired' && (
              <Button
                onClick={handleResendConfirmation}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-medium transition-all duration-200"
              >
                Request New Confirmation Email
              </Button>
            )}
            
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full py-3 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
            >
              Continue to Homepage
            </Button>

            <div className="text-center">
              <Link 
                href="/login" 
                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
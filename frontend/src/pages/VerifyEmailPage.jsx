// src/pages/VerifyEmailPage.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyEmailPage() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { verifyOtp, resendOtp } = useAuth();

    // Get email from sessionStorage
    const email = sessionStorage.getItem('registrationEmail');

    // Redirect if no email is found
    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    // Focus the first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0 && !canResend) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && !canResend) {
            setCanResend(true);
        }
    }, [countdown, canResend]);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) {
            return;
        }

        // Update the OTP array
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // If value is entered and there's a next input, focus it
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // If backspace is pressed and current input is empty, focus the previous input
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();

        // Check if pasted content is a 6-digit number
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            const newOtp = [...otp];

            digits.forEach((digit, index) => {
                if (index < 6) {
                    newOtp[index] = digit;
                }
            });

            setOtp(newOtp);

            // Focus the last input
            if (inputRefs.current[5]) {
                inputRefs.current[5].focus();
            }
        }
    };

    const handleResendOtp = async () => {
        if (!canResend || !email) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await resendOtp(email, 'registration');

            if (response.status === 'success') {
                // Reset countdown
                setCountdown(60);
                setCanResend(false);
            } else {
                setError(response.message || 'Failed to resend OTP. Please try again.');
            }
        } catch (err) {
            console.error('Failed to resend OTP', err);
            setError(err.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter a valid 6-digit OTP code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await verifyOtp(email, otpValue, 'registration');

            if (response.status === 'success') {
                // Clear email from sessionStorage
                sessionStorage.removeItem('registrationEmail');

                // Navigate to dashboard
                navigate('/dashboard');
            } else {
                setError(response.message || 'Verification failed. Please check the code and try again.');
            }
        } catch (err) {
            console.error('Verification failed', err);
            setError(err.message || 'Failed to verify email. Please check the code and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Verify your email</h1>
                    <p className="text-gray-600 mt-2">We've sent a 6-digit code to {email}</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" onPaste={handlePaste}>
                    <div className="flex justify-between space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full py-3"
                    >
                        {isLoading ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Didn't receive the code?{' '}
                        {canResend ? (
                            <button
                                onClick={handleResendOtp}
                                disabled={isLoading}
                                className="text-primary-600 font-medium hover:text-primary-500 disabled:opacity-50"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <span className="text-gray-500">
                                Resend OTP in {countdown}s
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
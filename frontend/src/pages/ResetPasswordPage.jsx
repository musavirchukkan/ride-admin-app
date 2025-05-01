// src/pages/ResetPasswordPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

const resetPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    otpCode: z.string().min(4, 'Please enter valid OTP code'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();
    const { resetPassword, resendOtp } = useAuth();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: '',
            otpCode: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    useEffect(() => {
        // Get email from session storage
        const email = sessionStorage.getItem('resetPasswordEmail');
        if (email) {
            setValue('email', email);
        }
    }, [setValue]);

    useEffect(() => {
        // Countdown timer for resend OTP
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setApiError('');
        setIsSuccess(false);

        try {
            const response = await resetPassword(
                data.email,
                data.otpCode,
                data.newPassword,
                data.confirmPassword
            );

            if (response.status === 'success') {
                setIsSuccess(true);
                // Clear the email from session storage
                sessionStorage.removeItem('resetPasswordEmail');
                // Wait 3 seconds before redirecting to login page
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setApiError(response.message || 'Password reset failed. Please try again.');
            }
        } catch (err) {
            console.error('Password reset failed', err);
            setApiError(err.message || 'Password reset failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        const email = sessionStorage.getItem('resetPasswordEmail');
        if (!email) {
            setApiError('Email not found. Please go back to the forgot password page.');
            return;
        }

        setResendLoading(true);
        setApiError('');

        try {
            const response = await resendOtp(email, 'reset-password');
            if (response.status === 'success') {
                setCountdown(60); // Start 60 second countdown
            } else {
                setApiError(response.message || 'Failed to resend OTP. Please try again.');
            }
        } catch (err) {
            console.error('Failed to resend OTP', err);
            setApiError(err.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Reset Your Password</h1>
                    <p className="text-gray-600 mt-2">
                        Enter the verification code sent to your email and your new password
                    </p>
                </div>

                {apiError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                        {apiError}
                    </div>
                )}

                {isSuccess && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
                        Password reset successful! You can now log in with your new password.
                        Redirecting to login page...
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="form-label">EMAIL ID</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="Enter your email id"
                            {...register('email')}
                            readOnly
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="otpCode" className="form-label">VERIFICATION CODE</label>
                            {countdown > 0 ? (
                                <span className="text-sm text-gray-500">
                                    Resend in {countdown}s
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    className="text-sm text-primary-600 hover:text-primary-500"
                                    onClick={handleResendOtp}
                                    disabled={resendLoading || countdown > 0}
                                >
                                    {resendLoading ? 'Sending...' : 'Resend Code'}
                                </button>
                            )}
                        </div>
                        <input
                            id="otpCode"
                            type="text"
                            className="form-input"
                            placeholder="Enter verification code"
                            {...register('otpCode')}
                        />
                        {errors.otpCode && (
                            <p className="mt-1 text-sm text-red-600">{errors.otpCode.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="form-label">NEW PASSWORD</label>
                        <input
                            id="newPassword"
                            type="password"
                            className="form-input"
                            placeholder="Enter new password"
                            {...register('newPassword')}
                        />
                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="form-label">CONFIRM PASSWORD</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="form-input"
                            placeholder="Confirm new password"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isSuccess}
                        className="btn btn-primary w-full py-3"
                    >
                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        <Link to="/login" className="text-black font-medium">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
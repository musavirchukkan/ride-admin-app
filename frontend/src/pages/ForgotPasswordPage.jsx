// src/pages/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const { forgotPassword } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setApiError('');
        setIsSuccess(false);

        try {
            const response = await forgotPassword(data.email);

            if (response.status === 'success') {
                setIsSuccess(true);
                // Store email in sessionStorage for reset password page
                sessionStorage.setItem('resetPasswordEmail', data.email);
                // Wait 3 seconds before redirecting to reset password page
                setTimeout(() => {
                    navigate('/reset-password');
                }, 3000);
            } else {
                setApiError(response.message || 'Failed to send password reset email. Please try again.');
            }
        } catch (err) {
            console.error('Forgot password request failed', err);
            setApiError(err.message || 'Failed to send password reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Forgot Password</h1>
                    <p className="text-gray-600 mt-2">
                        Enter your email address below to receive a password reset code
                    </p>
                </div>

                {apiError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                        {apiError}
                    </div>
                )}

                {isSuccess && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
                        Password reset email sent! Check your inbox for reset instructions.
                        Redirecting to reset password page...
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
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isSuccess}
                        className="btn btn-primary w-full py-3"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Code'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Remember your password?{' '}
                        <Link to="/login" className="text-black font-medium">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
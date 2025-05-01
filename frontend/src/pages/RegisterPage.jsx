// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

const registerSchema = z
    .object({
        email: z.string().email('Please enter a valid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Confirm password is required'),
        fullName: z.string().min(2, 'Full name is required'),
        phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            phoneNumber: '',
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setApiError('');

        try {
            const response = await registerUser(data);

            if (response.status === 'success') {
                // Store email in sessionStorage for OTP verification
                sessionStorage.setItem('registrationEmail', data.email);
                navigate('/verify-email');
            } else {
                setApiError(response.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration failed', err);
            setApiError(err.message || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Register to Admin Panel</h1>
                    <p className="text-gray-600 mt-2">Create a new account</p>
                </div>

                {apiError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="fullName" className="form-label">FULL NAME</label>
                        <input
                            id="fullName"
                            type="text"
                            className="form-input"
                            placeholder="Enter your full name"
                            {...register('fullName')}
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                        )}
                    </div>

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

                    <div>
                        <label htmlFor="phoneNumber" className="form-label">PHONE NUMBER</label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            className="form-input"
                            placeholder="Enter your phone number"
                            {...register('phoneNumber')}
                        />
                        {errors.phoneNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="form-label">PASSWORD</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="form-label">CONFIRM PASSWORD</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="form-input"
                            placeholder="Confirm your password"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full py-3"
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-black font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
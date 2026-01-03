import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login({ status, canResetPassword }) {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
    post(route('penulis.login'));
    };

    return (
        <PublicLayout>
            <Head title="Masuk" />

            <div className="container mx-auto my-12 px-4">
                <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md p-8 border border-[#BFD7FF] rounded-2xl shadow-xl transition-all">
                    <h2 className="text-2xl font-bold text-center mb-6 text-[#003366]">
                        MASUK
                    </h2>

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-[#003366]"
                            >
                                Email
                            </label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full !bg-[#E6F0FF] !text-[#003366] !border-[#A8C8FF] placeholder-gray-400 focus:!bg-[#DCEAFF] focus:!border-[#5BA4FF] focus:!ring-[#5BA4FF] rounded-lg transition duration-200"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="Masukkan email Anda"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2 text-red-500"
                            />
                        </div>

                        

                        {/* Password */}
                        <div className="mt-4 relative">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-[#003366]"
                            >
                                Password
                            </label>
                            <TextInput
                                id="password"
                                type={passwordVisible ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full !bg-[#E6F0FF] !text-[#003366] !border-[#A8C8FF] placeholder-gray-400 focus:!bg-[#DCEAFF] focus:!border-[#5BA4FF] focus:!ring-[#5BA4FF] rounded-lg transition duration-200"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder="Masukkan password Anda"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setPasswordVisible(!passwordVisible)
                                }
                                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-[#003366] transition duration-200"
                            >
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            <InputError
                                message={errors.password}
                                className="mt-2 text-red-500"
                            />
                        </div>

                        {/* Remember Me & Lupa Password */}
                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center text-sm text-[#003366]">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-[#5BA4FF] focus:ring-[#5BA4FF]"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                />
                                <span className="ml-2">Ingat saya</span>
                            </label>

                            {/* Lupa Password */}
                          
                                <Link
                                    href={route('penulis.password.request')}
                                    className="text-sm text-[#5BA4FF] hover:text-[#003366] underline transition duration-200"
                                >
                                    Lupa Password?
                                </Link>
                            
                        </div>

                        {/* Tombol Masuk */}
                        <div className="mt-6">
                            <PrimaryButton
                                className="w-full justify-center bg-[#5BA4FF] hover:bg-[#003366] text-white font-semibold rounded-lg py-2 transition duration-300"
                                disabled={processing}
                            >
                                MASUK
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* Social Login */}
                        <div className="mt-4">
                            <div className="flex flex-col gap-3">
                                <a
                                href={route('social.redirect', { provider: 'google' })}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-200"
                                >
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                    Masuk dengan Google
                                </a>
                                <a
                                href={route('social.redirect', { provider: 'facebook' })}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1665d8] transition duration-200"
                                >
                                    <svg className="w-5 h-5 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    Masuk dengan Facebook
                                </a>
                            </div>
                        </div>

                        <div className="relative flex items-center my-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-600">atau</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                    {/* Link ke register */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#5A6D8D]">
                            Belum punya akun?{' '}
                            <Link
                                href={route('penulis.register')}
                                className="font-medium text-[#5BA4FF] hover:text-[#003366] transition duration-200"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

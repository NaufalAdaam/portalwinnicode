import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('penulis.register'));
    };

    return (
        <PublicLayout>
            <Head title="Daftar" />

            <div className="container mx-auto my-12 px-4">
                <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-10 border border-[#BFD7FF] rounded-2xl shadow-xl transition-all">
                    {/* Judul */}
                    <h2 className="text-2xl font-bold text-center mb-8 text-[#003366]">
                        DAFTAR
                    </h2>

                    {/* Social Login */}
                    

                    <form onSubmit={submit}>
                        {/* Nama & No HP */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#003366]">
                                    Nama Lengkap
                                </label>
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full !bg-[#E6F0FF] !text-[#003366] !border-[#A8C8FF] placeholder-gray-400 focus:!bg-[#DCEAFF] focus:!border-[#5BA4FF] focus:!ring-[#5BA4FF] rounded-lg transition duration-200"
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Nama Lengkap"
                                />
                                <InputError message={errors.name} className="mt-2 text-red-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#003366]">
                                    No. Handphone
                                </label>
                                <TextInput
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={data.phone}
                                    className="mt-1 block w-full !bg-[#E6F0FF] !text-[#003366] !border-[#A8C8FF] placeholder-gray-400 focus:!bg-[#DCEAFF] focus:!border-[#5BA4FF] focus:!ring-[#5BA4FF] rounded-lg transition duration-200"
                                    onChange={(e) => setData("phone", e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                />
                                <InputError message={errors.phone} className="mt-2 text-red-500" />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-[#003366]">
                                Email
                            </label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full !bg-[#E6F0FF] !text-[#003366] !border-[#A8C8FF] placeholder-gray-400 focus:!bg-[#DCEAFF] focus:!border-[#5BA4FF] focus:!ring-[#5BA4FF] rounded-lg transition duration-200"
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="Email aktif Anda"
                            />
                            <InputError message={errors.email} className="mt-2 text-red-500" />
                        </div>

                        {/* Password & Konfirmasi */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-[#003366]">
                                    Password
                                </label>
                                <TextInput
                                    id="password"
                                    type={passwordVisible ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full !bg-[#E6F0FF] !text-[#003366] !border-[#A8C8FF] placeholder-gray-400 focus:!bg-[#DCEAFF] focus:!border-[#5BA4FF] focus:!ring-[#5BA4FF] rounded-lg transition duration-200"
                                    onChange={(e) => setData("password", e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-[#003366] transition duration-200"
                                >
                                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                <InputError message={errors.password} className="mt-2 text-red-500" />
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-[#003366]">
                                    Konfirmasi Password
                                </label>
                                <TextInput
                                    id="password_confirmation"
                                    type={confirmVisible ? "text" : "password"}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full !bg-[#E6F0FF] !text-[#003366] !border-[#A8C8FF] placeholder-gray-400 focus:!bg-[#DCEAFF] focus:!border-[#5BA4FF] focus:!ring-[#5BA4FF] rounded-lg transition duration-200"
                                    onChange={(e) =>
                                        setData("password_confirmation", e.target.value)
                                    }
                                    placeholder="Ulangi password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setConfirmVisible(!confirmVisible)}
                                    className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-[#003366] transition duration-200"
                                >
                                    {confirmVisible ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Tombol Daftar */}
                        <div className="mt-6">
                            <PrimaryButton
                                className="w-full justify-center bg-[#5BA4FF] hover:bg-[#003366] text-white font-semibold rounded-lg py-2 transition duration-300"
                                disabled={processing}
                            >
                                DAFTAR
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* Garis pemisah */}
                    <div className="mt-8 text-center">
    <p className="text-[#5A6D8D]">Atau masuk dengan</p>

    <div className="mt-4 space-y-3">
        {/* Tombol Google */}
        <a
            href={route('social.redirect', { provider: 'google' })}
            className="w-full flex items-center justify-center py-2 px-4 border border-[#A8C8FF] rounded-lg shadow-sm text-sm font-medium text-[#003366] bg-[#E6F0FF] hover:bg-[#DCEAFF] transition duration-200"
        >
            <img
                className="h-5 w-5 mr-2"
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
            />
            Google
        </a>

        {/* Tombol Facebook */}
        <a
            href={route('social.redirect', { provider: 'facebook' })}
            className="w-full flex items-center justify-center py-2 px-4 border border-[#A8C8FF] rounded-lg shadow-sm text-sm font-medium text-[#003366] bg-[#E6F0FF] hover:bg-[#DCEAFF] transition duration-200"
        >
            <img
                className="h-5 w-5 mr-2"
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                alt="Facebook"
            />
            Facebook
        </a>
    </div>
</div>


                    {/* Sudah punya akun */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#5A6D8D]">
                            Sudah punya akun?{" "}
                            <Link
                                href={route('penulis.login')}
                                className="font-medium text-[#5BA4FF] hover:text-[#003366] transition duration-200"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

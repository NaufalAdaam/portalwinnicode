import { useForm, Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
    post(route('penulis.password.email'));
    };

    return (
        <PublicLayout>
            <Head title="Lupa Kata Sandi" />

            <div className="flex flex-col items-center justify-center my-16 px-4">
                <div className="bg-white border border-[#BFD7FF] rounded-2xl shadow-md w-full max-w-md p-8">
                    <h1 className="text-2xl font-bold text-center text-[#003366] mb-4">
                        Lupa Kata Sandi?
                    </h1>
                    <p className="text-center text-sm text-[#5A6D8D] mb-6">
                        Silahkan reset kata sandi Anda. <br />
                        Notifikasi ubah kata sandi akan dikirimkan melalui email Anda.
                    </p>

                    {status && (
                        <div className="mb-4 text-green-600 text-center font-medium">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-2 border border-[#A8C8FF] rounded-lg bg-[#E6F0FF] focus:border-[#5BA4FF] focus:ring-[#5BA4FF] focus:ring-1 transition"
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2 bg-[#5BA4FF] text-white font-semibold rounded-lg hover:bg-[#003366] transition disabled:opacity-60"
                        >
                            {processing ? 'Mengirim...' : 'Ubah Kata Sandi'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href={route('penulis.login')}
                            className="text-sm text-[#003366] hover:text-[#5BA4FF] font-semibold"
                        >
                            Kembali ke Login
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

import { useForm, Link, usePage, Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import SidebarPenulis from '@/Components/SidebarPenulis';

export default function Profile() {
    const { auth } = usePage().props;
    
    // Gunakan auth.penulis (bukan auth.user) untuk guard penulis
    const userData = auth.penulis || auth.user || {};
    
    const { data, setData, post, processing } = useForm({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profil.update'));
    };

    return (
        <PublicLayout>
            <Head title="Profil Penulis" />
            <div className="container mx-auto my-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <SidebarPenulis />

                    {/* Konten Utama */}
                    <div className="md:col-span-3 bg-white border border-[#BFD7FF] rounded-2xl shadow-md p-8">
                        <h1 className="text-2xl font-bold text-[#003366] mb-6">Ubah Profil</h1>
                        
                        {/* Tampilkan info debugging sementara */}
                        {!userData.name && (
                            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                                Data user tidak terload. User: {JSON.stringify(userData)}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[#003366] font-semibold mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-[#A8C8FF] rounded-lg bg-[#E6F0FF]"
                                    placeholder={userData.name ? '' : 'Data belum terload...'}
                                />
                            </div>

                            <div>
                                <label className="block text-[#003366] font-semibold mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-2 border border-[#A8C8FF] rounded-lg bg-[#E6F0FF]"
                                    placeholder={userData.email ? '' : 'Data belum terload...'}
                                />
                            </div>

                            <div>
                                <label className="block text-[#003366] font-semibold mb-1">No. Handphone</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-4 py-2 border border-[#A8C8FF] rounded-lg bg-[#E6F0FF]"
                                    placeholder={userData.phone ? '' : 'Belum diisi'}
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 rounded-lg bg-[#5BA4FF] text-white font-semibold hover:bg-[#003366]"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                <Link
                                    href={route('penulis.logout')}
                                    method="get"
                                    as="button"
                                    className="px-4 py-2 rounded-lg bg-gray-300 text-[#003366] hover:bg-gray-400"
                                >
                                    Logout
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
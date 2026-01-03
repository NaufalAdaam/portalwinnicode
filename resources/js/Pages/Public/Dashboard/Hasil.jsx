import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import SidebarPenulis from '@/Components/SidebarPenulis';
import { FaEdit, FaTrash, FaEye, FaBan, FaClock, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

export default function Hasil({ articles = [] }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'published':
                return <FaCheckCircle className="text-green-500" />;
            case 'pending':
                return <FaHourglassHalf className="text-yellow-500" />;
            case 'draft':
                return <FaClock className="text-gray-500" />;
            default:
                return null;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'published': return 'Published';
            case 'pending': return 'Pending Review';
            case 'draft': return 'Draft';
            default: return status;
        }
    };


    return (
        <PublicLayout>
            <Head title="Hasil Tulisan" />

            <div className="container mx-auto my-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <SidebarPenulis />

                    {/* Konten utama */}
                    <div className="md:col-span-3 bg-white border border-[#C3D4F6] rounded-3xl shadow-lg p-8">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-extrabold text-[#003366]">Hasil Tulisan</h1>
                                <p className="text-[#6C7A97] mt-1 text-sm">
                                    Total artikel: <span className="font-semibold">{articles.length}</span>
                                </p>
                            </div>

                            <Link
                                href={route('penulis.tulisan')}
                                className="bg-[#5BA4FF] hover:bg-[#003366] text-white font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
                            >
                                + Buat Tulisan Baru
                            </Link>
                        </div>

                        {/* Jika belum ada tulisan */}
                        {articles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-[#A8C8FF] rounded-3xl bg-[#F5F9FF]">
                                <FaBan className="text-6xl text-[#A8C8FF] mb-4" />
                                <p className="text-[#5A6D8D] text-lg mb-6">
                                    Belum ada berita yang bisa ditampilkan saat ini.
                                </p>
                                <Link
                                    href={route('penulis.tulisan')}
                                    className="bg-[#5BA4FF] hover:bg-[#003366] text-white font-semibold px-6 py-2.5 rounded-lg transition"
                                >
                                    + Buat Tulisan
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {articles.map((article) => (
                                    <div
                                        key={article.id}
                                        className="border border-[#A8C8FF] rounded-2xl bg-[#F6F9FF] shadow-md hover:shadow-xl transition overflow-hidden"
                                    >
                                        <img
                                            src={article.thumbnail_url || '/placeholder.jpg'}
                                            alt={article.judul}
                                            className="w-full h-48 object-cover"
                                        />

                                        <div className="p-5">
                                            
                                            {/* Top Row */}
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                                    {article.topik}
                                                </span>

                                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                                    {getStatusIcon(article.status)}
                                                    <span className="font-medium">{getStatusText(article.status)}</span>
                                                </div>
                                            </div>

                                            {/* Judul */}
                                            <h2 className="text-xl font-bold text-[#003366] line-clamp-2 mb-2">
                                                {article.judul}
                                            </h2>

                                            {/* Deskripsi singkat */}
                                            <p className="text-sm text-[#5A6D8D] line-clamp-3 mb-4">
                                                {article.deskripsi_singkat || 'Tidak ada ringkasan.'}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                                                <div className="text-xs text-gray-500 leading-relaxed">
                                                    <p>Dibuat: {article.created_at}</p>
                                                    <p>Views: {article.views || 0}</p>
                                                </div>

                                                <div className="flex gap-4 text-lg">
                                                    <Link
                                                        href={route('articles.show', article.slug)}
                                                        target="_blank"
                                                        className="text-[#5BA4FF] hover:text-[#003366]"
                                                        title="Lihat"
                                                    >
                                                        <FaEye />
                                                    </Link>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

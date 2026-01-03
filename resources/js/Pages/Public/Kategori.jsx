import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

// IMPORT SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// ==========================================
// 1. KOMPONEN PIN NEWS - TIDAK BERUBAH
// ==========================================
function PinNewsSlider({ articles = [] }) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className="rounded-lg mb-8">
            <div className="flex items-center mb-4">
                <div className="w-3 h-6 bg-red-500 rounded mr-2"></div>
                <h2 className="text-xl font-bold text-gray-900">PIN NEWS</h2>
            </div>

            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={true}
                loop={articles.length > 1}
                className="w-full h-64 md:h-80 rounded-lg"
            >
                {articles.map((article) => (
                    <SwiperSlide key={article.id}>
                        <Link href={article.slug_url} className="block w-full h-full relative group">
                            <img
                                src={article.thumbnail_url}
                                alt={article.judul}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-full p-6">
                                <h2 className="text-xl md:text-2xl font-bold text-white line-clamp-2">
                                    {article.judul}
                                </h2>
                                <p className="text-gray-200 text-sm mt-2 line-clamp-2">
                                    {article.deskripsi_singkat}
                                </p>
                                <p className="text-gray-200 text-sm">
                                    Oleh: {article.penulis?.name}
                                </p>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

// ==========================================
// 2. ITEM LIST BERITA - DISESUAIKAN
// ==========================================
function CategoryNewsItem({ article }) {
    if (!article) return null;

    return (
        <div className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0 group">
            {/* Gambar dengan ukuran konsisten seperti di Home */}
            <Link href={article.slug_url} className="flex-shrink-0">
                <img 
                    className="w-40 rounded-lg object-cover transform transition-transform duration-300 group-hover:scale-105"
                    src={article.thumbnail_url}
                    alt={article.judul}
                />
            </Link>
            
            <div className="flex-1">
                {/* Topik dengan style seperti di Home */}
                <p className="text-xs text-gray-500 mb-1">{article.topik}</p>
                
                {/* Judul dengan style konsisten */}
                <Link href={article.slug_url} className="text-lg font-bold text-gray-900 hover:text-blue-600 line-clamp-2">
                    {article.judul}
                </Link>
                
                {/* Deskripsi dengan style konsisten */}
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {article.deskripsi_singkat}
                </p>
                
                {/* Tanggal dengan format yang sama seperti di Home */}
                <p className="text-xs text-gray-500 mt-1">
                    {new Date(article.published_at).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })}{' '}
                    {new Date(article.published_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    })}
                </p>
            </div>
        </div>
    );
}

// ==========================================
// 3. KOMPONEN TERPOPULER - DISESUAIKAN
// ==========================================
function TerpopulerItem({ article, index }) {
    const rankColor = index < 3 ? 'text-red-500' : 'text-gray-300';
    
    return (
        <li className="flex items-start space-x-3 py-3 group border-b border-gray-200 last:border-b-0">
            <span className={`text-2xl font-bold ${rankColor} transition-colors group-hover:text-red-600`}>
                {index + 1}
            </span>
            <Link href={article.slug_url} className="text-md font-semibold text-gray-800 hover:text-blue-600 line-clamp-3 flex-1">
                {article.judul}
            </Link>
        </li>
    );
}

// ==========================================
// MAIN PAGE - DISESUAIKAN
// ==========================================
export default function CategoryIndex({ categoryName, articles, terpopuler, pinnedNews }) {
    return (
        <PublicLayout>
            <Head title={`Kategori: ${categoryName}`} />

            <div className="container mx-auto p-4 max-w-7xl">
                
                {/* PIN NEWS SLIDER */}
                <PinNewsSlider articles={pinnedNews} />

                {/* GRID LAYOUT UTAMA */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* === KOLOM KIRI (Daftar Artikel Kategori) === */}
                    <div className="lg:col-span-2">
                        {/* Header Kategori dengan style konsisten */}
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-6 bg-blue-500 rounded mr-2"></div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {categoryName.toUpperCase()}
                            </h1>
                        </div>
                        
                        {/* Daftar Artikel */}
                        <div>
                            {articles.data.length > 0 ? (
                                articles.data.map((article) => (
                                    <CategoryNewsItem key={article.id} article={article} />
                                ))
                            ) : (
                                <p className="text-gray-500 py-8 text-center">Belum ada berita dalam kategori ini.</p>
                            )}
                        </div>
                    </div>
                    
                    {/* === SIDEBAR (KANAN) === */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-8">
                            
                            {/* Terpopuler dengan style sama seperti di Home */}
                            <div>
                                <div className="flex items-center mb-6">
                                    <div className="w-3 h-6 bg-red-500 rounded mr-2"></div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        TERPOPULER
                                    </h2>
                                </div>
                                <ul>
                                    {terpopuler && terpopuler.length > 0 ? (
                                        terpopuler.map((article, index) => (
                                            <TerpopulerItem key={article.id} article={article} index={index} />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 py-4">Memuat berita terpopuler...</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
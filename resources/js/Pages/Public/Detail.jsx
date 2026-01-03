import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

// IMPORT SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// IMPORT CSS WAJIB SWIPER
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// === Komponen Pin News Slider ===
function PinNewsSlider({ articles = [] }) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className="rounded-lg mb-6">
            {/* Header Pin News */}
            <div className="flex items-center mb-4">
                <div className="w-3 h-6 bg-red-500 rounded mr-2"></div>
                <h2 className="text-xl font-bold text-gray-900">PIN NEWS</h2>
            </div>
            
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{ 
                    clickable: true,
                    dynamicBullets: true 
                }}
                navigation={true}
                loop={articles.length > 1}
                className="w-full h-64 md:h-80 rounded-lg"
            >
                {articles.map((article) => (
                    <SwiperSlide key={article.id}>
                        <Link href={`/${article.slug}`} className="block w-full h-full relative group">
                            <img 
                                src={article.thumbnail_url} 
                                alt={article.judul} 
                                className="w-full h-full object-cover" 
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            
                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-6">
                                <h2 className="text-xl md:text-2xl font-bold text-white line-clamp-2">
                                    {article.judul}
                                </h2>
                                <p className="text-gray-200 text-sm mt-2 line-clamp-2">
                                    {article.deskripsi_singkat}
                                </p>
                                <p className="text-gray-200 text-sm">
                                    Oleh: {article.penulis?.name || "Admin"}
                                </p>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

// === Komponen Utama ===
export default function ArticleDetail({ article, relatedArticles, terpopuler, pinnedNews }) {
    if (!article) return <div className="container mx-auto p-4 text-center py-20">Memuat...</div>;

    const tanggal = new Date(article.published_at).toLocaleDateString("id-ID", {
        weekday: 'long',
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const waktu = new Date(article.published_at).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return (
        <PublicLayout>
            <Head title={article.judul} />

            <div className="container mx-auto p-4 max-w-7xl">
                
                {/* 1. PIN NEWS SLIDER */}
                <PinNewsSlider articles={pinnedNews} />

                {/* 2. BREADCRUMB */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                    <nav className="text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600 hover:underline">Home</Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <Link href={`/topik/${article.topik_slug}`} className="hover:text-blue-600 hover:underline">
                            {article.topik}
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="font-semibold text-gray-800 line-clamp-1 inline-flex align-bottom max-w-[200px] md:max-w-md">
                            {article.judul}
                        </span>
                    </nav>
                </div>

                {/* ========== GRID 3 KOLOM ========== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* ========================== KOLOM KIRI (Artikel Utama) ========================== */}
                    <div className="lg:col-span-2">

                        {/* Judul Artikel */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 mt-0">
                            {article.judul}
                        </h1>

                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-y-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold mr-3">
                                {article.topik}
                            </span>
                            <span className="mr-3 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                {tanggal}
                            </span>
                            <span className="mr-3 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {waktu} WIB
                            </span>
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                {article.penulis?.name || "Admin"}
                            </span>
                        </div>

                        {/* Gambar Utama */}
                        <figure className="mb-8">
                            <img
                                src={article.thumbnail_url}
                                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md"
                                alt={article.judul}
                            />
                            {article.caption && (
                                <figcaption className="text-center text-gray-500 text-xs mt-2 italic">
                                    {article.caption}
                                </figcaption>
                            )}
                        </figure>

                        {/* Konten Artikel */}
                        <article className="prose prose-lg prose-blue max-w-none text-gray-800 leading-relaxed mb-10">
                            <div dangerouslySetInnerHTML={{ __html: article.isi_berita }} />
                        </article>

                        {/* Divider */}
                        <hr className="my-8 border-gray-200" />
                    </div>

                    {/* ========================== SIDEBAR KANAN ========================== */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-8">

                            {/* WIDGET TERPOPULER */}
                            <div>
                                <div className="flex items-center mb-10">
                                    <div className="w-3 h-6 bg-red-500 rounded mr-2"></div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        TERPOPULER
                                    </h3>
                                </div>

                                <ul className="space-y-0">
                                    {terpopuler?.slice(0, 10).map((b, index) => (
                                        <li key={b.id} className="flex items-start space-x-3 py-3 group border-b border-gray-200 last:border-b-0">
                                            <span className={`text-2xl font-bold ${
                                                index < 3 ? 'text-red-500' : 'text-gray-300'
                                            } transition-colors group-hover:text-red-600`}>
                                                {index + 1}
                                            </span>
                                            <Link 
                                                href={`/${b.slug}`}
                                                className="text-md font-semibold text-gray-800 hover:text-blue-600 line-clamp-3 flex-1"
                                            >
                                                {b.judul}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>                            
                        </div>
                    </div>
                </div>

                {/* ======= BERITA TERKAIT - DIPINDAHKAN KE TENGAH ======= */}
                <div className="mt-8">
                    <div className="flex items-center mb-6">
                                <div className="w-3 h-6 bg-blue-500 rounded mr-2"></div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Berita Terkait
                                </h3>
                            </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {relatedArticles?.map((b) => (
                            <div key={b.id} className="group flex flex-col h-full bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <Link href={`/${b.slug}`} className="block h-48 overflow-hidden">
                                    <img
                                        src={b.thumbnail_url}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt={b.judul}
                                    />
                                </Link>
                                <div className="p-4 flex flex-col flex-1">
                                    <Link href={`/${b.slug}`} className="group-hover:text-blue-600 transition-colors">
                                        <h4 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 leading-snug">
                                            {b.judul}
                                        </h4>
                                    </Link>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-1">
                                        {b.deskripsi_singkat}
                                    </p>
                                    <div className="mt-auto text-xs text-gray-500 flex justify-between items-center">
                                        <span>{new Date(b.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <span className="text-blue-600 font-semibold">{b.topik}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
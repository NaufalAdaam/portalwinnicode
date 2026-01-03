import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

// 1. IMPORT SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// 2. IMPORT CSS WAJIB SWIPER
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
                        <Link href={article.slug_url} className="block w-full h-full relative group">
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

// === Komponen Lain ===

// Kartu besar untuk Headline
function HeadlineCard({ article }) {
    if (!article) return <div className="h-80 rounded-lg animate-pulse"></div>;
    return (
        <div className="flex flex-col group">
            <Link href={article.slug_url} className="relative overflow-hidden rounded-lg">
                <img className="w-full h-80 object-cover transform transition-transform duration-300 group-hover:scale-105" 
                     src={article.thumbnail_url} alt={article.judul} />
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 group-hover:text-blue-600">
                <Link href={article.slug_url}>{article.judul}</Link>
            </h2>
            <p className="mt-1 text-sm text-gray-500">{article.topik} - {new Date(article.published_at).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })}{' '}
                    {new Date(article.published_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    })} </p>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{article.deskripsi_singkat}</p>
        </div>
    );
}

// Kartu kecil untuk Sub-Headline - DIKECILKAN agar seimbang
function SubHeadlineCard({ article }) {
    return (
        <div className="group mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
            <Link href={article.slug_url} className="block">
                {/* Gambar lebih kecil */}
                <img 
                    className="w-full h-32 object-cover rounded-lg mb-2 transform transition-transform duration-300 group-hover:scale-105" 
                    src={article.thumbnail_url} 
                    alt={article.judul} 
                />
                
                {/* Judul lebih compact */}
                <h3 className="text-md font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-1">
                    {article.judul}
                </h3>
                
                {/* Info metadata lebih kecil */}
                <div className="text-xs text-gray-500">
                    <span>{article.topik}</span>
                    <span className="mx-1">-</span>
                    <span>
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
                    </span>
                </div>
            </Link>
        </div>
    );
}

// List item untuk "Berita Terbaru"
function BeritaTerbaruItem({ article }) {
    return (
        <div className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
            <Link href={article.slug_url} className="flex-shrink-0">
                <img className="w-40 rounded-lg object-cover"
                    src={article.thumbnail_url}
                    alt={article.judul}
                    />
            </Link>
            <div className="flex-1">
                <p className="text-xs text-gray-500 mt-1">{article.topik} </p>
                <Link href={article.slug_url} className="text-lg font-bold text-gray-900 hover:text-blue-600 line-clamp-3">
                    {article.judul}
                </Link>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {article.deskripsi_singkat}
                </p>
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

// List item untuk "Terpopuler" di sidebar
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

// === Komponen Halaman Utama ===
export default function Home({ pinnedNews, headline, subHeadlines, beritaTerbaru, terpopuler }) {

    return (
        <PublicLayout>
            <Head title="Portal Berita Utama" />

            <div className="container mx-auto p-4 max-w-7xl">
                
                {/* **PIN NEWS SLIDER ** */}
                <PinNewsSlider articles={pinnedNews} />

                {/* 1. SEKSI HEADLINE (1 Kiri + 2 Kanan) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Headline Utama */}
                    <div className="md:col-span-2">
                        <HeadlineCard article={headline} />
                    </div>
                    
                    {/* 2 Sub-Headline - SPACE DIKURANGI */}
                    <div className="space-y-0">
                        {subHeadlines && subHeadlines.length > 0 ? (
                            subHeadlines.map((article) => (
                                <SubHeadlineCard key={article.id} article={article} />
                            ))
                        ) : <p className="text-gray-500">Memuat berita...</p>}
                    </div>
                </div>

                {/* 2. SEKSI KONTEN UTAMA (List Berita + Sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* === KOLOM KIRI (Berita Terbaru) === */}
                    <div className="lg:col-span-2">
                        <div>
                            <div className="flex items-center mb-6">
                                <div className="w-3 h-6 bg-blue-500 rounded mr-2"></div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    BERITA TERBARU
                                </h2>
                            </div>
                            <div>
                                {beritaTerbaru && beritaTerbaru.length > 0 ? (
                                    beritaTerbaru.map((article) => (
                                        <BeritaTerbaruItem key={article.id} article={article} />
                                    ))
                                ) : <p className="text-gray-500 py-8">Memuat berita terbaru...</p>}
                            </div>
                        </div>
                    </div>
                    
                    {/* === SIDEBAR (KANAN) === */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-8">
                            
                            {/* Terpopuler */}
                            <div>
                                <div className="flex items-center mb-">
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
                                    ) : <p className="text-gray-500 py-4">Memuat berita terpopuler...</p>}
                                </ul>
                            </div>

                            {/* Banner Iklan Kecil (Opsional) */}
                            <div className="rounded-lg text-center">
                                <p className="text-sm text-gray-500 mb-2">Sponsored</p>
                                <div className="rounded border border-gray-200">
                                    <img 
                                        src="https://dummyimage.com/300x250/ccc/fff&text=Advertisement"
                                        alt="Advertisement" 
                                        className="w-full h-auto rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
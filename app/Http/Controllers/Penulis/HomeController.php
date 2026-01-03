<?php

namespace App\Http\Controllers\Penulis;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $pinnedNews = Article::with('penulis')
            ->published()
            ->where('is_pinned', true)
            ->orderBy('published_at', 'desc')
            ->take(4)
            ->get()
            ->map(fn($b) => $this->formatBerita($b));

        $headlineData = Article::with('penulis')
            ->published()
            ->where('is_headline', true)
            ->orderBy('published_at', 'desc')
            ->first();

        $headline = $headlineData ? $this->formatBerita($headlineData) : null;

        $subHeadlines = Article::with('penulis')
            ->published()
            ->where('is_subheadline', true)
            ->orderBy('published_at', 'desc')
            ->take(2)
            ->get()
            ->map(fn($b) => $this->formatBerita($b));

        $beritaTerbaru = Article::with('penulis')
            ->published()
            ->orderBy('published_at', 'desc')
            ->take(20)
            ->get()
            ->map(fn($b) => $this->formatBerita($b));

        // TERPOPULER OTOMATIS - BERDASARKAN VIEWS TERTINGGI
        $terpopuler = Article::with('penulis')
            ->published()
            ->orderBy('views', 'desc')
            ->orderBy('published_at', 'desc')
            ->take(10)
            ->get()
            ->map(fn($b) => $this->formatBerita($b));

        return Inertia::render('Public/Home', [
            'pinnedNews'    => $pinnedNews,
            'headline'      => $headline,
            'subHeadlines'  => $subHeadlines,
            'beritaTerbaru' => $beritaTerbaru,
            'terpopuler'    => $terpopuler,
        ]);
    }

    private function formatBerita($berita)
    {
        return [
            'id' => $berita->id,
            'judul' => $berita->judul,
            'slug' => $berita->slug,
            'slug_url' => $berita->slug_url,
            'thumbnail_url' => $berita->thumbnail_url,
            'deskripsi_singkat' => $berita->deskripsi_singkat,
            'isi_berita' => $berita->isi_berita,
            'topik' => $berita->topik,
            'views' => $berita->views,
            'status' => $berita->status,
            'is_pinned' => $berita->is_pinned,
            'is_headline' => $berita->is_headline,
            'is_subheadline' => $berita->is_subheadline,
            'published_at' => $berita->published_at ? $berita->published_at->format('d M Y H:i') : null,
            'published_at_raw' => $berita->published_at,
            'created_at' => $berita->created_at->format('d M Y'),
            'keywords' => $berita->keywords,
            'tanggal' => $berita->tanggal,

            'penulis' => [
                'id' => $berita->penulis->id ?? null,
                'name' => $berita->penulis->name ?? 'Tidak diketahui',
                'email' => $berita->penulis->email ?? '-',
                'photo' => $berita->penulis->profile_photo_url ?? null,
            ],
        ];
    }
}
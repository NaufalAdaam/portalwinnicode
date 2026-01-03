<?php

namespace App\Http\Controllers\Penulis;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function show($kategori)
    {
    
        // Format kategori dari URL
        $kategoriFormatted = str_replace('-', ' ', $kategori);
        $kategoriFormatted = ucwords($kategoriFormatted); // Gunakan ucwords bukan strtoupper

        // Ambil artikel berdasarkan kategori
        $articles = Article::where('topik', 'like', '%' . $kategoriFormatted . '%')
            ->published()
            ->with('penulis')
            ->orderBy('published_at', 'desc')
            ->paginate(12)
            ->through(function ($article) {
                return $this->formatBeritaSimple($article);
            });

        // PINNED NEWS
        $pinnedNews = Article::with('penulis')
            ->published()
            ->where('is_pinned', true)
            ->orderBy('published_at', 'desc')
            ->take(4)
            ->get()
            ->map(fn($article) => $this->formatBeritaSimple($article));

        // TERPOPULER OTOMATIS
        $terpopuler = Article::with('penulis')
            ->published()
            ->orderBy('views', 'desc')
            ->orderBy('published_at', 'desc')
            ->take(10)
            ->get()
            ->map(fn($article) => $this->formatBeritaSimple($article));
 
        return Inertia::render('Public/Kategori', [
            'categoryName' => $kategoriFormatted,
            'articles' => $articles,
            'pinnedNews' => $pinnedNews,
            'terpopuler' => $terpopuler,
        ]);
    }

    private function formatBeritaSimple($article)
    {
        return [
            'id' => $article->id,
            'judul' => $article->judul,
            'slug' => $article->slug,
            'slug_url' => $article->slug_url,
            'thumbnail_url' => $article->thumbnail_url,
            'deskripsi_singkat' => $article->deskripsi_singkat,
            'topik' => $article->topik,
            'views' => $article->views,
            'published_at' => $article->published_at ? $article->published_at->format('d M Y') : null,
            'penulis' => [
                'id' => $article->penulis->id ?? null,
                'name' => $article->penulis->name ?? 'Tidak diketahui',
                'email' => $article->penulis->email ?? '-',
            ],
        ];
    }
}
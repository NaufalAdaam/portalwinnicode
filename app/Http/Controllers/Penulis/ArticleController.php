<?php

namespace App\Http\Controllers\Penulis;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function show($slug)
    {
        return $this->showArticle($slug);
    }

    public function showBySlug($slug)
    {
        return $this->showArticle($slug);
    }

    private function showArticle($slug)
    {
        $article = Article::where('slug', $slug)
            ->with('penulis')
            ->where('status', 'published') // Hanya yang published
            ->firstOrFail();

        // Increment views
        $article->increment('views');

        // Ambil pinned news
        $pinnedNews = Article::with('penulis')
            ->where('status', 'published')
            ->where('is_pinned', true)
            ->orderBy('published_at', 'desc')
            ->take(5)
            ->get()
            ->map(fn($b) => $this->formatBerita($b));

        // Ambil berita terkait berdasarkan topik
        $relatedArticles = Article::with('penulis')
            ->where('status', 'published')
            ->where('topik', $article->topik)
            ->where('id', '!=', $article->id)
            ->latest()
            ->take(6)
            ->get()
            ->map(fn($b) => $this->formatBerita($b));

        // TERPOPULER OTOMATIS - BERDASARKAN VIEWS
        $terpopuler = Article::with('penulis')
            ->where('status', 'published')
            ->orderBy('views', 'desc')
            ->orderBy('published_at', 'desc')
            ->take(10)
            ->get()
            ->map(fn($b) => $this->formatBerita($b));

        return Inertia::render('Public/Detail', [
            'article' => $this->formatBerita($article),
            'relatedArticles' => $relatedArticles,
            'terpopuler' => $terpopuler,
            'pinnedNews' => $pinnedNews,
        ]);
    }

    // Tambahkan method untuk search
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        
        $results = Article::with('penulis')
            ->where('status', 'published')
            ->where(function($q) use ($query) {
                $q->where('judul', 'like', "%{$query}%")
                  ->orWhere('deskripsi_singkat', 'like', "%{$query}%")
                  ->orWhere('isi_berita', 'like', "%{$query}%")
                  ->orWhere('keywords', 'like', "%{$query}%");
            })
            ->orderBy('published_at', 'desc')
            ->paginate(12);

        return Inertia::render('Public/Search', [
            'results' => $results,
            'query' => $query
        ]);
    }

    private function formatBerita($berita)
    {
        return [
            'id' => $berita->id,
            'judul' => $berita->judul,
            'slug' => $berita->slug,
            'thumbnail_url' => $berita->thumbnail_url,
            'deskripsi_singkat' => $berita->deskripsi_singkat,
            'isi_berita' => $berita->isi_berita,
            'topik' => $berita->topik,
            'views' => $berita->views,
            'status' => $berita->status,
            'keywords' => $berita->keywords,
            'published_at' => $berita->published_at ? $berita->published_at->format('d M Y H:i') : null,
            'created_at' => $berita->created_at->format('d M Y'),
            'penulis' => [
                'id' => $berita->penulis->id ?? null,
                'name' => $berita->penulis->name ?? 'Tidak diketahui',
                'email' => $berita->penulis->email ?? '-',
                'photo' => $berita->penulis->profile_photo_url ?? null,
            ],
        ];
    }
}
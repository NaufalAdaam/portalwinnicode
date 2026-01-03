<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Hitung statistik berita
        $totalBerita = Article::count();
        $publishedBerita = Article::where('status', 'published')->count();
        $draftBerita = Article::where('status', 'draft')->count();
        
        // Ambil data berita terbaru untuk ditampilkan
        $latestBeritas = Article::with('penulis')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($berita) {
                return [
                    'id' => $berita->id,
                    'judul' => $berita->judul,
                    'status' => $berita->status,
                    'topik' => $berita->topik,
                    'published_at' => $berita->published_at?->format('d M Y H:i'),
                    'views' => $berita->views,
                    'penulis' => $berita->penulis?->name,
                    'is_pinned' => $berita->is_pinned,
                    'is_headline' => $berita->is_headline,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => auth()->user()
            ],
            'beritaStats' => [
                'total' => $totalBerita,
                'published' => $publishedBerita,
                'draft' => $draftBerita
            ],
            'latestBeritas' => $latestBeritas
        ]);
    }
}
<?php

namespace App\Http\Controllers\Penulis;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BeritaController extends Controller
{
    /**
     * Menampilkan form create
     */
    public function create()
    {
        return Inertia::render('Penulis/Dashboard/Tulisan');
    }

    /**
     * Menampilkan halaman hasil tulisan
     */
    public function index()
    {
        $articles = Article::where('penulis_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($article) => $this->formatForPenulis($article));

        return Inertia::render('Public/Dashboard/Hasil', [
            'articles' => $articles,
        ]);
    }

    /**
     * Menyimpan berita baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi_singkat' => 'required|string',
            'isi_berita' => 'required|string',
            'topik' => 'required|string',
            'tanggal' => 'required|date',
            'keywords' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        // Cek slug duplikat
        $slug = Str::slug($request->judul);
        $counter = 1;
        $originalSlug = $slug;
        
        while (Article::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        // Upload thumbnail jika ada
        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        // Buat berita
        Article::create([
            'judul' => $request->judul,
            'slug' => $slug,
            'thumbnail_url' => $thumbnailPath,
            'deskripsi_singkat' => $request->deskripsi_singkat,
            'isi_berita' => $request->isi_berita,
            'status' => 'draft',
            'is_pinned' => false,
            'is_headline' => false,
            'is_subheadline' => false,
            'views' => 0,
            'penulis_id' => auth()->id(),
            'topik' => $request->topik,
            'tanggal' => $request->tanggal,
            'keywords' => $request->keywords,
        ]);

        return redirect()->route('penulis.hasil')->with('success', 'Berita telah berhasil disimpan sebagai draft!');
    }

    /**
     * Menampilkan form edit
     */
    public function edit($id)
    {
        $article = Article::where('id', $id)
            ->where('penulis_id', auth()->id())
            ->firstOrFail();

        return Inertia::render('Penulis/Dashboard/Edit', [
            'article' => $this->formatForPenulis($article),
        ]);
    }

    /**
     * Update berita
     */
    public function update(Request $request, $id)
    {
        $article = Article::where('id', $id)
            ->where('penulis_id', auth()->id())
            ->firstOrFail();

        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi_singkat' => 'required|string',
            'isi_berita' => 'required|string',
            'topik' => 'required|string',
            'tanggal' => 'required|date',
            'keywords' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'status' => 'required|in:draft,pending,published'
        ]);

        // Update slug jika judul berubah
        if ($article->judul !== $request->judul) {
            $slug = Str::slug($request->judul);
            $counter = 1;
            $originalSlug = $slug;
            
            while (Article::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            $article->slug = $slug;
        }

        // Update thumbnail jika ada file baru
        if ($request->hasFile('thumbnail')) {
            // Hapus thumbnail lama jika ada
            if ($article->thumbnail_url && Storage::disk('public')->exists($article->thumbnail_url)) {
                Storage::disk('public')->delete($article->thumbnail_url);
            }
            $article->thumbnail_url = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        // Update fields
        $article->judul = $request->judul;
        $article->deskripsi_singkat = $request->deskripsi_singkat;
        $article->isi_berita = $request->isi_berita;
        $article->topik = $request->topik;
        $article->tanggal = $request->tanggal;
        $article->keywords = $request->keywords;
        $article->status = $request->status;
        
        // Jika status menjadi published dan belum ada published_at
        if ($request->status === 'published' && !$article->published_at) {
            $article->published_at = now();
        }

        $article->save();

        return redirect()->route('penulis.hasil')->with('success', 'Berita berhasil diperbarui!');
    }

    /**
     * Hapus berita
     */
    public function destroy($id)
    {
        $article = Article::where('id', $id)
            ->where('penulis_id', auth()->id())
            ->firstOrFail();

        // Hapus thumbnail jika ada
        if ($article->thumbnail_url && Storage::disk('public')->exists($article->thumbnail_url)) {
            Storage::disk('public')->delete($article->thumbnail_url);
        }

        $article->delete();

        return redirect()->route('penulis.hasil')->with('success', 'Berita berhasil dihapus!');
    }

    /**
     * Format untuk tampilan penulis
     */
    private function formatForPenulis($article)
    {
        return [
            'id' => $article->id,
            'judul' => $article->judul,
            'slug' => $article->slug,
            'thumbnail_url' => $article->thumbnail_url,
            'deskripsi_singkat' => $article->deskripsi_singkat,
            'isi_berita' => $article->isi_berita,
            'topik' => $article->topik,
            'keywords' => $article->keywords,
            'tanggal' => $article->tanggal,
            'status' => $article->status,
            'views' => $article->views,
            'is_pinned' => $article->is_pinned,
            'is_headline' => $article->is_headline,
            'is_subheadline' => $article->is_subheadline,
            'published_at' => $article->published_at ? $article->published_at->format('Y-m-d') : null,
            'created_at' => $article->created_at->format('d M Y'),
            'updated_at' => $article->updated_at->format('d M Y'),
        ];
    }
}
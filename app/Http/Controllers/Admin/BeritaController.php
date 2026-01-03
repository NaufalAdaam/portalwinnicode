<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\User;
use App\Models\NavbarMenu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BeritaController extends Controller
{
    /**
     * Menampilkan halaman manajemen berita
     */
    public function index()
    {
        $beritaList = Article::with('penulis')
                            ->orderBy('created_at', 'desc')
                            ->paginate(15)
                            ->through(function ($item) {
                                return [
                                    'id' => $item->id,
                                    'judul' => $item->judul,
                                    'slug' => $item->slug,
                                    'thumbnail_url' => $item->thumbnail_url,
                                    'deskripsi_singkat' => $item->deskripsi_singkat,
                                    'isi_berita' => $item->isi_berita,
                                    'topik' => $item->topik,
                                    'keywords' => $item->keywords,
                                    'status' => $item->status,
                                    'is_pinned' => $item->is_pinned,
                                    'is_headline' => $item->is_headline,
                                    'is_subheadline' => $item->is_subheadline,
                                    'views' => $item->views,
                                    'published_at' => $item->published_at?->format('Y-m-d H:i:s'),
                                    'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                                    'updated_at' => $item->updated_at->format('Y-m-d H:i:s'),
                                    'penulis' => $item->penulis ? [
                                        'id' => $item->penulis->id,
                                        'name' => $item->penulis->name,
                                        'email' => $item->penulis->email
                                    ] : null
                                ];
                            });

        $topiks = NavbarMenu::orderBy('nama_menu')->get(['id', 'nama_menu']);

        return Inertia::render('Admin/Berita', [
            'berita' => $beritaList,
            'topiks' => $topiks,
            'flash' => session('flash', [])
        ]);
    }

    /**
     * API untuk mendapatkan data berita
     */
    public function apiIndex(Request $request)
    {
        $query = Article::with('penulis')->orderBy('created_at', 'desc');

        // Filter pencarian
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('deskripsi_singkat', 'like', "%{$search}%")
                  ->orWhere('topik', 'like', "%{$search}%")
                  ->orWhere('keywords', 'like', "%{$search}%");
            });
        }

        $perPage = $request->perPage ?? 10;
        $berita = $query->paginate($perPage);

        return response()->json([
            'data' => $berita->items(),
            'current_page' => $berita->currentPage(),
            'last_page' => $berita->lastPage(),
            'per_page' => $berita->perPage(),
            'total' => $berita->total(),
            'from' => $berita->firstItem(),
            'to' => $berita->lastItem()
        ]);
    }

    /**
     * API untuk mendapatkan detail berita
     */
    public function apiShow($id)
    {
        $berita = Article::with('penulis')->findOrFail($id);

        return response()->json([
            'id' => $berita->id,
            'judul' => $berita->judul,
            'slug' => $berita->slug,
            'thumbnail_url' => $berita->thumbnail_url,
            'deskripsi_singkat' => $berita->deskripsi_singkat,
            'isi_berita' => $berita->isi_berita,
            'topik' => $berita->topik,
            'keywords' => $berita->keywords,
            'status' => $berita->status,
            'is_pinned' => $berita->is_pinned,
            'is_headline' => $berita->is_headline,
            'is_subheadline' => $berita->is_subheadline,
            'views' => $berita->views,
            'published_at' => $berita->published_at?->format('Y-m-d H:i:s'),
            'created_at' => $berita->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $berita->updated_at->format('Y-m-d H:i:s'),
            'penulis' => $berita->penulis ? [
                'id' => $berita->penulis->id,
                'name' => $berita->penulis->name,
                'email' => $berita->penulis->email
            ] : null
        ]);
    }

    /**
     * API untuk menyimpan berita baru
     */
    public function apiStore(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|unique:beritas,slug',
            'thumbnail_url' => 'nullable|string|url',
            'deskripsi_singkat' => 'required|string|max:500',
            'isi_berita' => 'required|string',
            'topik' => 'nullable|string|max:100',
            'keywords' => 'nullable|string|max:255',
            'status' => 'required|in:draft,pending,published',
            'is_pinned' => 'boolean',
            'is_headline' => 'boolean',
            'is_subheadline' => 'boolean',
            'published_at' => 'nullable|date'
        ]);

        // Generate slug otomatis jika tidak diisi
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['judul']) . '-' . time();
        }

        $validated['penulis_id'] = auth()->id();
        
        // Set published_at jika status published
        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $berita = Article::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil dibuat',
            'data' => $berita
        ]);
    }

    /**
     * API untuk update berita
     */
    public function apiUpdate(Request $request, $id)
    {
        $berita = Article::findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|unique:beritas,slug,' . $berita->id,
            'thumbnail_url' => 'nullable|string|url',
            'deskripsi_singkat' => 'required|string|max:500',
            'isi_berita' => 'required|string',
            'topik' => 'nullable|string|max:100',
            'keywords' => 'nullable|string|max:255',
            'status' => 'required|in:draft,pending,published',
            'is_pinned' => 'boolean',
            'is_headline' => 'boolean',
            'is_subheadline' => 'boolean',
            'published_at' => 'nullable|date'
        ]);

        // Handle published_at berdasarkan perubahan status
        if ($validated['status'] === 'published' && $berita->status !== 'published') {
            $validated['published_at'] = now();
        } elseif ($validated['status'] !== 'published' && $berita->status === 'published') {
            $validated['published_at'] = null;
        }

        $berita->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil diperbarui',
            'data' => $berita
        ]);
    }

    /**
     * API untuk menghapus berita
     */
    public function apiDestroy($id)
    {
        $berita = Article::findOrFail($id);
        $berita->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil dihapus'
        ]);
    }

    /**
 * Menampilkan halaman setting berita
 */
public function setting(Request $request)
{
    $query = Article::with('penulis')
                    ->where('status', 'published')
                    ->orderBy('created_at', 'desc');

    // Filter pencarian
    if ($request->has('search') && !empty($request->search)) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('judul', 'like', "%{$search}%")
              ->orWhere('deskripsi_singkat', 'like', "%{$search}%")
              ->orWhere('topik', 'like', "%{$search}%")
              ->orWhere('keywords', 'like', "%{$search}%");
        });
    }

    // Paginate + transform data
    $beritaList = $query->paginate(15)
                        ->appends($request->query())
                        ->through(function ($item) {
                            return [
                                'id' => $item->id,
                                'judul' => $item->judul,
                                'slug' => $item->slug,
                                'thumbnail_url' => $item->thumbnail_url,
                                'status' => $item->status,
                                'is_pinned' => $item->is_pinned,
                                'is_headline' => $item->is_headline,
                                'is_subheadline' => $item->is_subheadline,
                                'views' => $item->views,
                                'published_at' => $item->published_at?->format('Y-m-d H:i:s'),
                                'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                                'penulis' => $item->penulis ? [
                                    'id' => $item->penulis->id,
                                    'name' => $item->penulis->name,
                                    'email' => $item->penulis->email
                                ] : null
                            ];
                        });

    return Inertia::render('Admin/Setting', [
        'berita' => $beritaList,
        'flash' => session('flash', [])
    ]);
}


/**
 * Toggle status berita
 */
public function toggleStatus(Request $request, Article $berita)
{
    $request->validate([
        'field' => 'required|in:is_pinned,is_headline,is_subheadline'
    ]);

    $field = $request->field;
    
    // Mapping nama field yang lebih user-friendly
    $fieldNames = [
        'is_pinned' => 'Pin',
        'is_headline' => 'Headline',
        'is_subheadline' => 'Subheadline', 
    ];
    
    $fieldName = $fieldNames[$field] ?? $field;
    
    $berita->update([
        $field => !$berita->$field
    ]);

    // Kembalikan Inertia response dengan flash message
    return redirect()->route('admin.berita.setting')
        ->with('flash', [
            'success' => $fieldName . ' berhasil ' . 
                        ($berita->$field ? 'diaktifkan' : 'dinonaktifkan')
        ]);
}
    /**
     * Update berita
     */
    public function update(Request $request, Article $berita)
    {
        \Log::info('Update request received:', $request->all());

        if ($request->has('status')) {
            $request->validate([
                'status' => 'required|in:draft,pending,published'
            ]);

            $updateData = ['status' => $request->status];

            if ($request->status === 'published' && $berita->status !== 'published') {
                $updateData['published_at'] = now();
            }

            if ($request->status !== 'published' && $berita->status === 'published') {
                $updateData['published_at'] = null;
            }

            $berita->update($updateData);
            $berita->refresh();

            return redirect()->route('admin.berita.index')
                ->with('flash', ['success' => 'Status berita berhasil diupdate']);
        }

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|unique:beritas,slug,' . $berita->id,
            'deskripsi_singkat' => 'required|string|max:500',
            'isi_berita' => 'required|string',
            'thumbnail_url' => 'nullable|string|url',
            'topik' => 'nullable|string|max:100',
            'keywords' => 'nullable|string|max:255',
            'status' => 'required|in:draft,pending,published',
        ]);

        if ($validated['status'] === 'published' && $berita->status !== 'published') {
            $validated['published_at'] = now();
        } elseif ($validated['status'] !== 'published' && $berita->status === 'published') {
            $validated['published_at'] = null;
        }

        $berita->update($validated);

        return redirect()->route('admin.berita.index')
            ->with('flash', ['success' => 'Berita berhasil diperbarui']);
    }

    /**
     * Menampilkan form tambah berita
     */
    public function create()
    {
        return Inertia::render('Admin/BeritaCreate');
    }

    /**
     * Menyimpan berita baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|unique:beritas,slug',
            'deskripsi_singkat' => 'required|string|max:500',
            'isi_berita' => 'required|string',
            'thumbnail_url' => 'nullable|string|url',
            'topik' => 'nullable|string|max:100',
            'keywords' => 'nullable|string|max:255',
            'status' => 'required|in:draft,pending,published',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['judul']) . '-' . time();
        }

        $validated['penulis_id'] = auth()->id();
        
        if ($validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        Article::create($validated);

        return redirect()->route('admin.berita.index')
            ->with('flash', ['success' => 'Berita berhasil dibuat']);
    }

    /**
     * Menampilkan form edit berita
     */
    public function edit(Article $berita)
    {
        return Inertia::render('Admin/BeritaEdit', [
            'berita' => [
                'id' => $berita->id,
                'judul' => $berita->judul,
                'slug' => $berita->slug,
                'deskripsi_singkat' => $berita->deskripsi_singkat,
                'isi_berita' => $berita->isi_berita,
                'thumbnail_url' => $berita->thumbnail_url,
                'topik' => $berita->topik,
                'keywords' => $berita->keywords,
                'status' => $berita->status,
                'is_pinned' => $berita->is_pinned,
                'is_headline' => $berita->is_headline,
                'is_subheadline' => $berita->is_subheadline,
                'published_at' => $berita->published_at?->format('Y-m-d H:i:s'),
                'created_at' => $berita->created_at->format('Y-m-d H:i:s'),
            ]
        ]);
    }

    /**
     * Hapus berita
     */
    public function destroy(Article $berita)
    {
        $berita->delete();

        return redirect()->route('admin.berita.index')
            ->with('flash', ['success' => 'Berita berhasil dihapus']);
    }

    /**
     * Generate slug otomatis
     */
    public function generateSlug(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255'
        ]);

        $slug = Str::slug($request->judul);
        
        if (Article::where('slug', $slug)->exists()) {
            $slug = $slug . '-' . time();
        }

        return response()->json([
            'slug' => $slug
        ]);
    }

    /**
     * Menampilkan detail berita
     */
    public function show(Article $berita)
    {
        return Inertia::render('Admin/Berita/Show', [
            'berita' => $berita->load('penulis')
        ]);
    }
}
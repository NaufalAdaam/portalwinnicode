<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Auth\AdminLoginController;
use App\Http\Controllers\Admin\PenulisController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\MediaController; 

// Login Admin
Route::get('/login', [AdminLoginController::class, 'create'])->name('admin.login');
Route::post('/login', [AdminLoginController::class, 'store'])->name('admin.login.store');
Route::get('/logout', [AdminLoginController::class, 'destroy'])->name('admin.logout');

// ✅ GUNAKAN MIDDLEWARE DEFAULT
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    
// Routes untuk Penulis
    Route::get('/penulis', [PenulisController::class, 'index'])->name('admin.penulis');
    Route::post('/penulis', [PenulisController::class, 'store'])->name('admin.penulis.store');
    Route::put('/penulis/{id}', [PenulisController::class, 'update'])->name('admin.penulis.update');
    Route::delete('/penulis/{id}', [PenulisController::class, 'destroy'])->name('admin.penulis.destroy');
    
    // Routes untuk Berita - MENGGUNAKAN RESOURCE ROUTES
    Route::resource('berita', BeritaController::class)
        ->names([
            'index'   => 'admin.berita.index',
            'create'  => 'admin.berita.create',
            'store'   => 'admin.berita.store',
            'edit'    => 'admin.berita.edit',
            'update'  => 'admin.berita.update',
            'destroy' => 'admin.berita.destroy',
        ])
        ->parameters([
            // paksa parameter route menjadi {berita} (bukan {beritum})
            'berita' => 'berita'
        ]);
    
    // Route khusus untuk setting berita
    Route::get('setting', [BeritaController::class, 'setting'])->name('admin.berita.setting');
    
    // ✅ TAMBAHKAN ROUTE UNTUK TOGGLE STATUS - INI YANG PERLU DITAMBAHKAN
    Route::patch('/berita/{berita}/toggle', [BeritaController::class, 'toggleStatus'])->name('admin.berita.toggle');
    
    // Route untuk bulk actions
    Route::post('/berita/bulk-action', [BeritaController::class, 'bulkAction'])->name('admin.berita.bulk-action');
    
    // Route untuk generate slug
    Route::post('/berita/generate-slug', [BeritaController::class, 'generateSlug'])->name('admin.berita.generate-slug');
    
    // Route untuk approve berita
    Route::post('/berita/{berita}/approve', [BeritaController::class, 'approve'])->name('admin.berita.approve');
    
    // Routes lainnya
    Route::get('/logo', fn() => Inertia::render('Admin/Logo'))->name('admin.logo');
    Route::get('/menu', fn() => Inertia::render('Admin/Menu'))->name('admin.menu');
    Route::get('/footer', fn() => Inertia::render('Admin/Footer'))->name('admin.footer');
    Route::get('/navbar', fn() => Inertia::render('Admin/Navbar'))->name('admin.navbar');
    Route::get('/media', [MediaController::class, 'index'])->name('admin.media');
    Route::get('/konfigurasi', [UserController::class, 'index'])->name('admin.konfigurasi');
});

<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Penulis\HomeController;
use App\Http\Controllers\Auth\PenulisLoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Penulis\DashboardController;
use App\Http\Controllers\Penulis\BeritaController;
use App\Http\Controllers\Penulis\ArticleController;
use App\Http\Controllers\Penulis\KategoriController;

// WEBSITE PUBLIK — SEMUA BISA DI AKSES TAMU
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/tentang', fn () => Inertia::render('Public/Footer/Tentang'))->name('tentang');
Route::get('/kontak', fn () => Inertia::render('Public/Footer/Kontak'))->name('kontak');
Route::get('/berita', fn () => Inertia::render('Public/Berita/Index'))->name('berita.index');

Route::get('/search', function () {
    return Inertia::render('Public/Search', [
        'query' => request('q', '')
    ]);
})->name('berita.search');

Route::get('/kategori/{kategori}', [KategoriController::class, 'show'])->name('kategori.show');

// Detail berita
Route::get('/artikel/{slug}', [ArticleController::class, 'show'])->name('articles.show');

// Catch-all slug (harus paling akhir!)
Route::get('/{slug}', [ArticleController::class, 'showBySlug'])
    ->where('slug', '^(?!tentang|kontak|penulis|admin|api|berita|search|kategori|auth|dashboard|_ignition|_debugbar).*$')
    ->name('articles.show.slug');


// === AUTH PENULIS (LOGIN, REGISTER, DLL) ===
Route::prefix('penulis')->group(function () {
    Route::get('/login', [PenulisLoginController::class, 'create'])->name('penulis.login');
    Route::post('/login', [PenulisLoginController::class, 'store'])->name('penulis.login.store');
    Route::get('/logout', [PenulisLoginController::class, 'destroy'])->name('penulis.logout');

    Route::get('/register', fn () => Inertia::render('Public/Auth/Register'))->name('penulis.register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('penulis.register.store');

    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
        ->middleware('guest')
        ->name('penulis.password.request');

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->middleware('guest')
        ->name('penulis.password.email');

    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
        ->middleware('guest')
        ->name('penulis.password.reset');

    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->middleware('guest')
        ->name('penulis.password.store');
});


// === DASHBOARD PENULIS (HANYA UNTUK YANG SUDAH LOGIN) ===
Route::middleware(['auth:penulis', 'role:penulis'])
    ->prefix('penulis')
    ->group(function () {
        Route::get('/berita/{id}/edit', [BeritaController::class, 'edit'])->name('penulis.berita.edit');
        Route::put('/berita/{id}', [BeritaController::class, 'update'])->name('penulis.berita.update');
        Route::delete('/berita/{id}', [BeritaController::class, 'destroy'])->name('penulis.berita.destroy');
        Route::post('/berita/store', [BeritaController::class, 'store'])->name('penulis.berita.store');

        Route::get('/dashboard', function () {
            return redirect()->route('penulis.profile');
        })->name('penulis.dashboard');

        Route::get('/dashboard/profile', [DashboardController::class, 'profile'])->name('penulis.profile');
        Route::get('/dashboard/tulisan', [DashboardController::class, 'tulisan'])->name('penulis.tulisan');
        Route::get('/dashboard/hasil', [BeritaController::class, 'index'])->name('penulis.hasil');
        Route::post('/profil/update', [ProfileController::class, 'update'])->name('profil.update');
    });
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardRedirectController;
use App\Http\Controllers\Auth\SocialController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// === ROUTE UNTUK SOCIAL LOGIN (HARUS BISA DIAKSES OLEH TAMU) ===
Route::get('auth/{provider}/redirect', [SocialController::class, 'redirect'])
    ->name('social.redirect');

Route::get('auth/{provider}/callback', [SocialController::class, 'callback'])
    ->name('social.callback');


// === ROUTE DASHBOARD SETELAH LOGIN (MULTI-ROLE) ===
Route::get('/dashboard', DashboardRedirectController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');


// === MUAT SEMUA ROUTE PUBLIK (HALAMAN WEBSITE UTAMA) ===
require __DIR__.'/public.php';


// === MUAT ROUTE ADMIN (Jika dibutuhkan) ===
// require __DIR__.'/admin.php';


// === MUAT ROUTE AUTH BAWAAN LARAVEL (LOGIN/REGISTER BIASA) ===
require __DIR__.'/auth.php';
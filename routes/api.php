<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LogoController;
use App\Http\Controllers\Api\FooterMenuController;
use App\Http\Controllers\Api\FooterSocialController;
use App\Http\Controllers\Api\NavbarMenuController;
// Pastikan import Controller Berita ada di sini
use App\Http\Controllers\Admin\BeritaController; 

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Default route untuk user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ==================== LOGO API ====================
Route::get('/logo', [LogoController::class, 'index']);
Route::post('/logo', [LogoController::class, 'store']);
Route::put('/logo/{id}', [LogoController::class, 'update']);
Route::delete('/logo/{id}', [LogoController::class, 'destroy']);

// ==================== FOOTER MENU API ====================
Route::put('/footer-menu/reorder', [FooterMenuController::class, 'reorder']);
Route::apiResource('footer-menu', FooterMenuController::class);

// ==================== FOOTER SOCIAL API ====================
Route::apiResource('footer-socials', FooterSocialController::class);

// ==================== NAVBAR MENU API ====================
Route::put('/navbar-menu/reorder', [NavbarMenuController::class, 'reorder']);
Route::apiResource('navbar-menu', NavbarMenuController::class);

// ==================== BERITA API ====================
Route::prefix('berita')->group(function () {
    Route::get('/', [BeritaController::class, 'apiIndex']);
    Route::get('/{id}', [BeritaController::class, 'apiShow']);
    Route::post('/', [BeritaController::class, 'apiStore']);
    Route::put('/{id}', [BeritaController::class, 'apiUpdate']);
    Route::delete('/{id}', [BeritaController::class, 'apiDestroy']);
});
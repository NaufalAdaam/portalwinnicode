<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/admin/dashboard';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
    // === API ===
    Route::middleware('api')
        ->prefix('api')
        ->group(base_path('routes/api.php'));

    // === Rute umum & penulis (tanpa prefix) ===
    Route::middleware('web')
        ->group(base_path('routes/public.php'));

    // === Rute admin dengan prefix ===
    Route::middleware('web')
        ->prefix('admin')
        ->group(base_path('routes/admin.php'));

    // === Rute default breeze / user biasa ===
    Route::middleware('web')
        ->group(base_path('routes/web.php'));
});

    }
}

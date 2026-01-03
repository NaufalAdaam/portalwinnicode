<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request; // Import Request

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $role)
    {
        $user = null;
        $guard = null;

        // Tentukan guard mana yang harus kita periksa berdasarkan role
        if ($role === 'admin') {
            $guard = 'admin';
        } elseif ($role === 'penulis') {
            $guard = 'penulis';
        }

        // Dapatkan user dari guard yang benar
        // Middleware 'auth:guard' sudah berjalan sebelumnya, jadi kita harus
        // bisa mendapatkan user dari guard yang sesuai.
        if ($guard && Auth::guard($guard)->check()) {
            $user = Auth::guard($guard)->user();
        } else if (Auth::check()) {
            // Fallback ke guard default jika tidak ada guard spesifik
            $user = Auth::user();
        }

        // Jika tidak ada user sama sekali (tidak login di guard manapun)
        if (!$user) {
            if ($role === 'admin') {
                return redirect()->route('admin.login');
            }
            return redirect()->route('penulis.login');
        }

        // Jika user ada, tapi role-nya tidak cocok
        if ($user->role !== $role) {
            // Arahkan mereka ke dashboard mereka yang benar
            if ($user->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }
            if ($user->role === 'penulis') {
                return redirect()->route('penulis.profile');
            }
            
            // Jika role tidak diketahui, logout saja
            Auth::guard($guard)->logout();
            return redirect('/');
        }

        // Jika user ada dan role cocok
        return $next($request);
    }
}

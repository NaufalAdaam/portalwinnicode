<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PenulisLoginController extends Controller
{
    public function create(Request $request) // ✅ TAMBAHKAN Request $request
    {
        // ✅ CEK JIKA SUDAH LOGIN SEBAGAI PENULIS
        if (Auth::guard('penulis')->check()) {
            return redirect()->route('penulis.profile');
        }

        // ✅ CEK JIKA SUDAH LOGIN SEBAGAI ADMIN, TAMPILKAN WARNING
        if (Auth::guard('admin')->check()) {
            return Inertia::render('Public/Auth/Login', [
                'warning' => 'Anda sudah login sebagai admin. Silakan logout dari admin terlebih dahulu.'
            ]);
        }

        return Inertia::render('Public/Auth/Login');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // ✅ GUNAKAN GUARD 'penulis' UNTUK LOGIN
        if (Auth::guard('penulis')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $request->session()->regenerate();

            // ✅ PASTIKAN USER ADALAH PENULIS
            $user = Auth::guard('penulis')->user();
            if ($user->role === 'penulis') {
                return redirect()->intended(route('penulis.profile'));
            } else {
                // JIKA ADMIN COBA LOGIN SEBAGAI PENULIS, LOGOUT
                Auth::guard('penulis')->logout();
                return back()->withErrors([
                    'email' => 'Admin tidak dapat login sebagai penulis.',
                ]);
            }
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ]);
    }

    // ✅ METHOD LOGOUT YANG BENARa
    public function destroy(Request $request)
    {
        Auth::guard('penulis')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
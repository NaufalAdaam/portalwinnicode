<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardRedirectController extends Controller
{
    /**
     * Mengarahkan pengguna ke dasbor yang sesuai berdasarkan peran mereka.
     * Ini adalah "single action controller", jadi kita menggunakan method __invoke().
     */
    public function __invoke()
    {
        // Ambil data pengguna yang sedang login
        $user = Auth::user();

        // Cek jika perannya adalah 'admin'
        if ($user->role === 'admin') {
            // Arahkan ke rute yang bernama 'admin.dashboard'
            return redirect()->route('admin.dashboard');
        }

        // Cek jika perannya adalah 'penulis'
        if ($user->role === 'penulis') {
            // Arahkan ke rute yang bernama 'penulis.dashboard'
            return redirect()->route('penulis.dashboard'); 
        }

        // Jika pengguna memiliki peran lain (atau tidak ada peran),
        // arahkan saja ke halaman utama sebagai fallback.
        return redirect('/');
    }
}


<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Hitung total berdasarkan role
        $adminCount = User::where('role', 'admin')->count();
        $penulisCount = User::where('role', 'penulis')->count();

        // Kirim data ke halaman React
        return Inertia::render('Admin/Konfigurasi', [
            'roleList' => [
                ['role' => 'Admin', 'total' => $adminCount],
                ['role' => 'Penulis', 'total' => $penulisCount],
            ],
        ]);
    }
}

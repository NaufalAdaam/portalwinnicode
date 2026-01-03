<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Menampilkan halaman registrasi.
     */
    public function create(): Response
    {
        return Inertia::render('Public/Auth/Register');
    }

    /**
     * Menangani permintaan registrasi.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'nullable|string|max:15',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'penulis', // Ini sudah benar
        ]);

        event(new Registered($user));

        // --- INI PERBAIKANNYA ---
        // Auth::login($user); // <-- SALAH: Ini login ke guard 'web'
        Auth::guard('penulis')->login($user); // <-- BENAR: Login ke guard 'penulis'

        // Pengalihan ini sekarang akan berfungsi karena Anda diautentikasi 
        // di guard 'penulis', dan middleware 'auth:penulis' akan lolos.
        return redirect()->route('penulis.dashboard');
    }
}


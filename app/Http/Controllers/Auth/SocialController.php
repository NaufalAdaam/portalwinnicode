<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialController extends Controller
{
    protected $allowed = ['google', 'facebook'];

    public function redirect($provider)
    {
        if (!in_array($provider, $this->allowed)) {
            abort(404);
        }
        return Socialite::driver($provider)->redirect();
    }

    

    public function callback(Request $request, $provider)
    {
        if (!in_array($provider, $this->allowed)) {
            abort(404);
        }

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect()->route('penulis.login')->withErrors('OAuth error: '.$e->getMessage());
        }

        $email = $socialUser->getEmail();
        if (!$email) {
            return redirect()->route('penulis.login')->withErrors('Provider tidak memberikan email. Gunakan metode lain.');
        }

        // Cari atau buat user
        $user = User::where('provider_name', $provider)
                    ->where('provider_id', $socialUser->getId())
                    ->first();

        if (!$user) {
            $user = User::where('email', $email)->first();

            if ($user) {
                // Update existing user dengan provider info
                $user->update([
                    'provider_name' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                ]);
            } else {
                // Create new user dengan role penulis
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $email,
                    'password' => null,
                    'provider_name' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                    'phone' => null, 
                    'role' => 'penulis', // Default role untuk social registration
                    'email_verified_at' => now(),
                ]);
            }
        }

        // --- PERBAIKAN DI SINI ---
        // Login menggunakan guard penulis
        Auth::guard('penulis')->login($user, true);

        // Redirect LANGSUNG ke halaman profile dashboard penulis
        return redirect()->route('penulis.profile');
    }
}
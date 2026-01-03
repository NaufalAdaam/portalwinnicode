<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [

            'auth' => [
                'penulis' => Auth::guard('penulis')->check()
                    ? [
                        'id' => Auth::guard('penulis')->user()->id,
                        'name' => Auth::guard('penulis')->user()->name,
                        'email' => Auth::guard('penulis')->user()->email,
                        'phone' => Auth::guard('penulis')->user()->phone,
                        'role' => Auth::guard('penulis')->user()->role,
                        'avatar' => Auth::guard('penulis')->user()->avatar,
                    ]
                    : null,

                'admin' => Auth::guard('admin')->check()
                    ? [
                        'id' => Auth::guard('admin')->user()->id,
                        'name' => Auth::guard('admin')->user()->name,
                        'email' => Auth::guard('admin')->user()->email,
                        'role' => 'admin',
                    ]
                    : null,
            ],

            'isAuthenticated' =>
                Auth::guard('penulis')->check() ||
                Auth::guard('admin')->check(),

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}

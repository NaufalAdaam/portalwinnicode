<?php

namespace App\Http\Controllers\Penulis;

use Inertia\Inertia;

use App\Http\Controllers\Controller;

use App\Models\NavbarMenu;

class DashboardController extends Controller
{
    public function profile()
    {
        return Inertia::render('Public/Dashboard/Profile');
    }

    public function tulisan()
      {
        return Inertia::render('Public/Dashboard/Tulisan', [
            'topiks' => NavbarMenu::orderBy('urutan')->get()
        ]);
    }

    public function hasil()
    {
        return Inertia::render('Public/Dashboard/Hasil');
    }
}

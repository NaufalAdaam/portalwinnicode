<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function index()
    {
        $media = Article::whereNotNull('thumbnail_url')
                        ->orderBy('created_at', 'desc')
                        ->get(['id', 'judul', 'thumbnail_url']);

        return Inertia::render('Admin/Media', [
            'media' => $media
        ]);
    }
}

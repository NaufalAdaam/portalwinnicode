<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Berita extends Model
{
    use HasFactory;

    // Nama tabel
    protected $table = 'beritas';

    // Kolom yang dapat diisi
    protected $fillable = [
        'judul',
        'slug',
        'thumbnail_url',
        'deskripsi_singkat',
        'isi_berita',
        'status',
        'published_at',
        'is_pinned',
        'is_headline',
        'is_subheadline',
        'views',
        'penulis_id',
        'kategori_id',
    ];

    // Timestamps
    public $timestamps = true;

    /**
     * Relasi dengan model User (penulis)
     */
    public function penulis()
    {
        return $this->belongsTo(User::class, 'penulis_id');
    }
}

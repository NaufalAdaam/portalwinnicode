<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Article extends Model
{
    use HasFactory;

    // Nama tabel
    protected $table = 'beritas';

    // Kolom yang dapat diisi
    protected $fillable = [
        'penulis_id',
        'judul',
        'slug',
        'thumbnail_url',
        'deskripsi_singkat',
        'isi_berita',
        'topik',
        'keywords',
        'tanggal',
        'status',
        'views',
        'is_pinned',
        'is_headline',
        'is_subheadline',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_pinned' => 'boolean',
        'is_headline' => 'boolean',
        'is_subheadline' => 'boolean',
        'views' => 'integer',
    ];

    /**
     * Accessor untuk URL lengkap
     */
    protected function slugUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => route('articles.show', $this->slug),
        );
    }

    /**
     * Accessor untuk thumbnail URL lengkap
     */
    protected function thumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (empty($value)) {
                    return '/default-thumbnail.jpg';
                }
                
                if (str_starts_with($value, 'http')) {
                    return $value;
                }
                
                return asset('storage/' . $value);
            },
        );
    }

    /**
     * Scope untuk status berita
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope untuk berita pinned
     */
    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    /**
     * Scope untuk berita headline
     */
    public function scopeHeadline($query)
    {
        return $query->where('is_headline', true);
    }

    /**
     * Relasi ke penulis
     */
    public function penulis()
    {
        return $this->belongsTo(User::class, 'penulis_id');
    }

    /**
     * Cek apakah berita sudah dipublish
     */
    public function isPublished()
    {
        return $this->status === 'published';   
    }

    /**
     * Cek apakah berita adalah draft
     */
    public function isDraft()
    {
        return $this->status === 'draft';
    }

    /**
     * Cek apakah berita pending
     */
    public function isPending()
    {
        return $this->status === 'pending';
    }
}
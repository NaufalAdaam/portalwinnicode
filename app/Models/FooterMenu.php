<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FooterMenu extends Model
{
    use HasFactory;

    protected $fillable = ['nama_menu', 'url', 'urutan'];

    // Optional: jika ingin menggunakan nama tabel yang berbeda
    // protected $table = 'footer_menus';
}
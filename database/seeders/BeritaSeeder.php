<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Berita; // Import model Anda

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        // Perintahkan BeritaFactory untuk membuat 50 data palsu
        Berita::factory(100)->create(); 
    }
}
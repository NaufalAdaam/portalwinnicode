<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Panggil BeritaSeeder Anda di sini
        $this->call([
            BeritaSeeder::class,
            // Anda bisa tambahkan seeder lain di sini
        ]);
    }
}
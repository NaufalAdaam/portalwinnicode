<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str; // Import Str

class BeritaFactory extends Factory
{
    public function definition(): array
    {
        $judul = $this->faker->sentence(6); // Buat 1 kalimat palsu

        return [
            'judul' => $judul,
            'slug' => Str::slug($judul), // Buat slug dari judul
            'thumbnail_url' => 'https://placehold.co/800x600?text=Berita', // Gambar palsu
            'deskripsi_singkat' => $this->faker->paragraph(2), // 2 paragraf palsu
            'isi_berita' => $this->faker->paragraph(10), // 10 paragraf palsu
            'status' => $this->faker->randomElement(['draft', 'pending', 'published']),
            'published_at' => $this->faker->optional()->dateTime(), // nullable
            'is_pinned' => $this->faker->boolean(20), // 20% kemungkinan di-pin
            'is_headline' => $this->faker->boolean(30), // 30% kemungkinan jadi headline
            'is_subheadline' => $this->faker->boolean(30), // 30% kemungkinan jadi sub-headline
            'views' => $this->faker->numberBetween(100, 5000),
        ];
    }
}
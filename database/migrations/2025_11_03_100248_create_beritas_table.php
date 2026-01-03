<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('beritas', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->string('thumbnail_url'); //untuk foto
            $table->text('deskripsi_singkat');
            $table->longText('isi_berita');
            
            // --- KOLOM KONTROL KONTEN (PENTING!) ---
            
            // Untuk alur persetujuan Admin (draft, pending, published)
            $table->enum('status', ['draft', 'pending', 'published'])->default('draft');
            
            // Untuk mengurutkan "Berita Terbaru" secara akurat
            $table->timestamp('published_at')->nullable(); 

            // --- FLAG UNTUK TAMPILAN HOME.JSX ---
            
            // 1. Untuk 'PinNewsSlider'
            $table->boolean('is_pinned')->default(false); 
            
            // 2. Untuk 'HeadlineCard'
            $table->boolean('is_headline')->default(false); 
            
            // 3. Untuk 'SubHeadlineCard'
            $table->boolean('is_subheadline')->default(false); 

            // 4. Untuk 'TerpopulerItem' (sesuai nama prop Anda)
            $table->boolean('is_terpopuler')->default(false); 

            // Untuk melacak views (sudah benar)
            $table->integer('views')->default(0);

            // $table->foreignId('kategori_id')->constrained(); 
            // $table->foreignId('user_id')->constrained(); // ID Penulis

            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beritas');
    }
};
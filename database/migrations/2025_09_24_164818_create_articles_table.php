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
    Schema::create('articles', function (Blueprint $table) {
        $table->id(); // Kolom id
        $table->string('title'); // Kolom Judul
        $table->text('content'); // Kolom isi artikel
        $table->string('keywords')->nullable(); // Kolom Keyword, nullable artinya boleh kosong
        $table->string('image')->nullable(); // Kolom Foto Terkait, boleh kosong
        $table->enum('status', ['draft', 'published'])->default('draft'); // Kolom status
        
        // Kunci tamu (foreign key) yang terhubung ke tabel users
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        
        // Kunci tamu (foreign key) yang terhubung ke tabel categories
        $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
        
        $table->timestamps(); // Otomatis membuat kolom created_at (sebagai tanggal artikel) dan updated_at
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};

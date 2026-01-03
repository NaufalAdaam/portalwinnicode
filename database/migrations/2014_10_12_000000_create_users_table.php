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
    Schema::create('users', function (Blueprint $table) {
        $table->id(); // Kolom id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
        $table->string('name'); // Kolom name (VARCHAR)
        $table->string('email')->unique(); // Kolom email (VARCHAR, harus unik)
        $table->string('password'); // Kolom password (VARCHAR)
        $table->enum('role', ['admin', 'penulis'])->default('penulis'); // Kolom role, pilihan hanya 'admin' atau 'penulis'
        $table->timestamps(); // Otomatis membuat kolom created_at dan updated_at
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

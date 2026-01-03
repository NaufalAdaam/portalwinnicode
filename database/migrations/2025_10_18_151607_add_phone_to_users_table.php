<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Fungsi ini dieksekusi saat Anda menjalankan `php artisan migrate`.
     * Tugasnya adalah MENAMBAHKAN kolom 'phone' ke tabel 'users'.
     */
    public function up(): void
    {
        // Membuka tabel 'users' untuk dimodifikasi
        Schema::table('users', function (Blueprint $table) {
            // Menambahkan kolom 'phone' dengan tipe data string (VARCHAR),
            // boleh kosong (nullable), dan diletakkan setelah kolom 'email'.
            $table->string('phone')->nullable()->after('name');
        });
    }

    /**
     * Reverse the migrations.
     * Fungsi ini dieksekusi saat Anda menjalankan `php artisan migrate:rollback`.
     * Tugasnya adalah MENGHAPUS kolom 'phone' sebagai 'undo'.
     */
    public function down(): void
    {
        // Membuka tabel 'users' untuk dimodifikasi
        Schema::table('users', function (Blueprint $table) {
            // Menghapus kolom 'phone' dari tabel.
            $table->dropColumn('phone');
        });
    }
};


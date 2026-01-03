<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->string('topik')->nullable()->after('isi_berita');
            $table->string('keywords')->nullable()->after('topik');
            $table->date('tanggal')->nullable()->after('keywords');
        });
    }

    public function down(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->dropColumn(['topik', 'keywords', 'tanggal']);
        });
    }
};

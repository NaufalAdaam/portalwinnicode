<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('footer_socials', function (Blueprint $table) {
            $table->string('icon')->nullable()->after('link');
        });
    }

    public function down(): void
    {
        Schema::table('footer_socials', function (Blueprint $table) {
            $table->dropColumn('icon');
        });
    }
};

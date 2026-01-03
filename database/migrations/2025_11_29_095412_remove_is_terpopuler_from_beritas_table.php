<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->dropColumn('is_terpopuler');
        });
    }

    public function down()
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->boolean('is_terpopuler')->default(false);
        });
    }
};
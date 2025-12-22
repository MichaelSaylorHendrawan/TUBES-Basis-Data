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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'department')) {
                $table->string('department')->nullable()->index();
            }
            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('active')->index();
            }
            // Indexes for common search/sort columns
            $table->index(['name']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'department')) {
                $table->dropIndex(['department']);
                $table->dropColumn('department');
            }
            if (Schema::hasColumn('users', 'status')) {
                $table->dropIndex(['status']);
                $table->dropColumn('status');
            }
            $table->dropIndex(['name']);
            $table->dropIndex(['created_at']);
        });
    }
};
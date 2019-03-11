<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSuppliersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('address',1000)->nullable();
            $table->string('phone',25)->nullable();
            $table->string('mobilephone',25)->nullable();
            $table->string('email')->nullable();
            $table->integer('credit_days')->nullable();
            $table->string('comments',1000)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        DB::table('entities')->insert([
            'name' => 'suppliers'
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('suppliers');
    }
}

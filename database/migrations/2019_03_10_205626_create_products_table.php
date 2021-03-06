<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('sku')->nullable();
            $table->string('image')->nullable();
            $table->integer('fabric_id');
            $table->integer('design_id')->nullable();
            $table->integer('color_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        DB::table('entities')->insert([
            'name' => 'products'
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}

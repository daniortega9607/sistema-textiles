<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('stock_id');
            $table->integer('purchase_id')->nullable();
            $table->integer('sale_id')->nullable();
            $table->decimal('quantity',10,2);
            $table->decimal('remaining_quantity',10,2);
            $table->integer('user_id');
            $table->timestamps();
        });

        DB::table('entities')->insert([
            'name' => 'stock_details'
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stock_details');
    }
}

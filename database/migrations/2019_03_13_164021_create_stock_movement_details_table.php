<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockMovementDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_movement_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('stock_movement_id');
            $table->unsignedInteger('stock_detail_id');
            $table->timestamps();
        });

        DB::table('entities')->insert([
            'name' => 'stock_movement_details'
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stock_movement_details');
    }
}

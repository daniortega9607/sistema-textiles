<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockMovementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('office_id');
            $table->unsignedInteger('to_office_id');
            $table->decimal('balance',10,2)->default(0);
            $table->decimal('total',10,2)->default(0);
            $table->tinyInteger('status')->default(2);//1) Canceled, 2) Pending, 3) Completed
            $table->unsignedInteger('user_id');
            $table->timestamps();
            $table->softDeletes();
        });

        DB::table('entities')->insert([
            'name' => 'stock_movements'
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stock_movements');
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StockMovementDetail extends Model
{
    protected $fillable = [
        'stock_movement_id','stock_detail_id'
    ];

    public function stockMovement()
    {
        return $this->belongsTo('App\StockMovement')->withTrashed();
    }

    public function stockDetail()
    {
        return $this->belongsTo('App\StockDetail');
    }
}

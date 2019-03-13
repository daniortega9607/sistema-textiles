<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StockDetail extends Model
{
    protected $fillable = [
        'stock_id','quantity','remaining_quantity','user_id'
    ];
    
    public function stock()
    {
        return $this->belongsTo('App\Stock');
    }

    public function user()
    {
        return $this->belongsTo('App\User')->withTrashed();
    }
}

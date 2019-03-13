<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $fillable = [
        'office_id','product_id','stock'
    ];
    
    public function office()
    {
        return $this->belongsTo('App\Office')->withTrashed();
    }

    public function product()
    {
        return $this->belongsTo('App\Product')->withTrashed();
    }

    public function stocks()
    {
        return $this->hasMany('App\StockDetail');
    }
}

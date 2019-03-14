<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockMovement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'office_id','to_office_id','balance','total','status','user_id', 'stocks'
    ];

    public function office()
    {
        return $this->belongsTo('App\Office')->withTrashed();
    }

    public function to_office()
    {
        return $this->belongsTo('App\Office')->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo('App\User')->withTrashed();
    }

    public function stocks()
    {
        return $this->hasMany('App\StockMovementDetail');
    }
}

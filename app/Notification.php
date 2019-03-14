<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'entity_id','entity_value_id','message','status','user_id'
    ];

    public function entity()
    {
        return $this->belongsTo('App\Entity');
    }
}

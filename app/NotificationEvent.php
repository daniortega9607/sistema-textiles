<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NotificationEvent extends Model
{
    protected $fillable = [
        'entity_id','entity_value_id','type'
    ];
    
    public function entity()
    {
        return $this->belongsTo('App\Entity');
    }
}

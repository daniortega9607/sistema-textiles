<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserPermission extends Model
{
    protected $fillable = [
        'user_id','permission_id','editor_id'
    ];
    
    public function user(){
        return $this->belongsTo('App\User');
    }
    
    public function permission(){
        return $this->belongsTo('App\Permission');
    }
    
    public function editor(){
        return $this->belongsTo('App\User');
    }
}

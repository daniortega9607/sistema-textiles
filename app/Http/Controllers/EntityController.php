<?php

namespace App\Http\Controllers;

use App\Entity;
use Illuminate\Http\Request;

class EntityController extends Controller
{
    public function index()
    {
        return response()->json(Entity::all(),200);
    }
}

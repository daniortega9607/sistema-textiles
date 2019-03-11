<?php

namespace App\Http\Controllers;

use App\Color;
use App\NotificationEvent;
use App\Entity;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    public function index(Request $request)
    {
        $query = Color::select('*');
        if (isset($request->search)) {
            $query->where('name','like','%'.$request->search.'%');
        }
        $query->orderBy('name');
        if (isset($request->paginate)) {
            $paginate = $request->paginate;
            return response()->json($query->paginate($paginate),200);
        }
        return response()->json($query->get(),200);
    }

    public function search(Request $request)
    {
        $query = Color::selectRaw('id, name as value');
        if(isset($request->id)){
            return response()->json($query->withTrashed()->find($request->id),200);
        }
        $query->where('name','like','%'.$request->search.'%');
        return response()->json($query->get(),200);
    }

    public function store(Request $request)
    {
        $item = Color::create($request->only([
            'name','value'
        ]));

        NotificationEvent::create([
            'entity_id' => Entity::where('name','colors')->first()->id,
            'entity_value_id' => $item->id,
            'type' => 1
        ]);

        return response()->json([
            'status' => (bool) $item,
            'data'   => $item,
            'message' => $item ? 'Color Created!' : 'Error Creating Color'
        ]);
    }

    public function show(Color $color)
    {
        return response()->json($color,200);         
    }

    public function update(Request $request, Color $color)
    {
        $status = $color->update(
            $request->only(['name','value'])
        );

        $now = date('Y-m-d h:i:s');
        NotificationEvent::insert([
            [
                'entity_id' => Entity::where('name','colors')->first()->id,
                'entity_value_id' => $color->id,
                'created_at' => $now,
                'updated_at' => $now,
                'type' => 3
            ],
            [
                'entity_id' => Entity::where('name','products')->first()->id,
                'entity_value_id' => NULL,
                'created_at' => $now,
                'updated_at' => $now,
                'type' => 2
            ],
            [
                'entity_id' => Entity::where('name','stocks')->first()->id,
                'entity_value_id' => NULL,
                'created_at' => $now,
                'updated_at' => $now,
                'type' => 2
            ]
        ]);
        
        return response()->json([
            'status' => $status,
            'message' => $status ? 'Color Updated!' : 'Error Updating Color'
        ]);
    }

    public function destroy(Color $color)
    {
        $status = $color->delete();

        NotificationEvent::create([
            'entity_id' => Entity::where('name','colors')->first()->id,
            'entity_value_id' => $color->id,
            'type' => 4
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Color Deleted!' : 'Error Deleting Color'
        ]);
    }
}

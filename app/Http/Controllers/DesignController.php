<?php

namespace App\Http\Controllers;

use App\Design;
use App\NotificationEvent;
use App\Entity;
use Illuminate\Http\Request;

class DesignController extends Controller
{
    public function index(Request $request)
    {
        $query = Design::select('*');
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
        $query = Design::selectRaw('id, name as value');
        if(isset($request->id)){
            return response()->json($query->withTrashed()->find($request->id),200);
        }
        $query->where('name','like','%'.$request->search.'%');
        return response()->json($query->get(),200);
    }

    public function store(Request $request)
    {
        $item = Design::create($request->only([
            'name'
        ]));

        NotificationEvent::create([
            'entity_id' => Entity::where('name','designs')->first()->id,
            'entity_value_id' => $item->id,
            'type' => 1
        ]);

        return response()->json([
            'status' => (bool) $item,
            'data'   => $item,
            'message' => $item ? 'Design Created!' : 'Error Creating Design'
        ]);
    }

    public function show(Design $design)
    {
        return response()->json($design,200);         
    }

    public function update(Request $request, Design $design)
    {
        $status = $design->update(
            $request->only(['name'])
        );

        $now = date('Y-m-d h:i:s');
        NotificationEvent::insert([
            [
                'entity_id' => Entity::where('name','designs')->first()->id,
                'entity_value_id' => $design->id,
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
            'message' => $status ? 'Design Updated!' : 'Error Updating Design'
        ]);
    }

    public function destroy(Design $design)
    {
        $status = $design->delete();

        NotificationEvent::create([
            'entity_id' => Entity::where('name','designs')->first()->id,
            'entity_value_id' => $design->id,
            'type' => 4
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Design Deleted!' : 'Error Deleting Design'
        ]);
    }
}

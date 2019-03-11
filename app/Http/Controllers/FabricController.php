<?php

namespace App\Http\Controllers;

use App\Fabric;
use App\NotificationEvent;
use App\Entity;
use Illuminate\Http\Request;

class FabricController extends Controller
{
    public function index(Request $request)
    {
        $query = Fabric::select('*');
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
        $query = Fabric::selectRaw('id, name as value');
        if(isset($request->id)){
            return response()->json($query->withTrashed()->find($request->id),200);
        }
        $query->where('name','like','%'.$request->search.'%');
        return response()->json($query->get(),200);
    }
    
    public function store(Request $request)
    {
        $item = Fabric::create($request->only([
            'name','buy_price','sell_price'
        ]));

        NotificationEvent::create([
            'entity_id' => Entity::where('name','fabrics')->first()->id,
            'entity_value_id' => $item->id,
            'type' => 1
        ]);

        return response()->json([
            'status' => (bool) $item,
            'data'   => $item,
            'message' => $item ? 'Fabric Created!' : 'Error Creating Fabric'
        ]);
    }

    public function show(Fabric $fabric)
    {
        return response()->json($fabric,200);         
    }

    public function update(Request $request, Fabric $fabric)
    {
        $status = $fabric->update(
            $request->only(['name','buy_price','sell_price'])
        );
        
        $now = date('Y-m-d h:i:s');
        NotificationEvent::insert([
            [
                'entity_id' => Entity::where('name','fabrics')->first()->id,
                'entity_value_id' => $fabric->id,
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
            'message' => $status ? 'Fabric Updated!' : 'Error Updating Fabric'
        ]);
    }

    public function destroy(Fabric $fabric)
    {
        $status = $fabric->delete();

        NotificationEvent::create([
            'entity_id' => Entity::where('name','fabrics')->first()->id,
            'entity_value_id' => $fabric->id,
            'type' => 4
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Fabric Deleted!' : 'Error Deleting Fabric'
        ]);
    }
}

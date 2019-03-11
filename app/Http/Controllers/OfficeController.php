<?php

namespace App\Http\Controllers;

use App\Office;
use App\NotificationEvent;
use App\Entity;
use Illuminate\Http\Request;

class OfficeController extends Controller
{
    public function index(Request $request)
    {
        $query = Office::select('*');
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
        $query = Office::selectRaw('id, name as value');
        if(isset($request->id)){
            return response()->json($query->withTrashed()->find($request->id),200);
        }
        $query->where('name','like','%'.$request->search.'%');
        return response()->json($query->get(),200);
    }

    public function store(Request $request)
    {
        $item = Office::create($request->only([
            'name','address','phone'
        ]));

        NotificationEvent::create([
            'entity_id' => Entity::where('name','offices')->first()->id,
            'entity_value_id' => $item->id,
            'type' => 1
        ]);
        
        return response()->json([
            'status' => (bool) $item,
            'data'   => $item,
            'message' => $item ? 'Office Created!' : 'Error Creating Office'
        ]);
    }

    public function show(Office $office)
    {
        return response()->json($office,200);         
    }

    public function update(Request $request, Office $office)
    {
        $status = $office->update(
            $request->only(['name','address','phone'])
        );

        NotificationEvent::create([
            'entity_id' => Entity::where('name','offices')->first()->id,
            'entity_value_id' => $office->id,
            'type' => 3
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Office Updated!' : 'Error Updating Office'
        ]);
    }

    public function destroy(Office $office)
    {
        $status = $office->delete();

        NotificationEvent::create([
            'entity_id' => Entity::where('name','offices')->first()->id,
            'entity_value_id' => $office->id,
            'type' => 4
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Office Deleted!' : 'Error Deleting Office'
        ]);
    }
}

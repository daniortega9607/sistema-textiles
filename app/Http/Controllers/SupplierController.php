<?php

namespace App\Http\Controllers;

use App\Supplier;
use App\NotificationEvent;
use App\Entity;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::select('*');
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
        $query = Supplier::selectRaw('id, name as value');
        if(isset($request->id)){
            return response()->json($query->withTrashed()->find($request->id),200);
        }
        $query->where('name','like','%'.$request->search.'%');
        return response()->json($query->get(),200);
    }

    public function store(Request $request)
    {
        $item = Supplier::create($request->only([
            'name','address','phone','mobilephone','email','credit_days','comments'
        ]));

        NotificationEvent::create([
            'entity_id' => Entity::where('name','suppliers')->first()->id,
            'entity_value_id' => $item->id,
            'type' => 1
        ]);
        
        return response()->json([
            'status' => (bool) $item,
            'data'   => $item,
            'message' => $item ? 'Supplier Created!' : 'Error Creating Supplier'
        ]);
    }

    public function show(Supplier $supplier)
    {
        return response()->json($supplier,200);         
    }

    public function update(Request $request, Supplier $supplier)
    {
        $status = $supplier->update(
            $request->only(['name','address','phone','mobilephone','email','credit_days','comments'])
        );

        NotificationEvent::create([
            'entity_id' => Entity::where('name','suppliers')->first()->id,
            'entity_value_id' => $supplier->id,
            'type' => 3
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Supplier Updated!' : 'Error Updating Supplier'
        ]);
    }

    public function destroy(Supplier $supplier)
    {
        $status = $supplier->delete();

        NotificationEvent::create([
            'entity_id' => Entity::where('name','suppliers')->first()->id,
            'entity_value_id' => $supplier->id,
            'type' => 4
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Supplier Deleted!' : 'Error Deleting Supplier'
        ]);
    }
}

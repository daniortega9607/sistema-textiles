<?php

namespace App\Http\Controllers;

use App\Stock;
use App\StockDetail;
use App\StockMovement;
use App\NotificationEvent;
use App\Entity;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = StockMovement::select('*');
        if (isset($request->search)) {
            $query->where('name','like','%'.$request->search.'%');
        }
        $query->orderBy('created_at');
        if (isset($request->paginate)) {
            $paginate = $request->paginate;
            return response()->json($query->paginate($paginate),200);
        }
        return response()->json($query->get(),200);
    }

    public function search(Request $request)
    {
        $query = StockMovement::selectRaw('id, name as value');
        if(isset($request->id)){
            return response()->json($query->withTrashed()->find($request->id),200);
        }
        $query->where('name','like','%'.$request->search.'%');
        return response()->json($query->get(),200);
    }

    public function store(Request $request)
    {
        $stockMovement = $request->only([
            'office_id','to_office_id','balance','total','status'
        ]);
        $stockMovement['user_id'] = 1;//$request->user()->id;

        $item = StockMovement::create($stockMovement);

        foreach ($request->stocks as $key => $value) {
            $fromStockDetail = StockDetail::find($value['id']);
            $stock = $fromStockDetail->stock;
            $toStock = Stock::select('*')->where('office_id',$stockMovement['to_office_id'])
            ->where('product_id',$stock['product_id'])->first();
            if (is_null($toStock)) {
                $toStock = Stock::create([
                    'office_id' => $stockMovement['to_office_id'],
                    'product_id' => $stock['product_id'],
                    'stock' => 0
                ]);
            }
            $fromStockDetail->stock_id = $toStock->id;
            $fromStockDetail->save();
            $stock->stock = $stock->stocks()->sum('remaining_quantity');
            $stock->save();
            $toStock->stock = $toStock->stocks()->sum('remaining_quantity');
            $toStock->save();
        }

        $now = date('Y-m-d h:i:s');
        NotificationEvent::insert([
            [
                'entity_id' => Entity::where('name','stock_movements')->first()->id,
                'entity_value_id' => $item->id,
                'created_at' => $now,
                'updated_at' => $now,
                'type' => 1
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
            'status' => (bool) $item,
            'data'   => $item,
            'message' => $item ? 'StockMovement Created!' : 'Error Creating StockMovement'
        ]);
    }

    public function show(StockMovement $stockMovement)
    {
        return response()->json($stockMovement->with([
            'office','to_office'
        ])->find($stockMovement->id),200);         
    }

    public function destroy(StockMovement $stockMovement)
    {
        $status = $stockMovement->delete();

        NotificationEvent::create([
            'entity_id' => Entity::where('name','stocks')->first()->id,
            'type' => 2
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'StockMovement Deleted!' : 'Error Deleting StockMovement'
        ]);
    }
}

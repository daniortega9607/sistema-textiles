<?php

namespace App\Http\Controllers;

use App\Stock;
use App\StockDetail;
use App\StockMovement;
use App\Notification;
use App\NotificationEvent;
use App\Entity;
use App\User;
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
        $stockMovement['user_id'] = $request->user()->id;

        $item = StockMovement::create($stockMovement);

        $stocks = $request->stocks;

        if(count($stocks) > 0) {
            foreach ($stocks as $key => $value) {
                $stocks[$key]['stock_detail_id'] = $value['id'];
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
            $item->stocks()->createMany($stocks);
        }

        $now = date('Y-m-d h:i:s');

        $users = User::where('user_type', 1)->where('id','!=',$request->user()->id)->get();
        $notifications = [];

        foreach ($users as $key => $value) {
            $notifications[] = [
                'entity_id' => Entity::where('name','stock_movements')->first()->id,
                'entity_value_id' => $item->id,
                'created_at' => $now,
                'message' => $request->user()->name.' ha creado un movimiento de almacen',
                'user_id' => $value['id']
            ];
        }
        return $notifications;
        if(count($notifications) > 0) {
            Notification::insert($notifications);
        }

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
            ],
            [
                'entity_id' => Entity::where('name','notifications')->first()->id,
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
            'office','to_office',
            'stocks.stockDetail.stock.product.fabric',
			'stocks.stockDetail.stock.product.design',
			'stocks.stockDetail.stock.product.color'
        ])->find($stockMovement->id),200);         
    }

    public function destroy(StockMovement $stockMovement)
    {
        $status = $stockMovement->delete();

        foreach ($stockMovement->stocks as $key => $stockMovementDetail) {
            $fromStock = $stockMovementDetail->stockDetail->stock;
            $toStock = Stock::select('*')->where('office_id',$stockMovementDetail->stockMovement['office_id'])
            ->where('product_id',$fromStock['product_id'])->first();
            $stockMovementDetail->stockDetail->stock_id = $toStock['id'];
            $stockMovementDetail->stockDetail->save();

            $fromStock->stock = $fromStock->stocks()->sum('remaining_quantity');
            $fromStock->save();
            $toStock->stock = $toStock->stocks()->sum('remaining_quantity');
            $toStock->save();

            $status = $stockMovementDetail->delete();
        }

        


        $now = date('Y-m-d h:i:s');
        NotificationEvent::insert([
            [
                'entity_id' => Entity::where('name','stock_movements')->first()->id,
                'entity_value_id' => $stockMovement->id,
                'created_at' => $now,
                'updated_at' => $now,
                'type' => 4
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
            'message' => $status ? 'StockMovement Deleted!' : 'Error Deleting StockMovement'
        ]);
    }
}

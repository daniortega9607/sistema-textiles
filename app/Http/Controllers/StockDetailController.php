<?php

namespace App\Http\Controllers;

use App\StockDetail;
use App\NotificationEvent;
use App\Entity;
use Illuminate\Http\Request;

class StockDetailController extends Controller
{
    public function store(Request $request)
    {
        $stockDetail = $request->only([
            'stock_id','quantity','remaining_quantity'
        ]);
        $stockDetail['user_id'] = 1;//$request->user()->id;

        $item = StockDetail::create($stockDetail);

        $item->stock->stock = $item->stock->stocks()->sum('remaining_quantity');
        $item->stock->save();

        NotificationEvent::create([
            'entity_id' => Entity::where('name','stocks')->first()->id,
            'entity_value_id' => $item->stock_id,
            'type' => 3
        ]);

        return response()->json([
            'status' => (bool) $item,
            'data'   => $item,
            'message' => $item ? 'StockDetail Created!' : 'Error Creating StockDetail'
        ]);
    }

    public function show(StockDetail $stockDetail)
    {
        return response()->json($stockDetail,200);         
    }

    public function update(Request $request, StockDetail $stockDetail)
    {
        $status = $stockDetail->update(
            $request->only(['remaining_quantity'])
        );

        NotificationEvent::create([
            'entity_id' => Entity::where('name','stocks')->first()->id,
            'entity_value_id' => $stockDetail->stock_id,
            'type' => 3
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'StockDetail Updated!' : 'Error Updating StockDetail'
        ]);
    }

    public function destroy(StockDetail $stockDetail)
    {
        $status = $stockDetail->delete();

        $stockDetail->stock->stock = $stockDetail->stock->stocks()->sum('remaining_quantity');
        $stockDetail->stock->save();

        NotificationEvent::create([
            'entity_id' => Entity::where('name','stocks')->first()->id,
            'entity_value_id' => $stockDetail->stock_id,
            'type' => 3
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'StockDetail Deleted!' : 'Error Deleting StockDetail'
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Stock;
use App\NotificationEvent;
use App\Entity;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $query = Stock::select('*')->with(['office','product.fabric','product.color','product.design','stocks']);
        /*if (isset($request->search)) {
            $query->where('name','like','%'.$request->search.'%');
        }
        $query->orderBy('name');*/
        if (isset($request->paginate)) {
            $paginate = $request->paginate;
            return response()->json($query->paginate($paginate),200);
        }
        return response()->json($query->get(),200);
    }

    public function search(Request $request)
    {
        $query = Stock::selectRaw('id, name as value');
        if(isset($request->id)){
            return response()->json($query->withTrashed()->find($request->id),200);
        }
        $query->where('name','like','%'.$request->search.'%');
        return response()->json($query->get(),200);
    }

    public function store(Request $request)
    {
        $stock = Stock::select('*')->where('office_id',$request->office_id)
        ->where('product_id',$request->product_id)->first();

        $item = null;
        if ($stock) {
            $item = $stock;
        } else {
            $item = Stock::create($request->only([
                'office_id','product_id','stock'
            ]));
        }

        $stocks = $request->stocks;

        if(count($stocks) > 0) {
            foreach ($stocks as $key => $value) {
                $stocks[$key]['user_id'] = $request->user()->id;
            }
            $item->stocks()->createMany($stocks);
            $item->stock = $item->stocks()->sum('remaining_quantity');
            $item->save();
        }
        
        if ($stock) {
            NotificationEvent::create([
                'entity_id' => Entity::where('name','stocks')->first()->id,
                'entity_value_id' => $item->id,
                'type' => 3
            ]);
        } else {
            NotificationEvent::create([
                'entity_id' => Entity::where('name','stocks')->first()->id,
                'entity_value_id' => $item->id,
                'type' => 1
            ]);
        }

        return response()->json([
            'status' => (bool) $item,
            'data'   => $item,
            'message' => $item ? 'Stock Created!' : 'Error Creating Stock'
        ]);
    }

    public function show(Stock $stock)
    {
        return response()->json($stock->with([
            'office','product.fabric','product.color','product.design','stocks'
        ])->find($stock->id),200);         
    }

    public function update(Request $request, Stock $stock)
    {
        $status = $stock->update(
            $request->only(['stock'])
        );

        NotificationEvent::create([
            'entity_id' => Entity::where('name','stocks')->first()->id,
            'entity_value_id' => $stock->id,
            'type' => 3
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Stock Updated!' : 'Error Updating Stock'
        ]);
    }
}

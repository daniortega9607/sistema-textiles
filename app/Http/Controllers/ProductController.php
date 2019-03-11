<?php

namespace App\Http\Controllers;

use App\Product;
use App\NotificationEvent;
use App\Entity;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::select('products.*')->with(['fabric','color','design']);

        $query->join('fabrics','fabrics.id','=','products.fabric_id');
        $query->leftJoin('colors','colors.id','=','products.color_id');
        $query->leftJoin('designs','designs.id','=','products.design_id');
        
        if (isset($request->search)) {
            $query->where('products.sku','like','%'.$request->search.'%')
            ->orWhere('fabrics.name','like','%'.$request->search.'%')
            ->orWhere('colors.name','like','%'.$request->search.'%')
            ->orWhere('designs.name','like','%'.$request->search.'%');
        }
        $query->orderBy('fabrics.name');
        if (isset($request->paginate)) {
            $paginate = $request->paginate;
            return response()->json($query->paginate($paginate),200);
        }
        return response()->json($query->get(),200);
    }

    public function search(Request $request)
    {
        $query = Product::selectRaw('products.id, CONCAT(products.sku," ",fabrics.name," ",designs.name," ",colors.name," ") as value');

        $query->join('fabrics','fabrics.id','=','products.fabric_id');
        $query->leftJoin('colors','colors.id','=','products.color_id');
        $query->leftJoin('designs','designs.id','=','products.design_id');
        if(isset($request->id)){
            return response()->json($query->withTrashed()->find($request->id),200);
        }
        $query->where('products.sku','like','%'.$request->search.'%')
        ->orWhere('fabrics.name','like','%'.$request->search.'%')
        ->orWhere('colors.name','like','%'.$request->search.'%')
        ->orWhere('designs.name','like','%'.$request->search.'%');
        return response()->json($query->get(),200);
    }

    public function store(Request $request)
    {
        $item = Product::create($request->only([
            'sku','fabric_id','design_id','color_id'
        ]));

        NotificationEvent::create([
            'entity_id' => Entity::where('name','products')->first()->id,
            'entity_value_id' => $item->id,
            'type' => 1
        ]);

        return response()->json([
            'status' => (bool) $item,
            'data'   => $item,
            'message' => $item ? 'Product Created!' : 'Error Creating Product'
        ]);
    }

    public function show(Product $product)
    {
        return response()->json($product->with(['fabric','color','design'])->find($product->id),200);         
    }

    public function update(Request $request, Product $product)
    {
        $status = $product->update(
            $request->only(['sku','fabric_id','design_id','color_id'])
        );

        $now = date('Y-m-d h:i:s');
        NotificationEvent::insert([
            [
                'entity_id' => Entity::where('name','products')->first()->id,
                'entity_value_id' => $product->id,
                'created_at' => $now,
                'updated_at' => $now,
                'type' => 3
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
            'message' => $status ? 'Product Updated!' : 'Error Updating Product'
        ]);
    }

    public function destroy(Product $product)
    {
        $status = $product->delete();

        NotificationEvent::create([
            'entity_id' => Entity::where('name','products')->first()->id,
            'entity_value_id' => $product->id,
            'type' => 4
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Product Deleted!' : 'Error Deleting Product'
        ]);
    }
}

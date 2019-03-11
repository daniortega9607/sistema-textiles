<?php

namespace App\Http\Controllers;

use App\Customer;
use App\NotificationEvent;
use App\Entity;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::select('*');
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
        $query = Customer::selectRaw('id, name as value');
        if(isset($request->id)){
            return response()->json($query->withTrashed()->find($request->id),200);
        }
        $query->where('name','like','%'.$request->search.'%');
        return response()->json($query->get(),200);
    }

    public function store(Request $request)
    {
        $item = Customer::create($request->only([
            'name','address','phone','mobilephone','email','credit_days','comments'
        ]));

        NotificationEvent::create([
            'entity_id' => Entity::where('name','customers')->first()->id,
            'entity_value_id' => $item->id,
            'type' => 1
        ]);
        
        return response()->json([
            'status' => (bool) $item,
            'data'   => $item,
            'message' => $item ? 'Customer Created!' : 'Error Creating Customer'
        ]);
    }

    public function show(Customer $customer)
    {
        return response()->json($customer,200);         
    }

    public function update(Request $request, Customer $customer)
    {
        $status = $customer->update(
            $request->only(['name','address','phone','mobilephone','email','credit_days','comments'])
        );

        NotificationEvent::create([
            'entity_id' => Entity::where('name','customers')->first()->id,
            'entity_value_id' => $customer->id,
            'type' => 3
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Customer Updated!' : 'Error Updating Customer'
        ]);
    }

    public function destroy(Customer $customer)
    {
        $status = $customer->delete();

        NotificationEvent::create([
            'entity_id' => Entity::where('name','customers')->first()->id,
            'entity_value_id' => $customer->id,
            'type' => 4
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Customer Deleted!' : 'Error Deleting Customer'
        ]);
    }
}

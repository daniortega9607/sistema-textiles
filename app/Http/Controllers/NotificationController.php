<?php

namespace App\Http\Controllers;

use App\Notification;
use App\NotificationEvent;
use App\Entity;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Notification::select('*')->with(['entity'])->where('user_id',$request->user()->id);
        $query->orderBy('created_at');
        if (isset($request->paginate)) {
            $paginate = $request->paginate;
            return response()->json($query->paginate($paginate),200);
        }
        return response()->json($query->get(),200);
    }

    public function show(Notification $notification)
    {
        return response()->json($notification->with(['entity'])->find($notification->id),200);         
    }

    public function update(Request $request, Notification $notification)
    {
        $status = $notification->update(
            $request->only(['status'])
        );

        $now = date('Y-m-d h:i:s');
        NotificationEvent::insert([
            [
                'entity_id' => Entity::where('name','notifications')->first()->id,
                'entity_value_id' => $notification->id,
                'created_at' => $now,
                'updated_at' => $now,
                'type' => 3
            ],
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Notification Updated!' : 'Error Updating Notification'
        ]);
    }

    public function destroy(Notification $notification)
    {
        $status = $notification->delete();

        NotificationEvent::create([
            'entity_id' => Entity::where('name','notifications')->first()->id,
            'entity_value_id' => $notification->id,
            'type' => 4
        ]);

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Notification Deleted!' : 'Error Deleting Notification'
        ]);
    }
}

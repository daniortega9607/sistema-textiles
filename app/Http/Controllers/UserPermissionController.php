<?php

namespace App\Http\Controllers;

use Auth;
use App\UserPermission;
use Illuminate\Http\Request;

class UserPermissionController extends Controller
{
    public function index()
    {
        return response()->json(UserPermission::with([
            'user', 'permission', 'editor
        '])->get(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->only(['user_id', 'permission_id']);
        $data['editor_id'] = Auth::user()->id;

        $res = UserPermission::create($data);

        return response()->json([
            'status' => (bool) $res,
            'data' => $res,
            'message' => $res ? 'Item Created!' : 'Error Creating Item',
        ]);
    }

    public function destroy(UserPermission $userPermission)
    {
        $status = $userPermission->delete();

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Item Deleted!' : 'Error Deleting Item',
        ]);
    }
}

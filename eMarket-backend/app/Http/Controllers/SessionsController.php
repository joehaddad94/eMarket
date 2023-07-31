<?php

namespace App\Http\Controllers;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;

class SessionsController extends Controller
{
    function addSession ($user_id) {

        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['error' => 'User not found']);
        }

        $existingSession = Session::where('user_id', $user_id)->first();
        if ($existingSession) {
            return response()->json(['message' => 'User already has a session']);
        }

        $session = new Session();
        $session->user_id = $user_id;
        $session->save();

        return response()->json(['message' => 'Session added successfully']);
    }
}

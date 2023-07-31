<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;

class CartsController extends Controller
{
    function addToCart (Request $request) {
        $cart = new Cart;

        $cart->quantity = 1;
        $cart->session_id = $request->session_id;
        $cart->product_id = $request->product_id;
        $cart->save();

        return json_encode(["Cart" => $cart]); 
    }

    function deleteFromCart($id) {
        $cart = Cart::find($id);
        $cart->delete();

        return response()->json(['message' => 'Success']);
    }

    function fetchAllCartItems($session_id) {
        $cart = Cart::where('session_id', $session_id)->get();

        return response()->json(['CartItems' => $cart]);
    }
}

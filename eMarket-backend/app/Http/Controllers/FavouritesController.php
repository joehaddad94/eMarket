<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Session;
use App\Models\Favourite;
use Illuminate\Http\Request;

class FavouritesController extends Controller
{
    function addFavourites (Request $request) {
        $favourite = new Favourite;

        $favourite->product_id = $request->product_id;
        $favourite->session_id = $request->session_id;
        $favourite->save();

        return json_encode(["Favourite" => "$favourite"]);
    }

    function deleteFavourite($favourite_id) {
        $favourite = Favourite::find($favourite_id);
        $favourite->delete();

        return response()->json(['message' => 'Success']);
    }

    function fetchAllFavourites($session_id) {
        $favourites = Favourite::where('session_id', $session_id)->get();

        return response()->json(['Favourites' => $favourites]);
    }
}

<?php

namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductsController extends Controller
{
    function createOrUpdateProduct(Request $request, $id = "add"){
        if($id == "add"){
            $product = new Product;
        } else {
            $product = Product::find($id);
        }

        // $product->$id;
        $product->name = $request->name ? $request->name : $product->name;
        $product->description = $request->description ? $request->description : $product->description;
        $product->image = $request->image ? $request->image : $product->image;
        $product->category_id = $request->category_id;
        $product->save();

        return json_encode(["Product" => $product]);
    }
   

    function deleteProduct($id) {
        $product = Product::find($id);
        $product->delete();

        return response()->json(['message' => 'Success']);
    }

    function fetchAllOrOneProduct($id = null) {
        if($id){
            $products = Product::find($id);
        }else{
            $products = Product::all();
        }
        
        return json_encode(["Products" => $products]);
    }

    function fetchProductsByCategory ($category_id) {
        $products = DB::table('products')
        ->join('categories', 'products.category_id', '=', 'categories.id')
        ->where('categories.id', $category_id)
        ->select('products.*')
        ->get();

        return json_encode(["Products" => $products]);
    }
}

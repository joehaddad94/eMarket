<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoriesController extends Controller
{
   function addOrUpdateCategory(Request $request, $id = "add") {
    if($id == "add") {
        $category = new Category;
    } else {
        $category = Category::find($id);
    }

    $category->name = $request->name ? $request->name : $article->name;
    $category->save();

    return json_encode(["categories" => $category]);
   }

   function deleteCategory($id) {
    $category = Category::find($id);
    $category->delete();

    return response()->json(['message' => 'Category deleted successfully']);
   }

   function fetchAllOrOneCategory($id = null) {
    if($id){
        $categories = Category::find($id);
    }else{
        $categories = Category::all();
    }
    
    return json_encode(["Categories" => $categories]);
}
}

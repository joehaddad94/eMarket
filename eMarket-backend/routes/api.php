<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SessionsController;
use App\Http\Controllers\CartsController;
use App\Http\Controllers\FavouritesController;

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
});

Route::post('/add_update_category', [CategoriesController::class, "addOrUpdateCategory"]);
Route::get('/delete_category/{id}', [CategoriesController::class, "deleteCategory"]);
Route::post('/fetch_one_or_all_categories/{id?}', [CategoriesController::class, "fetchAllOrOneCategory"]);


Route::post('/add_update_product/{id?}', [ProductsController::class, "createOrUpdateProduct"]);
Route::post('/delete_product/{id?}', [ProductsController::class, "deleteProduct"]);
Route::post('/fetch_one_or_all_products/{id?}', [ProductsController::class, "fetchAllOrOneProduct"]);
Route::post('/fetch_all_products_by_category/{id}', [ProductsController::class, "fetchProductsByCategory"]);

Route::post('/add_session/{id}', [SessionsController::class, "addSession"]);

Route::post('/add_to_cart', [CartsController::class, "addToCart"]);
Route::post('/delete_from_cart/{id}', [CartsController::class, "deleteFromCart"]);
Route::post('/fetch_cart_items_by_session/{id}', [CartsController::class, "fetchAllCartItems"]);

Route::post('/add_to_favourites', [FavouritesController::class, "addFavourites"]);
Route::post('/delete_favourites/{id}', [FavouritesController::class, "deleteFavourite"]);
Route::post('/fetch_favourites_by_session/{id}', [FavouritesController::class, "fetchAllFavourites"]);
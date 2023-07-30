<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;

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
Route::get('/delete_product/{id?}', [ProductsController::class, "deleteProduct"]);
Route::post('/fetch_one_or_all_products/{id?}', [ProductsController::class, "fetchAllOrOneProduct"]);
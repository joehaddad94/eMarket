<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CategoriesController;

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
});

Route::post('/add_update_category', [CategoriesController::class, "addOrUpdateCategory"]);
Route::post('/delete_category/{id}', [CategoriesController::class, "deleteCategory"]);
<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::post('login', 'UserController@login');

Route::group(['middleware' => ['api']], function() {
    Route::get('/notification_events/subscribe', 'NotificationEventController@subscribe');
    Route::get('/offices/search', 'OfficeController@search');
    Route::resource('/offices', 'OfficeController');
    Route::get('/colors/search', 'ColorController@search');
    Route::resource('/colors', 'ColorController');
    Route::get('/designs/search', 'DesignController@search');
    Route::resource('/designs', 'DesignController');
    Route::get('/fabrics/search', 'FabricController@search');
    Route::resource('/fabrics', 'FabricController');
    Route::get('/products/search', 'ProductController@search');
    Route::resource('/products', 'ProductController');
    Route::get('/customers/search', 'CustomerController@search');
    Route::resource('/customers', 'CustomerController');
    Route::get('/suppliers/search', 'SupplierController@search');
    Route::resource('/suppliers', 'SupplierController');
    Route::get('/users/search', 'UserController@search');
    Route::resource('/users', 'UserController');
    Route::resource('/stocks', 'StockController');
    Route::resource('/stock_details', 'StockDetailController');
    Route::resource('/stock_movements', 'StockMovementController');
});
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', App\Http\Controllers\Api\RegisterController::class)->name('register');
Route::post('/login', App\Http\Controllers\Api\LoginController::class)->name('login');
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/song-list', [SongController::class, 'index'])->name('song.list');

Route::get('/get-playlist/{usertoken}', [MyPlaylistController::class, 'index'])->name('playlist.list');
Route::post('/addto-playlist', [MyPlaylistController::class, 'add'])->name('playlist.add');

Route::post('/logout', App\Http\Controllers\Api\LogoutController::class)->name('logout');
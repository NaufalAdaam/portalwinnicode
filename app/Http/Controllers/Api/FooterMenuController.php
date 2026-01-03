<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FooterMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FooterMenuController extends Controller
{
    public function index()
    {
        try {
            $menus = FooterMenu::orderBy('urutan', 'asc')->get();
            return response()->json($menus);
        } catch (\Exception $e) {
            Log::error('Error fetching footer menus: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch menus'], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_menu' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'urutan' => 'required|integer',
        ]);

        try {
            $menu = FooterMenu::create($request->all());
            return response()->json($menu, 201);
        } catch (\Exception $e) {
            Log::error('Error creating footer menu: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create menu'], 500);
        }
    }

    public function show($id)
    {
        try {
            $menu = FooterMenu::findOrFail($id);
            return response()->json($menu);
        } catch (\Exception $e) {
            Log::error('Error fetching footer menu: ' . $e->getMessage());
            return response()->json(['error' => 'Menu not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_menu' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'urutan' => 'required|integer',
        ]);

        try {
            $menu = FooterMenu::findOrFail($id);
            $menu->update($request->all());
            return response()->json($menu);
        } catch (\Exception $e) {
            Log::error('Error updating footer menu: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update menu'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $menu = FooterMenu::findOrFail($id);
            $menu->delete();
            return response()->json(['message' => 'Menu berhasil dihapus']);
        } catch (\Exception $e) {
            Log::error('Error deleting footer menu: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete menu'], 500);
        }
    }

    // 🔹 METHOD REORDER YANG DIPERBAIKI
    public function reorder(Request $request)
    {
        Log::info('Reorder request received:', $request->all());

        $request->validate([
            'menus' => 'required|array',
            'menus.*.id' => 'required|exists:footer_menus,id',
            'menus.*.urutan' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            foreach ($request->menus as $menuData) {
                FooterMenu::where('id', $menuData['id'])
                    ->update(['urutan' => $menuData['urutan']]);
            }

            DB::commit();

            // Ambil data terbaru untuk response
            $updatedMenus = FooterMenu::orderBy('urutan', 'asc')->get();

            Log::info('Reorder successful');

            return response()->json([
                'message' => 'Menu order updated successfully',
                'menus' => $updatedMenus
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Reorder failed: ' . $e->getMessage());

            return response()->json([
                'error' => 'Failed to update menu order',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
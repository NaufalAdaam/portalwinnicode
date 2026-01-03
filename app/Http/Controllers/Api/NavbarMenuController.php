<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NavbarMenu;
use Illuminate\Http\Request;

class NavbarMenuController extends Controller
{
    public function index()
    {
        return response()->json(NavbarMenu::orderBy('urutan')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_menu' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'urutan' => 'integer',
        ]);

        $menu = NavbarMenu::create($request->only('nama_menu', 'url', 'urutan'));
        return response()->json($menu, 201);
    }

    public function update(Request $request, $id)
    {
        $menu = NavbarMenu::findOrFail($id);
        $menu->update($request->only('nama_menu', 'url', 'urutan'));
        return response()->json($menu);
    }

    public function destroy($id)
    {
        NavbarMenu::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    public function reorder(Request $request)
    {
        foreach ($request->menus as $menuData) {
            NavbarMenu::where('id', $menuData['id'])->update(['urutan' => $menuData['urutan']]);
        }
        return response()->json(['message' => 'Reordered successfully']);
    }
}

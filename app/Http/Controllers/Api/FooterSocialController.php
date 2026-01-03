<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FooterSocial;
use Illuminate\Http\Request;

class FooterSocialController extends Controller
{
    /**
     * Ambil semua data sosial media
     */
    public function index()
    {
        return response()->json(FooterSocial::orderBy('id', 'asc')->get());
    }

    /**
     * Simpan data sosial media baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_sosial' => 'required|string|max:255',
            'icon' => 'required|string|max:255',
            'link' => 'required|string|max:255',
        ]);

        $data = FooterSocial::create([
            'nama_sosial' => $request->nama_sosial,
            'icon' => $request->icon,
            'link' => $request->link,
        ]);

        return response()->json([
            'message' => 'Sosial media berhasil ditambahkan.',
            'data' => $data
        ], 201);
    }

    /**
     * Update data sosial media
     */
    public function update(Request $request, $id)
    {
        $social = FooterSocial::findOrFail($id);

        $request->validate([
            'nama_sosial' => 'required|string|max:255',
            'icon' => 'required|string|max:255',
            'link' => 'required|string|max:255',
        ]);

        $social->update([
            'nama_sosial' => $request->nama_sosial,
            'icon' => $request->icon,
            'link' => $request->link,
        ]);

        return response()->json([
            'message' => 'Sosial media berhasil diperbarui.',
            'data' => $social
        ]);
    }

    /**
     * Hapus data sosial media
     */
    public function destroy($id)
    {
        $social = FooterSocial::findOrFail($id);
        $social->delete();

        return response()->json([
            'message' => 'Sosial media berhasil dihapus.'
        ]);
    }
}

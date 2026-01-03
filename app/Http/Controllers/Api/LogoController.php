<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Logo;
use Illuminate\Http\Request;

class LogoController extends Controller
{
    /**
     * Menampilkan semua logo atau logo berdasarkan posisi (navbar/footer)
     */
    public function index(Request $request)
    {
        $posisi = $request->query('posisi');

        if ($posisi) {
            $logos = Logo::where('posisi', $posisi)->get();
        } else {
            $logos = Logo::all();
        }

        return response()->json($logos);
    }

    /**
     * Menyimpan logo baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_logo'   => 'required|string|max:255',
            'gambar'      => 'required|image|mimes:png,jpg,jpeg|max:2048',
            'keterangan'  => 'nullable|string',
            'posisi'      => 'required|string|in:navbar,footer', // 👈 tambahkan validasi posisi
        ]);

        $path = $request->file('gambar')->store('logo', 'public');

        $logo = Logo::create([
            'nama_logo'  => $request->nama_logo,
            'gambar'     => $path,
            'keterangan' => $request->keterangan,
            'posisi'     => $request->posisi, // 👈 simpan posisi logo
        ]);

        return response()->json($logo, 201);
    }

    /**
     * Update data logo
     */
    public function update(Request $request, $id)
    {
        $logo = Logo::findOrFail($id);

        $request->validate([
            'nama_logo'   => 'required|string|max:255',
            'gambar'      => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
            'keterangan'  => 'nullable|string',
            'posisi'      => 'nullable|string|in:navbar,footer',
        ]);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('logo', 'public');
            $logo->gambar = $path;
        }

        $logo->nama_logo  = $request->nama_logo;
        $logo->keterangan = $request->keterangan;
        if ($request->posisi) {
            $logo->posisi = $request->posisi;
        }
        $logo->save();

        return response()->json($logo);
    }

    /**
     * Hapus logo
     */
    public function destroy($id)
    {
        $logo = Logo::findOrFail($id);
        $logo->delete();

        return response()->json(['message' => 'Logo deleted successfully']);
    }
}

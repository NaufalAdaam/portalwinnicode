import { Head, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import SidebarPenulis from '@/Components/SidebarPenulis';
import { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';

export default function BuatTulisan() {
    const { flash, errors, topiks } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        judul: '',
        deskripsi_singkat: '',
        isi_berita: '',
        topik: '',
        tanggal: '',
        keywords: '',
        thumbnail: null,
    });

    const [preview, setPreview] = useState(null);
    const [modalMessage, setModalMessage] = useState(null);
    const [modalType, setModalType] = useState(null); // success / error

    // Munculkan modal jika ada flash backend
    useEffect(() => {
        if (flash.success) {
            setModalMessage(flash.success);
            setModalType("success");
            reset();
            setPreview(null);
        }

        if (flash.error) {
            setModalMessage(flash.error);
            setModalType("error");
        }
    }, [flash]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("thumbnail", file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post("/penulis/berita/store");
    };

    return (
        <PublicLayout>
            <Head title="Buat Tulisan" />

            {/* POPUP MODAL */}
            {modalMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-[480px] rounded-xl shadow-lg p-6 text-center">

                        {/* Icon */}
                        {modalType === "success" && (
                        <div style={{ color: '#10B981' }} className="text-5xl mb-3">✔</div>
                        )}
                        {modalType === "error" && (
                        <div style={{ color: '#EF4444' }} className="text-5xl mb-3">⚠</div>
                        )}


                        <h2 className="text-xl font-bold mb-2">
                            {modalType === "success" ? "Berhasil!" : "Gagal!"}
                        </h2>

                        <p className="text-gray-700 mb-5">{modalMessage}</p>

                        <button
                            onClick={() => setModalMessage(null)}
                            className="bg-pink-600 !important text-white px-6 py-2 rounded-lg"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto my-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    <SidebarPenulis />

                    <div className="md:col-span-3 bg-white border border-[#BFD7FF] rounded-2xl shadow-md p-8">
                        <h1 className="text-2xl font-bold text-[#003366] mb-6">
                            Buat Tulisan
                        </h1>

                        <form className="space-y-5" onSubmit={submit}>

                            {/* JUDUL */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Judul Tulisan"
                                    value={data.judul}
                                    onChange={(e) => setData("judul", e.target.value)}
                                    className="w-full border border-[#A8C8FF] rounded-lg px-4 py-2"
                                />
                                {errors.judul && (
                                    <p className="text-red-500 text-sm">{errors.judul}</p>
                                )}
                            </div>

                            {/* TOPIK + TANGGAL */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Dropdown Topik */}
                                <div>
                                    <select
                                        value={data.topik}
                                        onChange={(e) => setData("topik", e.target.value)}
                                        className="border border-[#A8C8FF] rounded-lg px-4 py-2 w-full"
                                    >
                                        <option value="" disabled>Pilih Topik Berita</option>
                                        {topiks?.map((t) => (
                                            <option key={t.id} value={t.nama_menu}>
                                                {t.nama_menu}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.topik && (
                                        <p className="text-red-500 text-sm">{errors.topik}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="date"
                                        value={data.tanggal}
                                        onChange={(e) => setData("tanggal", e.target.value)}
                                        className="border border-[#A8C8FF] rounded-lg px-4 py-2 w-full"
                                    />
                                    {errors.tanggal && (
                                        <p className="text-red-500 text-sm">{errors.tanggal}</p>
                                    )}
                                </div>
                            </div>

                            {/* DESKRIPSI SINGKAT */}
                            <div>
                                <textarea
                                    rows="3"
                                    placeholder="Deskripsi Singkat"
                                    value={data.deskripsi_singkat}
                                    onChange={(e) => setData("deskripsi_singkat", e.target.value)}
                                    className="w-full border border-[#A8C8FF] rounded-lg px-4 py-2"
                                ></textarea>
                                {errors.deskripsi_singkat && (
                                    <p className="text-red-500 text-sm">{errors.deskripsi_singkat}</p>
                                )}
                            </div>

                            {/* ISI BERITA */}
                            <div>
                                <textarea
                                    rows="6"
                                    placeholder="Isi Berita"
                                    value={data.isi_berita}
                                    onChange={(e) => setData("isi_berita", e.target.value)}
                                    className="w-full border border-[#A8C8FF] rounded-lg px-4 py-2"
                                ></textarea>
                                {errors.isi_berita && (
                                    <p className="text-red-500 text-sm">{errors.isi_berita}</p>
                                )}
                            </div>

                            {/* KEYWORDS */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Keywords"
                                    value={data.keywords}
                                    onChange={(e) => setData("keywords", e.target.value)}
                                    className="w-full border border-[#A8C8FF] rounded-lg px-4 py-2"
                                />
                                {errors.keywords && (
                                    <p className="text-red-500 text-sm">{errors.keywords}</p>
                                )}
                            </div>

                            {/* UPLOAD FOTO */}
                            <div>
                                <label className="block font-semibold mb-2">Upload Foto</label>

                                <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 relative bg-[#F8FBFF]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />

                                    {preview ? (
                                        <img src={preview} className="w-full h-48 object-cover rounded-lg" />
                                    ) : (
                                        <div className="text-center text-[#5A6D8D]">
                                            <FaCamera className="mx-auto text-3xl mb-2 text-[#5BA4FF]" />
                                            <p>Upload foto terkait</p>
                                        </div>
                                    )}
                                </div>

                                {errors.thumbnail && (
                                    <p className="text-red-500 text-sm">{errors.thumbnail}</p>
                                )}
                            </div>

                            <div className="text-right">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#5BA4FF] hover:bg-[#003366] text-white px-6 py-2 rounded-lg"
                                >
                                    Kirim Berita →
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

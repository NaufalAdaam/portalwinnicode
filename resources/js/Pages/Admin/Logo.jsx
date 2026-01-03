import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Home, Users, FileText, LayoutDashboard, Image as ImageIcon, Settings,
    Bell, Plus, X, Edit2, Trash2,TrendingUp,Clock, // <-- Tambahkan Edit2 dan Trash2 di sini
    ChevronDown, ImagePlus, Menu, Navigation, RectangleHorizontal
} from "lucide-react";

// Komponen SidebarLink (Sudah benar)
function SidebarLink({ href = "#", icon, children, isActive = false, isSidebarOpen = true }) {
    const baseClasses = "flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 group";
    const hoverClasses = "hover:bg-gray-100 dark:hover:bg-gray-700";
    const activeClasses = "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 font-semibold";

    return (
        <a
            href={href}
            title={isSidebarOpen ? '' : children}
            className={`${baseClasses} ${isActive ? activeClasses : hoverClasses} ${!isSidebarOpen ? 'justify-center' : ''}`}
        >
            <span className="flex-shrink-0">{icon}</span>
            {isSidebarOpen && <span className="overflow-hidden whitespace-nowrap">{children}</span>}
        </a>
    );
}

// Komponen SidebarDropdown
function SidebarDropdown({ icon, title, isSidebarOpen, subLinks = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                title={isSidebarOpen ? '' : title}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${!isSidebarOpen ? 'justify-center' : ''}`}
            >
                <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0">{icon}</span>
                    {isSidebarOpen && <span className="overflow-hidden whitespace-nowrap">{title}</span>}
                </div>
                {isSidebarOpen && (
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>
            {isOpen && isSidebarOpen && (
                <div className="pt-2 space-y-1 ml-5">
                    {subLinks.map((link) => (
                        <SidebarLink
                            key={link.title}
                            href={link.href}
                            icon={link.icon}
                            isActive={link.active}
                            isSidebarOpen={isSidebarOpen}
                        >
                            {link.title}
                        </SidebarLink>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function LayoutLogo() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [logos, setLogos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nama_logo: "",
        keterangan: "",
        posisi: "",
        gambar: null
    });

    const navLinks = [
        { type: 'link', title: 'Dashboard', icon: <Home size={20} />, href: '/admin/dashboard' },
        {
            type: 'dropdown',
            title: 'Users',
            icon: <Users size={20} />,
            subLinks: [{ title: 'Penulis', href: '/admin/penulis', icon: <Users size={18} /> }]
        },
        {
            type: 'dropdown',
            title: 'Konten Berita',
            icon: <FileText size={20} />,
            subLinks: [
        { title: 'Manajemen Berita', href: '/admin/berita', icon: <Clock size={18} /> },
        { title: 'Pengaturan Berita', href: '/admin/setting', icon: <TrendingUp size={18} />,},
      ]
        },
        {
            type: 'dropdown',
            title: 'Layout',
            icon: <LayoutDashboard size={20} />,
            subLinks: [
                { title: 'Logo', href: '#', icon: <ImagePlus size={18} />, active: true },
                { title: 'Menu Bawah', href: '/admin/menu', icon: <Menu size={18} /> },
                { title: 'Footer Social', href: '/admin/footer', icon: <RectangleHorizontal size={18} /> },
                { title: 'Navbar', href: '/admin/navbar', icon: <Navigation size={18} /> },
            ]
        },
        { type: 'link', title: 'Media', icon: <ImageIcon size={20} />, href: '/admin/media' },
        { type: 'link', title: 'Konfigurasi Users', icon: <Settings size={20} />, href: '/admin/konfigurasi' },
    ];

    useEffect(() => {
        fetchLogos();
    }, []);

    const fetchLogos = () => {
        setLoading(true);
        axios.get('/api/logo')
            .then((res) => setLogos(res.data))
            .catch((err) => console.error("Gagal mengambil data logo:", err))
            .finally(() => setLoading(false));
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "gambar") {
            setFormData({ ...formData, gambar: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleEdit = (logo) => {
        setFormData({
            nama_logo: logo.nama_logo,
            keterangan: logo.keterangan,
            posisi: logo.posisi,
            gambar: null,
        });
        setEditingId(logo.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus logo ini?")) {
            axios.delete(`/api/logo/${id}`)
                .then(() => fetchLogos())
                .catch((err) => console.error("Gagal menghapus logo:", err));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append("nama_logo", formData.nama_logo);
        form.append("keterangan", formData.keterangan);
        form.append("posisi", formData.posisi);
        if (formData.gambar) {
            form.append("gambar", formData.gambar);
        }
        
        // Menangani bug method-spoofing FormData di Laravel
        if (editingId) {
             form.append("_method", "POST");
        }

        const url = editingId ? `/api/logo/${editingId}` : "/api/logo";
        const method = "post";

        axios({
            method,
            url,
            data: form,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(() => {
                setShowModal(false);
                setEditingId(null);
                fetchLogos();
                setFormData({ nama_logo: "", keterangan: "", posisi: "", gambar: null });
            })
            .catch((err) => console.error("Gagal upload/update logo:", err));
    };

    return (
        <>
            <Head title="Layout / Logo" />
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

                {/* Sidebar */}
                <aside
                    className={`bg-white dark:bg-gray-800 shadow-lg flex flex-col flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
                    onMouseEnter={() => setIsSidebarOpen(true)}
                    onMouseLeave={() => setIsSidebarOpen(false)}
                >
                    <div className="p-5 border-b dark:border-gray-700 h-[65px] flex items-center justify-center">
                        <h1 className="text-xl font-bold text-center overflow-hidden whitespace-nowrap">
                            {isSidebarOpen ? 'Dashboard Admin' : 'DA'}
                        </h1>
                    </div>

                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                        {navLinks.map((link) => {
                            if (link.type === 'link') {
                                return (
                                    <SidebarLink
                                        key={link.title}
                                        href={link.href}
                                        icon={link.icon}
                                        isActive={link.active}
                                        isSidebarOpen={isSidebarOpen}
                                    >
                                        {link.title}
                                    </SidebarLink>
                                );
                            }
                            if (link.type === 'dropdown') {
                                return (
                                    <SidebarDropdown
                                        key={link.title}
                                        icon={link.icon}
                                        title={link.title}
                                        isSidebarOpen={isSidebarOpen}
                                        subLinks={link.subLinks}
                                    />
                                );
                            }
                            return null;
                        })}
                    </nav>
                </aside>

                {/* Konten */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 h-[65px] flex items-center">
                        <div className="flex justify-between items-center w-full px-4">

                            {/* KIRI – kosong (biar sejajar) */}
                            <div></div>

                            {/* KANAN – Bell & Logout */}
                            <div className="flex items-center space-x-4">
                            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                <Bell className="w-6 h-6" />
                            </button>

                            <Link
                                href="login"
                                className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                            >
                                <span className="hidden sm:inline">Logout</span>
                            </Link>
                            </div>

                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Layout / Logo</h2>

                            {/* Toolbar */}
                            <div className="flex flex-wrap justify-between items-center mb-4">
                                <div className="relative w-full sm:w-64 mb-2 sm:mb-0">
                                </div>

                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => { setShowModal(true); setEditingId(null); setFormData({ nama_logo: "", keterangan: "", posisi: "", gambar: null }); }}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add New</span>
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Nama Logo</th>
                                            <th className="px-6 py-3 font-semibold">Gambar</th>
                                            <th className="px-6 py-3 font-semibold">Keterangan</th>
                                            <th className="px-6 py-3 font-semibold">Posisi</th>
                                            <th className="px-6 py-3 font-semibold text-center">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                                        ) : logos.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-4 text-gray-400">Belum ada data logo</td></tr>
                                        ) : (
                                            logos.map((logo) => (
                                                <tr key={logo.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 border-b dark:border-gray-600">
                                                    <td className="px-6 py-3">{logo.nama_logo}</td>
                                                    <td className="px-6 py-3">
                                                        <img src={`/storage/${logo.gambar}`} alt={logo.nama_logo} className="h-10 rounded" />
                                                    </td>
                                                    <td className="px-6 py-3">{logo.keterangan}</td>
                                                    <td className="px-6 py-3">{logo.posisi}</td>
                                                    <td className="px-6 py-3 text-center">
                                                        <div className="flex justify-center space-x-2">
                                                            {/* Edit Button */}
                                                            <button
                                                                onClick={() => handleEdit(logo)}
                                                                className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
                                                            >
                                                                <Edit2 size={16} />
                                                                <span>Edit</span>
                                                            </button>
                                                            
                                                            {/* Delete Button */}
                                                            <button
                                                                onClick={() => handleDelete(logo.id)}
                                                                className="text-red-500 hover:text-red-600 flex items-center space-x-1"
                                                            >
                                                                <Trash2 size={16} />
                                                                <span>Delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Modal Add/Edit */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 text-gray-200 rounded-xl p-6 w-96 shadow-lg relative">
                        <button
                            onClick={() => { setShowModal(false); setEditingId(null); setFormData({ nama_logo: "", keterangan: "", posisi: "", gambar: null }); }}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-lg font-semibold mb-4 text-gray-100">
                            {editingId ? "Edit Logo" : "Upload Logo Baru"}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm mb-1 text-gray-300">Nama Logo</label>
                                <input
                                    type="text"
                                    name="nama_logo"
                                    value={formData.nama_logo}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan nama logo"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm mb-1 text-gray-300">Keterangan</label>
                                <input
                                    type="text"
                                    name="keterangan"
                                    value={formData.keterangan}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan keterangan"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm mb-1 text-gray-300">Posisi</label>
                                <input
                                    type="text"
                                    name="posisi"
                                    value={formData.posisi}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan posisi logo"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm mb-1 text-gray-300">Pilih Gambar</label>
                                <input
                                    type="file"
                                    name="gambar"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="w-full text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                            >
                                {editingId ? "Update" : "Simpan"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
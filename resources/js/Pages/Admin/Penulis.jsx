import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  FileText,
  LayoutDashboard,
  ImageIcon,
  Settings,
  ChevronDown,
  Search,
  Bell,
  ImagePlus,
  Menu,
  Navigation,
  RectangleHorizontal,
  Plus,
  TrendingUp,
  Clock,
  X,
  Edit2,
  Trash2,
  AlertCircle // ✅ Ditambahkan untuk ikon warning
} from "lucide-react";

// Komponen Link Sidebar
function SidebarLink({ href = "#", icon, children, isActive = false, isSidebarOpen = true }) {
  const baseClasses = "flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 group";
  const hoverClasses = "hover:bg-gray-100 dark:hover:bg-gray-700";
  const activeClasses = "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 font-semibold";

  return (
    <a
      href={href}
      title={!isSidebarOpen ? children : ''}
      className={`${baseClasses} ${isActive ? activeClasses : hoverClasses} ${!isSidebarOpen ? 'justify-center' : ''}`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {isSidebarOpen && <span className="overflow-hidden whitespace-nowrap">{children}</span>}
    </a>
  );
}

// Komponen Dropdown Sidebar
function SidebarDropdown({ icon, title, isSidebarOpen, subLinks = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        title={!isSidebarOpen ? title : ''}
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
              isSidebarOpen={isSidebarOpen} 
              isActive={link.active}
            >
              {link.title}
            </SidebarLink>
          ))}
        </div>
      )}
    </div>
  );
}

// Halaman utama Penulis
export default function UsersPenulis() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // === State untuk modal konfirmasi hapus ===
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { type: 'delete', id: 123, title: 'Nama' }

  const { penulis, flash } = usePage().props;

  // Filter data berdasarkan pencarian
  const filteredPenulis = penulis ? penulis.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  // Effect untuk menampilkan pesan sukses
  useEffect(() => {
    if (flash.success) {
      setSuccessMessage(flash.success);
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flash.success]);

  // Effect untuk menampilkan error dari server
  useEffect(() => {
    if (flash.errors) {
      setErrors(flash.errors);
    }
  }, [flash.errors]);

  const navLinks = [
    { type: 'link', title: 'Dashboard', icon: <Home size={20} />, href: route('admin.dashboard') },
    {
      type: 'dropdown',
      title: 'Users',
      icon: <Users size={20} />,
      subLinks: [
        { title: 'Penulis', href: '#', icon: <Users size={18} />, active: true },
      ]
    },
    {
      type: 'dropdown',
      title: 'Konten Berita',
      icon: <FileText size={20} />,
      subLinks: [
        { title: 'Manajemen Berita', href: route('admin.berita.index'), icon: <Clock size={18} /> },
        { title: 'Pengaturan Berita', href: route('admin.berita.setting'), icon: <TrendingUp size={18} /> },
      ]
    },
    {
      type: 'dropdown',
      title: 'Layout',
      icon: <LayoutDashboard size={20} />,
      subLinks: [
        { title: 'Logo', href: route('admin.logo'), icon: <ImagePlus size={18} /> },
        { title: 'Menu Bawah', href: route('admin.menu'), icon: <Menu size={18} /> },
        { title: 'Footer Social', href: route('admin.footer'), icon: <RectangleHorizontal size={18} /> },
        { title: 'Navbar', href: route('admin.navbar'), icon: <Navigation size={18} /> },
      ]
    },
    { type: 'link', title: 'Media', icon: <ImageIcon size={20} />, href: route('admin.media') },
    { type: 'link', title: 'Konfigurasi Users', icon: <Settings size={20} />, href: route('admin.konfigurasi') },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleEdit = (penulisData) => {
    setFormData({
      name: penulisData.name || "",
      phone: penulisData.phone || "",
      email: penulisData.email || "",
      password: "",
      password_confirmation: ""
    });
    setEditingId(penulisData.id);
    setShowModal(true);
    setErrors({});
  };

  // ✅ Ganti dari window.confirm ke modal
  const handleDelete = (penulisData) => {
    setPendingAction({
      type: "delete",
      id: penulisData.id,
      title: penulisData.name || 'Penulis ini'
    });
    setShowConfirmModal(true);
  };

  // ✅ Eksekusi tindakan (hapus)
  const executeAction = () => {
    if (!pendingAction || pendingAction.type !== 'delete') return;

    router.delete(route('admin.penulis.destroy', pendingAction.id), {
      preserveScroll: true,
      onSuccess: () => {
        setSuccessMessage('Penulis berhasil dihapus');
        setShowConfirmModal(false);
        setPendingAction(null);
      },
      onError: (errors) => {
        console.error('Gagal menghapus penulis:', errors);
        alert('Gagal menghapus penulis. Silakan coba lagi.');
        setShowConfirmModal(false);
        setPendingAction(null);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setErrors({ ...errors, name: 'Nama lengkap harus diisi' });
      return;
    }
    
    if (!formData.email.trim()) {
      setErrors({ ...errors, email: 'Email harus diisi' });
      return;
    }
    
    if (!editingId && !formData.password) {
      setErrors({ ...errors, password: 'Password harus diisi' });
      return;
    }
    
    if (formData.password && formData.password !== formData.password_confirmation) {
      setErrors({ ...errors, password_confirmation: 'Konfirmasi password tidak cocok' });
      return;
    }

    if (editingId) {
      router.put(route('admin.penulis.update', editingId), formData, {
        preserveScroll: true,
        onSuccess: () => {
          setShowModal(false);
          setEditingId(null);
          resetForm();
          setSuccessMessage('Penulis berhasil diperbarui');
        },
        onError: (errors) => {
          setErrors(errors);
        }
      });
    } else {
      router.post(route('admin.penulis.store'), formData, {
        preserveScroll: true,
        onSuccess: () => {
          setShowModal(false);
          resetForm();
          setSuccessMessage('Penulis berhasil ditambahkan');
        },
        onError: (errors) => {
          setErrors(errors);
        }
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: ""
    });
    setErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <>
      <Head title="Users / Penulis" />
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
            <div className="flex justify-between items-center h-[65px] px-4">
              <div></div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  <Bell className="w-6 h-6" />
                </button>
                <Link
                  href={route('admin.logout')}
                  method="post"
                  as="button"
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  <span className="hidden sm:inline">Logout</span>
                </Link>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                {successMessage}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Users / Penulis</h2>
              </div>
              
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="relative w-full sm:w-64 mb-2 sm:mb-0">
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari Nama"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setEditingId(null);
                      resetForm();
                    }}
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
                      <th className="px-6 py-3 font-semibold">No</th>
                      <th className="px-6 py-3 font-semibold">Nama Penulis</th>
                      <th className="px-6 py-3 font-semibold">No Telepon</th>
                      <th className="px-6 py-3 font-semibold">Email</th>
                      <th className="px-6 py-3 font-semibold">Role</th>
                      <th className="px-6 py-3 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPenulis.length > 0 ? (
                      filteredPenulis.map((p, index) => (
                        <tr
                          key={p.id}
                          className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-3">{index + 1}</td>
                          <td className="px-6 py-3">{p.name || '-'}</td>
                          <td className="px-6 py-3">{p.phone || '—'}</td>
                          <td className="px-6 py-3">{p.email || '-'}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${p.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                              {p.role || 'penulis'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleEdit(p)}
                                className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
                              >
                                <Edit2 size={16} />
                                <span>Edit</span>
                              </button>
                              
                              <button
                                onClick={() => handleDelete(p)}
                                className="text-red-500 hover:text-red-600 flex items-center space-x-1"
                              >
                                <Trash2 size={16} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-8 text-gray-500 dark:text-gray-400"
                        >
                          {penulis && penulis.length === 0 ? 
                            'Belum ada data penulis. Klik "Add New" untuk menambahkan.' : 
                            'Data tidak ditemukan dengan kata kunci tersebut.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal Add/Edit User Penulis */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-gray-200 rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-100">
              {editingId ? "Edit Penulis" : "Tambah Penulis Baru"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Masukkan nama lengkap"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  No. Handphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor handphone"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Masukkan email"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  Password {editingId ? '(kosongkan jika tidak ingin mengubah)' : '*'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Masukkan password"
                  required={!editingId}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-1 text-gray-300">
                  Konfirmasi Password {editingId ? '(kosongkan jika tidak ingin mengubah)' : '*'}
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password_confirmation ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Konfirmasi password"
                  required={!editingId}
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  {editingId ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL KONFIRMASI HAPUS PENULIS === */}
      {showConfirmModal && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-lg relative">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Konfirmasi Penghapusan
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Apakah Anda yakin ingin{" "}
                <span className="font-semibold text-red-600 dark:text-red-400">
                  menghapus
                </span>{" "}
                penulis berikut?
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Nama:</span> {pendingAction.title}
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setPendingAction(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Batal
                </button>

                <button
                  onClick={executeAction}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
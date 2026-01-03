import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Home,
  Users,
  FileText,
  LayoutDashboard,
  Image as ImageIcon,
  Settings,
  ChevronDown,
  Bell,
  ImagePlus,
  Menu,
  Navigation,
  RectangleHorizontal,
  Plus,
  X,
  GripVertical,
  Edit2,
  Trash2,
  TrendingUp,
  Clock
} from "lucide-react";

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

function SidebarDropdown({ icon, title, isSidebarOpen, subLinks = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Cek apakah ada sublink yang aktif
  const isAnySubLinkActive = subLinks.some((link) => link.active);

  // Buka dropdown jika ada sublink yang aktif saat pertama render
  useEffect(() => {
    if (isAnySubLinkActive) {
      setIsOpen(true);
    }
  }, [isAnySubLinkActive]);

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

function AdminLayout({ children, title, activeLinkTitle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Definisikan navLinks di dalam layout
  const navLinks = [
    {
      type: "link",
      title: "Dashboard",
      icon: <Home size={20} />,
      href: "/admin/dashboard",
    },
    {
      type: "dropdown",
      title: "Users",
      icon: <Users size={20} />,
      subLinks: [
        {
          title: "Penulis",
          href: "/admin/penulis",
          icon: <Users size={18} />,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Konten Berita",
      icon: <FileText size={20} />,
      subLinks: [
        { title: 'Manajemen Berita', href: '/admin/berita', icon: <Clock size={18} /> },
        { title: 'Pengaturan Berita', href: '/admin/setting', icon: <TrendingUp size={18} />,},
      ],
    },
    {
      type: "dropdown",
      title: "Layout",
      icon: <LayoutDashboard size={20} />,
      subLinks: [
        {
          title: "Logo",
          href: "/admin/logo",
          icon: <ImagePlus size={18} />,
        },
        {
          title: "Menu Bawah",
          href: "/admin/menu",
          icon: <Menu size={18} />,
        },
        {
          title: "Footer Social",
          href: "/admin/footer",
          icon: <RectangleHorizontal size={18} />,
        },
        {
          title: "Navbar",
          href: "/admin/navbar",
          icon: <Navigation size={18} />,
        },
      ],
    },
    {
      type: "link",
      title: "Media",
      icon: <ImageIcon size={20} />,
      href: "/admin/media",
    },
    {
      type: "link",
      title: "Konfigurasi Users",
      icon: <Settings size={20} />,
      href: "/admin/konfigurasi",
    },
  ];

  // Logika untuk menandai link aktif secara dinamis
  const processedNavLinks = navLinks.map((link) => {
    if (link.type === "link") {
      return {
        ...link,
        active: link.title === activeLinkTitle,
      };
    }
    if (link.type === "dropdown") {
      return {
        ...link,
        subLinks: link.subLinks.map((sublink) => ({
          ...sublink,
          active: sublink.title === activeLinkTitle,
        })),
      };
    }
    return link;
  });

  return (
    <>
      <Head title={title} />
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* === Sidebar === */}
        <aside
          className={`bg-white dark:bg-gray-800 shadow-lg flex flex-col flex-shrink-0 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <div className="p-5 border-b dark:border-gray-700 h-[65px] flex items-center justify-center">
            <h1 className="text-xl font-bold text-center overflow-hidden whitespace-nowrap">
              {isSidebarOpen ? "Dashboard Admin" : "DA"}
            </h1>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {processedNavLinks.map((link) =>
              link.type === "dropdown" ? (
                <SidebarDropdown
                  key={link.title}
                  icon={link.icon}
                  title={link.title}
                  isSidebarOpen={isSidebarOpen}
                  subLinks={link.subLinks}
                />
              ) : (
                <SidebarLink
                  key={link.title}
                  href={link.href}
                  icon={link.icon}
                  isActive={link.active}
                  isSidebarOpen={isSidebarOpen}
                >
                  {link.title}
                </SidebarLink>
              )
            )}
          </nav>
        </aside>

        {/* === Main Content Area === */}
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


          {/* Page Content (dari props.children) */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

function DraggableTableRow({
  menu,
  index,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}) {
  return (
    <tr
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      className={`border-b dark:border-gray-600 transition-all duration-200 ${
        isDragging
          ? "bg-blue-50 dark:bg-gray-700 opacity-50"
          : "odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
      }`}
    >
      {/* Kolom Grip */}
      <td className="px-6 py-4 w-8">
        <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-move" />
      </td>
      {/* Kolom Nama Menu */}
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
        {menu.nama_menu}
      </td>
      {/* Kolom URL */}
      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
        {menu.url}
      </td>
      {/* Kolom Posisi */}
      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
        {menu.urutan}
      </td>
      {/* Kolom Action */}
      <td className="px-6 py-4">
        <div className="flex justify-center space-x-3">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(menu)}
            className="text-blue-500 hover:text-blue-600 flex items-center space-x-1 transition-colors"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
          
          {/* Delete Button */}
          <button
            onClick={() => onDelete(menu.id)}
            className="text-red-500 hover:text-red-600 flex items-center space-x-1 transition-colors"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function NavbarLayout() {
  // State khusus untuk halaman ini
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama_menu: "",
    url: "",
    urutan: "",
  });
  const [dragIndex, setDragIndex] = useState(null);

  // --- Data Fetching ---
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/navbar-menu");
      // Urutkan berdasarkan 'urutan' saat mengambil data
      setMenus(res.data.sort((a, b) => a.urutan - b.urutan));
    } catch (error) {
      console.error("Gagal mengambil data navbar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ nama_menu: "", url: "", urutan: "" });
    setEditingId(null);
  };

  const handleOpenModal = (menu = null) => {
    if (menu) {
      // Mode Edit
      setFormData({
        nama_menu: menu.nama_menu,
        url: menu.url,
        urutan: menu.urutan,
      });
      setEditingId(menu.id);
    } else {
      // Mode Add New
      resetForm();
      // Atur urutan default ke item terakhir + 1
      const nextUrutan =
        menus.length > 0
          ? Math.max(...menus.map((m) => m.urutan)) + 1
          : 1;
      setFormData((prev) => ({ ...prev, urutan: nextUrutan }));
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // --- CRUD Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nama_menu: formData.nama_menu,
      url: formData.url,
      urutan: formData.urutan || menus.length + 1,
    };

    try {
      if (editingId) {
        await axios.put(`/api/navbar-menu/${editingId}`, data);
      } else {
        await axios.post("/api/navbar-menu", data);
      }
      handleCloseModal();
      fetchMenus();
    } catch (err) {
      console.error("Gagal menyimpan navbar:", err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus menu navbar ini?")) {
      try {
        await axios.delete(`/api/navbar-menu/${id}`);
        fetchMenus();
      } catch (error) {
        console.error("Gagal menghapus menu navbar:", error);
      }
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();

    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      return;
    }

    // 1. Update state secara optimis (langsung di UI)
    const newMenus = [...menus];
    const [movedItem] = newMenus.splice(dragIndex, 1);
    newMenus.splice(dropIndex, 0, movedItem);

    // 2. Update 'urutan' field untuk semua item
    const updatedMenus = newMenus.map((menu, index) => ({
      ...menu,
      urutan: index + 1,
    }));

    setMenus(updatedMenus);
    setDragIndex(null);

    // 3. Kirim perubahan urutan ke backend
    try {
      const reorderData = updatedMenus.map((menu) => ({
        id: menu.id,
        urutan: menu.urutan,
      }));
      await axios.put("/api/navbar-menu/reorder", { menus: reorderData });
    } catch (error) {
      console.error("Gagal mengupdate urutan navbar:", error);
      fetchMenus();
    }
  };

  // --- Render JSX ---
  return (
    <AdminLayout title="Layout / Navbar" activeLinkTitle="Navbar">
      {/* Konten Halaman Spesifik */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Layout / Navbar
        </h2>
        
        {/* Toolbar (Tombol Add) */}
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => handleOpenModal(null)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span>Add New</span>
          </button>
        </div>

        {/* Tabel Menu Navbar */}
        <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold w-8"></th>
                <th className="px-6 py-3 font-semibold">Nama Menu</th>
                <th className="px-6 py-3 font-semibold">URL</th>
                <th className="px-6 py-3 font-semibold">Posisi</th>
                <th className="px-6 py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : menus.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-400">
                    Belum ada data menu navbar
                  </td>
                </tr>
              ) : (
                menus.map((menu, index) => (
                  <DraggableTableRow
                    key={menu.id}
                    menu={menu}
                    index={index}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    isDragging={dragIndex === index}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-gray-200 rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Menu Navbar" : "Tambah Menu Navbar Baru"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm mb-1 text-gray-300">
                  Nama Menu
                </label>
                <input
                  type="text"
                  name="nama_menu"
                  value={formData.nama_menu}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm mb-1 text-gray-300">
                  URL
                </label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: /berita"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  Posisi
                </label>
                <input
                  type="number"
                  name="urutan"
                  value={formData.urutan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
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
    </AdminLayout>
  );
}
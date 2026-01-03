import { Head, Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Trash2,
  Edit2,
  X,
  TrendingUp,
  Clock
} from "lucide-react";

function SidebarLink({ href = "#", icon, children, isActive = false, isSidebarOpen = true }) {
  const baseClasses =
    "flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 group";
  const hoverClasses = "hover:bg-gray-100 dark:hover:bg-gray-700";
  const activeClasses =
    "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 font-semibold";

  return (
    <a
      href={href}
      title={isSidebarOpen ? "" : children}
      className={`${baseClasses} ${isActive ? activeClasses : hoverClasses} ${
        !isSidebarOpen ? "justify-center" : ""
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {isSidebarOpen && <span className="overflow-hidden whitespace-nowrap">{children}</span>}
    </a>
  );
}

function SidebarDropdown({ icon, title, isSidebarOpen, subLinks = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        title={isSidebarOpen ? "" : title}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
          !isSidebarOpen ? "justify-center" : ""
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="flex-shrink-0">{icon}</span>
          {isSidebarOpen && <span className="overflow-hidden whitespace-nowrap">{title}</span>}
        </div>
        {isSidebarOpen && (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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

export default function Footer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama_sosial: "",
    icon: "",
    link: ""
  });

  const navLinks = [
    { type: "link", title: "Dashboard", icon: <Home size={20} />, href: "/admin/dashboard" },
    {
      type: "dropdown",
      title: "Users",
      icon: <Users size={20} />,
      subLinks: [{ title: "Penulis", href: "/admin/penulis", icon: <Users size={18} /> }],
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
        { title: "Logo", href: "/admin/logo", icon: <ImagePlus size={18} /> },
        { title: "Menu Bawah", href: "/admin/menu", icon: <Menu size={18} /> },
        { title: "Footer Social", href: "#", icon: <RectangleHorizontal size={18} />, active: true },
        { title: "Navbar", href: "/admin/navbar", icon: <Navigation size={18} /> },
      ],
    },
    { type: "link", title: "Media", icon: <ImageIcon size={20} />, href: "/admin/media" },
    { type: "link", title: "Konfigurasi Users", icon: <Settings size={20} />, href: "/admin/konfigurasi" },
  ];

  useEffect(() => {
    fetchSocials();
  }, []);

  const fetchSocials = () => {
    setLoading(true);
    axios.get('/api/footer-socials')
      .then((res) => setSocials(res.data))
      .catch((err) => console.error("Gagal mengambil data sosial media:", err))
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (sosial) => {
    setFormData({
      nama_sosial: sosial.nama_sosial,
      icon: sosial.icon,
      link: sosial.link,
    });
    setEditingId(sosial.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus sosial media ini?")) {
      axios.delete(`/api/footer-socials/${id}`)
        .then(() => fetchSocials())
        .catch((err) => console.error("Gagal menghapus sosial media:", err));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const url = editingId ? `/api/footer-socials/${editingId}` : "/api/footer-socials";
    const method = editingId ? "put" : "post";

    axios({
      method,
      url,
      data: formData,
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        setShowModal(false);
        setEditingId(null);
        fetchSocials();
        setFormData({ nama_sosial: "", icon: "", link: "" });
      })
      .catch((err) => console.error("Gagal menyimpan sosial media:", err));
  };

  return (
    <>
      <Head title="Layout / Footer" />
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
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

        {/* Konten Utama */}
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Layout / Footer Social
              </h2>

              {/* Toolbar */}
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="relative w-full sm:w-64 mb-2 sm:mb-0">
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => { setShowModal(true); setEditingId(null); setFormData({ nama_sosial: "", icon: "", link: "" }); }}
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
                      <th className="px-6 py-3 font-semibold">Nama Media Sosial</th>
                      <th className="px-6 py-3 font-semibold">Icon</th>
                      <th className="px-6 py-3 font-semibold">Link</th>
                      <th className="px-6 py-3 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                    ) : socials.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-4 text-gray-400">Belum ada data sosial media</td></tr>
                    ) : (
                      socials.map((sosial) => (
                        <tr key={sosial.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 border-b dark:border-gray-600">
                          <td className="px-6 py-3">{sosial.nama_sosial}</td>
                          <td className="px-6 py-3">{sosial.icon}</td>
                          <td className="px-6 py-3">
                            <a
                              href={sosial.link}
                              className="text-blue-500 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {sosial.link}
                            </a>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEdit(sosial)}
                                className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
                              >
                                <Edit2 size={16} />
                                <span>Edit</span>
                              </button>
                              
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDelete(sosial.id)}
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
              onClick={() => { setShowModal(false); setEditingId(null); setFormData({ nama_sosial: "", icon: "", link: "" }); }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-100">
              {editingId ? "Edit Sosial Media" : "Tambah Sosial Media Baru"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm mb-1 text-gray-300">Nama Media Sosial</label>
                <input
                  type="text"
                  name="nama_sosial"
                  value={formData.nama_sosial}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama media sosial"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm mb-1 text-gray-300">Icon</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: FaInstagram"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">Link</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan link media sosial"
                  required
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
import { Head, Link, usePage, router } from '@inertiajs/react';
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
  Search,
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
  Clock,
  Eye,
  Save,
  Calendar,
  User,
  Tag,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

function SidebarLink({ href = "#", icon, children, isActive = false, isSidebarOpen = true }) {
  const baseClasses = "flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 group";
  const hoverClasses = "hover:bg-gray-100 dark:hover:bg-gray-700";
  const activeClasses = "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 font-semibold";

  return (
    <Link
      href={href}
      title={isSidebarOpen ? '' : children}
      className={`${baseClasses} ${isActive ? activeClasses : hoverClasses} ${!isSidebarOpen ? 'justify-center' : ''}`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {isSidebarOpen && <span className="overflow-hidden whitespace-nowrap">{children}</span>}
    </Link>
  );
}

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

export default function Berita() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [viewingBerita, setViewingBerita] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0
  });

  const [formData, setFormData] = useState({
    judul: "",
    slug: "",
    thumbnail_url: "",
    deskripsi_singkat: "",
    isi_berita: "",
    topik: "",
    keywords: "",
    status: "draft",
    published_at: "",
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
        { title: 'Manajemen Berita', href: '/admin/berita', icon: <Clock size={18} />, active: true },
        { title: 'Pengaturan Berita', href: '/admin/setting', icon: <TrendingUp size={18} /> },
      ],
    },
    {
      type: "dropdown",
      title: "Layout",
      icon: <LayoutDashboard size={20} />,
      subLinks: [
        { title: "Logo", href: "/admin/logo", icon: <ImagePlus size={18} /> },
        { title: "Menu Bawah", href: "/admin/menu", icon: <Menu size={18} /> },
        { title: "Footer Social", href: "/admin/footer", icon: <RectangleHorizontal size={18} /> },
        { title: "Navbar", href: "/admin/navbar", icon: <Navigation size={18} /> },
      ],
    },
    { type: "link", title: "Media", icon: <ImageIcon size={20} />, href: "/admin/media" },
    { type: "link", title: "Konfigurasi Users", icon: <Settings size={20} />, href: "/admin/konfigurasi" },
  ];

  const { props } = usePage();
  const topiks = props.topiks || [];

  useEffect(() => {
    if (props.berita) {
      setBerita(props.berita.data || []);
      setPagination({
        current_page: props.berita.current_page || 1,
        last_page: props.berita.last_page || 1,
        per_page: props.berita.per_page || 10,
        total: props.berita.total || 0,
        from: props.berita.from || 0,
        to: props.berita.to || 0
      });
      setLoading(false);
    } else {
      fetchBerita();
    }
  }, [props.berita]);

  const fetchBerita = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('/api/berita', {
        params: {
          page: page,
          perPage: pagination.per_page,
          search: search
        }
      });

      if (response.data) {
        setBerita(response.data.data || []);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to
        });
      }
    } catch (err) {
      setError('Gagal memuat data berita');
      setBerita([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    clearTimeout(handleSearch.timeout);
    handleSearch.timeout = setTimeout(() => {
      fetchBerita(1, value);
    }, 500);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchBerita(page, searchTerm);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleEdit = (beritaItem) => {
    setFormData({
      judul: beritaItem.judul || "",
      slug: beritaItem.slug || "",
      thumbnail_url: beritaItem.thumbnail_url || "",
      deskripsi_singkat: beritaItem.deskripsi_singkat || "",
      isi_berita: beritaItem.isi_berita || "",
      topik: beritaItem.topik || "",
      keywords: beritaItem.keywords || "",
      status: beritaItem.status || "draft",
      published_at: beritaItem.published_at ? beritaItem.published_at.slice(0, 16) : "",
    });
    setEditingId(beritaItem.id);
    setShowModal(true);
  };

  const handleView = async (beritaItem) => {
    try {
      // Fetch detail lengkap berita dari API
      const response = await axios.get(`/api/berita/${beritaItem.id}`);
      setViewingBerita(response.data);
      setShowViewModal(true);
    } catch (err) {
      // Jika API tidak tersedia, gunakan data yang ada
      setViewingBerita(beritaItem);
      setShowViewModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      try {
        await axios.delete(`/api/berita/${id}`);
        fetchBerita(pagination.current_page, searchTerm);
      } catch (err) {
        alert('Gagal menghapus berita');
      }
    }
  };

  const confirmDelete = (item) => {
  setPendingAction({
    type: "delete",
    id: item.id,
    title: item.judul,
  });
  setShowConfirmModal(true);
};

const confirmUpdate = (item) => {
  setPendingAction({
    type: "update",
    id: item.id,
    title: item.judul,
  });
  setShowConfirmModal(true);
};

const executeAction = async () => {
  if (!pendingAction) return;

  if (pendingAction.type === "delete") {
    try {
      await axios.delete(`/api/berita/${pendingAction.id}`);
      fetchBerita(pagination.current_page, searchTerm);
    } catch (err) {
      alert("Gagal menghapus berita");
    }
  }

  if (pendingAction.type === "update") {
    const beritaItem = berita.find((b) => b.id === pendingAction.id);
    handleEdit(beritaItem);
  }

  setShowConfirmModal(false);
  setPendingAction(null);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId ? `/api/berita/${editingId}` : "/api/berita";
      const method = editingId ? "put" : "post";

      await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "application/json" },
      });

      setShowModal(false);
      setEditingId(null);
      fetchBerita(pagination.current_page, searchTerm);
      setFormData({ 
        judul: "", 
        slug: "",
        thumbnail_url: "",
        deskripsi_singkat: "",
        isi_berita: "", 
        topik: "",
        keywords: "",
        status: "draft", 
        published_at: "",
      });
    } catch (err) {
      alert('Gagal menyimpan berita');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '-';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { class: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", label: "Published" },
      draft: { class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", label: "Draft" },
      pending: { class: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300", label: "Pending" }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const Pagination = () => {
    if (pagination.last_page <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan {pagination.from} sampai {pagination.to} dari {pagination.total} berita
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(pagination.last_page)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === pagination.last_page ||
                (page >= pagination.current_page - 2 && page <= pagination.current_page + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                      pagination.current_page === page
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === pagination.current_page - 3 ||
                page === pagination.current_page + 3
              ) {
                return (
                  <span key={page} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head title="Manajemen Berita" />
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar - sama seperti sebelumnya */}
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

        <div className="flex-1 flex flex-col overflow-hidden">
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


          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Manajemen Berita
              </h2>

              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="relative w-full sm:w-64 mb-2 sm:mb-0">
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari berita"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => { 
                      setShowModal(true); 
                      setEditingId(null); 
                      setFormData({ 
                        judul: "", 
                        slug: "",
                        thumbnail_url: "",
                        deskripsi_singkat: "",
                        isi_berita: "", 
                        topik: "",
                        keywords: "",
                        status: "draft", 
                        published_at: "",
                      }); 
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Berita</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Judul Berita</th>
                      <th className="px-6 py-3 font-semibold">Topik</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold">Tanggal Publikasi</th>
                      <th className="px-6 py-3 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8">
                          <div className="flex justify-center items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <span>Memuat data...</span>
                          </div>
                        </td>
                      </tr>
                    ) : berita.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-400">
                          <div className="flex flex-col items-center space-y-2">
                            <FileText size={48} className="text-gray-300" />
                            <span>
                              {searchTerm ? "Tidak ada berita yang sesuai dengan pencarian" : "Belum ada data berita"}
                            </span>
                            {!searchTerm && (
                              <button
                                onClick={() => setShowModal(true)}
                                className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                              >
                                Tambah Berita Pertama
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      berita.map((item) => (
                        <tr key={item.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 border-b dark:border-gray-600">
                          <td className="px-6 py-3 max-w-xs">
                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {item.judul}
                            </div>
                            {item.deskripsi_singkat && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                                {item.deskripsi_singkat}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs">
                              {item.topik || 'Belum ada topik'}
                            </span>
                          </td>
                          <td className="px-6 py-3">{getStatusBadge(item.status)}</td>
                          <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {item.published_at ? formatDate(item.published_at) : '-'}
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleView(item)}
                                className="text-green-500 hover:text-green-600 flex items-center space-x-1 px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                title="Lihat detail"
                              >
                                <Eye size={16} />
                                <span>Lihat</span>
                              </button>
                              
                              <button
                                onClick={() => confirmUpdate(item)}
                                className="text-blue-500 hover:text-blue-600 flex items-center space-x-1 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                title="Edit berita"
                              >
                                <Edit2 size={16} />
                                <span>Edit</span>
                              </button>
                              
                              <button
                                onClick={() => confirmDelete(item)}
                                className="text-red-500 hover:text-red-600 flex items-center space-x-1 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Hapus berita"
                              >
                                <Trash2 size={16} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination />
            </div>
          </main>
        </div>
      </div>

      {/* Modal Tambah/Edit Berita */} 
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-900 text-gray-200 rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-lg relative">
      <button
        onClick={() => { 
          setShowModal(false); 
          setEditingId(null); 
          setFormData({ 
            judul: "", 
            slug: "",
            thumbnail_url: "",
            deskripsi_singkat: "",
            isi_berita: "", 
            topik: "",
            keywords: "",
            status: "draft", 
            published_at: "",
          }); 
        }}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
      >
        <X size={20} />
      </button>

      <h2 className="text-lg font-semibold mb-4 text-gray-100">
        {editingId ? "Edit Berita" : "Tambah Berita Baru"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Judul Berita *</label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan judul berita"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Topik/Kategori</label>
              <select
                name="topik"
                value={formData.topik}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Pilih Topik Berita</option>
                {topiks?.map((t) => (
                  <option key={t.id} value={t.nama_menu}>
                    {t.nama_menu}
                  </option>
                ))}
              </select>
          </div>


          <div>
            <label className="block text-sm mb-1 text-gray-300">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-300">URL Gambar (Thumbnail)</label>
          <input
            type="text"
            name="thumbnail_url"
            value={formData.thumbnail_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-300">Deskripsi Singkat</label>
          <textarea
            name="deskripsi_singkat"
            value={formData.deskripsi_singkat}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Deskripsi singkat berita..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-300">Keywords</label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Keyword/Kata kunci"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-300">Konten Berita *</label>
          <textarea
            name="isi_berita"
            value={formData.isi_berita}
            onChange={handleChange}
            rows="12"
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tulis konten berita di sini..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition flex items-center justify-center space-x-2"
        >
          <Save size={16} />
          <span>{editingId ? "Update Berita" : "Simpan Berita"}</span>
        </button>
      </form>
    </div>
  </div>
)}

{/* Modal Lihat Berita */}
{showViewModal && viewingBerita && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-900 text-gray-200 rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-lg relative">
      <button
        onClick={() => { setShowViewModal(false); setViewingBerita(null); }}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 z-10"
      >
        <X size={20} />
      </button>

      <div className="space-y-6">
        <div className="border-b border-gray-700 pb-4">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">{viewingBerita.judul}</h2>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <User size={16} />
              <span>Dibuat oleh: {viewingBerita.penulis?.name || 'Tidak ada Penulis'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>Dibuat: {formatDate(viewingBerita.created_at)}</span>
            </div>
            {viewingBerita.published_at && (
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>Dipublikasi: {formatDate(viewingBerita.published_at)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {viewingBerita.topik && (
              <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                {viewingBerita.topik}
              </span>
            )}
          </div>
        </div>

        {viewingBerita.thumbnail_url && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={viewingBerita.thumbnail_url} 
              alt={viewingBerita.judul}
              className="w-full h-28 object-contain bg-gray-800"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {viewingBerita.deskripsi_singkat && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Deskripsi Singkat</h3>
            <p className="text-gray-300 leading-relaxed">{viewingBerita.deskripsi_singkat}</p>
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Isi Berita</h3>
          <div className="text-gray-200 leading-relaxed whitespace-pre-line">
            {viewingBerita.isi_berita}
          </div>
        </div>

        {viewingBerita.keywords && (
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Keywords:</h4>
            <div className="flex flex-wrap gap-2">
              {viewingBerita.keywords.split(',').map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowViewModal(false);
                handleEdit(viewingBerita);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              <Edit2 size={16} />
              <span>Edit Berita</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{showConfirmModal && pendingAction && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-lg relative">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Konfirmasi Tindakan
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Apakah Anda yakin ingin{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {pendingAction.type === "delete" ? "menghapus" : "mengupdate"}
          </span>{" "}
          berita:
        </p>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Judul:</span> {pendingAction.title}
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
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Ya, {pendingAction.type === "delete" ? "Hapus" : "Lanjutkan"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
}
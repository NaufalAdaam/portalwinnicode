import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
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
  TrendingUp,
  Clock,
  Eye,
  Pin,
  Star,
  Layers,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  User,
  FileText as FileTextIcon
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
            <SidebarLink key={link.title} href={link.href} icon={link.icon} isSidebarOpen={isSidebarOpen} isActive={link.active}>
              {link.title}
            </SidebarLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPengaturanBerita() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { berita, flash } = usePage().props;
  const [loadingStates, setLoadingStates] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBerita, setViewingBerita] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const navLinks = [
    { type: 'link', title: 'Dashboard', icon: <Home size={20} />, href: '/admin/dashboard' },
    {
      type: 'dropdown',
      title: 'Users',
      icon: <Users size={20} />,
      subLinks: [
        { title: 'Penulis', href: '/admin/penulis', icon: <Users size={18} /> },
      ]
    },
    {
      type: 'dropdown',
      title: 'Konten Berita',
      icon: <FileText size={20} />,
      subLinks: [
        { title: 'Manajemen Berita', href: '/admin/berita', icon: <Clock size={18} /> },
        { title: 'Pengaturan Berita', href: '/admin/setting', icon: <TrendingUp size={18} />, active: true },
      ]
    },
    {
      type: 'dropdown',
      title: 'Layout',
      icon: <LayoutDashboard size={20} />,
      subLinks: [
        { title: 'Logo', href: '/admin/logo', icon: <ImagePlus size={18} /> },
        { title: 'Menu Bawah', href: '/admin/menu', icon: <Menu size={18} /> },
        { title: 'Footer Social', href: '/admin/footer', icon: <RectangleHorizontal size={18} /> },
        { title: 'Navbar', href: '/admin/navbar', icon: <Navigation size={18} /> },
      ]
    },
    { type: 'link', title: 'Media', icon: <ImageIcon size={20} />, href: '/admin/media' },
    { type: 'link', title: 'Konfigurasi Users', icon: <Settings size={20} />, href: '/admin/konfigurasi' },
  ];

  // Inisialisasi searchTerm dari query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, []);

  // Fungsi untuk handle view dengan modal
  const handleView = (beritaItem) => {
    setViewingBerita(beritaItem);
    setShowViewModal(true);
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fungsi untuk konfirmasi sebelum toggle status
  const confirmToggleStatus = (id, field, title, currentStatus) => {
    const action = {
      id,
      field,
      title,
      currentStatus,
      newStatus: !currentStatus
    };
    setPendingAction(action);
    setShowConfirmModal(true);
  };

  // Fungsi untuk eksekusi toggle status setelah konfirmasi
  const executeToggleStatus = async () => {
    if (!pendingAction) return;

    const { id, field } = pendingAction;
    
    setLoadingStates(prev => ({ ...prev, [`${field}-${id}`]: true }));
    setShowConfirmModal(false);
    
    try {
        await router.patch(`/admin/berita/${id}/toggle`, { 
            field 
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                console.log('Status berhasil diupdate');
            },
            onError: (errors) => {
                console.error('Error toggling status:', errors);
                alert('Gagal mengupdate status: ' + (errors.message || 'Unknown error'));
            }
        });
        
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Gagal mengupdate status: ' + (error.message || 'Unknown error'));
    } finally {
        setLoadingStates(prev => ({ ...prev, [`${field}-${id}`]: false }));
        setPendingAction(null);
    }
  };

  // Fungsi untuk handle search dengan debounce - INI YANG DIPERBAIKI
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
    
    clearTimeout(handleSearch.timeout);
    handleSearch.timeout = setTimeout(() => {
      router.get('/admin/setting', { 
        search: value,
        page: 1 // Reset ke halaman 1 saat search
      }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onFinish: () => setIsSearching(false)
      });
    }, 500);
  };

  // Fungsi untuk reset search
  const handleResetSearch = () => {
    setSearchTerm('');
    setIsSearching(true);
    router.get('/admin/setting', {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onFinish: () => setIsSearching(false)
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= (berita?.last_page || 1)) {
      router.get('/admin/setting', { 
        page, 
        search: searchTerm 
      }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    }
  };

  // Auto hide flash message
  useEffect(() => {
    if (flash.success) {
      const timer = setTimeout(() => {
        router.get('/admin/setting');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [flash]);

  const Pagination = () => {
    if (!berita || berita.last_page <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan {berita.from} sampai {berita.to} dari {berita.total} berita
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(berita.current_page - 1)}
              disabled={berita.current_page === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(berita.last_page)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === berita.last_page ||
                (page >= berita.current_page - 2 && page <= berita.current_page + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                      berita.current_page === page
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === berita.current_page - 3 ||
                page === berita.current_page + 3
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
              onClick={() => handlePageChange(berita.current_page + 1)}
              disabled={berita.current_page === berita.last_page}
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

  const getToggleButton = (item, field, title) => {
    const isLoading = loadingStates[`${field}-${item.id}`];
    const isActive = item[field];
    
    const buttonConfig = {
      is_pinned: { 
        activeClass: "text-pink-500 hover:text-pink-600",
        inactiveClass: "text-gray-500 hover:text-gray-600",
        icon: <Pin />
      },
      is_headline: { 
        activeClass: "text-blue-500 hover:text-blue-600",
        inactiveClass: "text-gray-500 hover:text-gray-600",
        icon: <Star />
      },  
      is_subheadline: { 
        activeClass: "text-amber-500 hover:text-amber-600",
        inactiveClass: "text-gray-500 hover:text-gray-600",
        icon: <Layers />
      }};

    const config = buttonConfig[field] || buttonConfig.is_pinned;

    return (
      <button
        onClick={() => confirmToggleStatus(item.id, field, title, isActive)}
        disabled={isLoading}
        className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-105 ${
          isActive ? config.activeClass : config.inactiveClass
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={`${isActive ? 'Nonaktifkan' : 'Aktifkan'} ${title}`}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : isActive ? (
          React.cloneElement(config.icon, { className: "w-4 h-4 fill-current" })
        ) : (
          React.cloneElement(config.icon, { className: "w-4 h-4" })
        )}
      </button>
    );
  };

  return (
    <>
      <Head title="Pengaturan Berita" />
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

        {/* Main content */}
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
              
              {/* Flash Message */}
              {flash.success && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{flash.success}</span>
                  </div>
                  <button 
                    onClick={() => router.get('/admin/setting')}
                    className="text-green-700 hover:text-green-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {flash.error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
                  <span>{flash.error}</span>
                </div>
              )}

              <div className="flex flex-col mb-6 gap-4">

                {/* Judul */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Pengaturan Berita - Status Khusus
                </h2>

                {/* Search Bar dengan loading indicator */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari Berita"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-10 py-2 w-full rounded-lg border bg-gray-50 
                              dark:bg-gray-700 dark:border-gray-600 
                              focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-2.5">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {searchTerm && !isSearching && (
                    <button
                      onClick={handleResetSearch}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Judul Berita</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-center">Pin</th>
                      <th className="px-6 py-4 font-semibold text-center">Headline</th>
                      <th className="px-6 py-4 font-semibold text-center">Subheadline</th>
                      <th className="px-6 py-4 font-semibold text-center">Views</th>
                      <th className="px-6 py-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {berita?.data && berita.data.length > 0 ? (
                      berita.data.map((item) => (
                        <tr key={item.id} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4">
                            <div className="max-w-md">
                              <div className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                {item.judul}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Dipublikasi: {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : 'Draft'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(item.status)}
                          </td>
                          
                          {/* Toggle Buttons */}
                          <td className="px-6 py-4 text-center">
                            {getToggleButton(item, 'is_pinned', 'Pin')}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {getToggleButton(item, 'is_headline', 'Headline')}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {getToggleButton(item, 'is_subheadline', 'Subheadline')}
                          </td>  
                          <td className="px-6 py-4 text-center">
                              <div className="flex items-center space-x-1">
                                  <Eye size={16} className="text-gray-400" />
                                  <span>{item.views || 0}</span>
                              </div>
                          </td>                        
                          <td className="px-6 py-4">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleView(item)}
                                className="text-green-500 hover:text-green-600 flex items-center space-x-1 px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                title="Lihat detail"
                              >
                                <Eye size={16} />
                                <span>Lihat</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center space-y-3 text-gray-500 dark:text-gray-400">
                            <FileTextIcon className="w-12 h-12 text-gray-300" />
                            <div>
                              <p className="text-lg font-medium">
                                {searchTerm ? 'Tidak ada hasil pencarian' : 'Tidak ada data berita'}
                              </p>
                              <p className="text-sm">
                                {searchTerm 
                                  ? `Tidak ditemukan berita dengan kata kunci "${searchTerm}"`
                                  : 'Belum ada berita yang dipublikasi'}
                              </p>
                            </div>
                            {searchTerm && (
                              <button
                                onClick={handleResetSearch}
                                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                              >
                                Reset Pencarian
                              </button>
                            )}
                            {!searchTerm && (
                              <Link 
                                href="/admin/berita"
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                              >
                                Kelola Berita
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {berita?.data && berita.data.length > 0 && <Pagination />}
            </div>
          </main>
        </div>
      </div>
      
      {/* Modal Konfirmasi */}
      {showConfirmModal && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-lg relative">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Konfirmasi Perubahan
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Apakah Anda yakin ingin {pendingAction.newStatus ? 'mengaktifkan' : 'menonaktifkan'} status{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {pendingAction.title}
                </span>{" "}
                untuk berita ini?
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Judul:</span> {berita?.data?.find(b => b.id === pendingAction.id)?.judul}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  <span className="font-medium">Status saat ini:</span>{" "}
                  <span className={pendingAction.currentStatus ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {pendingAction.currentStatus ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  <span className="font-medium">Akan diubah menjadi:</span>{" "}
                  <span className={pendingAction.newStatus ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {pendingAction.newStatus ? 'Aktif' : 'Tidak Aktif'}
                  </span>
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
                  onClick={executeToggleStatus}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <span>Ya, {pendingAction.newStatus ? 'Aktifkan' : 'Nonaktifkan'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Modal */}
      {showViewModal && viewingBerita && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg relative">
            <button
              onClick={() => { setShowViewModal(false); setViewingBerita(null); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
            >
              <X size={24} />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{viewingBerita.judul}</h2>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <span>Status: {getStatusBadge(viewingBerita.status)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Dibuat: {formatDate(viewingBerita.created_at)}</span>
                </div>
                {viewingBerita.published_at && (
                  <div className="flex items-center space-x-1">
                    <span>Dipublikasi: {formatDate(viewingBerita.published_at)}</span>
                  </div>
                )}
                {viewingBerita.penulis && (
                  <div className="flex items-center space-x-1">
                    <User size={16} />
                    <span>Penulis: {viewingBerita.penulis.name || viewingBerita.penulis}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  viewingBerita.is_pinned ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <Pin size={16} className={viewingBerita.is_pinned ? "fill-current" : ""} />
                  <span>Pinned</span>
                </div>
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  viewingBerita.is_headline ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <Star size={16} className={viewingBerita.is_headline ? "fill-current" : ""} />
                  <span>Headline</span>
                </div>
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  viewingBerita.is_subheadline ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <Layers size={16} className={viewingBerita.is_subheadline ? "fill-current" : ""} />
                  <span>Subheadline</span>
                </div>
              </div>

              {viewingBerita.gambar || viewingBerita.thumbnail_url ? (
                <div className="mb-6">
                  <img 
                    src={viewingBerita.gambar || viewingBerita.thumbnail_url} 
                    alt={viewingBerita.judul}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              ) : null}

              {viewingBerita.deskripsi_singkat && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Deskripsi Singkat</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{viewingBerita.deskripsi_singkat}</p>
                </div>
              )}

              {viewingBerita.isi && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Konten Berita</h3>
                  <div 
                    className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: viewingBerita.isi }}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => { setShowViewModal(false); setViewingBerita(null); }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
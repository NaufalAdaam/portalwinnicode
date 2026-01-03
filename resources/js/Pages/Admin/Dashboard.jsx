import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import {
  Home,
  Users,
  FileText,
  LayoutDashboard,
  Image as ImageIcon,
  Settings,
  ChevronDown,
  Bell,
  File,
  CheckCircle,
  FileClock,
  ImagePlus,
  Menu,
  LayoutTemplate,
  Navigation,
  RectangleHorizontal,
  LogOut,
  Clock,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  Pin,
  Star,
  TrendingUp as TrendingUpIcon,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Komponen Navigasi Samping (Sidebar)
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
          {subLinks.map((link, index) => (
            <SidebarLink
              key={index}
              href={link.href}
              icon={link.icon}
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

// Komponen Card Statistik dengan Error Handling
function StatCard({ icon, title, value, description, color }) {
  return (
    <div className="flex items-center space-x-4 p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value !== undefined ? value : 0}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
        {description && (
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</div>
        )}
      </div>
    </div>
  );
}

// Komponen Tabel Berita Terbaru - DIUBAH STYLE NYA
function LatestBeritaTable({ beritas = [] }) {
  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { 
        class: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", 
        label: "Published" 
      },
      draft: { 
        class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
        label: "Draft" 
      },
      pending: { 
        class: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300", 
        label: "Pending" 
      }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  // Format tanggal seperti di Berita.jsx dan Setting.jsx
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

  return (
    <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
          <tr>
            <th className="px-6 py-4 font-semibold">Judul Berita</th>
            <th className="px-6 py-4 font-semibold">Topik</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Tanggal</th>
            <th className="px-6 py-4 font-semibold text-center">Views</th>
            <th className="px-6 py-4 font-semibold">Penulis</th>
          </tr>
        </thead>
        <tbody>
          {beritas.map((berita, index) => (
            <tr key={berita.id || index} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {/* Kolom Judul - seperti di Setting.jsx */}
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-xs truncate">
            <div className="flex items-center space-x-2">
              {berita.is_pinned && <Pin size={14} className="text-yellow-500" />}
              {berita.is_headline && <Star size={14} className="text-blue-500" />}
              <span className="truncate">{berita.judul || 'Judul tidak tersedia'}</span>
            </div>
          </td>
              
              {/* Kolom Topik - seperti di Berita.jsx */}
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs">
                  {berita.topik || 'Umum'}
                </span>
              </td>
              
              {/* Kolom Status - seperti di Berita.jsx dan Setting.jsx */}
              <td className="px-6 py-4">
                {getStatusBadge(berita.status)}
              </td>
              
              {/* Kolom Tanggal - format seperti di Berita.jsx */}
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {berita.published_at ? formatDate(berita.published_at) : '-'}
              </td>
              
              {/* Kolom Views - seperti di Setting.jsx */}
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Eye size={14} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {berita.views || 0}
                  </span>
                </div>
              </td>
              
              {/* Kolom Penulis */}
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {berita.penulis || 'Tidak Ada Penulis'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {beritas.length === 0 && (
        <div className="text-center py-12">
          <div className="flex flex-col items-center space-y-3 text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 text-gray-300" />
            <div>
              <p className="text-lg font-medium">Tidak ada berita terbaru</p>
              <p className="text-sm">Belum ada berita yang dibuat</p>
            </div>
            <Link
              href="/admin/berita/create"
              className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              <Plus size={16} />
              <span>Tambah Berita Pertama</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Komponen Error Fallback
function ErrorFallback() {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <div>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Error Memuat Data</h3>
          <p className="text-red-700 dark:text-red-400">
            Terjadi kesalahan saat memuat data statistik. Pastikan backend berjalan dengan benar.
          </p>
        </div>
      </div>
    </div>
  );
}

// Komponen Dashboard Utama
export default function Dashboard({ auth, beritaStats, latestBeritas }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Default values untuk menghindari undefined
  const safeBeritaStats = beritaStats || {
    total: 0,
    published: 0,
    draft: 0
  };

  const safeLatestBeritas = latestBeritas || [];

  // Struktur navigasi
  const navLinks = [
    { type: 'link', title: 'Dashboard', icon: <Home size={20} />, href: '/admin/dashboard', active: true },
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
        { title: 'Pengaturan Berita', href: '/admin/setting', icon: <TrendingUp size={18} /> },
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

  return (
    <>
      <Head title="Dashboard" />
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
            {navLinks.map((link, index) => {
              if (link.type === 'link') {
                return (
                  <SidebarLink
                    key={index}
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
                    key={index}
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

        {/* Area Konten Utama */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
            <div className="flex justify-between items-center h-[65px] px-4">
              <div className="flex items-center space-x-4 min-w-[200px]">
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>

              <div className="flex items-center space-x-4">
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  <Bell className="w-6 h-6" />
                </button>

                <Link
                  href="/admin/logout"
                  method="post"
                  as="button"
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </Link>
              </div>
            </div>
          </header>

          {/* Konten Utama */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
            {/* Error Notification jika data tidak ada */}
            {!beritaStats && <ErrorFallback />}

            {/* Statistik Berita */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Statistik Berita</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  icon={<File className="w-6 h-6 text-gray-600" />}
                  title="Total Berita"
                  value={safeBeritaStats.total}
                  description="Semua berita yang tersimpan"
                  color="bg-gray-100 dark:bg-gray-700"
                />
                <StatCard
                  icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                  title="Published"
                  value={safeBeritaStats.published}
                  description="Berita yang sudah dipublikasi"
                  color="bg-green-100 dark:bg-green-900"
                />
                <StatCard
                  icon={<FileClock className="w-6 h-6 text-yellow-600" />}
                  title="Draft"
                  value={safeBeritaStats.draft}
                  description="Berita dalam proses penulisan"
                  color="bg-yellow-100 dark:bg-yellow-900"
                />
              </div>
            </div>

            {/* Berita Terbaru - STYLE DIUBAH */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Berita Terbaru
                </h2>
              </div>

              <LatestBeritaTable beritas={safeLatestBeritas} />

              {safeLatestBeritas.length > 0 && (
                <div className="mt-6 text-center">
                  <Link
                    href="/admin/berita"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    <span>Lihat semua berita</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
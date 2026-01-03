import { Head, Link, usePage } from '@inertiajs/react';
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
  ImagePlus,
  Menu,
  Navigation,
  RectangleHorizontal,
  LogOut,
  TrendingUp,
  Clock,
} from "lucide-react";

// 🔹 Komponen Sidebar Link
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

// 🔹 Komponen Sidebar Dropdown
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
            <SidebarLink key={link.title} href={link.href} icon={link.icon} isSidebarOpen={isSidebarOpen}>
              {link.title}
            </SidebarLink>
          ))}
        </div>
      )}
    </div>
  );
}

// 🔹 Halaman Konfigurasi Users
export default function KonfigurasiUsers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { roleList = [] } = usePage().props; // Ambil data dari backend (UserController)

  const navLinks = [
    { type: 'link', title: 'Dashboard', icon: <Home size={20} />, href: 'dashboard' },
    {
      type: 'dropdown',
      title: 'Users',
      icon: <Users size={20} />,
      subLinks: [
        { title: 'Penulis', href: 'penulis', icon: <Users size={18} /> },
      ]
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
        { title: 'Logo', href: 'logo', icon: <ImagePlus size={18} /> },
        { title: 'Menu Bawah', href: 'menu', icon: <Menu size={18} /> },
        { title: 'Footer Social', href: 'footer', icon: <RectangleHorizontal size={18} /> },
        { title: 'Navbar', href: 'navbar', icon: <Navigation size={18} /> },
      ]
    },
    { type: 'link', title: 'Media', icon: <ImageIcon size={20} />, href: 'media' },
    { type: 'link', title: 'Konfigurasi Users', icon: <Settings size={20} />, href: '#', active: true },
  ];

  return (
    <>
      <Head title="Konfigurasi Users" />
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


          {/* Konten */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Konfigurasi Users</h2>

              {roleList.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Tidak ada data pengguna ditemukan.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roleList.map((role, i) => (
                    <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total {role.total} User</p>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-1">{role.role}</h3>
                      </div>
                      <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition">Edit</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

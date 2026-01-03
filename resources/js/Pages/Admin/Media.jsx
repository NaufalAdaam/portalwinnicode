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
  ImagePlus,
  Menu,
  Navigation,
  RectangleHorizontal,
  Plus,
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

export default function Media({ media }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("library");

  const navLinks = [
    { type: 'link', title: 'Dashboard', icon: <Home size={20} />, href: 'dashboard' },
    {
      type: 'dropdown',
      title: 'Users',
      icon: <Users size={20} />,
      subLinks: [{ title: 'Penulis', href: 'penulis', icon: <Users size={18} /> }],
    },
    {
      type: 'dropdown',
      title: 'Konten Berita',
      icon: <FileText size={20} />,
      subLinks: [
        { title: 'Manajemen Berita', href: '/admin/berita', icon: <Clock size={18} /> },
        { title: 'Pengaturan Berita', href: '/admin/setting', icon: <TrendingUp size={18} />,},
      ],
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
      ],
    },
    { type: 'link', title: 'Media', icon: <ImageIcon size={20} />, href: '#', active: true },
    { type: 'link', title: 'Konfigurasi Users', icon: <Settings size={20} />, href: 'konfigurasi' },
  ];

  return (
    <>
      <Head title="Media" />
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
            {navLinks.map((link) =>
              link.type === 'link' ? (
                <SidebarLink key={link.title} href={link.href} icon={link.icon} isActive={link.active} isSidebarOpen={isSidebarOpen}>
                  {link.title}
                </SidebarLink>
              ) : (
                <SidebarDropdown key={link.title} icon={link.icon} title={link.title} isSidebarOpen={isSidebarOpen} subLinks={link.subLinks} />
              )
            )}
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

          {/* Body */}
          <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Kiri - Media Library */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Media</h2>

                {/* Tabs */}
                <div className="flex space-x-4 border-b pb-2 mb-4">
                  <button 
                    onClick={() => setActiveTab("library")} 
                    className={`pb-2 ${activeTab === "library" ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-600"}`}
                  >
                    Media Library
                  </button>
                </div>

                {/* Isi Tab */}
                {activeTab === "library" ? (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {media.length > 0 ? (
                        media.map((item) => (
                          <div key={item.id} className="relative group">
                            <img
                              src={item.thumbnail_url}
                              alt={item.judul}
                              className="w-full h-32 rounded-md shadow-sm"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 col-span-full text-center">Tidak ada media.</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
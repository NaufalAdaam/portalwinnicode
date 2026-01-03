import { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function Navbar() {
  const { auth, isAuthenticated } = usePage().props;
  const url = usePage().url;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const isPenulis = () => auth.penulis !== null;
  const isAdmin = () => auth.admin !== null;

  const formatUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return `/${url}`;
  };

  const isActive = (itemUrl) => {
    if (!itemUrl) return false;
    if (!url) return false;

    const formattedUrl = formatUrl(itemUrl).toLowerCase();
    const currentUrl = url.toLowerCase();

    return currentUrl.startsWith(formattedUrl);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/logo?posisi=navbar")
      .then((res) => res.json())
      .then((data) => {
        const logoData = Array.isArray(data) ? data[0] : data;
        setLogo(logoData);
      });
  }, []);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/navbar-menu");
        const data = await response.json();

        const sortedItems = data
          .sort((a, b) => a.urutan - b.urutan)
          .map((item) => ({ ...item }));

        setNavItems(sortedItems);
      } catch (error) {
        setNavItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNavItems();
  }, []);

  useEffect(() => {
    const searchBerita = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/berita?search=${encodeURIComponent(
            searchQuery.trim()
          )}&status=published&limit=5`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (Array.isArray(data)) {
            setSearchResults(data.slice(0, 5));
          } else if (data.data && Array.isArray(data.data)) {
            setSearchResults(data.data.slice(0, 5));
          } else if (data.berita && Array.isArray(data.berita)) {
            setSearchResults(data.berita.slice(0, 5));
          } else {
            setSearchResults([]);
          }
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      if (searchOpen && searchQuery.trim().length >= 2) {
        searchBerita();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (route().has('berita.search')) {
        router.get(route('berita.search'), { q: searchQuery.trim() });
      } else {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      }
      
      closeSearch();
    }
  };

  const handleResultClick = (item) => {
    if (item.slug) {
      if (route().has('articles.show')) {
        router.get(route('articles.show', item.slug));
      } else {
        window.location.href = `/artikel/${item.slug}`;
      }
      closeSearch();
    }
  };

  const toggleSearch = () => {
    const newState = !searchOpen;
    setSearchOpen(newState);
    
    if (newState) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        !event.target.closest(".search-toggle-btn")
      ) {
        closeSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && searchOpen) {
        closeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const formatMenuName = (name) => name.toUpperCase();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="bg-[#003366] text-white relative">
        <div className="container mx-auto px-4 h-16 flex items-center justify-center relative">
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2">
            <Link href="/">
              {logo ? (
                <img
                  src={
                    logo.gambar.startsWith("http")
                      ? logo.gambar
                      : `http://127.0.0.1:8000/storage/${logo.gambar}`
                  }
                  alt={logo.nama_logo}
                  className="h-12 md:h-20 w-auto"
                />
              ) : (
                <img
                  src="/logowini.png"
                  alt="Default Logo"
                  className="h-12 md:h-20 w-auto"
                />
              )}
            </Link>
          </div>

          <div className="absolute right-4 flex items-center space-x-2 md:space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href={route("penulis.login")}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-1 px-3 md:py-2 md:px-4 rounded-md text-sm md:text-base"
                >
                  Masuk
                </Link>
                <Link
                  href={route("penulis.login")}
                  className="hidden md:block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md"
                >
                  Buat Tulisan
                </Link>
              </>
            ) : (
              <>
                {isPenulis() && (
                  <Link
                    href={route("penulis.tulisan")}
                    className="hidden md:block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md"
                  >
                    Buat Tulisan
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1 text-white"
                  >
                    <UserCircleIcon className="h-8 w-8 md:h-12 md:w-12 text-pink-400" />
                    <ChevronDownIcon className="hidden md:block h-4 w-4 text-white" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-1 z-50">
                      {isPenulis() && (
                        <>
                          <Link
                            href={route("penulis.profile")}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Profil
                          </Link>
                          <Link
                            href={route("penulis.password.email")}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Ubah Password
                          </Link>
                          <Link
                            href={route("penulis.logout")}
                            method="get"
                            as="button"
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Logout
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div 
          ref={searchContainerRef}
          className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40"
        >
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita, artikel, atau topik..."
                className="w-full p-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                autoComplete="off"
                aria-label="Search input"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </form>

            {searchQuery.length >= 2 && (
              <div className="max-h-96 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                    Mencari...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="px-2 py-1 text-sm text-gray-500 mb-2">
                      {searchResults.length} hasil ditemukan untuk "{searchQuery}"
                    </div>
                    <div className="space-y-2">
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick(item)}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
                        >
                          <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">
                            {item.judul}
                          </h4>
                          {item.deskripsi_singkat && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {item.deskripsi_singkat}
                            </p>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            {item.topik && (
                              <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                                {item.topik}
                              </span>
                            )}
                            {item.published_at && (
                              <span className="text-xs text-gray-400">
                                {new Date(item.published_at).toLocaleDateString('id-ID')}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : searchQuery.length > 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MagnifyingGlassIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p>Tidak ditemukan hasil untuk "{searchQuery}"</p>
                  </div>
                ) : null}
              </div>
            )}

            {searchQuery.length < 2 && searchQuery.length > 0 && (
              <div className="p-4 text-center text-gray-400 text-sm">
                Ketik minimal 2 karakter untuk mencari
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="bg-white border-b relative z-30">
        <div className="container mx-auto px-4 h-12 flex items-center justify-center relative">
          <div className="hidden md:flex items-center space-x-8">
            {loading ? (
              <div className="flex space-x-8">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="h-4 w-20 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : navItems.length > 0 ? (
              navItems.map((item) => (
                <Link
                  key={item.id}
                  href={formatUrl(item.url)}
                  className={
                    `font-semibold text-sm uppercase tracking-wider transition duration-300 whitespace-nowrap ` +
                    (isActive(item.url)
                      ? "text-pink-600 border-b-2 border-pink-600"
                      : "text-gray-700 hover:text-blue-700")
                  }
                >
                  {formatMenuName(item.nama_menu)}
                </Link>
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                Menu tidak tersedia
              </div>
            )}
          </div>

          <div className="md:hidden flex overflow-x-auto py-2 space-x-4 scrollbar-hide">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-4 w-16 bg-gray-200 rounded animate-pulse flex-shrink-0"
                />
              ))
            ) : navItems.length > 0 ? (
              navItems.map((item) => (
                <Link
                  key={item.id}
                  href={formatUrl(item.url)}
                  className={
                    `font-semibold text-xs uppercase tracking-wider transition duration-300 whitespace-nowrap flex-shrink-0 ` +
                    (isActive(item.url)
                      ? "text-pink-600 border-b-2 border-pink-600"
                      : "text-gray-700 hover:text-blue-700")
                  }
                >
                  {formatMenuName(item.nama_menu)}
                </Link>
              ))
            ) : (
              <div className="text-gray-500 text-xs">
                Menu tidak tersedia
              </div>
            )}
          </div>

         <div className="hidden md:flex items-center ml-4">
          <button
            onClick={toggleSearch}
            className="search-toggle-btn p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 hover:text-blue-700" />
          </button>
        </div>
        </div>
      </nav>
    </header>
  );
}
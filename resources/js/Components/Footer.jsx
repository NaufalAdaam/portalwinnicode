import { useEffect, useState } from "react";
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaTiktok,
  FaFacebookF,
  FaGlobe,
} from "react-icons/fa";

export default function Footer() {
  const [logo, setLogo] = useState(null);
  const [menus, setMenus] = useState([]);
  const [socials, setSocials] = useState([]);

  // 🔹 Ambil data logo
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/logo?posisi=footer")
      .then((res) => res.json())
      .then((data) => {
        const logoData = Array.isArray(data) ? data[0] : data;
        setLogo(logoData);
      })
      .catch((err) => console.error("Gagal ambil logo:", err));
  }, []);

  // 🔹 Ambil data menu bawah dari CMS
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/footer-menu")
      .then((res) => res.json())
      .then((data) => {
        const sortedMenus = data.sort((a, b) => a.urutan - b.urutan);
        setMenus(sortedMenus);
      })
      .catch((err) => console.error("Gagal ambil menu:", err));
  }, []);

  // 🔹 Ambil data sosial media dari CMS
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/footer-socials")
      .then((res) => res.json())
      .then((data) => setSocials(data))
      .catch((err) => console.error("Gagal ambil sosial media:", err));
  }, []);

  // 🔹 Map nama icon → komponen React
  const iconMap = {
    FaInstagram: FaInstagram,
    FaTwitter: FaTwitter,
    FaYoutube: FaYoutube,
    FaLinkedinIn: FaLinkedinIn,
    FaTiktok: FaTiktok,
    FaFacebookF: FaFacebookF,
    FaGlobe: FaGlobe,
  };

  // 🔹 Warna brand masing-masing sosial media
  const colorMap = {
    FaInstagram: "#E1306C",
    FaTwitter: "#1DA1F2",
    FaYoutube: "#FF0000",
    FaLinkedinIn: "#0077B5",
    FaTiktok: "#000000",
    FaFacebookF: "#1877F2",
    FaGlobe: "#ffffff",
  };

  return (
    <footer className="bg-[#083872] text-white py-4 text-center">
      {/* Logo */}
      <div className="flex flex-col items-center mb-3">
        {logo ? (
          <img
            src={
              logo.gambar.startsWith("http")
                ? logo.gambar
                : `http://127.0.0.1:8000/storage/${logo.gambar}`
            }
            alt={logo.nama_logo}
            className="h-14 mb-2"
          />
        ) : (
          <span>Loading logo...</span>
        )}
      </div>

      {/* Dynamic Social Icons dari CMS (warna mengikuti brand) */}
      <div className="flex justify-center space-x-3 mb-4">
        {socials.length > 0 ? (
          socials.map((sosial) => {
            const IconComponent = iconMap[sosial.icon] || FaGlobe;
            const bgColor = colorMap[sosial.icon] || "#ffffff";

            return (
              <a
                key={sosial.id}
                href={sosial.link}
                target="_blank"
                rel="noopener noreferrer"
                title={sosial.nama_sosial}
                className="p-2 rounded-full hover:scale-110 transition-transform"
                style={{
                  backgroundColor: bgColor,
                  color: "#ffffff", // icon putih di atas background berwarna
                }}
              >
                <IconComponent size={18} />
              </a>
            );
          })
        ) : (
          <span className="text-gray-300 text-sm">Memuat sosial media...</span>
        )}
      </div>

      {/* Dynamic Menu dari CMS */}
      <div className="flex flex-wrap justify-center gap-3 text-[11px] font-medium mb-2">
        {menus.length > 0 ? (
          menus.map((menu) => (
            <a
              key={menu.id}
              href={menu.url}
              className="hover:text-pink-400 transition"
            >
              {menu.nama_menu.toUpperCase()}
            </a>
          ))
        ) : (
          <span>Memuat menu...</span>
        )}
      </div>

      {/* Copyright */}
      <p className="text-[12px] text-gray-300">
        winnicode.com ©2025 | All Rights Reserved
      </p>
    </footer>
  );
}

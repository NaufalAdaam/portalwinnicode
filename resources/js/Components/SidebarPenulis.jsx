import { Link, usePage } from '@inertiajs/react';
import { FaUser, FaPenFancy, FaFileAlt } from 'react-icons/fa';

export default function SidebarPenulis() {
    const { url } = usePage();

    return (
        <div className="bg-white border border-[#BFD7FF] rounded-2xl p-4 shadow-md">
            <h2 className="text-lg font-bold text-[#003366] mb-4">Menu</h2>
            <ul className="space-y-2">
                <li>
                    <Link
                        href={route('penulis.profile')}
                        className={`flex items-center px-3 py-2 rounded-lg ${
                            url.startsWith('/penulis/dashboard/profile')
                                ? 'bg-[#E6F0FF] text-[#003366] font-semibold'
                                : 'text-[#5A6D8D] hover:text-[#003366]'
                        }`}
                    >
                        <FaUser className="mr-2" /> Ubah Profil
                    </Link>
                </li>
                <li>
                    <Link
                        href={route('penulis.tulisan')}
                        className={`flex items-center px-3 py-2 rounded-lg ${
                            url.startsWith('/penulis/dashboard/tulisan')
                                ? 'bg-[#E6F0FF] text-[#003366] font-semibold'
                                : 'text-[#5A6D8D] hover:text-[#003366]'
                        }`}
                    >
                        <FaPenFancy className="mr-2" /> Buat Tulisan
                    </Link>
                </li>
                <li>
                    <Link
                        href={route('penulis.hasil')}
                        className={`flex items-center px-3 py-2 rounded-lg ${
                            url.startsWith('/penulis/dashboard/hasil')
                                ? 'bg-[#E6F0FF] text-[#003366] font-semibold'
                                : 'text-[#5A6D8D] hover:text-[#003366]'
                        }`}
                    >
                        <FaFileAlt className="mr-2" /> Hasil Tulisan
                    </Link>
                </li>
            </ul>
        </div>
    );
}

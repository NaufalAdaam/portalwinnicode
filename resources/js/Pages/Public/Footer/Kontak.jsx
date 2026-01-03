// resources/js/Pages/Public/Footer/Kontak.jsx
import PublicLayout from '@/Layouts/PublicLayout';
import React from 'react';

export default function Kontak(props) {
    return (
        <PublicLayout>
            <div className="container mx-auto p-8">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        KONTAK KAMI
                    </h1>
                    
                    {/* Bagian Informasi Kontak */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Kolom Kiri - Informasi Utama */}
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    Hubungi Kami
                                </h2>
                                
                                <div className="space-y-4">
                                    <div className="bg-blue-100 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">Email</h3>
                                        <p className="text-gray-600">admin@winnicode.com</p>
                                    </div>
                                    
                                    <div className="bg-pink-100 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">Telepon</h3>
                                        <p className="text-gray-600">+62 851-5993-2501</p>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-500 mt-4 italic">
                                    Kami siap membantu Anda 24/7
                                </p>
                            </div>
                        </div>

                        {/* Kolom Kanan - Detail Kontak */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Informasi Lengkap
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">E-Mail:</h4>
                                    <p className="text-gray-600">winnicodegarudaofficial@gmail.com</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Call Center:</h4>
                                    <p className="text-gray-600">+62 851-5993-2501 (24 Jam)</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Alamat (Cabang Bandung):</h4>
                                    <p className="text-gray-600 text-sm">
                                        Jl. Asia Afrika No.158, Kb. Pisang, Kec. Sumur Bandung,
                                        Kota Bandung, Jawa Barat 40261
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="border-t pt-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Layanan Pelanggan
                            </h3>
                            <p className="text-gray-600">
                                Tim support kami siap membantu Anda kapan saja. Jangan ragu untuk menghubungi kami 
                                melalui berbagai channel yang tersedia.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
// resources/js/Pages/Public/Footer/Tentang.jsx
import PublicLayout from '@/Layouts/PublicLayout';
import React from 'react';

export default function Tentang(props) {
    return (
        <PublicLayout>
            <div className="container mx-auto p-8">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                    
                    {/* 1. Judul Utama diganti menjadi "Profil" */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Profil
                    </h1>
                    
                    {/* 2. Subjudul ditambahkan */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Winnicode Garuda Teknologi
                    </h2>
                    
                    {/* 3. Teks baru dimasukkan di sini */}
                    <div className="text-gray-700 leading-relaxed space-y-6">
                        <p>
                            <strong>PT. Winnicode Garuda Teknologi</strong> adalah perusahaan yang bergerak di bidang Media 
                            Publikasi dan Layanan Digital, didirikan pada tahun 2020 di Bandung. Kami hadir 
                            untuk menyediakan solusi publikasi dan digital yang inovatif bagi berbagai sektor 
                            industri. Fokus utama kami adalah pada publikasi berita, artikel, dan jurnalistik,
                            serta menyediakan layanan digital yang mendukung transformasi dan pertumbuhan bisnis
                            di era modern. Dalam bidang Media Publikasi, <strong>PT. Winnicode Garuda Teknologi</strong> mengkhususkan 
                            diri dalam pembuatan dan distribusi konten-konten berkualitas seperti berita terkini, artikel 
                            mendalam, dan tulisan jurnalistik yang dirancang untuk memberikan informasi yang akurat,
                            terpercaya, dan relevan kepada masyarakat. Kami berkomitmen untuk menyajikan konten yang tidak hanya 
                            informatif, tetapi juga berperan dalam membentuk opini publik dan mendukung perkembangan pengetahuan.
                        </p>
                        
                        {/* 4. Judul "Pendiri" ditambahkan */}
                        <h2 className="text-2xl font-semibold text-gray-800 !mt-10 mb-4 pt-4 border-t">
                            Pendiri
                        </h2>
                        
                        <p>
                            <strong>PT. Winnicode Garuda Teknologi</strong> didirikan pada tahun 2020 di Kota Bandung sebagai respons terhadap 
                            meningkatnya kebutuhan akan layanan digital yang inovatif dan terpercaya di era transformasi digital. 
                            Perusahaan ini lahir dari visi untuk menjadi pelopor dalam bidang publikasi media dan layanan digital 
                            yang mampu memberdayakan individu, institusi, dan pelaku usaha dalam menghadapi tantangan teknologi 
                            yang terus berkembang. Didirikan oleh sekelompok profesional muda yang memiliki latar belakang kuat di 
                            bidang teknologi informasi dan komunikasi, <strong>PT. Winnicode Garuda Teknologi</strong> berkomitmen untuk menyediakan 
                            solusi kreatif dan berkelanjutan. Fokus utama perusahaan meliputi pengembangan perangkat lunak, pembuatan 
                            website dan aplikasi, layanan publikasi media digital, serta penyediaan layanan teknologi untuk mendukung 
                            kegiatan promosi dan branding secara online. Sejak awal pendiriannya, <strong>Winnicode</strong> terus berinovasi dan menjalin 
                            kemitraan strategis dengan berbagai pihak guna memperluas jangkauan serta meningkatkan kualitas layanan. Dengan 
                            semangat profesionalisme dan integritas, <strong>Winnicode</strong> hadir untuk menjadi mitra teknologi yang handal bagi klien di 
                            berbagai sektor industri.
                        </p>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
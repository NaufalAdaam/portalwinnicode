import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    // --- BAGIAN INI YANG KITA UBAH ---
    // Kode baru ini lebih pintar dan bisa mencari file
    // di dalam sub-folder seperti 'Public' dan 'Admin'.
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        let page = pages[`./Pages/${name}.jsx`];
        if (!page) {
            throw new Error(`Vite page component '${name}' not found.`);
        }
        return page.default;
    },
    // ------------------------------------

    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);    
    },
    progress: {
        color: '#4B5563',
    },
});

import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import CommandSearch from '@/components/layout/CommandSearch';
import AuthModal from '@/components/auth/AuthModal';

export const metadata: Metadata = {
  title: 'RUANG ISU - Pusat Pemantauan dan Pengembangan Isu Sosial Politik | GMNI Wastukancana Purwakarta',
  description: 'Sistem intelligence dan pemantauan isu sosial-politik milik GMNI Komisariat Wastukancana Purwakarta. Membaca persoalan, menghubungkan sumber data, dan menggunakan AI untuk menyusun bahan kajian advokasi.',
  keywords: [
    'RUANG ISU',
    'GMNI',
    'GMNI Wastukancana',
    'Purwakarta',
    'Gerakan Mahasiswa Nasional Indonesia',
    'Pemantauan Isu Sosial Politik',
    'Bahan Kajian Advokasi',
    'Marhaenisme'
  ],
  authors: [{ name: 'Bidang Sosial Politik GMNI Wastukancana Purwakarta' }],
  icons: {
    icon: '/assets/gmni/logo-gmni.png',
    apple: '/assets/gmni/logo-gmni.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased selection:bg-red-100 selection:text-red-900">
        <AppProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <MobileNav />
          <Footer />
          <CommandSearch />
          <AuthModal />
        </AppProvider>
      </body>
    </html>
  );
}

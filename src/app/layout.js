import './globals.css';
import { Inter } from 'next/font/google';
import { Banner } from './components/Banner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'SXD-Exercise',
    description: 'A multi-step form exercise',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Banner />
                {children}
            </body>
        </html>
    );
}

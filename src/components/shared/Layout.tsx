import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout = ({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout; 
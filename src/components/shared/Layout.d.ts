import { ReactNode } from 'react';
interface LayoutProps {
    children: ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
}
declare const Layout: ({ children, showHeader, showFooter }: LayoutProps) => import("react/jsx-runtime").JSX.Element;
export default Layout;

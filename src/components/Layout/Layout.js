import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Report from '../components/Report/Report';
import Help from '../components/Help/Help';

const Layout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="layout-container">
            <header className="layout-header">
                <nav className="layout-nav">
                    <div className="nav-brand">
                        <h1>Cuide-se</h1>
                    </div>
                    <div className="nav-links">
                        <a href="/">Início</a>
                        {user && (
                            <>
                                <a href="/perfil">Perfil</a>
                                <a href="/transacoes">Transações</a>
                                <a href="/ajuda">Ajuda</a>
                            </>
                        )}
                    </div>
                    <div className="nav-user">
                        {user ? (
                            <>
                                <span>{user.email}</span>
                                <button onClick={() => signOut()}>Sair</button>
                            </>
                        ) : (
                            <>
                                <a href="/login">Login</a>
                                <a href="/cadastro">Cadastro</a>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <main className="layout-main">
                {children}
            </main>

            <aside className="layout-sidebar">
                <Report />
            </aside>

            <footer className="layout-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Sobre</h3>
                        <p>Cuide-se é uma plataforma de cuidadores profissionais.</p>
                    </div>
                    <div className="footer-section">
                        <h3>Contato</h3>
                        <p>Email: contato@cuide-se.com</p>
                        <p>Telefone: (XX) XXXX-XXXX</p>
                    </div>
                    <div className="footer-section">
                        <h3>Ajuda</h3>
                        <button onClick={() => window.location.href = '/ajuda'}>
                            Central de Ajuda
                        </button>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .layout-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                }

                .layout-header {
                    background: #4CAF50;
                    padding: 1rem;
                }

                .layout-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .nav-brand h1 {
                    color: white;
                    margin: 0;
                }

                .nav-links a {
                    color: white;
                    text-decoration: none;
                    margin: 0 1rem;
                }

                .nav-user {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .nav-user span {
                    color: white;
                }

                .nav-user button {
                    background: white;
                    color: #4CAF50;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .layout-main {
                    flex: 1;
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .layout-sidebar {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                }

                .layout-footer {
                    background: #333;
                    color: white;
                    padding: 2rem;
                }

                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                }

                .footer-section h3 {
                    margin: 0 0 1rem 0;
                }

                .footer-section p {
                    margin: 0.5rem 0;
                }

                .footer-section button {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .footer-section button:hover {
                    background: #45a049;
                }

                @media (max-width: 768px) {
                    .layout-nav {
                        flex-direction: column;
                        text-align: center;
                    }

                    .nav-links {
                        margin: 1rem 0;
                    }

                    .nav-links a {
                        margin: 0.5rem;
                    }

                    .footer-content {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Layout;

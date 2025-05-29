import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalProfessionals: 0,
        totalServices: 0,
        totalRevenue: 0,
        pendingReports: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        subscribeToStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            
            // Total de usuários
            const { count: totalUsers } = await supabase
                .from('usuarios')
                .select('*', { count: 'exact', head: true });

            // Usuários ativos (últimos 30 dias)
            const { count: activeUsers } = await supabase
                .from('usuarios')
                .select('*', { count: 'exact', head: true })
                .gte('data_ultimo_login', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

            // Total de profissionais
            const { count: totalProfessionals } = await supabase
                .from('usuarios')
                .select('*', { count: 'exact', head: true })
                .eq('tipo_perfil', 'profissional');

            // Total de serviços
            const { count: totalServices } = await supabase
                .from('servicos')
                .select('*', { count: 'exact', head: true });

            // Total de receita
            const { data: transactions } = await supabase
                .from('transacoes')
                .select('valor')
                .gte('data', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

            const totalRevenue = transactions.reduce((sum, t) => sum + t.valor, 0);

            // Relatórios pendentes
            const { count: pendingReports } = await supabase
                .from('relatorios')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pendente');

            setStats({
                totalUsers,
                activeUsers,
                totalProfessionals,
                totalServices,
                totalRevenue,
                pendingReports
            });
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToStats = () => {
        const channel = supabase.channel('admin-stats')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'usuarios'
                },
                () => fetchStats()
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'transacoes'
                },
                () => fetchStats()
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'relatorios'
                },
                () => fetchStats()
            )
            .subscribe();
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="admin-dashboard">
            <h1>Painel Administrativo</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total de Usuários</h3>
                    <p>{stats.totalUsers}</p>
                </div>

                <div className="stat-card">
                    <h3>Usuários Ativos</h3>
                    <p>{stats.activeUsers}</p>
                </div>

                <div className="stat-card">
                    <h3>Profissionais</h3>
                    <p>{stats.totalProfessionals}</p>
                </div>

                <div className="stat-card">
                    <h3>Serviços</h3>
                    <p>{stats.totalServices}</p>
                </div>

                <div className="stat-card">
                    <h3>Receita Total</h3>
                    <p>{formatCurrency(stats.totalRevenue)}</p>
                </div>

                <div className="stat-card">
                    <h3>Relatórios Pendentes</h3>
                    <p>{stats.pendingReports}</p>
                </div>
            </div>

            <div className="admin-actions">
                <button onClick={() => window.location.href = '/admin/users'}>
                    Gerenciar Usuários
                </button>
                <button onClick={() => window.location.href = '/admin/reports'}>
                    Ver Relatórios
                </button>
                <button onClick={() => window.location.href = '/admin/analytics'}>
                    Análises
                </button>
            </div>

            <style jsx>{`
                .admin-dashboard {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }

                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .stat-card h3 {
                    margin: 0 0 10px 0;
                    color: #666;
                }

                .stat-card p {
                    margin: 0;
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                }

                .admin-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 30px;
                }

                .admin-actions button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    background: #4CAF50;
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.3s;
                }

                .admin-actions button:hover {
                    background: #45a049;
                }

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .admin-actions {
                        flex-direction: column;
                    }

                    .stat-card {
                        padding: 15px;
                    }

                    .stat-card p {
                        font-size: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;

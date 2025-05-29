import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';

const Analytics = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState({
        monthlyRevenue: [],
        userGrowth: [],
        serviceUsage: [],
        professionalPerformance: [],
        loading: true
    });

    useEffect(() => {
        fetchAnalytics();
        subscribeToAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            // Receita mensal
            const { data: monthlyRevenueData } = await supabase
                .rpc('get_monthly_revenue', {
                    start_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
                });

            // Crescimento de usuários
            const { data: userGrowthData } = await supabase
                .rpc('get_user_growth', {
                    start_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
                });

            // Uso de serviços
            const { data: serviceUsageData } = await supabase
                .rpc('get_service_usage', {
                    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                });

            // Desempenho dos profissionais
            const { data: professionalPerformanceData } = await supabase
                .rpc('get_professional_performance', {
                    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                });

            setAnalytics({
                monthlyRevenue: monthlyRevenueData,
                userGrowth: userGrowthData,
                serviceUsage: serviceUsageData,
                professionalPerformance: professionalPerformanceData,
                loading: false
            });
        } catch (error) {
            console.error('Erro ao carregar análises:', error);
        }
    };

    const subscribeToAnalytics = () => {
        const channel = supabase.channel('analytics')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'transacoes'
                },
                () => fetchAnalytics()
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'usuarios'
                },
                () => fetchAnalytics()
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
        <div className="admin-analytics">
            <h1>Análises</h1>

            {analytics.loading ? (
                <div>Carregando...</div>
            ) : (
                <div className="analytics-grid">
                    <div className="analytics-card">
                        <h3>Receita Mensal</h3>
                        <div className="chart">
                            <canvas id="monthlyRevenueChart"></canvas>
                        </div>
                    </div>

                    <div className="analytics-card">
                        <h3>Crescimento de Usuários</h3>
                        <div className="chart">
                            <canvas id="userGrowthChart"></canvas>
                        </div>
                    </div>

                    <div className="analytics-card">
                        <h3>Uso de Serviços</h3>
                        <div className="chart">
                            <canvas id="serviceUsageChart"></canvas>
                        </div>
                    </div>

                    <div className="analytics-card">
                        <h3>Desempenho dos Profissionais</h3>
                        <div className="chart">
                            <canvas id="professionalPerformanceChart"></canvas>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-analytics {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .analytics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .analytics-card {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .analytics-card h3 {
                    margin: 0 0 15px 0;
                    color: #333;
                }

                .chart {
                    height: 300px;
                }

                @media (max-width: 768px) {
                    .analytics-grid {
                        grid-template-columns: 1fr;
                    }

                    .analytics-card {
                        padding: 15px;
                    }

                    .chart {
                        height: 200px;
                    }
                }
            `}</style>

            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
                {`
                const monthlyRevenueChart = document.getElementById('monthlyRevenueChart');
                const userGrowthChart = document.getElementById('userGrowthChart');
                const serviceUsageChart = document.getElementById('serviceUsageChart');
                const professionalPerformanceChart = document.getElementById('professionalPerformanceChart');

                if (monthlyRevenueChart) {
                    new Chart(monthlyRevenueChart, {
                        type: 'line',
                        data: {
                            labels: ${JSON.stringify(analytics.monthlyRevenue.map(d => d.month))},
                            datasets: [{
                                label: 'Receita Mensal',
                                data: ${JSON.stringify(analytics.monthlyRevenue.map(d => d.revenue))},
                                borderColor: '#4CAF50',
                                tension: 0.1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return 'R$ ' + value.toLocaleString('pt-BR');
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (userGrowthChart) {
                    new Chart(userGrowthChart, {
                        type: 'line',
                        data: {
                            labels: ${JSON.stringify(analytics.userGrowth.map(d => d.month))},
                            datasets: [{
                                label: 'Novos Usuários',
                                data: ${JSON.stringify(analytics.userGrowth.map(d => d.new_users))},
                                borderColor: '#2196F3',
                                tension: 0.1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }

                if (serviceUsageChart) {
                    new Chart(serviceUsageChart, {
                        type: 'bar',
                        data: {
                            labels: ${JSON.stringify(analytics.serviceUsage.map(d => d.service_name))},
                            datasets: [{
                                label: 'Uso de Serviços',
                                data: ${JSON.stringify(analytics.serviceUsage.map(d => d.usage_count))},
                                backgroundColor: '#4CAF50'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }

                if (professionalPerformanceChart) {
                    new Chart(professionalPerformanceChart, {
                        type: 'bar',
                        data: {
                            labels: ${JSON.stringify(analytics.professionalPerformance.map(d => d.professional_name))},
                            datasets: [{
                                label: 'Avaliações',
                                data: ${JSON.stringify(analytics.professionalPerformance.map(d => d.rating))},
                                backgroundColor: '#2196F3'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 5
                                }
                            }
                        }
                    });
                }
                `}
            </script>
        </div>
    );
};

export default Analytics;

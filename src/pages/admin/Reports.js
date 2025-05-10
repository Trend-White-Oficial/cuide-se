import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';

const Reports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        fetchReports();
        subscribeToReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            
            const { data, error } = await supabase
                .from('relatorios')
                .select(`
                    *,
                    usuario:usuario_id (
                        nome_completo,
                        email
                    ),
                    perfil:perfil_id (
                        nome_completo,
                        foto_perfil_url
                    )
                `)
                .order('data_criacao', { ascending: false });

            if (error) throw error;
            
            setReports(data);
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReportStatus = async (reportId, status) => {
        try {
            const { error } = await supabase
                .from('relatorios')
                .update({
                    status,
                    data_resolucao: new Date().toISOString(),
                    resolvido_por: user.id
                })
                .eq('id', reportId);

            if (error) throw error;
            
            // Enviar notificação para o usuário que criou o relatório
            const report = reports.find(r => r.id === reportId);
            if (report && report.usuario_id) {
                await supabase
                    .from('notificacoes')
                    .insert({
                        perfil_id: report.usuario_id,
                        titulo: 'Atualização de Relatório',
                        mensagem: `Seu relatório sobre ${report.perfil.nome_completo} foi ${status === 'resolvido' ? 'resolvido' : 'rejeitado'}.`,
                        tipo: 'relatorio'
                    });
            }

            fetchReports();
        } catch (error) {
            console.error('Erro ao atualizar status do relatório:', error);
        }
    };

    const subscribeToReports = () => {
        const channel = supabase.channel('reports')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'relatorios'
                },
                (payload) => {
                    fetchReports();
                }
            )
            .subscribe();
    };

    const formatReportDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="admin-reports">
            <h1>Relatórios</h1>

            {loading ? (
                <div>Carregando...</div>
            ) : (
                <div className="reports-list">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className={`report-item ${report.status}`}
                            onClick={() => setSelectedReport(report.id === selectedReport ? null : report.id)}
                        >
                            <div className="report-header">
                                <img
                                    src={report.perfil.foto_perfil_url}
                                    alt={report.perfil.nome_completo}
                                    className="profile-picture"
                                />
                                <div className="report-info">
                                    <h3>{report.perfil.nome_completo}</h3>
                                    <p>{report.usuario.nome_completo}</p>
                                </div>
                                <span className="report-status">
                                    {report.status === 'pendente' ? 'Pendente' : 
                                     report.status === 'resolvido' ? 'Resolvido' : 'Rejeitado'}
                                </span>
                            </div>

                            <div className={`report-content ${selectedReport === report.id ? 'expanded' : ''}`}>
                                <p>{report.descricao}</p>
                                <div className="report-actions">
                                    {report.status === 'pendente' && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReportStatus(report.id, 'resolvido');
                                                }}
                                            >
                                                Resolvido
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReportStatus(report.id, 'rejeitado');
                                                }}
                                            >
                                                Rejeitar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="report-meta">
                                <span>{formatReportDate(report.data_criacao)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .admin-reports {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .reports-list {
                    margin-top: 20px;
                }

                .report-item {
                    background: white;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    border: 1px solid #eee;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .report-item:hover {
                    border-color: #ddd;
                }

                .report-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 10px;
                }

                .profile-picture {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .report-info {
                    flex: 1;
                }

                .report-info h3 {
                    margin: 0 0 5px 0;
                    color: #333;
                }

                .report-info p {
                    margin: 0;
                    color: #666;
                }

                .report-status {
                    background: #f8f9fa;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                }

                .report-status.pendente {
                    background: #fff3cd;
                    color: #856404;
                }

                .report-status.resolvido {
                    background: #d4edda;
                    color: #155724;
                }

                .report-status.rejeitado {
                    background: #f8d7da;
                    color: #721c24;
                }

                .report-content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-in-out;
                }

                .report-content.expanded {
                    max-height: 500px;
                }

                .report-actions {
                    display: flex;
                    gap: 10px;
                    margin: 15px 0;
                }

                .report-actions button {
                    padding: 8px 15px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .report-actions button:first-child {
                    background: #28a745;
                    color: white;
                }

                .report-actions button:last-child {
                    background: #dc3545;
                    color: white;
                }

                .report-meta {
                    color: #666;
                    font-size: 12px;
                    text-align: right;
                }

                @media (max-width: 768px) {
                    .report-item {
                        padding: 10px;
                    }

                    .profile-picture {
                        width: 35px;
                        height: 35px;
                    }

                    .report-info h3 {
                        font-size: 16px;
                    }

                    .report-meta {
                        font-size: 11px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Reports;

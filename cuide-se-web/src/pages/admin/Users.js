import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';

const Users = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filters, setFilters] = useState({
        role: 'all',
        status: 'all'
    });

    useEffect(() => {
        fetchUsers();
        subscribeToUsers();
    }, [filters.role, filters.status]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            
            let query = supabase
                .from('usuarios')
                .select(`
                    *,
                    perfil:perfil_id (
                        nome_completo,
                        foto_perfil_url,
                        especialidade
                    )
                `);

            if (filters.role !== 'all') {
                query = query.eq('tipo_perfil', filters.role);
            }

            if (filters.status !== 'all') {
                query = query.eq('status_conta', filters.status);
            }

            const { data, error } = await query
                .order('data_criacao', { ascending: false });

            if (error) throw error;
            
            setUsers(data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserStatus = async (userId, status) => {
        try {
            const { error } = await supabase
                .from('usuarios')
                .update({
                    status_conta: status,
                    data_status: new Date().toISOString(),
                    atualizado_por: user.id
                })
                .eq('id', userId);

            if (error) throw error;
            
            fetchUsers();
        } catch (error) {
            console.error('Erro ao atualizar status do usuário:', error);
        }
    };

    const subscribeToUsers = () => {
        const channel = supabase.channel('users')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'usuarios'
                },
                (payload) => {
                    fetchUsers();
                }
            )
            .subscribe();
    };

    const formatUserDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="admin-users">
            <h1>Gerenciar Usuários</h1>

            <div className="filters">
                <select
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                >
                    <option value="all">Todos os Tipos</option>
                    <option value="cliente">Clientes</option>
                    <option value="profissional">Profissionais</option>
                </select>

                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="all">Todos os Status</option>
                    <option value="ativo">Ativos</option>
                    <option value="inativo">Inativos</option>
                    <option value="suspenso">Suspensos</option>
                </select>
            </div>

            {loading ? (
                <div>Carregando...</div>
            ) : (
                <div className="users-list">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={`user-item ${user.status_conta}`}
                            onClick={() => setSelectedUser(user.id === selectedUser ? null : user.id)}
                        >
                            <div className="user-header">
                                <img
                                    src={user.perfil.foto_perfil_url}
                                    alt={user.perfil.nome_completo}
                                    className="profile-picture"
                                />
                                <div className="user-info">
                                    <h3>{user.perfil.nome_completo}</h3>
                                    <p>{user.email}</p>
                                </div>
                                <span className="user-status">
                                    {user.status_conta === 'ativo' ? 'Ativo' : 
                                     user.status_conta === 'inativo' ? 'Inativo' : 'Suspenso'}
                                </span>
                            </div>

                            <div className={`user-content ${selectedUser === user.id ? 'expanded' : ''}`}>
                                <p>Tipo de Perfil: {user.tipo_perfil}</p>
                                <p>Data de Criação: {formatUserDate(user.data_criacao)}</p>
                                {user.perfil.especialidade && (
                                    <p>Especialidade: {user.perfil.especialidade}</p>
                                )}
                                <div className="user-actions">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUserStatus(user.id, 'ativo');
                                        }}
                                    >
                                        Ativar
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUserStatus(user.id, 'inativo');
                                        }}
                                    >
                                        Inativar
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUserStatus(user.id, 'suspenso');
                                        }}
                                    >
                                        Suspender
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .admin-users {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .filters {
                    display: flex;
                    gap: 10px;
                    margin: 20px 0;
                }

                select {
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }

                .users-list {
                    margin-top: 20px;
                }

                .user-item {
                    background: white;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    border: 1px solid #eee;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .user-item:hover {
                    border-color: #ddd;
                }

                .user-header {
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

                .user-info {
                    flex: 1;
                }

                .user-info h3 {
                    margin: 0 0 5px 0;
                    color: #333;
                }

                .user-info p {
                    margin: 0;
                    color: #666;
                }

                .user-status {
                    background: #f8f9fa;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                }

                .user-status.ativo {
                    background: #d4edda;
                    color: #155724;
                }

                .user-status.inativo {
                    background: #fff3cd;
                    color: #856404;
                }

                .user-status.suspenso {
                    background: #f8d7da;
                    color: #721c24;
                }

                .user-content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-in-out;
                }

                .user-content.expanded {
                    max-height: 500px;
                }

                .user-content p {
                    margin: 5px 0;
                    color: #666;
                }

                .user-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }

                .user-actions button {
                    padding: 8px 15px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .user-actions button:first-child {
                    background: #28a745;
                    color: white;
                }

                .user-actions button:nth-child(2) {
                    background: #ffc107;
                    color: #000;
                }

                .user-actions button:last-child {
                    background: #dc3545;
                    color: white;
                }

                @media (max-width: 768px) {
                    .filters {
                        flex-wrap: wrap;
                    }

                    .user-item {
                        padding: 10px;
                    }

                    .profile-picture {
                        width: 35px;
                        height: 35px;
                    }

                    .user-info h3 {
                        font-size: 16px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Users;

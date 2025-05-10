import React, { useState, useEffect } from 'react';
import { apiTransacoes } from '../../api/financial';
import { useAuth } from '../../contexts/AuthContext';

const Transactions = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        tipo: '',
        dataInicial: '',
        dataFinal: ''
    });

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const { data, error } = await apiTransacoes.listTransactions(user.id, filters);
            if (error) throw error;
            setTransactions(data);
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="transactions-container">
            <div className="transactions-header">
                <h1>Histórico de Transações</h1>
                <div className="filters">
                    <select
                        name="tipo"
                        value={filters.tipo}
                        onChange={handleFilterChange}
                    >
                        <option value="">Todos os tipos</option>
                        <option value="pagamento">Pagamentos</option>
                        <option value="recebimento">Recebimentos</option>
                        <option value="reembolso">Reembolsos</option>
                    </select>
                    <input
                        type="date"
                        name="dataInicial"
                        value={filters.dataInicial}
                        onChange={handleFilterChange}
                        placeholder="Data Inicial"
                    />
                    <input
                        type="date"
                        name="dataFinal"
                        value={filters.dataFinal}
                        onChange={handleFilterChange}
                        placeholder="Data Final"
                    />
                </div>
            </div>

            <div className="transactions-content">
                {loading ? (
                    <div>Carregando...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Tipo</th>
                                <th>Descrição</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Cartão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{new Date(transaction.data_transacao).toLocaleDateString('pt-BR')}</td>
                                    <td>{transaction.tipo_transacao}</td>
                                    <td>{transaction.descricao}</td>
                                    <td>{formatCurrency(transaction.valor)}</td>
                                    <td>
                                        <span className={`status ${transaction.status}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td>
                                        {transaction.cartao ? (
                                            <div className="card-info">
                                                <span>{transaction.cartao.bandeira}</span>
                                                <span>•••• {transaction.cartao.numero_cartao.slice(-4)}</span>
                                            </div>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx>{`
                .transactions-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .transactions-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .filters {
                    display: flex;
                    gap: 10px;
                }

                select,
                input {
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                .transactions-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th,
                td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }

                th {
                    background-color: #f8f9fa;
                    font-weight: bold;
                }

                .status {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                }

                .status.pendente {
                    background-color: #ffc107;
                    color: #000;
                }

                .status.liberado {
                    background-color: #4CAF50;
                    color: white;
                }

                .status.cancelado {
                    background-color: #f44336;
                    color: white;
                }

                .card-info {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                @media (max-width: 768px) {
                    .filters {
                        flex-direction: column;
                    }

                    table {
                        display: block;
                        overflow-x: auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default Transactions;

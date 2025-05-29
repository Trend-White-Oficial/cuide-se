import React, { useState, useEffect } from 'react';
import { apiAssinaturas, apiTransacoes, apiComprovantes } from '../../api/financial';
import { useAuth } from '../../contexts/AuthContext';

const FinancialProfile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [newTransaction, setNewTransaction] = useState({
        tipo: 'receita',
        descricao: '',
        valor: '',
        categoria: '',
        comprovante: null
    });
    const [categories, setCategories] = useState([
        'Serviços', 'Materiais', 'Despesas', 'Recompensas', 'Outros'
    ]);

    useEffect(() => {
        fetchSubscription();
        fetchTransactions();
        fetchBalance();
    }, [user]);

    const fetchSubscription = async () => {
        try {
            const { data, error } = await apiAssinaturas.getActiveSubscription(user.id);
            if (error) throw error;
            setSubscription(data);
        } catch (error) {
            console.error('Erro ao carregar assinatura:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const { data, error } = await apiTransacoes.listTransactions(user.id);
            if (error) throw error;
            setTransactions(data);
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
        }
    };

    const fetchBalance = async () => {
        try {
            const { data, error } = await apiTransacoes.getBalance(user.id);
            if (error) throw error;
            setBalance(data[0]);
        } catch (error) {
            console.error('Erro ao carregar saldo:', error);
        }
    };

    const handleNewTransaction = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('file', newTransaction.comprovante);

            const { data: receiptData, error: receiptError } = await apiComprovantes.uploadReceipt(
                newTransaction.id,
                formData.get('file')
            );

            if (receiptError) throw receiptError;

            const { error: transactionError } = await apiTransacoes.createTransaction({
                ...newTransaction,
                comprovante_url: receiptData[0].path
            });

            if (transactionError) throw transactionError;

            setNewTransaction({
                tipo: 'receita',
                descricao: '',
                valor: '',
                categoria: '',
                comprovante: null
            });
            fetchTransactions();
            fetchBalance();
        } catch (error) {
            console.error('Erro ao criar transação:', error);
        }
    };

    if (loading || !subscription) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="financial-profile">
            <section className="subscription-info">
                <h2>Assinatura Atual</h2>
                <div className="subscription-details">
                    <div className="detail-item">
                        <strong>Plano:</strong> {subscription.plano.nome}
                    </div>
                    <div className="detail-item">
                        <strong>Valor:</strong> R${subscription.plano.valor}
                    </div>
                    <div className="detail-item">
                        <strong>Benefícios:</strong>
                        <ul>
                            {subscription.plano.beneficios.map((beneficio, index) => (
                                <li key={index}>{beneficio}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="detail-item">
                        <strong>Válida até:</strong> {subscription.data_fim}
                    </div>
                </div>
            </section>

            <section className="financial-summary">
                <h2>Resumo Financeiro</h2>
                <div className="balance-box">
                    <h3>Saldo Atual</h3>
                    <p>R${balance.toFixed(2)}</p>
                </div>
                <div className="transaction-stats">
                    <div className="stat-item">
                        <strong>Receitas:</strong>
                        <span>+
                            {transactions
                                .filter(t => t.tipo === 'receita' && t.status === 'confirmado')
                                .reduce((sum, t) => sum + t.valor, 0)
                                .toFixed(2)}
                        </span>
                    </div>
                    <div className="stat-item">
                        <strong>Despesas:</strong>
                        <span>-
                            {transactions
                                .filter(t => t.tipo === 'despesa' && t.status === 'confirmado')
                                .reduce((sum, t) => sum + t.valor, 0)
                                .toFixed(2)}
                        </span>
                    </div>
                </div>
            </section>

            <section className="transaction-form">
                <h2>Registrar Transação</h2>
                <form onSubmit={handleNewTransaction}>
                    <div className="form-group">
                        <label>Tipo</label>
                        <select
                            value={newTransaction.tipo}
                            onChange={(e) => setNewTransaction({ ...newTransaction, tipo: e.target.value })}
                        >
                            <option value="receita">Receita</option>
                            <option value="despesa">Despesa</option>
                            <option value="recompensa">Recompensa</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Descrição</label>
                        <input
                            type="text"
                            value={newTransaction.descricao}
                            onChange={(e) => setNewTransaction({ ...newTransaction, descricao: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Valor</label>
                        <input
                            type="number"
                            step="0.01"
                            value={newTransaction.valor}
                            onChange={(e) => setNewTransaction({ ...newTransaction, valor: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Categoria</label>
                        <select
                            value={newTransaction.categoria}
                            onChange={(e) => setNewTransaction({ ...newTransaction, categoria: e.target.value })}
                        >
                            {categories.map((categoria) => (
                                <option key={categoria} value={categoria}>{categoria}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Comprovante</label>
                        <input
                            type="file"
                            onChange={(e) => setNewTransaction({ ...newTransaction, comprovante: e.target.files[0] })}
                            required
                        />
                    </div>
                    <button type="submit">Registrar Transação</button>
                </form>
            </section>

            <section className="transaction-history">
                <h2>Histórico de Transações</h2>
                <div className="transactions-list">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="transaction-item">
                            <div className="transaction-info">
                                <div className="transaction-type">
                                    {transaction.tipo === 'receita' ? '+' : '-'}
                                    R${transaction.valor.toFixed(2)}
                                </div>
                                <div className="transaction-details">
                                    <div className="detail">
                                        <strong>Descrição:</strong> {transaction.descricao}
                                    </div>
                                    <div className="detail">
                                        <strong>Categoria:</strong> {transaction.categoria}
                                    </div>
                                    <div className="detail">
                                        <strong>Data:</strong> {new Date(transaction.data_transacao).toLocaleDateString()}
                                    </div>
                                    <div className="detail">
                                        <strong>Status:</strong> {transaction.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <style jsx>{`
                .financial-profile {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .subscription-info, .financial-summary, .transaction-form, .transaction-history {
                    margin-bottom: 30px;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .subscription-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .detail-item {
                    padding: 10px;
                    border: 1px solid #eee;
                    border-radius: 4px;
                }

                .financial-summary {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 20px;
                }

                .balance-box {
                    background: #4CAF50;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                }

                .balance-box h3 {
                    margin: 0 0 10px 0;
                    color: white;
                }

                .balance-box p {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 0;
                }

                .transaction-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }

                .stat-item {
                    padding: 15px;
                    border: 1px solid #eee;
                    border-radius: 4px;
                }

                .stat-item strong {
                    display: block;
                    margin-bottom: 5px;
                }

                .stat-item span {
                    font-size: 18px;
                    font-weight: bold;
                }

                .transaction-form form {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .form-group label {
                    font-weight: bold;
                }

                .form-group input,
                .form-group select {
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                }

                button {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                button:hover {
                    background-color: #45a049;
                }

                .transactions-list {
                    margin-top: 20px;
                }

                .transaction-item {
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                }

                .transaction-info {
                    display: flex;
                    gap: 20px;
                }

                .transaction-type {
                    font-size: 24px;
                    font-weight: bold;
                    color: #4CAF50;
                }

                .transaction-details {
                    flex: 1;
                }

                .detail {
                    margin-bottom: 5px;
                }

                .detail strong {
                    display: inline-block;
                    width: 100px;
                }

                @media (max-width: 768px) {
                    .financial-summary {
                        grid-template-columns: 1fr;
                    }

                    .transaction-info {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .transaction-type {
                        font-size: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default FinancialProfile;

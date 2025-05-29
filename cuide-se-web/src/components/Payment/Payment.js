import React, { useState } from 'react';
import { apiCartoes, apiTransacoes } from '../../api/financial';
import { useAuth } from '../../contexts/AuthContext';

const Payment = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [cardData, setCardData] = useState({
        numero: '',
        nome: '',
        expiracao: '',
        codigo: '',
        bandeira: '',
        tipo: ''
    });
    const [transactionData, setTransactionData] = useState({
        valor: '',
        descricao: ''
    });
    const [selectedCard, setSelectedCard] = useState(null);
    const [cards, setCards] = useState([]);

    const handleCardSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            Object.entries(cardData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const { data, error } = await apiCartoes.createCard(formData);
            if (error) throw error;

            // Atualizar lista de cartões
            await fetchCards();
            setStep(2);
        } catch (error) {
            console.error('Erro ao adicionar cartão:', error);
            alert('Erro ao adicionar cartão. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data, error } = await apiTransacoes.createTransaction({
                perfil_id: user.id,
                cartao_id: selectedCard.id,
                valor: parseFloat(transactionData.valor),
                tipo_transacao: 'pagamento',
                descricao: transactionData.descricao
            });

            if (error) throw error;

            // Limpar formulário após envio bem-sucedido
            setTransactionData({
                valor: '',
                descricao: ''
            });

            alert('Pagamento realizado com sucesso!');
            // Redirecionar para histórico de transações
            window.location.href = '/transacoes';
        } catch (error) {
            console.error('Erro ao realizar pagamento:', error);
            alert('Erro ao realizar pagamento. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCards = async () => {
        try {
            const { data, error } = await apiCartoes.listCards(user.id);
            if (error) throw error;
            setCards(data);
        } catch (error) {
            console.error('Erro ao carregar cartões:', error);
        }
    };

    const renderStep1 = () => (
        <div>
            <h2>Adicionar Cartão de Crédito</h2>
            <form onSubmit={handleCardSubmit}>
                <div className="form-group">
                    <label>Número do Cartão</label>
                    <input
                        type="text"
                        value={cardData.numero}
                        onChange={(e) => setCardData({ ...cardData, numero: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Nome do Titular</label>
                    <input
                        type="text"
                        value={cardData.nome}
                        onChange={(e) => setCardData({ ...cardData, nome: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Data de Expiração</label>
                    <input
                        type="month"
                        value={cardData.expiracao}
                        onChange={(e) => setCardData({ ...cardData, expiracao: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Código de Segurança</label>
                    <input
                        type="password"
                        value={cardData.codigo}
                        onChange={(e) => setCardData({ ...cardData, codigo: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Bandeira</label>
                    <select
                        value={cardData.bandeira}
                        onChange={(e) => setCardData({ ...cardData, bandeira: e.target.value })}
                        required
                    >
                        <option value="">Selecione</option>
                        <option value="visa">Visa</option>
                        <option value="mastercard">MasterCard</option>
                        <option value="amex">American Express</option>
                        <option value="elo">Elo</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Adicionando...' : 'Adicionar Cartão'}
                </button>
            </form>
        </div>
    );

    const renderStep2 = () => (
        <div>
            <h2>Realizar Pagamento</h2>
            <form onSubmit={handleTransactionSubmit}>
                <div className="form-group">
                    <label>Selecione o Cartão</label>
                    <select
                        value={selectedCard?.id}
                        onChange={(e) => {
                            const selected = cards.find(card => card.id === e.target.value);
                            setSelectedCard(selected);
                        }}
                        required
                    >
                        <option value="">Selecione um cartão</option>
                        {cards.map(card => (
                            <option key={card.id} value={card.id}>
                                {`${card.bandeira} - ${card.nome}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Valor</label>
                    <input
                        type="number"
                        step="0.01"
                        value={transactionData.valor}
                        onChange={(e) => setTransactionData({ ...transactionData, valor: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Descrição</label>
                    <input
                        type="text"
                        value={transactionData.descricao}
                        onChange={(e) => setTransactionData({ ...transactionData, descricao: e.target.value })}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Processando...' : 'Realizar Pagamento'}
                </button>
            </form>
        </div>
    );

    return (
        <div className="payment-container">
            <div className="payment-content">
                {step === 1 ? renderStep1() : renderStep2()}
            </div>

            <style jsx>{`
                .payment-container {
                    padding: 20px;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .payment-content {
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    margin: 0 0 20px 0;
                    color: #333;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }

                input,
                select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                }

                button {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 100%;
                    transition: background-color 0.3s;
                }

                button:hover:not(:disabled) {
                    background-color: #45a049;
                }

                button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .payment-container {
                        padding: 10px;
                    }

                    .payment-content {
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Payment;

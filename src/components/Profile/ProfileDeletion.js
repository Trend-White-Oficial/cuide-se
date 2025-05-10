import React, { useState } from 'react';
import { apiPerfis, apiDocumentos, apiTransacoes, apiAssinaturas } from '../../api/profile';
import { useAuth } from '../../contexts/AuthContext';

const ProfileDeletion = () => {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [deletionReason, setDeletionReason] = useState('');

    const handleDeleteProfile = async () => {
        try {
            setLoading(true);

            // 1. Cancelar assinatura ativa
            const { data: subscription, error: subscriptionError } = await apiAssinaturas.getActiveSubscription(user.id);
            if (subscription && !subscriptionError) {
                await apiAssinaturas.updateSubscriptionStatus(subscription.id, 'cancelado');
            }

            // 2. Cancelar transações pendentes
            const { data: transactions, error: transactionsError } = await apiTransacoes.listTransactions(user.id, {
                status: 'pendente'
            });
            if (transactions && !transactionsError) {
                for (const transaction of transactions) {
                    await apiTransacoes.updateTransactionStatus(transaction.id, 'cancelado');
                }
            }

            // 3. Remover documentos
            const { data: documents, error: documentsError } = await apiDocumentos.listDocuments(user.id);
            if (documents && !documentsError) {
                for (const document of documents) {
                    await apiDocumentos.deleteDocument(document.id);
                }
            }

            // 4. Remover perfil
            await apiPerfis.deleteProfile(user.id);

            // 5. Fazer logout
            await signOut();

            // Redirecionar para página inicial
            window.location.href = '/';
        } catch (error) {
            console.error('Erro ao excluir perfil:', error);
            alert('Erro ao excluir perfil. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <div>
            <h2>Excluir Perfil</h2>
            <p>Tem certeza que deseja excluir sua conta? Esta ação é irreversível.</p>
            <div className="warning-box">
                <p>Ao excluir sua conta:</p>
                <ul>
                    <li>Seus dados serão permanentemente removidos</li>
                    <li>Você perderá acesso a todos os seus serviços</li>
                    <li>Seus documentos serão excluídos</li>
                    <li>Seu histórico de transações será apagado</li>
                </ul>
            </div>
            <div className="actions">
                <button onClick={() => setStep(2)} className="continue-btn">
                    Continuar
                </button>
                <button onClick={() => setStep(0)} className="cancel-btn">
                    Cancelar
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div>
            <h2>Confirmação</h2>
            <p>Por favor, insira o código de confirmação enviado para seu email.</p>
            <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Código de confirmação"
            />
            <div className="actions">
                <button onClick={handleDeleteProfile} className="delete-btn">
                    Excluir Conta
                </button>
                <button onClick={() => setStep(1)} className="back-btn">
                    Voltar
                </button>
            </div>
        </div>
    );

    return (
        <div className="profile-deletion">
            <div className="deletion-container">
                {step === 1 ? renderStep1() : renderStep2()}
            </div>

            <style jsx>{`
                .profile-deletion {
                    padding: 20px;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .deletion-container {
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    margin: 0 0 20px 0;
                    color: #333;
                }

                p {
                    margin: 10px 0;
                    color: #666;
                }

                .warning-box {
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin: 20px 0;
                }

                .warning-box ul {
                    list-style: none;
                    padding: 0;
                    margin: 10px 0 0;
                }

                .warning-box li {
                    margin: 5px 0;
                    padding-left: 20px;
                    position: relative;
                }

                .warning-box li:before {
                    content: '•';
                    position: absolute;
                    left: 0;
                    color: #ffc107;
                }

                input {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                }

                .actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: opacity 0.3s;
                }

                button:hover {
                    opacity: 0.9;
                }

                .continue-btn {
                    background-color: #4CAF50;
                    color: white;
                }

                .cancel-btn {
                    background-color: #f44336;
                    color: white;
                }

                .delete-btn {
                    background-color: #f44336;
                    color: white;
                }

                .back-btn {
                    background-color: #2196F3;
                    color: white;
                }

                @media (max-width: 768px) {
                    .profile-deletion {
                        padding: 10px;
                    }

                    .deletion-container {
                        padding: 20px;
                    }

                    .actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfileDeletion;

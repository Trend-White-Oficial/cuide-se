import React, { useState, useEffect } from 'react';
import { apiPerfis, apiIndicacoes } from '../../api/profile';
import { useAuth } from '../../contexts/AuthContext';

const ClientProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        telefone: '',
        foto_perfil_url: '',
        profissao: '',
        sobre_mim: '',
        endereco: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
    });
    const [referrals, setReferrals] = useState([]);
    const [rewards, setRewards] = useState([]);

    useEffect(() => {
        fetchProfileData();
        fetchReferrals();
        fetchRewards();
    }, [user]);

    const fetchProfileData = async () => {
        try {
            const { data, error } = await apiPerfis.getProfile(user.id);
            if (error) throw error;
            setProfile(data);
            setFormData({
                telefone: data.telefone,
                foto_perfil_url: data.foto_perfil_url,
                profissao: data.profissao,
                sobre_mim: data.sobre_mim,
                endereco: data.endereco,
                bairro: data.bairro,
                cidade: data.cidade,
                estado: data.estado,
                cep: data.cep
            });
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            setLoading(false);
        }
    };

    const fetchReferrals = async () => {
        try {
            const { data, error } = await apiIndicacoes.listReferrals(user.id);
            if (error) throw error;
            setReferrals(data);
        } catch (error) {
            console.error('Erro ao carregar indicações:', error);
        }
    };

    const fetchRewards = async () => {
        try {
            const { data, error } = await apiIndicacoes.getAvailableRewards(user.id);
            if (error) throw error;
            setRewards(data);
        } catch (error) {
            console.error('Erro ao carregar recompensas:', error);
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setFormData({
            telefone: profile.telefone,
            foto_perfil_url: profile.foto_perfil_url,
            profissao: profile.profissao,
            sobre_mim: profile.sobre_mim,
            endereco: profile.endereco,
            bairro: profile.bairro,
            cidade: profile.cidade,
            estado: profile.estado,
            cep: profile.cep
        });
    };

    const handleSave = async () => {
        try {
            const { error } = await apiPerfis.updateProfile(user.id, formData);
            if (error) throw error;
            setEditMode(false);
            fetchProfileData();
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
        }
    };

    const handleRewardUsage = async (rewardId) => {
        try {
            const { error } = await apiIndicacoes.useReward(rewardId);
            if (error) throw error;
            fetchRewards();
        } catch (error) {
            console.error('Erro ao usar recompensa:', error);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="client-profile">
            <section className="profile-header">
                <div className="profile-picture">
                    <img src={profile.foto_perfil_url || '/default-avatar.png'} alt="Foto de perfil" />
                    {editMode && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, foto_perfil_url: URL.createObjectURL(e.target.files[0]) })}
                        />
                    )}
                </div>
                <div className="profile-info">
                    <h1>{profile.nome_completo}</h1>
                    <p className="status-verification">
                        Status de Verificação: {profile.status_verificacao}
                    </p>
                    <p className="professional-info">
                        {profile.profissao} • {profile.cidade}, {profile.estado}
                    </p>
                </div>
                {!editMode && (
                    <button onClick={handleEdit}>Editar Perfil</button>
                )}
            </section>

            {editMode && (
                <section className="profile-edit">
                    <form>
                        <div className="form-group">
                            <label>Telefone</label>
                            <input
                                type="tel"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Profissão</label>
                            <input
                                type="text"
                                value={formData.profissao}
                                onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Sobre mim</label>
                            <textarea
                                value={formData.sobre_mim}
                                onChange={(e) => setFormData({ ...formData, sobre_mim: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Endereço</label>
                            <input
                                type="text"
                                value={formData.endereco}
                                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Bairro</label>
                            <input
                                type="text"
                                value={formData.bairro}
                                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Cidade</label>
                            <input
                                type="text"
                                value={formData.cidade}
                                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Estado</label>
                            <input
                                type="text"
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>CEP</label>
                            <input
                                type="text"
                                value={formData.cep}
                                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                                Cancelar
                            </button>
                            <button type="button" onClick={handleSave} className="save-btn">
                                Salvar
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="profile-section">
                <h2>Meus Dados</h2>
                <div className="profile-data">
                    <div className="data-item">
                        <strong>CPF:</strong> {profile.cpf}
                    </div>
                    <div className="data-item">
                        <strong>Email:</strong> {profile.email}
                    </div>
                    <div className="data-item">
                        <strong>Data de Nascimento:</strong> {profile.data_nascimento}
                    </div>
                    <div className="data-item">
                        <strong>Gênero:</strong> {profile.genero}
                    </div>
                </div>
            </section>

            <section className="profile-section">
                <h2>Indicações</h2>
                <div className="referrals-list">
                    {referrals.map((referral) => (
                        <div key={referral.id} className="referral-item">
                            <div className="referral-info">
                                <div className="referral-user">
                                    <img src={referral.indicador.foto_perfil_url} alt="Indicador" />
                                    <span>{referral.indicador.nome_completo}</span>
                                </div>
                                <div className="referral-status">
                                    Status: {referral.status}
                                </div>
                                <div className="referral-rewards">
                                    Recompensa: R${referral.recompensa_indicador}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="profile-section">
                <h2>Recompensas Disponíveis</h2>
                <div className="rewards-list">
                    {rewards.map((reward) => (
                        <div key={reward.id} className="reward-item">
                            <div className="reward-info">
                                <div className="reward-type">{reward.tipo}</div>
                                <div className="reward-value">R${reward.valor}</div>
                                <div className="reward-description">{reward.descricao}</div>
                                <button onClick={() => handleRewardUsage(reward.id)}>Usar Recompensa</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <style jsx>{`
                .client-profile {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .profile-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .profile-picture {
                    position: relative;
                }

                .profile-picture img {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .profile-info {
                    flex: 1;
                }

                .profile-info h1 {
                    margin: 0;
                    font-size: 24px;
                }

                .status-verification {
                    color: #666;
                    font-size: 14px;
                }

                .professional-info {
                    color: #666;
                    font-size: 14px;
                }

                .profile-section {
                    margin-bottom: 30px;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .profile-data {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .data-item {
                    padding: 10px;
                    border: 1px solid #eee;
                    border-radius: 4px;
                }

                .referrals-list, .rewards-list {
                    margin-top: 20px;
                }

                .referral-item, .reward-item {
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                }

                .referral-info, .reward-info {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .referral-user {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .referral-user img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .reward-type {
                    font-weight: bold;
                }

                .reward-value {
                    color: #4CAF50;
                    font-size: 18px;
                }

                button {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                button:hover {
                    background-color: #45a049;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }

                .form-group input,
                .form-group textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                }

                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                .cancel-btn {
                    background-color: #f44336;
                }

                .cancel-btn:hover {
                    background-color: #da190b;
                }

                .save-btn {
                    background-color: #4CAF50;
                }

                .save-btn:hover {
                    background-color: #45a049;
                }
            `}</style>
        </div>
    );
};

export default ClientProfile;

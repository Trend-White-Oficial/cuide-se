import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';

const Follow = ({ perfilId, nomeCompleto, fotoPerfilUrl }) => {
    const { user } = useAuth();
    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkFollowingStatus();
        subscribeToFollows();
    }, [perfilId]);

    const checkFollowingStatus = async () => {
        try {
            const { data, error } = await supabase
                .from('seguimentos')
                .select()
                .eq('seguidor_id', user.id)
                .eq('seguido_id', perfilId)
                .single();

            if (error) throw error;
            setFollowing(!!data);
        } catch (error) {
            console.error('Erro ao verificar seguimento:', error);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToFollows = () => {
        const channel = supabase.channel('follows')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'seguimentos',
                    filter: `seguidor_id=eq.${user.id} or seguido_id=eq.${user.id}`
                },
                (payload) => {
                    checkFollowingStatus();
                }
            )
            .subscribe();
    };

    const toggleFollow = async () => {
        try {
            setLoading(true);
            
            if (following) {
                // Remover seguimento
                const { error } = await supabase
                    .from('seguimentos')
                    .delete()
                    .eq('seguidor_id', user.id)
                    .eq('seguido_id', perfilId);

                if (error) throw error;
            } else {
                // Adicionar seguimento
                const { error } = await supabase
                    .from('seguimentos')
                    .insert({
                        seguidor_id: user.id,
                        seguido_id: perfilId
                    });

                if (error) throw error;

                // Enviar notificação para o seguido
                await supabase
                    .from('notificacoes')
                    .insert({
                        perfil_id: perfilId,
                        titulo: 'Novo Seguidor',
                        mensagem: `${user.nome_completo} começou a seguir você`,
                        tipo: 'seguidor'
                    });
            }

            setFollowing(!following);
        } catch (error) {
            console.error('Erro ao alterar seguimento:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="follow-container">
            <div className="user-info">
                <img
                    src={fotoPerfilUrl}
                    alt={nomeCompleto}
                    className="profile-picture"
                />
                <div className="user-details">
                    <h3>{nomeCompleto}</h3>
                </div>
            </div>

            <button
                onClick={toggleFollow}
                disabled={loading}
                className={`follow-button ${following ? 'following' : ''}`}
            >
                {loading ? 'Carregando...' : following ? 'Seguindo' : 'Seguir'}
            </button>

            <style jsx>{`
                .follow-container {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .profile-picture {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .user-details {
                    display: flex;
                    flex-direction: column;
                }

                .user-details h3 {
                    margin: 0;
                    font-size: 16px;
                    color: #333;
                }

                .follow-button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                }

                .follow-button:not(.following) {
                    background-color: #4CAF50;
                    color: white;
                }

                .follow-button.following {
                    background-color: #f8f9fa;
                    color: #666;
                }

                .follow-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .follow-button:hover:not(:disabled) {
                    opacity: 0.9;
                }

                @media (max-width: 768px) {
                    .follow-container {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }

                    .user-info {
                        flex-direction: column;
                        align-items: center;
                    }

                    .profile-picture {
                        width: 60px;
                        height: 60px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Follow;

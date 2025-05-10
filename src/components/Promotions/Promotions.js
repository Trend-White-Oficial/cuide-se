import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';

const Promotions = () => {
    const { user } = useAuth();
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        fetchPromotions();
        fetchFollowing();
        subscribeToPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            
            // Buscar promoções dos profissionais que o usuário segue
            const { data: seguidos, error: errorSeguidos } = await supabase
                .from('seguimentos')
                .select('seguido_id')
                .eq('seguidor_id', user.id);

            if (errorSeguidos) throw errorSeguidos;

            const seguidosIds = seguidos.map(s => s.seguido_id);

            // Buscar promoções
            const { data: promos, error: errorPromos } = await supabase
                .from('promocoes')
                .select(`
                    *,
                    perfil:perfil_id (
                        nome_completo,
                        foto_perfil_url,
                        especialidade
                    )
                `)
                .in('perfil_id', seguidosIds)
                .gte('data_inicio', new Date().toISOString())
                .order('data_inicio', { ascending: true });

            if (errorPromos) throw errorPromos;
            
            setPromotions(promos);
        } catch (error) {
            console.error('Erro ao carregar promoções:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFollowing = async () => {
        try {
            const { data, error } = await supabase
                .from('seguimentos')
                .select('seguido_id')
                .eq('seguidor_id', user.id);

            if (error) throw error;
            setFollowing(data.map(f => f.seguido_id));
        } catch (error) {
            console.error('Erro ao carregar seguimentos:', error);
        }
    };

    const subscribeToPromotions = () => {
        const channel = supabase.channel('promotions')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'promocoes'
                },
                (payload) => {
                    fetchPromotions();
                }
            )
            .subscribe();
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDiscount = (discount) => {
        return `${discount}% de desconto`;
    };

    return (
        <div className="promotions-container">
            <h1>Promoções</h1>

            {loading ? (
                <div>Carregando...</div>
            ) : promotions.length === 0 ? (
                <div>Nenhuma promoção disponível</div>
            ) : (
                <div className="promotions-grid">
                    {promotions.map((promotion) => (
                        <div key={promotion.id} className="promotion-card">
                            <div className="promotion-header">
                                <img
                                    src={promotion.foto_perfil_url}
                                    alt={promotion.nome_completo}
                                    className="profile-picture"
                                />
                                <div className="promotion-info">
                                    <h3>{promotion.nome_completo}</h3>
                                    <span className="specialty">{promotion.especialidade}</span>
                                </div>
                            </div>

                            <div className="promotion-content">
                                <h4>{promotion.titulo}</h4>
                                <p>{promotion.descricao}</p>

                                <div className="promotion-details">
                                    <div className="price-info">
                                        <span className="original-price">
                                            {formatCurrency(promotion.valor_original)}
                                        </span>
                                        <span className="discount">
                                            {formatDiscount(promotion.desconto)}
                                        </span>
                                        <span className="final-price">
                                            {formatCurrency(
                                                promotion.valor_original * 
                                                (1 - promotion.desconto / 100)
                                            )}
                                        </span>
                                    </div>

                                    <div className="dates">
                                        <span className="start-date">
                                            Início: {new Date(promotion.data_inicio).toLocaleDateString('pt-BR')}
                                        </span>
                                        <span className="end-date">
                                            Término: {new Date(promotion.data_fim).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => {
                                        // Adicionar ao calendário
                                        window.location.href = `webcal://${window.location.origin}/promotion/${promotion.id}`;
                                    }}
                                >
                                    Adicionar ao Calendário
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .promotions-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .promotions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .promotion-card {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .promotion-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 15px;
                }

                .profile-picture {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .promotion-info {
                    display: flex;
                    flex-direction: column;
                }

                .promotion-info h3 {
                    margin: 0;
                    font-size: 18px;
                    color: #333;
                }

                .specialty {
                    font-size: 14px;
                    color: #666;
                    margin-top: 5px;
                }

                .promotion-content {
                    margin-top: 15px;
                }

                .promotion-content h4 {
                    margin: 0 0 10px 0;
                    color: #4CAF50;
                }

                .promotion-content p {
                    margin: 0 0 15px 0;
                    color: #666;
                }

                .price-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .original-price {
                    text-decoration: line-through;
                    color: #999;
                }

                .discount {
                    background: #4CAF50;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-weight: bold;
                }

                .final-price {
                    color: #4CAF50;
                    font-weight: bold;
                }

                .dates {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    font-size: 14px;
                    color: #666;
                }

                button {
                    width: 100%;
                    padding: 10px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.3s;
                }

                button:hover {
                    background: #45a049;
                }

                @media (max-width: 768px) {
                    .promotions-grid {
                        grid-template-columns: 1fr;
                    }

                    .promotion-card {
                        padding: 15px;
                    }

                    .profile-picture {
                        width: 50px;
                        height: 50px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Promotions;

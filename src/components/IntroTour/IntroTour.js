import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';

const IntroTour = () => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [showTour, setShowTour] = useState(false);
    const [hasCompletedTour, setHasCompletedTour] = useState(false);

    // Passos do tour
    const tourSteps = [
        {
            title: "Bem-vindo ao Cuide-se!",
            description: "Este tour vai te ajudar a explorar as principais funcionalidades do app.",
            target: "header-logo"
        },
        {
            title: "Agendamento de Serviços",
            description: "Aqui você pode encontrar e agendar serviços com profissionais qualificados.",
            target: "services-tab"
        },
        {
            title: "Promoções e Eventos",
            description: "Fique por dentro das melhores promoções e eventos dos profissionais que você segue.",
            target: "promotions-tab"
        },
        {
            title: "Seguindo Profissionais",
            description: "Siga seus profissionais favoritos para receber notificações sobre novidades e promoções.",
            target: "following-tab"
        },
        {
            title: "Calendário de Eventos",
            description: "Organize seus compromissos e adicione eventos ao seu calendário pessoal.",
            target: "calendar-tab"
        },
        {
            title: "Siga-nos nas Redes Sociais!",
            description: "Conecte-se conosco nas redes sociais para ficar por dentro de novidades e promoções especiais!",
            socialLinks: {
                instagram: "https://instagram.com/cuide-se",
                facebook: "https://facebook.com/cuide-se",
                whatsapp: "https://wa.me/5511999999999"
            }
        }
    ];

    useEffect(() => {
        checkTourStatus();
    }, []);

    const checkTourStatus = async () => {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('completou_tutorial')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            setHasCompletedTour(data.completou_tutorial);
            setShowTour(!data.completou_tutorial);
        } catch (error) {
            console.error('Erro ao verificar status do tour:', error);
        }
    };

    const markTourAsCompleted = async () => {
        try {
            const { error } = await supabase
                .from('usuarios')
                .update({ completou_tutorial: true })
                .eq('id', user.id);

            if (error) throw error;
            setHasCompletedTour(true);
            setShowTour(false);
        } catch (error) {
            console.error('Erro ao marcar tour como completo:', error);
        }
    };

    const nextStep = () => {
        setCurrentStep((prev) => {
            if (prev === tourSteps.length - 1) {
                markTourAsCompleted();
                return prev;
            }
            return prev + 1;
        });
    };

    const previousStep = () => {
        setCurrentStep((prev) => Math.max(0, prev - 1));
    };

    const renderSocialLinks = () => {
        const { socialLinks } = tourSteps[currentStep];
        return (
            <div className="social-links">
                <h4>Conecte-se conosco:</h4>
                <div className="links-container">
                    <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link instagram"
                    >
                        Instagram
                    </a>
                    <a
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link facebook"
                    >
                        Facebook
                    </a>
                    <a
                        href={socialLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link whatsapp"
                    >
                        WhatsApp
                    </a>
                </div>
            </div>
        );
    };

    if (!showTour || hasCompletedTour) return null;

    return (
        <div className="intro-tour">
            <div className="tour-step">
                <div className="step-indicator">
                    Passo {currentStep + 1} de {tourSteps.length}
                </div>

                <div className="tour-content">
                    <h2>{tourSteps[currentStep].title}</h2>
                    <p>{tourSteps[currentStep].description}</p>

                    {tourSteps[currentStep].socialLinks && renderSocialLinks()}

                    <div className="tour-actions">
                        <button
                            onClick={previousStep}
                            disabled={currentStep === 0}
                            className="secondary"
                        >
                            Anterior
                        </button>
                        <button onClick={nextStep}>
                            {currentStep === tourSteps.length - 1 ? 'Finalizar' : 'Próximo'}
                        </button>
                    </div>
                </div>

                <button
                    className="skip-tour"
                    onClick={() => {
                        markTourAsCompleted();
                        setShowTour(false);
                    }}
                >
                    Pular Tour
                </button>
            </div>

            <style jsx>{`
                .intro-tour {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .tour-step {
                    background: white;
                    padding: 25px;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 90%;
                    position: relative;
                }

                .step-indicator {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #4CAF50;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                }

                .tour-content {
                    text-align: center;
                }

                .tour-content h2 {
                    margin: 0 0 15px 0;
                    color: #333;
                }

                .tour-content p {
                    margin: 0 0 20px 0;
                    color: #666;
                }

                .social-links {
                    margin: 20px 0;
                }

                .links-container {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .social-link {
                    padding: 8px 15px;
                    border-radius: 4px;
                    color: white;
                    text-decoration: none;
                    transition: opacity 0.3s;
                }

                .social-link:hover {
                    opacity: 0.9;
                }

                .social-link.instagram {
                    background: #E1306C;
                }

                .social-link.facebook {
                    background: #1877F2;
                }

                .social-link.whatsapp {
                    background: #25D366;
                }

                .tour-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                .tour-actions button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .tour-actions button.secondary {
                    background: #f8f9fa;
                    color: #333;
                }

                .tour-actions button:not(.secondary) {
                    background: #4CAF50;
                    color: white;
                }

                .skip-tour {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: #4CAF50;
                    font-size: 14px;
                    cursor: pointer;
                    padding: 5px 10px;
                }

                @media (max-width: 768px) {
                    .tour-step {
                        padding: 15px;
                    }

                    .tour-content h2 {
                        font-size: 20px;
                    }

                    .tour-content p {
                        font-size: 14px;
                    }

                    .tour-actions button {
                        padding: 8px 15px;
                    }
                }
            `}</style>
        </div>
    );
};

export default IntroTour;

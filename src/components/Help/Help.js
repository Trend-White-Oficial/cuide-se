import React, { useState, useEffect } from 'react';
import { apiFAQ, apiTutoriais } from '../../api/help';

const Help = () => {
    const [faqs, setFaqs] = useState([]);
    const [tutoriais, setTutoriais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTutorial, setCurrentTutorial] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchFAQs();
        fetchTutoriais();
    }, []);

    const fetchFAQs = async () => {
        try {
            const { data, error } = await apiFAQ.listFAQs();
            if (error) throw error;
            setFaqs(data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar FAQ:', error);
            setLoading(false);
        }
    };

    const fetchTutoriais = async () => {
        try {
            const { data, error } = await apiTutoriais.listTutoriais();
            if (error) throw error;
            setTutoriais(data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar tutoriais:', error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredFaqs = faqs.filter(faq =>
        faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.resposta.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTutoriais = tutoriais.filter(tutorial =>
        tutorial.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openTutorial = (tutorial) => {
        setCurrentTutorial(tutorial);
        setShowModal(true);
    };

    const closeModal = () => {
        setCurrentTutorial(null);
        setShowModal(false);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="help-container">
            <div className="help-header">
                <h1>Ajuda e Suporte</h1>
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="help-content">
                <section className="faq-section">
                    <h2>Perguntas Frequentes</h2>
                    <div className="faqs-list">
                        {filteredFaqs.map((faq) => (
                            <div key={faq.id} className="faq-item">
                                <h3>{faq.pergunta}</h3>
                                <p>{faq.resposta}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="tutorials-section">
                    <h2>Tutoriais</h2>
                    <div className="tutorials-grid">
                        {filteredTutoriais.map((tutorial) => (
                            <div key={tutorial.id} className="tutorial-card" onClick={() => openTutorial(tutorial)}>
                                <h3>{tutorial.titulo}</h3>
                                <p>{tutorial.descricao}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {showModal && currentTutorial && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>×</button>
                        <h2>{currentTutorial.titulo}</h2>
                        <div className="tutorial-content">
                            <div className="tutorial-description">
                                {currentTutorial.descricao}
                            </div>
                            {currentTutorial.video_url && (
                                <div className="tutorial-video">
                                    <iframe
                                        src={currentTutorial.video_url}
                                        title={currentTutorial.titulo}
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .help-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .help-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .help-header h1 {
                    margin: 0;
                    color: #333;
                }

                .help-header input {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    width: 300px;
                }

                .help-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                }

                .faq-section, .tutorials-section {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .faqs-list {
                    margin-top: 20px;
                }

                .faq-item {
                    margin-bottom: 20px;
                    padding: 15px;
                    border: 1px solid #eee;
                    border-radius: 4px;
                }

                .faq-item h3 {
                    margin: 0 0 10px 0;
                    color: #4CAF50;
                }

                .tutorials-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .tutorial-card {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.3s;
                }

                .tutorial-card:hover {
                    transform: translateY(-5px);
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    max-width: 800px;
                    width: 90%;
                    position: relative;
                }

                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #f44336;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 24px;
                }

                .tutorial-content {
                    margin-top: 20px;
                }

                .tutorial-description {
                    margin-bottom: 20px;
                }

                .tutorial-video {
                    margin-top: 20px;
                }

                .tutorial-video iframe {
                    width: 100%;
                    height: 400px;
                    border: none;
                }

                @media (max-width: 768px) {
                    .help-content {
                        grid-template-columns: 1fr;
                    }

                    .help-header input {
                        width: 100%;
                    }

                    .modal-content {
                        width: 95%;
                        margin: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Help;

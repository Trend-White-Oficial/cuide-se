import React, { useState } from 'react';

const FAQ = () => {
    const [activeQuestion, setActiveQuestion] = useState(null);

    const faqs = [
        {
            question: "Como funciona o agendamento de serviços?",
            answer: "Para agendar um serviço, basta selecionar o profissional desejado, escolher o serviço e a data/hora disponível. Após confirmar, você receberá as informações de pagamento e o agendamento será confirmado após o pagamento ser processado."
        },
        {
            question: "Posso cancelar um agendamento?",
            answer: "Sim, você pode cancelar um agendamento com até 24 horas de antecedência. Após esse período, o cancelamento pode resultar em multa de acordo com a política do profissional."
        },
        {
            question: "Como funciona o sistema de avaliações?",
            answer: "Após receber o serviço, você poderá avaliar o profissional com uma nota de 1 a 5 estrelas e deixar um comentário sobre sua experiência. As avaliações ajudam outros usuários a fazerem melhores escolhas."
        },
        {
            question: "Quais formas de pagamento são aceitas?",
            answer: "Aceitamos pagamentos via cartão de crédito, débito e PIX. O pagamento é processado diretamente no momento do agendamento para garantir a disponibilidade do horário."
        },
        {
            question: "Como funciona o sistema de promoções?",
            answer: "Profissionais podem oferecer promoções especiais que aparecem em seu feed. Você pode seguir profissionais para receber notificações sobre suas promoções e adicionar eventos ao seu calendário."
        },
        {
            question: "Como funciona o sistema de seguimento?",
            answer: "Você pode seguir profissionais para receber notificações sobre suas novas promoções e serviços. Quando você seguir alguém, eles também receberão uma notificação."
        },
        {
            question: "Como faço para reportar um problema?",
            answer: "Caso encontre algum problema ou fraude, você pode usar o botão de reportar disponível em todas as páginas. Seu relatório será analisado pela nossa equipe e você receberá feedback sobre o resultado."
        },
        {
            question: "Como funciona o sistema de níveis de cliente?",
            answer: "O sistema de níveis é uma forma de reconhecer e recompensar clientes frequentes. Quanto mais serviços você contratar, mais pontos você acumula e mais benefícios você recebe. Os níveis são administrativos e não visíveis aos usuários comuns."
        }
    ];

    return (
        <div className="faq-container">
            <h1>Perguntas Frequentes</h1>

            <div className="faq-categories">
                <button className="active">Geral</button>
                <button>Agendamento</button>
                <button>Pagamentos</button>
                <button>Segurança</button>
            </div>

            <div className="faq-list">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`faq-item ${activeQuestion === index ? 'active' : ''}`}
                        onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                    >
                        <div className="faq-question">
                            <h3>{faq.question}</h3>
                            <span className="arrow">{activeQuestion === index ? '▼' : '▶'}</span>
                        </div>
                        <div className="faq-answer">{faq.answer}</div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .faq-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .faq-categories {
                    display: flex;
                    gap: 10px;
                    margin: 20px 0;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }

                .faq-categories button {
                    padding: 8px 15px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 14px;
                    color: #666;
                }

                .faq-categories button.active {
                    color: #4CAF50;
                    border-bottom: 2px solid #4CAF50;
                }

                .faq-list {
                    margin-top: 20px;
                }

                .faq-item {
                    border: 1px solid #eee;
                    border-radius: 4px;
                    margin-bottom: 10px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .faq-item.active {
                    border-color: #4CAF50;
                }

                .faq-question {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    background: #f8f9fa;
                    cursor: pointer;
                }

                .faq-question h3 {
                    margin: 0;
                    font-size: 16px;
                }

                .arrow {
                    transition: transform 0.3s ease;
                }

                .faq-item.active .arrow {
                    transform: rotate(90deg);
                }

                .faq-answer {
                    padding: 15px;
                    display: none;
                    background: white;
                }

                .faq-item.active .faq-answer {
                    display: block;
                }

                @media (max-width: 768px) {
                    .faq-container {
                        padding: 15px;
                    }

                    .faq-categories {
                        flex-wrap: wrap;
                    }

                    .faq-categories button {
                        padding: 6px 12px;
                    }

                    .faq-question h3 {
                        font-size: 15px;
                    }
                }
            `}</style>
        </div>
    );
};

export default FAQ;

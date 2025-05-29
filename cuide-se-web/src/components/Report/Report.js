import React, { useState } from 'react';
import { apiRelatorios } from '../../api/report';
import { useAuth } from '../../contexts/AuthContext';

const Report = () => {
    const { user } = useAuth();
    const [report, setReport] = useState({
        tipo: 'erro',
        titulo: '',
        descricao: '',
        evidencia: null
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('tipo', report.tipo);
            formData.append('titulo', report.titulo);
            formData.append('descricao', report.descricao);
            if (report.evidencia) {
                formData.append('evidencia', report.evidencia);
            }

            const { error } = await apiRelatorios.createReport(formData);
            if (error) throw error;

            // Limpar formulário após envio bem-sucedido
            setReport({
                tipo: 'erro',
                titulo: '',
                descricao: '',
                evidencia: null
            });

            alert('Relatório enviado com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar relatório:', error);
            alert('Erro ao enviar relatório. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="report-container">
            <form onSubmit={handleSubmit} className="report-form">
                <h2>Enviar Relatório</h2>
                
                <div className="form-group">
                    <label>Tipo de Relatório</label>
                    <select
                        value={report.tipo}
                        onChange={(e) => setReport({ ...report, tipo: e.target.value })}
                        required
                    >
                        <option value="erro">Erro</option>
                        <option value="bug">Bug</option>
                        <option value="fraude">Fraude</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Título</label>
                    <input
                        type="text"
                        value={report.titulo}
                        onChange={(e) => setReport({ ...report, titulo: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                        value={report.descricao}
                        onChange={(e) => setReport({ ...report, descricao: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Evidência (opcional)</label>
                    <input
                        type="file"
                        onChange={(e) => setReport({ ...report, evidencia: e.target.files[0] })}
                        accept="image/*,.pdf,.txt"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Relatório'}
                </button>
            </form>

            <style jsx>{`
                .report-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                }

                .report-form {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    width: 300px;
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
                select,
                textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                }

                textarea {
                    height: 100px;
                    resize: vertical;
                }

                button {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 10px 20px;
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
                    .report-container {
                        width: 100%;
                        bottom: 0;
                        right: 0;
                        left: 0;
                        padding: 10px;
                    }

                    .report-form {
                        width: 100%;
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Report;

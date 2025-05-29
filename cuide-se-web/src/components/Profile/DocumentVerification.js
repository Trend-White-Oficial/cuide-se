import React, { useState, useEffect } from 'react';
import { apiDocumentos } from '../../api/financial';
import { useAuth } from '../../contexts/AuthContext';

const DocumentVerification = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newDocument, setNewDocument] = useState({
        tipo_documento: 'cpf',
        arquivo_front: null,
        arquivo_back: null
    });

    useEffect(() => {
        fetchDocuments();
    }, [user]);

    const fetchDocuments = async () => {
        try {
            const { data, error } = await apiDocumentos.listDocuments(user.id);
            if (error) throw error;
            setDocuments(data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar documentos:', error);
            setLoading(false);
        }
    };

    const handleDocumentUpload = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('file', newDocument.arquivo_front);

            const { data: frontData, error: frontError } = await apiDocumentos.uploadDocument(
                user.id,
                newDocument.tipo_documento,
                formData,
                true
            );

            if (frontError) throw frontError;

            if (newDocument.arquivo_back) {
                const formDataBack = new FormData();
                formDataBack.append('file', newDocument.arquivo_back);

                const { data: backData, error: backError } = await apiDocumentos.uploadDocument(
                    user.id,
                    newDocument.tipo_documento,
                    formDataBack,
                    false
                );

                if (backError) throw backError;
            }

            setNewDocument({
                tipo_documento: 'cpf',
                arquivo_front: null,
                arquivo_back: null
            });
            fetchDocuments();
        } catch (error) {
            console.error('Erro ao enviar documento:', error);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="document-verification">
            <section className="document-upload">
                <h2>Enviar Documentos</h2>
                <form onSubmit={handleDocumentUpload}>
                    <div className="form-group">
                        <label>Tipo de Documento</label>
                        <select
                            value={newDocument.tipo_documento}
                            onChange={(e) => setNewDocument({ ...newDocument, tipo_documento: e.target.value })}
                        >
                            <option value="cpf">CPF</option>
                            <option value="cnpj">CNPJ</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Documento (Frente)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewDocument({ ...newDocument, arquivo_front: e.target.files[0] })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Documento (Verso)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewDocument({ ...newDocument, arquivo_back: e.target.files[0] })}
                        />
                    </div>
                    <button type="submit">Enviar Documento</button>
                </form>
            </section>

            <section className="documents-list">
                <h2>Documentos Enviados</h2>
                <div className="documents-grid">
                    {documents.map((document) => (
                        <div key={document.id} className="document-item">
                            <div className="document-info">
                                <div className="document-type">
                                    <strong>Tipo:</strong> {document.tipo_documento.toUpperCase()}
                                </div>
                                <div className="document-status">
                                    <strong>Status:</strong> {document.status_verificacao}
                                </div>
                                <div className="document-actions">
                                    {document.documento_front_url && (
                                        <a href={document.documento_front_url} target="_blank" rel="noopener noreferrer">
                                            Ver Frente
                                        </a>
                                    )}
                                    {document.documento_back_url && (
                                        <a href={document.documento_back_url} target="_blank" rel="noopener noreferrer">
                                            Ver Verso
                                        </a>
                                    )}
                                </div>
                            </div>
                            {document.observacoes && (
                                <div className="document-notes">
                                    <strong>Observações:</strong> {document.observacoes}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <style jsx>{`
                .document-verification {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .document-upload, .documents-list {
                    margin-bottom: 30px;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
                .form-group select {
                    width: 100%;
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

                .documents-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .document-item {
                    padding: 15px;
                    border: 1px solid #eee;
                    border-radius: 4px;
                }

                .document-info {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .document-type, .document-status {
                    padding: 5px;
                    border-radius: 4px;
                }

                .document-type {
                    background: #f8f9fa;
                }

                .document-status {
                    background: #fff3cd;
                }

                .document-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }

                .document-actions a {
                    color: #4CAF50;
                    text-decoration: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    transition: color 0.3s;
                }

                .document-actions a:hover {
                    color: #45a049;
                }

                .document-notes {
                    margin-top: 10px;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 4px;
                }

                @media (max-width: 768px) {
                    .documents-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default DocumentVerification;

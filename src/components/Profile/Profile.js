import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ClientProfile from './ClientProfile';
import ProfessionalProfile from './ProfessionalProfile';
import FinancialProfile from './FinancialProfile';
import DocumentVerification from './DocumentVerification';
import ProfileDeletion from './ProfileDeletion';

const Profile = () => {
    const { user } = useAuth();

    // Determinar se é cliente ou profissional
    const isProfessional = user?.metadata?.tipo_usuario === 'profissional';

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-section">
                    {isProfessional ? (
                        <ProfessionalProfile />
                    ) : (
                        <ClientProfile />
                    )}
                </div>

                {isProfessional && (
                    <>
                        <div className="profile-section">
                            <DocumentVerification />
                        </div>
                        <div className="profile-section">
                            <FinancialProfile />
                        </div>
                    </>
                )}

                <div className="profile-section">
                    <ProfileDeletion />
                </div>
            </div>

            <style jsx>{`
                .profile-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .profile-content {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 30px;
                }

                .profile-section {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                @media (max-width: 768px) {
                    .profile-container {
                        padding: 10px;
                    }

                    .profile-content {
                        gap: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;

import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from './LoadingSpinner';

// Componentes carregados sob demanda
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
const ChartComponent = React.lazy(() => import('./ChartComponent'));
const MapComponent = React.lazy(() => import('./MapComponent'));

const LazyLoadedComponent = ({ type, data }) => {
  const { t } = useTranslation();

  const renderComponent = () => {
    switch (type) {
      case 'chart':
        return <ChartComponent data={data} />;
      case 'map':
        return <MapComponent data={data} />;
      case 'heavy':
        return <HeavyComponent data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="lazy-loaded-container">
      <Suspense fallback={<LoadingSpinner message={t('common.loading')} />}>
        {renderComponent()}
      </Suspense>
    </div>
  );
};

export default LazyLoadedComponent; 
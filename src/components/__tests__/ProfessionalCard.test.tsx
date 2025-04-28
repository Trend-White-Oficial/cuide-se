import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfessionalCard from '../ProfessionalCard';

describe('ProfessionalCard', () => {
  it('should render the professional card correctly', () => {
    const professional = {
      id: '1',
      name: 'John Doe',
      avatar: '',
      specialties: ['Dermatology'],
      rating: 4.5,
      totalReviews: 10,
      address: { city: 'New York', state: 'NY' },
      description: 'Experienced dermatologist specializing in skin care.',
    };

    const { getByText } = render(
      <BrowserRouter>
        <ProfessionalCard professional={professional} />
      </BrowserRouter>
    );

    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('Dermatology')).toBeInTheDocument();
    expect(getByText('4.5')).toBeInTheDocument();
    expect(getByText('(10 avaliações)')).toBeInTheDocument();
    expect(getByText('New York, NY')).toBeInTheDocument();
    expect(getByText('Experienced dermatologist specializing in skin care.')).toBeInTheDocument();
  });
});
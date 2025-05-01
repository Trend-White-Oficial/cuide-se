export const mockProfessional = {
  id: '1',
  name: 'Dr. João Silva',
  specialty: 'Cardiologista',
  rating: 4.5,
  reviewsCount: 123,
  bio: 'Médico especialista em cardiologia com mais de 10 anos de experiência.',
  availability: [
    { day: 'Monday', hours: ['08:00', '12:00', '14:00', '18:00'] },
    { day: 'Tuesday', hours: ['08:00', '12:00', '14:00', '18:00'] },
  ],
  services: [
    { id: '1', name: 'Consulta de rotina', price: 300 },
    { id: '2', name: 'Consulta de retorno', price: 200 },
  ],
  location: {
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zip: '01234-567'
  },
  contact: {
    phone: '(11) 99999-9999',
    email: 'dr.joao@example.com'
  },
  photoUrl: 'https://example.com/doctor-photo.jpg'
};

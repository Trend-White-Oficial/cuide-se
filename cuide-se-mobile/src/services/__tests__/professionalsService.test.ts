import { professionalsService } from '../api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ProfessionalsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfessionals', () => {
    it('deve buscar profissionais com sucesso', async () => {
      const mockProfessionals = [
        {
          id: '1',
          name: 'Dr. João Silva',
          specialty: 'Psicólogo',
          rating: 4.5,
          reviewCount: 32,
          price: 150
        },
        {
          id: '2',
          name: 'Dra. Maria Santos',
          specialty: 'Nutricionista',
          rating: 4.8,
          reviewCount: 45,
          price: 180
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockProfessionals });

      const response = await professionalsService.getProfessionals();

      expect(response.data).toEqual(mockProfessionals);
      expect(mockedAxios.get).toHaveBeenCalledWith('/professionals');
    });

    it('deve buscar profissionais com filtros', async () => {
      const mockProfessionals = [
        {
          id: '1',
          name: 'Dr. João Silva',
          specialty: 'Psicólogo',
          rating: 4.5,
          reviewCount: 32,
          price: 150
        }
      ];

      const filters = {
        specialty: 'Psicólogo',
        minRating: 4,
        maxPrice: 200
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockProfessionals });

      const response = await professionalsService.getProfessionals(filters);

      expect(response.data).toEqual(mockProfessionals);
      expect(mockedAxios.get).toHaveBeenCalledWith('/professionals', {
        params: filters
      });
    });

    it('deve lidar com erro na busca de profissionais', async () => {
      const errorMessage = 'Erro ao buscar profissionais';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(professionalsService.getProfessionals())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getProfessionalById', () => {
    it('deve buscar um profissional por ID com sucesso', async () => {
      const mockProfessional = {
        id: '1',
        name: 'Dr. João Silva',
        specialty: 'Psicólogo',
        rating: 4.5,
        reviewCount: 32,
        price: 150
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockProfessional });

      const response = await professionalsService.getProfessionalById('1');

      expect(response.data).toEqual(mockProfessional);
      expect(mockedAxios.get).toHaveBeenCalledWith('/professionals/1');
    });

    it('deve lidar com erro na busca de profissional por ID', async () => {
      const errorMessage = 'Profissional não encontrado';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(professionalsService.getProfessionalById('999'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('searchProfessionals', () => {
    it('deve buscar profissionais por termo de pesquisa', async () => {
      const mockProfessionals = [
        {
          id: '1',
          name: 'Dr. João Silva',
          specialty: 'Psicólogo',
          rating: 4.5,
          reviewCount: 32,
          price: 150
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockProfessionals });

      const response = await professionalsService.searchProfessionals('João');

      expect(response.data).toEqual(mockProfessionals);
      expect(mockedAxios.get).toHaveBeenCalledWith('/professionals/search', {
        params: { query: 'João' }
      });
    });

    it('deve lidar com erro na pesquisa de profissionais', async () => {
      const errorMessage = 'Erro na pesquisa';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(professionalsService.searchProfessionals('teste'))
        .rejects.toThrow(errorMessage);
    });
  });
}); 
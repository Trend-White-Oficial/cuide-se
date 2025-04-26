import { servicesService } from '../api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ServicesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getServices', () => {
    it('deve buscar serviços com sucesso', async () => {
      const mockServices = [
        {
          id: '1',
          professionalId: '1',
          name: 'Consulta Psicológica',
          description: 'Sessão de terapia individual',
          duration: 60,
          price: 150,
          category: 'Psicologia'
        },
        {
          id: '2',
          professionalId: '1',
          name: 'Avaliação Psicológica',
          description: 'Avaliação completa com testes',
          duration: 90,
          price: 200,
          category: 'Psicologia'
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockServices });

      const response = await servicesService.getServices('1');

      expect(response.data).toEqual(mockServices);
      expect(mockedAxios.get).toHaveBeenCalledWith('/professionals/1/services');
    });

    it('deve lidar com erro na busca de serviços', async () => {
      const errorMessage = 'Erro ao buscar serviços';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(servicesService.getServices('1'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getServiceById', () => {
    it('deve buscar um serviço por ID com sucesso', async () => {
      const mockService = {
        id: '1',
        professionalId: '1',
        name: 'Consulta Psicológica',
        description: 'Sessão de terapia individual',
        duration: 60,
        price: 150,
        category: 'Psicologia'
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockService });

      const response = await servicesService.getServiceById('1', '1');

      expect(response.data).toEqual(mockService);
      expect(mockedAxios.get).toHaveBeenCalledWith('/professionals/1/services/1');
    });

    it('deve lidar com erro na busca de serviço por ID', async () => {
      const errorMessage = 'Serviço não encontrado';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(servicesService.getServiceById('1', '999'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('createService', () => {
    it('deve criar um serviço com sucesso', async () => {
      const mockService = {
        id: '1',
        professionalId: '1',
        name: 'Consulta Psicológica',
        description: 'Sessão de terapia individual',
        duration: 60,
        price: 150,
        category: 'Psicologia'
      };

      const serviceData = {
        name: 'Consulta Psicológica',
        description: 'Sessão de terapia individual',
        duration: 60,
        price: 150,
        category: 'Psicologia'
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockService });

      const response = await servicesService.createService('1', serviceData);

      expect(response.data).toEqual(mockService);
      expect(mockedAxios.post).toHaveBeenCalledWith('/professionals/1/services', serviceData);
    });

    it('deve lidar com erro na criação de serviço', async () => {
      const errorMessage = 'Erro ao criar serviço';
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      const serviceData = {
        name: 'Consulta Psicológica',
        description: 'Sessão de terapia individual',
        duration: 60,
        price: 150,
        category: 'Psicologia'
      };

      await expect(servicesService.createService('1', serviceData))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('updateService', () => {
    it('deve atualizar um serviço com sucesso', async () => {
      const mockService = {
        id: '1',
        professionalId: '1',
        name: 'Consulta Psicológica Atualizada',
        description: 'Sessão de terapia individual atualizada',
        duration: 90,
        price: 180,
        category: 'Psicologia'
      };

      const serviceData = {
        name: 'Consulta Psicológica Atualizada',
        description: 'Sessão de terapia individual atualizada',
        duration: 90,
        price: 180
      };

      mockedAxios.put.mockResolvedValueOnce({ data: mockService });

      const response = await servicesService.updateService('1', '1', serviceData);

      expect(response.data).toEqual(mockService);
      expect(mockedAxios.put).toHaveBeenCalledWith('/professionals/1/services/1', serviceData);
    });

    it('deve lidar com erro na atualização de serviço', async () => {
      const errorMessage = 'Erro ao atualizar serviço';
      mockedAxios.put.mockRejectedValueOnce(new Error(errorMessage));

      const serviceData = {
        name: 'Consulta Psicológica Atualizada',
        description: 'Sessão de terapia individual atualizada',
        duration: 90,
        price: 180
      };

      await expect(servicesService.updateService('1', '1', serviceData))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('deleteService', () => {
    it('deve deletar um serviço com sucesso', async () => {
      const mockResponse = { data: { message: 'Serviço deletado com sucesso' } };
      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      const response = await servicesService.deleteService('1', '1');

      expect(response).toEqual(mockResponse);
      expect(mockedAxios.delete).toHaveBeenCalledWith('/professionals/1/services/1');
    });

    it('deve lidar com erro na deleção de serviço', async () => {
      const errorMessage = 'Erro ao deletar serviço';
      mockedAxios.delete.mockRejectedValueOnce(new Error(errorMessage));

      await expect(servicesService.deleteService('1', '1'))
        .rejects.toThrow(errorMessage);
    });
  });
}); 
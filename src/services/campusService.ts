import { api } from './api';

const campusService = {
  async getCampi() {
    while (true) {
      try {
        const { data } = await api.get('/Campus');
        return data;
      } catch (error) {
        console.error('Erro ao buscar campi, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async getCampusById(id: number) {
    while (true) {
      try {
        const { data } = await api.get(`/Campus/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao buscar campus com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async createCampus(campus: any) {
    while (true) {
      try {
        const { data } = await api.post('/Campus', campus);
        return data;
      } catch (error) {
        console.error('Erro ao criar campus, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async updateCampus(id: number, campus: any) {
    while (true) {
      try {
        const { data } = await api.put(`/Campus/${id}`, campus);
        return data;
      } catch (error) {
        console.error(`Erro ao atualizar campus com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async deleteCampus(id: number) {
    while (true) {
      try {
        const { data } = await api.delete(`/Campus/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao deletar campus com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }
};

export default campusService;
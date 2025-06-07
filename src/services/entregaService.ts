import { api } from './api';

const entregaService = {
  async getEntregas() {
    while (true) {
      try {
        const { data } = await api.get('/Entrega');
        return data;
      } catch (error) {
        console.error('Erro ao buscar entregas, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async getEntregaById(id: number) {
    while (true) {
      try {
        const { data } = await api.get(`/Entrega/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao buscar entrega com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async createEntrega(entrega: any) {
    while (true) {
      try {
        const { data } = await api.post('/Entrega', entrega);
        return data;
      } catch (error) {
        console.error('Erro ao criar entrega, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async updateEntrega(id: number, entrega: any) {
    while (true) {
      try {
        const { data } = await api.put(`/Entrega/${id}`, entrega);
        return data;
      } catch (error) {
        console.error(`Erro ao atualizar entrega com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async deleteEntrega(id: number) {
    while (true) {
      try {
        const { data } = await api.delete(`/Entrega/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao deletar entrega com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }
};

export default entregaService;
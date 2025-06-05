import { api } from './api';

const entregadorService = {
  async getEntregadores() {
    while (true) {
      try {
        const { data } = await api.get('/Entregador');
        return data;
      } catch (error) {
        console.error('Erro ao buscar entregadores, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async getEntregadorById(id: number) {
    while (true) {
      try {
        const { data } = await api.get(`/Entregador/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao buscar entregador com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async createEntregador(entregador: any) {
    while (true) {
      try {
        const { data } = await api.post('/Entregador', entregador);
        return data;
      } catch (error) {
        console.error('Erro ao criar entregador, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async updateEntregador(id: number, entregador: any) {
    while (true) {
      try {
        const { data } = await api.put(`/Entregador/${id}`, entregador);
        return data;
      } catch (error) {
        console.error(`Erro ao atualizar entregador com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async deleteEntregador(id: number) {
    while (true) {
      try {
        const { data } = await api.delete(`/Entregador/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao deletar entregador com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }
};

export default entregadorService;
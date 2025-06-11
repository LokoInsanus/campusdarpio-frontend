import { api } from './api';

const entregadorService = {
  async getEntregadores() {
    const { data } = await api.get('/Entregador');
    return data;
  },

  async getEntregadorById(id: number) {
    const { data } = await api.get(`/Entregador/${id}`);
    return data;
  },

  async createEntregador(entregador: any) {
    const { data } = await api.post('/Entregador', entregador);
    return data;
  },

  async updateEntregador(id: number, entregador: any) {
    const { data } = await api.put(`/Entregador/${id}`, entregador);
    return data;
  },

  async deleteEntregador(id: number) {
    const { data } = await api.delete(`/Entregador/${id}`);
    return data;
  }
};

export default entregadorService;
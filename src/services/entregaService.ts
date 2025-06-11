import { api } from './api';

const entregaService = {
  async getEntregas() {
    const { data } = await api.get('/Entrega');
    return data;
  },

  async getEntregaById(id: number) {
    const { data } = await api.get(`/Entrega/${id}`);
    return data;
  },

  async createEntrega(entrega: any) {
    const { data } = await api.post('/Entrega', entrega);
    return data;
  },

  async updateEntrega(id: number, entrega: any) {
    const { data } = await api.put(`/Entrega/${id}`, entrega);
    return data;
  },

  async deleteEntrega(id: number) {
    const { data } = await api.delete(`/Entrega/${id}`);
    return data;
  }
};

export default entregaService;
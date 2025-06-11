import { api } from './api';

const blocoService = {
  async getBlocos() {
    const { data } = await api.get('/Bloco');
    return data;
  },

  async getBlocoById(id: number) {
    const { data } = await api.get(`/Bloco/${id}`);
    return data;
  },

  async createBloco(bloco: any) {
    const { data } = await api.post('/Bloco', bloco);
    return data;
  },

  async updateBloco(id: number, bloco: any) {
    const { data } = await api.put(`/Bloco/${id}`, bloco);
    return data;
  },

  async deleteBloco(id: number) {
    const { data } = await api.delete(`/Bloco/${id}`);
    return data;
  }
};

export default blocoService;
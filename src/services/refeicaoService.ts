import { api } from './api';

const refeicaoService = {
  async getRefeicoes() {
    const { data } = await api.get('/Refeicao');
    return data;
  },

  async getRefeicaoById(id: number) {
    const { data } = await api.get(`/Refeicao/${id}`);
    return data;
  },

  async createRefeicao(refeicao: any) {
    const { data } = await api.post('/Refeicao', refeicao);
    return data;
  },

  async updateRefeicao(id: number, refeicao: any) {
    const { data } = await api.put(`/Refeicao/${id}`, refeicao);
    return data;
  },

  async deleteRefeicao(id: number) {
    const { data } = await api.delete(`/Refeicao/${id}`);
    return data;
  },

  async getRefeicoesMaisPedidas(params: { campus_id?: number; bloco_id?: number; data?: string }) {
    const { data } = await api.get('/Refeicao/RefeicoesMaisPedidas', { params });
    return data;
  }
};

export default refeicaoService;
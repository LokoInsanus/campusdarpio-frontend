import { api } from './api';

const bebidaService = {
  async getBebidas() {
    const { data } = await api.get('/Bebida');
    return data;
  },

  async getBebidaById(id: number) {
    const { data } = await api.get(`/Bebida/${id}`);
    return data;
  },

  async createBebida(bebida: any) {
    const { data } = await api.post('/Bebida', bebida);
    return data;
  },

  async updateBebida(id: number, bebida: any) {
    const { data } = await api.put(`/Bebida/${id}`, bebida);
    return data;
  },

  async deleteBebida(id: number) {
    const { data } = await api.delete(`/Bebida/${id}`);
    return data;
  },

  async getBebidasMaisPedidas(campusId: number, blocoId: number, dataFiltro: string) {
    const { data } = await api.get(`/Bebida/BebidasMaisPedidas/${campusId}/${blocoId}/${dataFiltro}`);
    return data;
  }
}

export default bebidaService;
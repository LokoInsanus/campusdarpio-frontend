import { api } from './api';

const cardapioService = {
  async getCardapios() {
    const { data } = await api.get('/Cardapio');
    return data;
  },

  async getCardapioById(id: number) {
    const { data } = await api.get(`/Cardapio/${id}`);
    return data;
  },

  async createCardapio(cardapio: any) {
    const { data } = await api.post('/Cardapio', cardapio);
    return data;
  },

  async updateCardapio(id: number, cardapio: any) {
    const { data } = await api.put(`/Cardapio/${id}`, cardapio);
    return data;
  },

  async deleteCardapio(id: number) {
    const { data } = await api.delete(`/Cardapio/${id}`);
    return data;
  }
};

export default cardapioService;
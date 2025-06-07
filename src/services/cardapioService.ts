import { api } from './api';

const cardapioService = {
  async getCardapios() {
    while (true) {
      try {
        const { data } = await api.get('/Cardapio');
        return data;
      } catch (error) {
        console.error('Erro ao buscar cardapios, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async getCardapioById(id: number) {
    while (true) {
      try {
        const { data } = await api.get(`/Cardapio/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao buscar cardapio com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async createCardapio(cardapio: any) {
    while (true) {
      try {
        const { data } = await api.post('/Cardapio', cardapio);
        return data;
      } catch (error) {
        console.error('Erro ao criar cardapio, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async updateCardapio(id: number, cardapio: any) {
    while (true) {
      try {
        const { data } = await api.put(`/Cardapio/${id}`, cardapio);
        return data;
      } catch (error) {
        console.error(`Erro ao atualizar cardapio com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async deleteCardapio(id: number) {
    while (true) {
      try {
        const { data } = await api.delete(`/Cardapio/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao deletar cardapio com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }
};

export default cardapioService;
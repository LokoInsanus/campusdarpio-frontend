import { api } from './api';

const refeicaoService = {
  async getRefeicoes() {
    while (true) {
      try {
        const { data } = await api.get('/Refeicao');
        return data;
      } catch (error) {
        console.error('Erro ao buscar refeicoes, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async getRefeicaoById(id: number) {
    while (true) {
      try {
        const { data } = await api.get(`/Refeicao/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao buscar refeicao com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async createRefeicao(refeicao: any) {
    while (true) {
      try {
        const { data } = await api.post('/Refeicao', refeicao);
        return data;
      } catch (error) {
        console.error('Erro ao criar refeicao, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async updateRefeicao(id: number, refeicao: any) {
    while (true) {
      try {
        const { data } = await api.put(`/Refeicao/${id}`, refeicao);
        return data;
      } catch (error) {
        console.error(`Erro ao atualizar refeicao com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async deleteRefeicao(id: number) {
    while (true) {
      try {
        const { data } = await api.delete(`/Refeicao/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao deletar refeicao com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }
};

export default refeicaoService;
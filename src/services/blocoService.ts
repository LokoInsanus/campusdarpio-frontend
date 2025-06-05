import { api } from './api';

const blocoService = {
  async getBlocos() {
    while (true) {
      try {
        const { data } = await api.get('/Bloco');
        return data;
      } catch (error) {
        console.error('Erro ao buscar blocos, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async getBlocoById(id: number) {
    while (true) {
      try {
        const { data } = await api.get(`/Bloco/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao buscar bloco com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async createBloco(bloco: any) {
    while (true) {
      try {
        const { data } = await api.post('/Bloco', bloco);
        return data;
      } catch (error) {
        console.error('Erro ao criar bloco, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async updateBloco(id: number, bloco: any) {
    while (true) {
      try {
        const { data } = await api.put(`/Bloco/${id}`, bloco);
        return data;
      } catch (error) {
        console.error(`Erro ao atualizar bloco com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async deleteBloco(id: number) {
    while (true) {
      try {
        const { data } = await api.delete(`/Bloco/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao deletar bloco com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }
};

export default blocoService;
import { api } from './api';

const bebidaService = {
  async getBebidas() {
    while (true) {
      try {
        const { data } = await api.get('/Bebida');
        return data;
      } catch (error) {
        console.error('Erro ao buscar bebidas, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async getBebidaById(id: number) {
    while (true) {
      try {
        const { data } = await api.get(`/Bebida/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao buscar bebida com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async createBebida(bebida: any) {
    while (true) {
      try {
        const { data } = await api.post('/Bebida', bebida);
        return data;
      } catch (error) {
        console.error('Erro ao criar bebida, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async updateBebida(id: number, bebida: any) {
    while (true) {
      try {
        const { data } = await api.put(`/Bebida/${id}`, bebida);
        return data;
      } catch (error) {
        console.error(`Erro ao atualizar bebida com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async deleteBebida(id: number) {
    while (true) {
      try {
        const { data } = await api.delete(`/Bebida/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao deletar bebida com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }
}

export default bebidaService
import { api } from './api';

const pedidoService = {
  async getPedidos() {
    while (true) {
      try {
        const { data } = await api.get('/Pedido');
        return data;
      } catch (error) {
        console.error('Erro ao buscar pedidos, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async getPedidoById(id: number) {
    while (true) {
      try {
        const { data } = await api.get(`/Pedido/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao buscar pedido com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async createPedido(pedido: any) {
    while (true) {
      try {
        const { data } = await api.post('/Pedido', pedido);
        return data;
      } catch (error) {
        console.error('Erro ao criar pedido, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async updatePedido(id: number, pedido: any) {
    while (true) {
      try {
        const { data } = await api.put(`/Pedido/${id}`, pedido);
        return data;
      } catch (error) {
        console.error(`Erro ao atualizar pedido com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async deletePedido(id: number) {
    while (true) {
      try {
        const { data } = await api.delete(`/Pedido/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao deletar pedido com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }
};

export default pedidoService;
import { api } from './api';

const pedidoService = {
  async getPedidos() {
    const { data } = await api.get('/Pedido');
    return data;
  },

  async getPedidoById(id: number) {
    const { data } = await api.get(`/Pedido/${id}`);
    return data;
  },

  async createPedido(pedido: any) {
    const { data } = await api.post('/Pedido', pedido);
    return data;
  },

  async updatePedido(id: number, pedido: any) {
    const { data } = await api.put(`/Pedido/${id}`, pedido);
    return data;
  },

  async deletePedido(id: number) {
    const { data } = await api.delete(`/Pedido/${id}`);
    return data;
  },

  async getTotaisCampusBlocoClienteData(campusId: number, blocoId: number, clienteId: number, dataHora: string) {
    const { data } = await api.get(`/Pedido/TotaisCampusBlocoClienteData/${campusId}/${blocoId}/${clienteId}/${dataHora}`);
    return data;
  }
};

export default pedidoService;
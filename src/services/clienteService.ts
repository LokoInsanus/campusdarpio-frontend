import { api } from './api';

const clienteService = {
  async getClientes() {
    const { data } = await api.get('/Cliente');
    return data;
  },

  async getClienteById(id: number) {
    const { data } = await api.get(`/Cliente/${id}`);
    return data;
  },

  async createCliente(cliente: any) {
    const { data } = await api.post('/Cliente', cliente);
    return data;
  },

  async updateCliente(id: number, cliente: any) {
    const { data } = await api.put(`/Cliente/${id}`, cliente);
    return data;
  },

  async deleteCliente(id: number) {
    const { data } = await api.delete(`/Cliente/${id}`);
    return data;
  }
};

export default clienteService;
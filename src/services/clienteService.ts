import { api } from './api';

const clienteService = {
  async getClientes() {
    while (true) {
      try {
        const { data } = await api.get('/Cliente');
        return data;
      } catch (error) {
        console.error('Erro ao buscar clientes, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async getClienteById(id: number) {
    while (true) {
      try {
        const { data } = await api.get(`/Cliente/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao buscar cliente com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async createCliente(cliente: any) {
    while (true) {
      try {
        const { data } = await api.post('/Cliente', cliente);
        return data;
      } catch (error) {
        console.error('Erro ao criar cliente, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async updateCliente(id: number, cliente: any) {
    while (true) {
      try {
        const { data } = await api.put(`/Cliente/${id}`, cliente);
        return data;
      } catch (error) {
        console.error(`Erro ao atualizar cliente com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async deleteCliente(id: number) {
    while (true) {
      try {
        const { data } = await api.delete(`/Cliente/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao deletar cliente com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }
};

export default clienteService;
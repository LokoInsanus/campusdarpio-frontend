import { api } from './api';

const funcionarioService = {
  async getFuncionarios() {
    const { data } = await api.get('/Funcionario');
    return data;
  },

  async getFuncionarioById(id: number) {
    const { data } = await api.get(`/Funcionario/${id}`);
    return data;
  },

  async createFuncionario(funcionario: any) {
    const { data } = await api.post('/Funcionario', funcionario);
    return data;
  },

  async updateFuncionario(id: number, funcionario: any) {
    const { data } = await api.put(`/Funcionario/${id}`, funcionario);
    return data;
  },

  async deleteFuncionario(id: number) {
    const { data } = await api.delete(`/Funcionario/${id}`);
    return data;
  }
};

export default funcionarioService;
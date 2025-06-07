import { api } from './api';

const funcionarioService = {
  async getFuncionarios() {
    while (true) {
      try {
        const { data } = await api.get('/Funcionario');
        return data;
      } catch (error) {
        console.error('Erro ao buscar funcionarios, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async getFuncionarioById(id: number) {
    while (true) {
      try {
        const { data } = await api.get(`/Funcionario/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao buscar funcionario com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async createFuncionario(funcionario: any) {
    while (true) {
      try {
        const { data } = await api.post('/Funcionario', funcionario);
        return data;
      } catch (error) {
        console.error('Erro ao criar funcionario, tentando de novo em 1 s', error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async updateFuncionario(id: number, funcionario: any) {
    while (true) {
      try {
        const { data } = await api.put(`/Funcionario/${id}`, funcionario);
        return data;
      } catch (error) {
        console.error(`Erro ao atualizar funcionario com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  },

  async deleteFuncionario(id: number) {
    while (true) {
      try {
        const { data } = await api.delete(`/Funcionario/${id}`);
        return data;
      } catch (error) {
        console.error(`Erro ao deletar funcionario com ID ${id}, tentando de novo em 1 s`, error);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }
};

export default funcionarioService;
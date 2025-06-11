import { api } from './api';

const campusService = {
  async getCampi() {
    const { data } = await api.get('/Campus');
    return data;
  },

  async getCampusById(id: number) {
    const { data } = await api.get(`/Campus/${id}`);
    return data;
  },

  async createCampus(campus: any) {
    const { data } = await api.post('/Campus', campus);
    return data;
  },

  async updateCampus(id: number, campus: any) {
    const { data } = await api.put(`/Campus/${id}`, campus);
    return data;
  },

  async deleteCampus(id: number) {
    const { data } = await api.delete(`/Campus/${id}`);
    return data;
  }
};

export default campusService;
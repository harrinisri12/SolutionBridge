import { api } from './api';

export const departmentService = {
  async getDepartments() {
    return api.get('/departments');
  },
  async getDepartmentById(id) {
    return api.get(`/departments/${id}`);
  },
  async createDepartment(data) {
    return api.post('/departments', data);
  },
  async updateDepartment(id, data) {
    return api.put(`/departments/${id}`, data);
  }
};

export default departmentService;

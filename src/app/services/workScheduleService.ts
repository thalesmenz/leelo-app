import api from '../config/axios';

export const workScheduleService = {
  async getAll(user_id: string) {
    const response = await api.get(`work-schedules/${user_id}`);
    return response.data;
  },

  async getDay(user_id: string, weekday: number) {
    const response = await api.get(`work-schedules/${user_id}/${weekday}`);
    return response.data;
  },

  async upsertMany(user_id: string, schedules: any[]) {
    const response = await api.put(`work-schedules/${user_id}`, schedules);
    return response.data;
  },

  async updateDay(user_id: string, weekday: number, data: any) {
    const response = await api.patch(`work-schedules/${user_id}/${weekday}`, data);
    return response.data;
  },

  async deleteDay(user_id: string, weekday: number) {
    const response = await api.delete(`work-schedules/${user_id}/${weekday}`);
    return response.data;
  },
}; 
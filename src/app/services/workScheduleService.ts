import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const workScheduleService = {
  async getAll(user_id: string) {
    const response = await axios.get(`${API_URL}work-schedules/${user_id}`);
    return response.data;
  },

  async getDay(user_id: string, weekday: number) {
    const response = await axios.get(`${API_URL}work-schedules/${user_id}/${weekday}`);
    return response.data;
  },

  async upsertMany(user_id: string, schedules: any[]) {
    const response = await axios.put(`${API_URL}work-schedules/${user_id}`, schedules);
    return response.data;
  },

  async updateDay(user_id: string, weekday: number, data: any) {
    const response = await axios.patch(`${API_URL}work-schedules/${user_id}/${weekday}`, data);
    return response.data;
  },

  async deleteDay(user_id: string, weekday: number) {
    const response = await axios.delete(`${API_URL}work-schedules/${user_id}/${weekday}`);
    return response.data;
  },
}; 
import axios from 'axios';

const API_URL = '/api/simulations'; // Cambiar según la configuración del backend

export const saveSimulationLog = async (log: { type: string; timestamp: string }) => {
  try {
    const response = await axios.post(`${API_URL}/save`, log);
    return response.data;
  } catch (error) {
    console.error('Error al guardar el registro de simulación:', error);
    throw error;
  }
};

export const fetchSimulationLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/logs`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los registros de simulación:', error);
    throw error;
  }
};

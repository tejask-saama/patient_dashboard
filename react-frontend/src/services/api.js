import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/patient_info';

const api = {
  // Get patient demographics data
  getPatientDemographics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/patient_demog`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient demographics:', error);
      throw error;
    }
  },

  // Get adverse events data
  getAdverseEvents: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/adverse_event`);
      return response.data;
    } catch (error) {
      console.error('Error fetching adverse events:', error);
      throw error;
    }
  }
};

export default api;

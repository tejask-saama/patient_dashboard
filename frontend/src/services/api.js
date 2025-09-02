import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPatientDemographics = async () => {
  try {
    const response = await api.get('/patient_info/patient_demog');
    return response.data;
  } catch (error) {
    console.error('Error fetching patient demographics:', error);
    throw error;
  }
};

export const fetchAdverseEvents = async () => {
  try {
    const response = await api.get('/patient_info/adverse_event');
    return response.data;
  } catch (error) {
    console.error('Error fetching adverse events:', error);
    throw error;
  }
};

// Helper function for binning ages
export const binAges = (ageRows) => {
  const bins = Array.from({length: 11}, (_, i) => ({ 
    label: `${i*10}-${i*10+9}`, 
    count: 0 
  }));
  
  for(const r of ageRows || []){
    const age = Number(r.value);
    const c = Number(r.count) || 0;
    if(Number.isFinite(age)){
      const idx = Math.max(0, Math.min(10, Math.floor(age/10)));
      bins[idx].count += c;
    }
  }
  return bins;
};

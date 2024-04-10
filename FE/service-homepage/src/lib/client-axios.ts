import axios from 'axios';


const clientAxios = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

clientAxios.interceptors.request.use(config => {
  // config.headers['Authorization'] = `Bearer ${yourAuthToken}`;
  return config;
}, error => {
  return Promise.reject(error);
});

clientAxios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response) {
    if (error.response.status === 401) {
      alert('토큰이 존재하지 않습니다.');
      window.location.href = '/';
    } else {
      const errorMessage = error.response.data.message || '오류가 발생했습니다.';
      alert(errorMessage);
    }
  } else {
    alert(`Error: ${error.message}`);
  }
  return Promise.reject(error);
});

export default clientAxios;
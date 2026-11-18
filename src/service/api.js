import axios from 'axios';
import { API_URL } from '../constants/config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Traduz erros da API para mensagens amigáveis
export function mensagemDeErro(error) {
  if (error.response?.data?.erro) return error.response.data.erro;
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return 'Não foi possível conectar ao servidor. Verifique se a API está ligada e se o celular está na mesma rede Wi-Fi.';
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}

export default api;

import axios from 'axios';
import { API_URL } from '../constants/config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Traduz erros da API para mensagens amigáveis
export function mensagemDeErro(error) {
  if (error.response?.data?.erro) return error.response.data.erro;
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.';
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}

export default api;

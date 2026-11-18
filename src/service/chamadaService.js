import api from './api';

export const buscarChamada = async (serieId, data) =>
  (await api.get('/chamadas', { params: { serieId, data } })).data;

export const salvarChamada = async (serieId, data, registros) =>
  (await api.post('/chamadas', { serieId, data, registros })).data;

export const buscarHistorico = async (serieId) =>
  (await api.get('/chamadas/historico', { params: { serieId } })).data;

import api from './api';

export const listarSeries = async () => (await api.get('/series')).data;

export const criarSerie = async (nome) => (await api.post('/series', { nome })).data;

export const atualizarSerie = async (id, nome) => (await api.put(`/series/${id}`, { nome })).data;

export const removerSerie = async (id) => api.delete(`/series/${id}`);

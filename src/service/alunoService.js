import api from './api';

export const listarAlunos = async (serieId) => (await api.get('/alunos', { params: { serieId } })).data;

export const criarAluno = async (nome, serieId) => (await api.post('/alunos', { nome, serieId })).data;

export const atualizarAluno = async (id, nome) => (await api.put(`/alunos/${id}`, { nome })).data;

export const removerAluno = async (id) => api.delete(`/alunos/${id}`);

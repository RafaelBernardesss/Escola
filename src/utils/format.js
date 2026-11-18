const PREPOSICOES = new Set(['da', 'de', 'do', 'das', 'dos', 'e']);

export function formatarNome(texto) {
  return texto
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((p, i) => (i > 0 && PREPOSICOES.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(' ');
}

export function iniciais(nome) {
  const partes = nome.trim().split(/\s+/).filter((p) => !PREPOSICOES.has(p.toLowerCase()));
  const primeira = partes[0]?.charAt(0) || '';
  const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : '';
  return (primeira + ultima).toUpperCase();
}

export function plural(qtd, singular, pluralTxt) {
  return `${qtd} ${qtd === 1 ? singular : pluralTxt}`;
}

const API_URL = 'http://localhost:5000';

export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
    return true;
  }
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    if (!decoded.exp) return false;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return nowInSeconds >= decoded.exp;
  } catch {
    return true;
  }
}

export function clearAuthStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('perfil');
  localStorage.removeItem('userEmail');
}

export function notifyAuthExpired() {
  clearAuthStorage();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }
}

async function request(path: string, token: string, init?: RequestInit) {
  // Limpar token de aspas extras ou espaços
  const cleanToken = token ? token.trim().replace(/^["']|["']$/g, '') : '';

  if (!cleanToken || isTokenExpired(cleanToken)) {
    notifyAuthExpired();
    throw new Error('Sessão expirada ou inválida. Faça login novamente.');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      notifyAuthExpired();
      throw new Error('Sessão expirada ou inválida. Faça login novamente.');
    }

    let message = `Erro ${response.status}`;
    try {
      const text = await response.text();
      if (text) {
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data?.mensagens) && data.mensagens.length) {
            message = data.mensagens.join(', ');
          } else if (data?.message) {
            message = data.message;
          } else if (data?.error) {
            message = data.error;
          } else {
            message = text;
          }
        } catch {
          message = text;
        }
      }
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return response.json();
  return response.text();
}

/**
 * Verifica se um token é aceito pelo backend fazendo uma chamada real.
 * Retorna true se o backend aceitar, false se retornar 401/403.
 */
export async function validateTokenWithServer(token: string): Promise<boolean> {
  if (!token || isTokenExpired(token)) return false;
  try {
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    const r = await fetch(`${API_URL}/veiculos`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${cleanToken}` },
    });
    return r.status !== 401 && r.status !== 403;
  } catch {
    return false;
  }
}

// ===== VEÍCULOS =====
async function getVeiculos(token: string): Promise<any[]> {
  return request('/veiculos', token, { method: 'GET' });
}

async function criarVeiculo(veiculo: any, token: string) {
  const body = { nome: veiculo.name, marca: veiculo.marca, placa: veiculo.placa, ano: veiculo.ano };
  return request('/veiculos', token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

async function deletarVeiculo(id: number, token: string) {
  return request(`/veiculos/${id}`, token, { method: 'DELETE' });
}

// ===== MOTORISTAS =====
async function getMotoristas(token: string): Promise<any[]> {
  return request('/motoristas', token, { method: 'GET' });
}

async function criarMotorista(motorista: any, token: string) {
  const body = {
    nome: motorista.nome,
    funcao: motorista.funcao,
    telefone: motorista.telefone,
    email: motorista.email,
    qtdViagem: motorista.qtdViagem,
    pontuacao: motorista.pontuacao,
    status: motorista.status,
    veiculo: motorista.veiculo,
  };
  return request('/motoristas', token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

async function deletarMotorista(id: number, token: string) {
  return request(`/motoristas/${id}`, token, { method: 'DELETE' });
}

async function atualizarMotorista(id: number, motorista: any, token: string) {
  const body = {
    nome: motorista.nome,
    funcao: motorista.funcao,
    telefone: motorista.telefone,
    email: motorista.email,
    qtdViagem: motorista.qtdViagem,
    pontuacao: motorista.pontuacao,
    status: motorista.status,
    veiculo: motorista.veiculo,
  };
  return request(`/motoristas/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// ===== ROTAS =====
async function getRotas(token: string): Promise<any[]> {
  return request('/rotas', token, { method: 'GET' });
}

async function criarRota(rota: any, token: string) {
  const body = {
    origem: rota.origem,
    destino: rota.destino,
    veiculo: rota.veiculo,
    motorista: rota.motorista,
    horario: rota.horario,
    distancia: rota.distancia,
    status: rota.status,
  };
  return request('/rotas', token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export {
  API_URL,
  getVeiculos,
  criarVeiculo,
  deletarVeiculo,
  getMotoristas,
  criarMotorista,
  deletarMotorista,
  atualizarMotorista,
  getRotas,
  criarRota,
};
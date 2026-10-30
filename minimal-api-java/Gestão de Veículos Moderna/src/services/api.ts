const API_URL = 'http://localhost:5000'

interface AdministradorLogado {
  email: string
  perfil: string
  token: string
}

async function getToken(): Promise<string | null> {
  const token = localStorage.getItem('token')
  if (!token) return null
  return token
}

async function login(email: string, senha: string): Promise<AdministradorLogado> {
  const response = await fetch(`${API_URL}/administradores/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  })

  if (!response.ok) {
    throw new Error('Falha no login. Verifique suas credenciais.')
  }

  const data = await response.json()
  const result = {
    email: data.Email,
    perfil: data.Perfil,
    token: data.Token,
  }
  localStorage.setItem('token', result.token)
  localStorage.setItem('userEmail', result.email)
  localStorage.setItem('perfil', result.perfil)
  return result
}

async function cadastrarConta(email: string, senha: string): Promise<any> {
  const response = await fetch(`${API_URL}/administradores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha, perfil: 'Editor' }),
  })

  if (!response.ok) {
    let errorMessage = 'Erro ao cadastrar conta.'
    try {
      const error = await response.json()
      if (error?.Mensagens) {
        errorMessage = error.Mensagens.join(', ')
      } else if (error?.mensagens) {
        errorMessage = error.mensagens.join(', ')
      }
    } catch (e) {
      // Se não for JSON, usa a mensagem padrão
    }
    throw new Error(errorMessage)
  }

  return await response.json()
}

async function logout(): Promise<void> {
  localStorage.removeItem('token')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('perfil')
}

async function getVeiculos(token: string): Promise<any[]> {
  const response = await fetch(`${API_URL}/veiculos`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar veículos.')
  }

  const data = await response.json()
  return data.map((v: any) => ({
    id: v.Id,
    name: v.Nome,
    plate: '',
    category: 'SUV',
    year: v.Ano,
    mileage: '0 km',
    status: 'Disponível',
    image: '',
    driver: 'Sem condutor',
  }))
}

async function criarVeiculo(veiculo: any, token: string): Promise<any> {
  const body = {
    nome: veiculo.name,
    marca: veiculo.marca,
    ano: veiculo.year,
  }

  const response = await fetch(`${API_URL}/veiculos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    let errorMessage = 'Erro ao criar veículo.'
    try {
      const error = await response.json()
      if (error.Mensagens) {
        errorMessage = error.Mensagens.join(', ')
      } else if (error.mensagens) {
        errorMessage = error.mensagens.join(', ')
      }
    } catch (e) {
      // Se não for JSON, usa a mensagem padrão
    }
    throw new Error(errorMessage)
  }

  return response.json()
}

async function deletarVeiculo(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/veiculos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao excluir veículo.')
  }
}

async function buscarVeiculoPorId(id: number, token: string): Promise<any> {
  const response = await fetch(`${API_URL}/veiculos/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Veículo não encontrado.')
  }

  const v = await response.json()
  return {
    id: v.Id,
    name: v.Nome,
    plate: '',
    category: 'SUV',
    year: v.Ano,
    mileage: '0 km',
    status: 'Disponível',
    image: '',
    driver: 'Sem condutor',
  }
}

export { login, logout, cadastrarConta, getVeiculos, criarVeiculo, deletarVeiculo, buscarVeiculoPorId }

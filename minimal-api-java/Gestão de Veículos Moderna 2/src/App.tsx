import { FormEvent, ReactNode, useMemo, useState, useEffect } from 'react'
import {
  getVeiculos,
  criarVeiculo,
  deletarVeiculo,
  getMotoristas,
  criarMotorista,
  deletarMotorista,
  atualizarMotorista,
  getRotas,
  criarRota,
  isTokenExpired,
  clearAuthStorage,
  validateTokenWithServer,
} from './services/api'

type Vehicle = {
  id: number
  name: string
  plate: string
  marca: string
  category: 'SUV' | 'Sedan' | 'Elétrico' | 'Utilitário'
  year: number
  mileage: string
  status: 'Disponível' | 'Em uso' | 'Manutenção'
  image: string
  driver: string
}

type Page = 'overview' | 'vehicles' | 'routes' | 'drivers' | 'settings' | 'help'

type RouteItem = {
  id: number
  origin: string
  destination: string
  vehicle: string
  driver: string
  time: string
  distance: string
  status: 'Em andamento' | 'Agendada' | 'Concluída'
}

type Driver = {
  id: number
  name: string
  initials: string
  role: string
  phone: string
  email: string
  trips: number
  score: string
  status: 'Em rota' | 'Disponível' | 'Folga'
  vehicle: string
  qtdViagem: number
  pontuacao: number
}

type AuthUser = {
  email: string
  perfil: string
  token: string
}

const API_URL = 'http://localhost:5000'

const photos = [
  'https://images.unsplash.com/photo-1760713170685-b67abc3be5ad?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1550242499-b5171f56de56?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1532268116505-8c59cc37d2e6?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1677522375387-4d41265a98c4?auto=format&fit=crop&w=1200&q=85',
]

function mapVeiculo(v: any): Vehicle {
  return {
    id: v.Id || v.id,
    name: v.Nome || v.name,
    plate: v.Placa || v.placa || v.Marca || v.marca || v.plate || '',
    marca: v.Marca || v.marca || '',
    category: (v.category || 'SUV') as Vehicle['category'],
    year: v.Ano || v.year || 0,
    mileage: v.mileage || '0 km',
    status: (v.status || 'Disponível') as Vehicle['status'],
    image: v.image || photos[Math.floor(Math.random() * photos.length)],
    driver: v.driver || 'Sem condutor',
  }
}

function mapMotorista(m: any): Driver {
  return {
    id: m.Id || m.id,
    name: m.Nome || m.name,
    initials: m.iniciais || (m.Nome || m.name || '').split(' ').slice(0, 2).map((p: string) => p[0]).join('').toUpperCase(),
    role: m.Funcao || m.role || 'Motorista',
    phone: m.Telefone || m.phone || '',
    email: m.Email || m.email || '',
    trips: m.Qtd_Viagem || m.qtdViagem || 0,
    score: m.pontuacao ? String(m.pontuacao) : '—',
    status: (m.Status || m.status || 'Disponível') as Driver['status'],
    vehicle: m.Veiculo || m.vehicle || 'Sem veículo',
    qtdViagem: Number(m.Qtd_Viagem || m.qtdViagem || 0),
    pontuacao: Number(m.Pontuacao || m.pontuacao || 0),
  }
}

function mapRota(r: any): RouteItem {
  return {
    id: r.Id || r.id,
    origin: r.Origem || r.origin,
    destination: r.Destino || r.destination,
    vehicle: r.Veiculo || r.vehicle,
    driver: r.Motorista || r.driver,
    time: r.Horario || r.horario,
    distance: r.Distancia || r.distancia || '—',
    status: (r.Status || r.status || 'Agendada') as RouteItem['status'],
  }
}

type IconName =
  | 'car'
  | 'grid'
  | 'route'
  | 'users'
  | 'settings'
  | 'help'
  | 'search'
  | 'plus'
  | 'bell'
  | 'chevron'
  | 'dots'
  | 'fuel'
  | 'gauge'
  | 'calendar'
  | 'trash'
  | 'eye'
  | 'close'
  | 'arrow'
  | 'menu'
  | 'check'
  | 'location'
  | 'clock'
  | 'phone'
  | 'star'
  | 'shield'
  | 'mail'
  | 'edit'
  | 'download'
  | 'lock'
  | 'file'
  | 'message'
  | 'spark'

const paths: Record<IconName, ReactNode> = {
  car: <><path d="M5 17h14M6 17l-1-3 2-5h10l2 5-1 3M8 17v2m8-2v2M7 13h.01M17 13h.01" /><path d="m7 9 1-3h8l1 3" /></>,
  grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  route: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h2a4 4 0 0 0 4-4V9a4 4 0 0 1 4-4" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-1.55-1H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1-1.55V3h4v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08a1.7 1.7 0 0 0-1.52 1Z" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.4 2.4 0 1 1 3.3 2.2c-.7.3-1 .8-1 1.6M12 17h.01" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  dots: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  fuel: <><path d="M4 21V4h10v17M3 21h12M7 8h4M14 8h2l3 3v7a2 2 0 0 0 4 0v-5l-2-2" /></>,
  gauge: <><path d="M20 14a8 8 0 1 0-16 0" /><path d="m12 14 4-4M4 18h16" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  check: <path d="m5 12 4 4L19 6" />,
  location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z" />,
  star: <path d="m12 2 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1L6.1 20l1.1-6.5-4.7-4.6L9 8l3-6Z" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
  message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />,
  spark: <><path d="m12 3-1.2 4.2L7 9l3.8 1.8L12 15l1.2-4.2L17 9l-3.8-1.8Z" /><path d="m5 14-.7 2.3L2 17l2.3.7L5 20l.7-2.3L8 17l-2.3-.7Z" /></>,
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Status({ value }: { value: Vehicle['status'] }) {
  const color = value === 'Disponível' ? 'green' : value === 'Em uso' ? 'blue' : 'amber'
  return <span className={`status status-${color}`}><i />{value}</span>
}

function Toggle({ label, text, checked, onClick }: { label: string; text: string; checked: boolean; onClick: () => void }) {
  return <div className="toggle-row"><div><b>{label}</b><span>{text}</span></div><button className={checked ? 'toggle active' : 'toggle'} onClick={onClick} aria-label={`${checked ? 'Desativar' : 'Ativar'} ${label}`}><i /></button></div>
}

function SettingsPlaceholder({ icon, title, text, action }: { icon: IconName; title: string; text: string; action: string }) {
  return <div><div className="settings-head"><span className="settings-icon"><Icon name={icon} /></span><div><h2>{title}</h2><p>{text}</p></div></div><div className="settings-placeholder"><span><Icon name={icon} size={30} /></span><h3>{title}</h3><p>{text}</p><button className="secondary-button">{action}<Icon name="arrow" size={16} /></button></div></div>
}

export default function App() {
  const [page, setPage] = useState<Page>('overview')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [routes, setRoutes] = useState<RouteItem[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [showAdd, setShowAdd] = useState(false)
  const [showAddRoute, setShowAddRoute] = useState(false)
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [selected, setSelected] = useState<Vehicle | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [settingsTab, setSettingsTab] = useState('Geral')
  const [helpSearch, setHelpSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [notifications, setNotifications] = useState({ maintenance: true, routes: true, weekly: false })
  const [ratingDriver, setRatingDriver] = useState<{ id: number; score: number } | null>(null)
  const [auth, setAuth] = useState<AuthUser | null>(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedPerfil = localStorage.getItem('perfil')
      const storedEmail = localStorage.getItem('userEmail')
      if (
        storedToken &&
        storedToken !== 'undefined' &&
        storedToken !== 'null' &&
        storedPerfil &&
        storedEmail &&
        !isTokenExpired(storedToken)
      ) {
        return { email: storedEmail, perfil: storedPerfil, token: storedToken }
      }
    } catch {}
    clearAuthStorage()
    return null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleAuthExpired = () => {
      logout()
      setShowLogin(true)
      notify('Sessão expirada ou inválida. Faça login novamente.')
    }
    window.addEventListener('auth:expired', handleAuthExpired)
    return () => window.removeEventListener('auth:expired', handleAuthExpired)
  }, [])

  useEffect(() => {
    // Validar token com o servidor real ao carregar a página
    // Isso detecta tokens com assinatura inválida ou expirados no servidor
    if (!auth || !auth.token) return
    if (isTokenExpired(auth.token)) {
      clearAuthStorage()
      setAuth(null)
      return
    }
    validateTokenWithServer(auth.token).then((valid) => {
      if (!valid) {
        clearAuthStorage()
        setAuth(null)
        notify('Sessão expirada. Por favor, faça login novamente.')
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!auth || !auth.token || isTokenExpired(auth.token)) {
      return
    }
    setLoading(true)
    Promise.all([
      getVeiculos(auth.token).then((data: any[]) => setVehicles(data.map(mapVeiculo))),
      getMotoristas(auth.token).then((data: any[]) => setDrivers(data.map(mapMotorista))),
      getRotas(auth.token).then((data: any[]) => setRoutes(data.map(mapRota))),
    ])
      .catch((err: any) => {
        if (
          err?.message?.includes('expirada') ||
          err?.message?.includes('inválida') ||
          err?.message?.includes('401')
        ) {
          logout()
          setShowLogin(true)
          notify('Sessão expirada ou inválida. Faça login novamente.')
        } else {
          notify(err.message || 'Erro ao carregar dados')
        }
      })
      .finally(() => setLoading(false))
  }, [auth])

  const filtered = useMemo(() => vehicles.filter((vehicle) => {
    const matchesSearch = `${vehicle.name} ${vehicle.plate}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (filter === 'Todos' || vehicle.status === filter)
  }), [vehicles, search, filter])

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  async function removeVehicle(id: number) {
    if (!isAdmin) {
      notify('Somente administradores podem remover veículos')
      return
    }

    if (!auth || !auth.token || isTokenExpired(auth.token)) {
      logout()
      setShowLogin(true)
      notify('Sessão expirada ou inválida. Faça login novamente.')
      return
    }
    try {
      await deletarVeiculo(id, auth.token)
      setVehicles((items) => items.filter((item) => item.id !== id))
      setSelected(null)
      notify('Veículo removido da frota')
    } catch (err: any) {
      if (
        err?.message === 'Erro 401' ||
        err?.message?.includes('401') ||
        err?.message?.includes('expirada') ||
        err?.message?.includes('inválida')
      ) {
        logout()
        setShowLogin(true)
        notify('Sessão expirada ou inválida. Faça login novamente.')
        return
      }
      notify(err.message || 'Erro ao remover veículo')
    }
  }

  async function removeDriver(id: number) {
    if (!isAdmin) {
      notify('Somente administradores podem remover condutores')
      return
    }

    if (!auth || !auth.token || isTokenExpired(auth.token)) {
      logout()
      setShowLogin(true)
      notify('Sessão expirada ou inválida. Faça login novamente.')
      return
    }
    try {
      await deletarMotorista(id, auth.token)
      setDrivers((items) => items.filter((item) => item.id !== id))
      notify('Condutor removido da equipe')
    } catch (err: any) {
      if (
        err?.message === 'Erro 401' ||
        err?.message?.includes('401') ||
        err?.message?.includes('expirada') ||
        err?.message?.includes('inválida')
      ) {
        logout()
        setShowLogin(true)
        notify('Sessão expirada ou inválida. Faça login novamente.')
        return
      }
      notify(err.message || 'Erro ao remover condutor')
    }
  }

  async function rateDriver(id: number, score: number) {
    if (!auth || !auth.token || isTokenExpired(auth.token)) {
      logout()
      setShowLogin(true)
      notify('Sessão expirada ou inválida. Faça login novamente.')
      return
    }
    const driver = drivers.find((d) => d.id === id)
    if (!driver) return
    try {
      setDrivers((items) => items.map((d) => d.id === id ? { ...d, pontuacao: score } : d))
      await atualizarMotorista(id, {
        nome: driver.name,
        funcao: driver.role,
        telefone: driver.phone,
        email: driver.email,
        qtdViagem: driver.trips,
        pontuacao: score,
        status: driver.status,
        veiculo: driver.vehicle,
      }, auth.token)
      const resp = await getMotoristas(auth.token)
      setDrivers(resp.map(mapMotorista))
      setRatingDriver(null)
      notify(`Avaliação atualizada: ${score} estrela${score !== 1 ? 's' : ''}`)
    } catch (err: any) {
      if (
        err?.message === 'Erro 401' ||
        err?.message?.includes('401') ||
        err?.message?.includes('expirada') ||
        err?.message?.includes('inválida')
      ) {
        logout()
        setShowLogin(true)
        notify('Sessão expirada ou inválida. Faça login novamente.')
        return
      }
      notify(err.message || 'Erro ao avaliar condutor')
      setRatingDriver(null)
    }
  }

  async function addVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isAdmin) {
      notify('Somente administradores podem adicionar veículos')
      return
    }

    if (!auth || !auth.token || isTokenExpired(auth.token)) {
      logout()
      setShowLogin(true)
      notify('Sessão expirada ou inválida. Faça login novamente.')
      return
    }
    const currentToken = auth.token
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const plate = String(data.get('plate') || '').trim().toUpperCase()
    const marca = String(data.get('marca') || '').trim()
    const yearRaw = Number(data.get('year'))
    const year = (!yearRaw || isNaN(yearRaw) || yearRaw < 1950) ? 2024 : yearRaw
    const category = (String(data.get('category') || 'SUV')) as Vehicle['category']
    try {
      await criarVeiculo({ name, marca, placa: plate, ano: year }, currentToken)
      const resp = await getVeiculos(currentToken)
      setVehicles(resp.map(mapVeiculo))
      setShowAdd(false)
      notify(`${name} adicionado à frota`)
    } catch (err: any) {
      // Sempre fechar o modal de adicionar veículo ao dar erro
      setShowAdd(false)
      if (
        err?.message === 'Erro 401' ||
        err?.message?.includes('401') ||
        err?.message?.includes('expirada') ||
        err?.message?.includes('inválida')
      ) {
        logout()
        setShowLogin(true)
        notify('Sessão expirada ou inválida. Faça login novamente.')
        return
      }
      notify(err.message || 'Erro ao adicionar veículo')
    }
  }

  function navigate(nextPage: Page) {
    setPage(nextPage)
    setMenuOpen(false)
    setSearch('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleLogin(email: string, senha: string) {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/administradores/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email.trim(), Senha: senha }),
      })
      if (!response.ok) {
        let message = 'Email ou senha inválidos'
        try {
          const errData = await response.json()
          if (errData?.message) message = errData.message
        } catch {}
        throw new Error(message)
      }
      const data = await response.json()
      const userToken = data.Token || data.token
      const userPerfil = data.Perfil || data.perfil || 'Adm'
      const userEmail = data.Email || data.email || email.trim()

      if (!userToken) {
        throw new Error('Falha na autenticação: token não retornado pelo servidor.')
      }

      const user: AuthUser = {
        email: userEmail,
        perfil: userPerfil,
        token: userToken,
      }
      localStorage.setItem('token', user.token)
      localStorage.setItem('perfil', user.perfil)
      localStorage.setItem('userEmail', user.email)
      setAuth(user)
      setShowLogin(false)
      notify('Login realizado com sucesso')
    } catch (err: any) {
      notify(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  async function handleCadastro(email: string, senha: string) {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/administradores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), senha, perfil: 'Editor' }),
      })
      if (!response.ok) {
        let msg = 'Erro ao cadastrar conta'
        try {
          const errData = await response.json()
          if (Array.isArray(errData?.mensagens) && errData.mensagens.length) {
            msg = errData.mensagens.join(', ')
          } else if (errData?.message) {
            msg = errData.message
          }
        } catch {}
        throw new Error(msg)
      }
      notify('Conta de Editor criada com sucesso! Faça login.')
      setShowLogin(false)
    } catch (err: any) {
      notify(err.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    clearAuthStorage()
    setAuth(null)
    setVehicles([])
    setRoutes([])
    setDrivers([])
    // Fechar todos os modais ao sair para não deixar formulários travados
    setShowAdd(false)
    setShowAddRoute(false)
    setShowAddDriver(false)
    setSelected(null)
    notify('Sessão encerrada')
  }

  async function addRoute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth || !auth.token || isTokenExpired(auth.token)) {
      logout()
      setShowLogin(true)
      notify('Sessão expirada ou inválida. Faça login novamente.')
      return
    }
    const data = new FormData(event.currentTarget)
    try {
      await criarRota({
        origem: String(data.get('origin')),
        destino: String(data.get('destination')),
        veiculo: String(data.get('vehicle')),
        motorista: String(data.get('driver')),
        horario: String(data.get('time')),
        distancia: String(data.get('distance') || '—'),
        status: 'Agendada',
      }, auth.token)
      const resp = await getRotas(auth.token)
      setRoutes(resp.map(mapRota))
      setShowAddRoute(false)
      notify('Nova rota agendada com sucesso')
    } catch (err: any) {
      if (
        err?.message === 'Erro 401' ||
        err?.message?.includes('401') ||
        err?.message?.includes('expirada') ||
        err?.message?.includes('inválida')
      ) {
        logout()
        setShowLogin(true)
        notify('Sessão expirada ou inválida. Faça login novamente.')
        return
      }
      notify(err.message || 'Erro ao criar rota')
    }
  }

  async function addDriver(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth || !auth.token || isTokenExpired(auth.token)) {
      logout()
      setShowLogin(true)
      notify('Sessão expirada ou inválida. Faça login novamente.')
      return
    }
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name'))
    try {
      await criarMotorista({
        nome: name,
        funcao: String(data.get('role')),
        telefone: String(data.get('phone')),
        email: String(data.get('email')),
        qtdViagem: 0,
        pontuacao: 0,
        status: 'Disponível',
        veiculo: 'Sem veículo',
      }, auth.token)
      const resp = await getMotoristas(auth.token)
      setDrivers(resp.map(mapMotorista))
      setShowAddDriver(false)
      notify(`${name} adicionado à equipe`)
    } catch (err: any) {
      if (
        err?.message === 'Erro 401' ||
        err?.message?.includes('401') ||
        err?.message?.includes('expirada') ||
        err?.message?.includes('inválida')
      ) {
        logout()
        setShowLogin(true)
        notify('Sessão expirada ou inválida. Faça login novamente.')
        return
      }
      notify(err.message || 'Erro ao adicionar motorista')
    }
  }

  const pageNames: Record<Page, string> = {
    overview: 'Visão geral',
    vehicles: 'Veículos',
    routes: 'Rotas',
    drivers: 'Condutores',
    settings: 'Configurações',
    help: 'Central de ajuda',
  }

  const nomeUsuario = auth
    ? ((auth.email.split('@')[0] || 'Usuário').charAt(0).toUpperCase() + (auth.email.split('@')[0] || 'Usuário').slice(1))
    : 'Usuário'

  const isAdmin = auth?.perfil === 'Adm'

  const bestDriver = drivers.length > 0
    ? drivers.reduce((prev, current) => {
        const prevScore = Number(prev.pontuacao) || 0
        const currScore = Number(current.pontuacao) || 0
        const prevTrips = Number(prev.trips) || 0
        const currTrips = Number(current.trips) || 0
        if (currScore > prevScore) return current
        if (currScore < prevScore) return prev
        return currTrips > prevTrips ? current : prev
      })
    : null

  return (
    <div className="app-shell">
      <aside className={menuOpen ? 'sidebar sidebar-open' : 'sidebar'}>
        <div className="brand"><span className="brand-mark"><Icon name="car" size={24} /></span><strong>Luna</strong></div>
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><Icon name="close" /></button>
        <nav>
          <span className="nav-label">GESTÃO</span>
          <button className={page === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('overview')}><Icon name="grid" />Visão geral</button>
          <button className={page === 'vehicles' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('vehicles')}><Icon name="car" />Veículos<span className="nav-count">{vehicles.length}</span></button>
          <button className={page === 'routes' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('routes')}><Icon name="route" />Rotas</button>
          <button className={page === 'drivers' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('drivers')}><Icon name="users" />Condutores</button>
          <span className="nav-label nav-label-second">SISTEMA</span>
          <button className={page === 'settings' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('settings')}><Icon name="settings" />Configurações</button>
          <button className={page === 'help' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('help')}><Icon name="help" />Central de ajuda</button>
        </nav>
        <div className="sidebar-card">
          <span className="sidebar-card-icon"><Icon name="gauge" /></span>
          <strong>Controle sua frota</strong>
          <p>Tenha decisões mais rápidas com dados centralizados.</p>
          <button>Ver relatório <Icon name="arrow" size={16} /></button>
        </div>
        <div className="sidebar-user">
          <div className="avatar">RN</div>
          <div><strong>Rafael Nunes</strong><span>Administrador</span></div>
          <Icon name="dots" />
        </div>
      </aside>

      {menuOpen && <button className="sidebar-backdrop" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}

      <main>
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Icon name="menu" /></button>
          <div className="breadcrumbs"><span>Nexo</span><Icon name="chevron" size={14} /><b>{pageNames[page]}</b></div>
          <div className="top-actions">
            <button className="notification" aria-label="Notificações"><Icon name="bell" /><i /></button>
            {auth ? (
              <>
                <span className="login-avatar">{auth.email.charAt(0).toUpperCase()}</span>
                <span className="login-copy"><b>{auth.email}</b><small>{auth.perfil}</small></span>
                <button className="login-button" onClick={logout}>Sair <Icon name="chevron" size={15} /></button>
              </>
            ) : (
              <button className="login-button" onClick={() => setShowLogin(true)}><span className="login-avatar">?</span><span className="login-copy"><b>Entrar</b><small>Faça login</small></span><Icon name="chevron" size={15} /></button>
            )}
          </div>
        </header>

        <div className="content">
          {!auth ? (
            <div className="login-screen">
              <div className="login-card">
                <span className="brand-mark login-mark"><Icon name="car" size={27} /></span>
                <span className="eyebrow">{isRegistering ? 'CADASTRO DE USUÁRIO' : 'BEM-VINDO À NEXO'}</span>
                <h2>{isRegistering ? 'Criar nova conta' : 'Acesse sua frota'}</h2>
                <p>{isRegistering ? 'Cadastre-se como Editor para gerenciar veículos e frotas.' : 'Entre para continuar gerenciando seus veículos.'}</p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  const email = String(form.get('email') || '').trim();
                  const senha = String(form.get('senha') || '');
                  if (isRegistering) {
                    handleCadastro(email, senha);
                  } else {
                    handleLogin(email, senha);
                  }
                }}>
                  <label>E-mail<input required type="email" name="email" placeholder="voce@empresa.com.br" /></label>
                  <label>Senha<input required type="password" name="senha" placeholder="••••••••" /></label>
                  <button className="primary-button login-submit" type="submit" disabled={loading}>
                    {loading ? 'Aguarde...' : (isRegistering ? 'Criar conta de Editor' : 'Entrar')} <Icon name="arrow" />
                  </button>
                </form>
                <div style={{ marginTop: '15px', fontSize: '13px', color: '#666', textAlign: 'center' }}>
                  {isRegistering ? (
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsRegistering(false) }} style={{ textDecoration: 'underline', color: '#333' }}>
                      Já tem uma conta? Faça login
                    </a>
                  ) : (
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsRegistering(true) }} style={{ textDecoration: 'underline', color: '#333' }}>
                      Não tem conta? Crie uma conta de Editor
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
          {page === 'overview' && <>
          <section className="welcome">
            <div>
              <span className="eyebrow">PAINEL DA FROTA</span>
              <h1>Olá, {nomeUsuario}. <span>Vamos acelerar?</span></h1>
              <p>Acompanhe o desempenho e mantenha sua operação sempre em movimento.</p>
            </div>
            {isAdmin && <button className="primary-button" onClick={() => setShowAdd(true)}><Icon name="plus" />Adicionar veículo</button>}
          </section>

          <section className="stats-grid">
            <article className="stat-card stat-main">
              <div className="stat-top"><span className="stat-icon"><Icon name="car" /></span><span className="trend">+2 este mês</span></div>
              <span className="stat-label">Total de veículos</span>
              <strong>{vehicles.length.toString().padStart(2, '0')}</strong>
              <div className="mini-bars">{[40, 58, 44, 72, 62, 88, 78, 100].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon pale-green"><Icon name="check" /></span><span className="stat-percent">62%</span></div>
              <span className="stat-label">Disponíveis</span>
              <strong>{vehicles.filter((v) => v.status === 'Disponível').length.toString().padStart(2, '0')}</strong>
              <div className="progress"><i style={{ width: '62%' }} /></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon pale-blue"><Icon name="route" /></span><span className="stat-percent blue-text">24%</span></div>
              <span className="stat-label">Em operação</span>
              <strong>{vehicles.filter((v) => v.status === 'Em uso').length.toString().padStart(2, '0')}</strong>
              <div className="progress blue-progress"><i style={{ width: '24%' }} /></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon pale-amber"><Icon name="settings" /></span><span className="stat-percent amber-text">14%</span></div>
              <span className="stat-label">Em manutenção</span>
              <strong>{vehicles.filter((v) => v.status === 'Manutenção').length.toString().padStart(2, '0')}</strong>
              <div className="progress amber-progress"><i style={{ width: '14%' }} /></div>
            </article>
          </section>

          <section className="fleet-section">
            <div className="section-heading">
              <div><h2>Veículos da frota</h2><p>Gerencie e acompanhe todos os veículos cadastrados.</p></div>
              <button className="link-button">Ver todos <Icon name="arrow" size={17} /></button>
            </div>
            <div className="toolbar">
              <label className="search-box"><Icon name="search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por modelo ou placa..." /></label>
              <div className="filter-group">
                {['Todos', 'Disponível', 'Em uso', 'Manutenção'].map((item) => (
                  <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>
                ))}
              </div>
            </div>

            {filtered.length ? (
              <div className="vehicle-grid">
                {filtered.map((vehicle) => (
                  <article className="vehicle-card" key={vehicle.id}>
                    <div className="vehicle-image">
                      <img src={vehicle.image} alt={`${vehicle.name} na frota`} />
                      <Status value={vehicle.status} />
                      <button className="more-button" aria-label={`Opções de ${vehicle.name}`}><Icon name="dots" /></button>
                    </div>
                    <div className="vehicle-body">
                      <div className="vehicle-title"><div><span>{vehicle.category}</span><h3>{vehicle.name}</h3></div><b>{vehicle.plate}</b></div>
                      <div className="vehicle-details">
                        <span><Icon name="calendar" size={16} />{vehicle.year}</span>
                        <span><Icon name="gauge" size={16} />{vehicle.mileage}</span>
                        <span><Icon name="fuel" size={16} />{vehicle.category === 'Elétrico' ? 'Elétrico' : 'Flex'}</span>
                      </div>
                      <div className="vehicle-footer">
                        <div className="driver-avatar">{vehicle.driver === 'Sem condutor' ? '—' : vehicle.driver.split(' ').map((x) => x[0]).join('')}</div>
                        <div className="driver-info"><span>Condutor</span><b>{vehicle.driver}</b></div>
                        <button onClick={() => setSelected(vehicle)} aria-label={`Visualizar ${vehicle.name}`}><Icon name="eye" /></button>
                        {isAdmin && <button className="delete-button" onClick={() => removeVehicle(vehicle.id)} aria-label={`Remover ${vehicle.name}`}><Icon name="trash" /></button>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state"><span><Icon name="search" size={28} /></span><h3>Nenhum veículo encontrado</h3><p>Tente ajustar sua busca ou selecionar outro filtro.</p></div>
            )}
          </section>
          </>}

          {page === 'vehicles' && <>
            <section className="page-hero">
              <div><span className="eyebrow">GESTÃO DA FROTA</span><h1>Todos os veículos</h1><p>Consulte, organize e mantenha os dados da sua frota sempre atualizados.</p></div>
              <div className="page-actions"><button className="secondary-button"><Icon name="download" size={17} />Exportar</button>{isAdmin && <button className="primary-button" onClick={() => setShowAdd(true)}><Icon name="plus" />Adicionar veículo</button>}</div>
            </section>
            <section className="compact-stats">
              <article><span className="compact-icon pale-blue"><Icon name="car" /></span><div><span>Total da frota</span><strong>{vehicles.length}</strong></div><small>+2 este mês</small></article>
              <article><span className="compact-icon pale-green"><Icon name="check" /></span><div><span>Disponíveis</span><strong>{vehicles.filter((v) => v.status === 'Disponível').length}</strong></div><small className="positive">Prontos para uso</small></article>
              <article><span className="compact-icon pale-amber"><Icon name="settings" /></span><div><span>Em manutenção</span><strong>{vehicles.filter((v) => v.status === 'Manutenção').length}</strong></div><small>Atenção necessária</small></article>
            </section>
            <section className="panel fleet-panel">
              <div className="panel-head"><div><h2>Inventário de veículos</h2><p>{filtered.length} veículos encontrados</p></div><button className="icon-button"><Icon name="dots" /></button></div>
              <div className="toolbar panel-toolbar">
                <label className="search-box"><Icon name="search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por modelo ou placa..." /></label>
                <div className="filter-group">
                  {['Todos', 'Disponível', 'Em uso', 'Manutenção'].map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>)}
                </div>
              </div>
              <div className="vehicle-table-wrap">
                <table className="data-table">
                  <thead><tr><th>VEÍCULO</th><th>PLACA</th><th>ANO</th><th>CONDUTOR</th><th>STATUS</th><th>QUILOMETRAGEM</th><th /></tr></thead>
                  <tbody>{filtered.map((vehicle) => <tr key={vehicle.id}>
                    <td><div className="table-vehicle"><img src={vehicle.image} alt="" /><div><b>{vehicle.name}</b><span>{vehicle.category}</span></div></div></td>
                    <td><span className="plate">{vehicle.plate}</span></td><td>{vehicle.year}</td>
                    <td><div className="table-driver"><span>{vehicle.driver === 'Sem condutor' ? '—' : vehicle.driver.split(' ').map((x) => x[0]).join('')}</span>{vehicle.driver}</div></td>
                    <td><Status value={vehicle.status} /></td><td>{vehicle.mileage}</td>
                    <td><div className="row-actions"><button onClick={() => setSelected(vehicle)} aria-label="Visualizar"><Icon name="eye" size={17} /></button>{isAdmin && <button onClick={() => removeVehicle(vehicle.id)} aria-label="Excluir"><Icon name="trash" size={17} /></button>}</div></td>
                  </tr>)}</tbody>
                </table>
                {!filtered.length && <div className="table-empty">Nenhum veículo corresponde aos filtros.</div>}
              </div>
            </section>
          </>}

          {page === 'routes' && <>
            <section className="page-hero">
              <div><span className="eyebrow">OPERAÇÃO EM TEMPO REAL</span><h1>Rotas e deslocamentos</h1><p>Planeje trajetos, acompanhe viagens e reduza o tempo da sua operação.</p></div>
              <button className="primary-button" onClick={() => setShowAddRoute(true)}><Icon name="plus" />Planejar rota</button>
            </section>
            <section className="route-layout">
              <div className="route-map">
                <div className="map-grid" />
                <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
                <span className="map-label label-one">Av. Paulista</span><span className="map-label label-two">Marginal Pinheiros</span>
                <div className="route-line line-one" /><div className="route-line line-two" />
                <span className="map-pin pin-start"><Icon name="location" size={17} /></span>
                <span className="map-pin pin-car"><Icon name="car" size={17} /></span>
                <span className="map-pin pin-end"><Icon name="location" size={17} /></span>
                <div className="map-card"><span className="live-dot" />Rota em andamento<strong>38 km · chegada 10:10</strong></div>
                <div className="map-tools"><button aria-label="Aproximar">+</button><button aria-label="Afastar">−</button></div>
              </div>
              <aside className="route-summary">
                <span className="eyebrow">RESUMO DE HOJE</span><h2>Operação saudável</h2><p>3 de 4 rotas dentro do horário planejado.</p>
                <div className="route-metric"><span><Icon name="route" /></span><div><small>Distância total</small><strong>128 km</strong></div></div>
                <div className="route-metric"><span><Icon name="clock" /></span><div><small>Tempo em trânsito</small><strong>4h 25min</strong></div></div>
                <div className="route-metric"><span><Icon name="gauge" /></span><div><small>Eficiência média</small><strong>92%</strong></div></div>
                <div className="efficiency-bar"><i /></div>
              </aside>
            </section>
            <section className="panel routes-panel">
              <div className="panel-head"><div><h2>Rotas de hoje</h2><p>Acompanhe os próximos deslocamentos da frota.</p></div><div className="filter-group"><button className="filter active">Todas</button><button className="filter">Ativas</button><button className="filter">Agendadas</button></div></div>
              <div className="route-list">{routes.map((route) => <article className="route-row" key={route.id}>
                <div className="route-time"><Icon name="clock" size={17} /><b>{route.time.split(' — ')[0]}</b><span>{route.time.split(' — ')[1]}</span></div>
                <div className="route-path"><i className="point start" /><span /><i className="point end" /></div>
                <div className="route-places"><div><small>ORIGEM</small><b>{route.origin}</b></div><div><small>DESTINO</small><b>{route.destination}</b></div></div>
                <div className="route-person"><span className="driver-avatar">{route.driver.split(' ').map((x) => x[0]).join('')}</span><div><small>{route.vehicle}</small><b>{route.driver}</b></div></div>
                <span className={`route-status ${route.status === 'Em andamento' ? 'live' : route.status === 'Concluída' ? 'done' : ''}`}>{route.status}</span>
                <button className="icon-button"><Icon name="chevron" size={17} /></button>
              </article>)}</div>
            </section>
          </>}

          {page === 'drivers' && <>
            <section className="page-hero">
              <div><span className="eyebrow">EQUIPE DE CONDUTORES</span><h1>Pessoas que movem a operação</h1><p>Acompanhe disponibilidade, desempenho e atribuições da sua equipe.</p></div>
              <button className="primary-button" onClick={() => setShowAddDriver(true)}><Icon name="plus" />Novo condutor</button>
            </section>
            <section className="driver-overview">
              {drivers.length > 0 && (
                <>
                  <article key={`highlight-${bestDriver!.id}`} className="driver-highlight"><div><span className="eyebrow">DESTAQUE DO MÊS</span><h2>{bestDriver!.name}</h2><p>Excelente desempenho em pontualidade e condução segura.</p><div className="score-line"><span><Icon name="star" size={17} />{bestDriver!.score}</span><span>{bestDriver!.trips} viagens</span><span>{Number(bestDriver!.score) >= 4 ? '98% pontual' : 'Acima da meta'}</span></div></div><div className="big-avatar">{bestDriver!.initials}<span><Icon name="spark" size={17} /></span></div></article>
                  <article className="team-stat"><span className="compact-icon pale-green"><Icon name="users" /></span><small>Condutores ativos</small><strong>{drivers.length}</strong><p>2 disponíveis agora</p></article>
                  <article className="team-stat"><span className="compact-icon pale-blue"><Icon name="shield" /></span><small>Índice de segurança</small><strong>96%</strong><p>Acima da meta mensal</p></article>
                </>
              )}
            </section>
            <section className="panel">
              <div className="panel-head"><div><h2>Todos os condutores</h2><p>Informações da equipe e status atual.</p></div><label className="search-box small-search"><Icon name="search" /><input placeholder="Buscar condutor..." /></label></div>
              <div className="drivers-grid">{drivers.map((driver, index) => <article className="driver-card" key={driver.id}>
                <div className={`driver-photo avatar-tone-${index % 4}`}>{driver.initials}<i className={driver.status === 'Disponível' ? 'online' : ''} /></div>
                <div className="driver-card-title"><div><h3>{driver.name}</h3><span>{driver.role}</span></div><button className="icon-button"><Icon name="dots" /></button>{isAdmin && <button className="icon-button" onClick={() => removeDriver(driver.id)} aria-label="Remover condutor"><Icon name="trash" /></button>}</div>
                <span className={`driver-status ${driver.status === 'Disponível' ? 'available' : driver.status === 'Em rota' ? 'driving' : ''}`}>{driver.status}</span>
                <div className="driver-contact"><span><Icon name="phone" size={15} />{driver.phone}</span><span><Icon name="car" size={15} />{driver.vehicle}</span></div>
                <div className="driver-numbers"><div><b>{driver.trips}</b><span>Viagens</span></div><div><div className="star-rating flex gap-1">{[1, 2, 3, 4, 5].map((n) => <span key={n} className={ratingDriver?.id === driver.id && ratingDriver.score >= n ? 'star active' : 'star'} onClick={() => rateDriver(driver.id, n)}><Icon name="star" size={13} /></span>)}</div><span>{driver.score}</span></div></div>
              </article>)}</div>
            </section>
          </>}

          {page === 'settings' && <>
            <section className="page-hero simple-hero">
              <div><span className="eyebrow">PREFERÊNCIAS DO SISTEMA</span><h1>Configurações</h1><p>Personalize sua conta, notificações e regras da operação.</p></div>
              <button className="primary-button" onClick={() => notify('Configurações salvas com sucesso')}><Icon name="check" />Salvar alterações</button>
            </section>
            <section className="settings-layout">
              <aside className="settings-nav">
                {[
                  ['Geral', 'settings'], ['Perfil e equipe', 'users'], ['Notificações', 'bell'], ['Segurança', 'shield'], ['Integrações', 'spark'],
                ].map(([item, icon]) => <button key={item} className={settingsTab === item ? 'active' : ''} onClick={() => setSettingsTab(item)}><Icon name={icon as IconName} />{item}<Icon name="chevron" size={15} /></button>)}
              </aside>
              <div className="settings-content">
                {settingsTab === 'Geral' && <>
                  <div className="settings-head"><span className="settings-icon"><Icon name="settings" /></span><div><h2>Informações da empresa</h2><p>Dados básicos exibidos nos relatórios e documentos.</p></div></div>
                  <div className="settings-form"><label>Nome da empresa<input defaultValue="Luna Template pra Gerenciamento de Veículos Ltda." /></label><div className="form-row"><label>CNPJ<input defaultValue="00.000.000/0001-00" /></label><label>Telefone<input defaultValue="(00) 0000-0000" /></label></div><label>E-mail administrativo<input defaultValue="template@gmail.com" /></label><label>Endereço<input defaultValue="São Paulo, SP" /></label></div>
                  <div className="settings-divider" />
                  <div className="settings-head compact"><span className="settings-icon"><Icon name="gauge" /></span><div><h2>Preferências da frota</h2><p>Unidades e padrões usados na plataforma.</p></div></div>
                  <div className="settings-form"><div className="form-row"><label>Unidade de distância<select defaultValue="Quilômetros (km)"><option>Quilômetros (km)</option><option>Milhas (mi)</option></select></label><label>Formato de data<select defaultValue="DD/MM/AAAA"><option>DD/MM/AAAA</option><option>MM/DD/AAAA</option></select></label></div></div>
                </>}
                {settingsTab === 'Perfil e equipe' && <SettingsPlaceholder icon="users" title="Perfil e equipe" text="Gerencie seus dados pessoais e as permissões dos membros da equipe." action="Gerenciar equipe" />}
                {settingsTab === 'Notificações' && <div><div className="settings-head"><span className="settings-icon"><Icon name="bell" /></span><div><h2>Notificações</h2><p>Escolha quais atualizações deseja receber.</p></div></div><div className="toggle-list">
                  <Toggle label="Alertas de manutenção" text="Receba avisos quando um veículo precisar de revisão." checked={notifications.maintenance} onClick={() => setNotifications((n) => ({ ...n, maintenance: !n.maintenance }))} />
                  <Toggle label="Atualizações de rotas" text="Mudanças, atrasos e conclusão de trajetos." checked={notifications.routes} onClick={() => setNotifications((n) => ({ ...n, routes: !n.routes }))} />
                  <Toggle label="Resumo semanal" text="Um relatório consolidado toda segunda-feira." checked={notifications.weekly} onClick={() => setNotifications((n) => ({ ...n, weekly: !n.weekly }))} />
                </div></div>}
                {settingsTab === 'Segurança' && <SettingsPlaceholder icon="shield" title="Segurança e acesso" text="Altere sua senha, ative autenticação em duas etapas e consulte sessões." action="Revisar segurança" />}
                {settingsTab === 'Integrações' && <SettingsPlaceholder icon="spark" title="Integrações" text="Conecte a Nexo a serviços de rastreamento, mapas e gestão." action="Ver integrações" />}
              </div>
            </section>
          </>}

          {page === 'help' && <>
            <section className="help-hero">
              <span className="help-icon"><Icon name="help" size={27} /></span><span className="eyebrow">CENTRAL DE AJUDA</span><h1>Como podemos ajudar?</h1><p>Encontre respostas rápidas ou fale com nosso time de suporte.</p>
              <label className="help-search"><Icon name="search" /><input value={helpSearch} onChange={(e) => setHelpSearch(e.target.value)} placeholder="Busque por uma dúvida, recurso ou palavra-chave..." /><kbd>⌘ K</kbd></label>
            </section>
            <section className="help-categories">
              {[
                ['car', 'Veículos', 'Cadastros, documentos e manutenção', '12 artigos'],
                ['route', 'Rotas', 'Planejamento e acompanhamento', '8 artigos'],
                ['users', 'Condutores', 'Equipe, permissões e desempenho', '10 artigos'],
                ['settings', 'Configurações', 'Conta, integrações e preferências', '7 artigos'],
              ].filter((item) => !helpSearch || `${item[1]} ${item[2]}`.toLowerCase().includes(helpSearch.toLowerCase())).map(([icon, title, text, count]) => <button className="help-category" key={title} onClick={() => { setPage(title === 'Veículos' ? 'vehicles' : title === 'Rotas' ? 'routes' : title === 'Condutores' ? 'drivers' : 'settings'); setShowLogin(false); }}><span><Icon name={icon as IconName} /></span><h3>{title}</h3><p>{text}</p><small>{count}<Icon name="arrow" size={15} /></small></button>)}
            </section>
            <section className="help-main">
              <div className="faq-panel panel"><div className="panel-head"><div><h2>Perguntas frequentes</h2><p>As dúvidas mais comuns de quem usa a Nexo.</p></div></div>
                <div className="faq-list">{[
                  ['Como cadastrar um novo veículo?', 'Acesse Veículos no menu lateral, clique em “Adicionar veículo” e preencha os dados de modelo, placa, ano e categoria.'],
                  ['Como atribuir um condutor a um veículo?', 'Na tela de Condutores, abra o perfil desejado e selecione o veículo disponível para atribuição.'],
                  ['Posso acompanhar uma rota em tempo real?', 'Sim. A tela de Rotas exibe os deslocamentos ativos e a posição mais recente enviada pelo veículo.'],
                  ['Como recebo alertas de manutenção?', 'Ative os alertas em Configurações → Notificações. Você poderá escolher os canais e a antecedência.'],
                ].map(([question, answer], index) => <article className={openFaq === index ? 'faq open' : 'faq'} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)}><b>{question}</b><span>+</span></button><p>{answer}</p></article>)}</div>
              </div>
              <aside className="support-card"><span className="support-icon"><Icon name="message" /></span><span className="eyebrow">SUPORTE NEXO</span><h2>Ainda precisa de ajuda?</h2><p>Nossa equipe está disponível de segunda a sexta, das 8h às 18h.</p><button className="lime-button" onClick={() => notify('Conversa iniciada com o suporte')}><Icon name="message" size={17} />Falar com especialista</button><button className="support-mail"><Icon name="mail" size={16} />suporte@nexo.com.br</button></aside>
            </section>
          </>}


               </>
        )}
      </div>
      </main>

      {showAdd && (
        <div className="modal-backdrop" onMouseDown={() => setShowAdd(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head"><div><span className="eyebrow">NOVA ENTRADA</span><h2>Adicionar veículo</h2><p>Preencha os dados principais do novo veículo.</p></div><button onClick={() => setShowAdd(false)} aria-label="Fechar"><Icon name="close" /></button></div>
            <form onSubmit={addVehicle}>
              <label>Modelo<input required name="name" placeholder="Ex.: Volvo XC60" /></label>
              <div className="form-row"><label>Marca<input required name="marca" placeholder="Ex.: Ford" /></label><label>Placa<input required name="plate" maxLength={8} placeholder="ABC-1D23" /></label><label>Ano<input required name="year" type="number" min="1990" max="2030" defaultValue="2024" /></label></div>
              <label>Categoria<select name="category" defaultValue="SUV"><option>SUV</option><option>Sedan</option><option>Elétrico</option><option>Utilitário</option></select></label>
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowAdd(false)}>Cancelar</button><button className="primary-button" type="submit"><Icon name="plus" />Adicionar à frota</button></div>
            </form>
          </div>
        </div>
      )}

      {showAddRoute && (
        <div className="modal-backdrop" onMouseDown={() => setShowAddRoute(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head"><div><span className="eyebrow">NOVO DESLOCAMENTO</span><h2>Planejar rota</h2><p>Defina o trajeto e os responsáveis pela viagem.</p></div><button onClick={() => setShowAddRoute(false)} aria-label="Fechar"><Icon name="close" /></button></div>
            <form onSubmit={addRoute}>
              <div className="form-row"><label>Origem<input required name="origin" placeholder="Local de partida" /></label><label>Destino<input required name="destination" placeholder="Local de chegada" /></label></div>
              <label>Veículo<select required name="vehicle" defaultValue=""><option value="" disabled>Selecione um veículo</option>{vehicles.map((vehicle) => <option key={vehicle.id}>{vehicle.name}</option>)}</select></label>
              <div className="form-row"><label>Condutor<select required name="driver" defaultValue=""><option value="" disabled>Selecione</option>{drivers.map((driver) => <option key={driver.id}>{driver.name}</option>)}</select></label><label>Horário<input required name="time" placeholder="Ex.: 09:30 — 11:00" /></label></div>
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowAddRoute(false)}>Cancelar</button><button className="primary-button" type="submit"><Icon name="route" />Agendar rota</button></div>
            </form>
          </div>
        </div>
      )}

      {showAddDriver && (
        <div className="modal-backdrop" onMouseDown={() => setShowAddDriver(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head"><div><span className="eyebrow">NOVA PESSOA</span><h2>Adicionar condutor</h2><p>Cadastre um novo membro da equipe operacional.</p></div><button onClick={() => setShowAddDriver(false)} aria-label="Fechar"><Icon name="close" /></button></div>
            <form onSubmit={addDriver}>
              <label>Nome completo<input required name="name" placeholder="Nome do condutor" /></label>
              <div className="form-row"><label>Telefone<input required name="phone" placeholder="(11) 99999-9999" /></label><label>Função<select name="role"><option>Motorista</option><option>Motorista sênior</option><option>Supervisor</option></select></label></div>
              <label>E-mail<input required type="email" name="email" placeholder="condutor@empresa.com.br" /></label>
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowAddDriver(false)}>Cancelar</button><button className="primary-button" type="submit"><Icon name="plus" />Adicionar à equipe</button></div>
            </form>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal-backdrop" onMouseDown={() => { setShowLogin(false); setIsRegistering(false); }}>
          <div className="modal login-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => { setShowLogin(false); setIsRegistering(false); }} aria-label="Fechar"><Icon name="close" /></button>
            <span className="brand-mark login-mark"><Icon name="car" size={27} /></span>
            <span className="eyebrow">{isRegistering ? 'CADASTRO DE USUÁRIO' : 'BEM-VINDO À NEXO'}</span>
            <h2>{isRegistering ? 'Criar nova conta' : 'Acesse sua frota'}</h2>
            <p>{isRegistering ? 'Cadastre-se como Editor para gerenciar veículos e frotas.' : 'Entre para continuar gerenciando seus veículos.'}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const email = String(form.get('email') || '').trim();
              const senha = String(form.get('senha') || '');
              if (isRegistering) {
                handleCadastro(email, senha);
              } else {
                handleLogin(email, senha);
              }
            }}>
              <label>E-mail<input required type="email" name="email" placeholder="voce@empresa.com.br" /></label>
              <label>Senha<input required type="password" name="senha" placeholder="••••••••" /></label>
              <button className="primary-button login-submit" type="submit" disabled={loading}>
                {loading ? 'Aguarde...' : (isRegistering ? 'Criar conta de Editor' : 'Entrar')} <Icon name="arrow" />
              </button>
            </form>
            <div style={{ marginTop: '15px', fontSize: '13px', color: '#666', textAlign: 'center' }}>
              {isRegistering ? (
                <a href="#" onClick={(e) => { e.preventDefault(); setIsRegistering(false); }} style={{ textDecoration: 'underline', color: '#333' }}>
                  Já tem uma conta? Faça login
                </a>
              ) : (
                <a href="#" onClick={(e) => { e.preventDefault(); setIsRegistering(true); }} style={{ textDecoration: 'underline', color: '#333' }}>
                  Não tem conta? Crie uma conta de Editor
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <div className="modal details-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="details-image"><img src={selected.image} alt={selected.name} /><button onClick={() => setSelected(null)} aria-label="Fechar"><Icon name="close" /></button></div>
            <div className="details-body"><div className="details-title"><div><span className="eyebrow">{selected.category}</span><h2>{selected.name}</h2></div><Status value={selected.status} /></div>
              <div className="details-grid"><div><span>Marca</span><b>{selected.marca}</b></div><div><span>Placa</span><b>{selected.plate}</b></div><div><span>Ano</span><b>{selected.year}</b></div><div><span>Quilometragem</span><b>{selected.mileage}</b></div><div><span>Condutor</span><b>{selected.driver}</b></div></div>
              <div className="modal-actions">{isAdmin && <button className="delete-wide" onClick={() => removeVehicle(selected.id)}><Icon name="trash" />Remover veículo</button>}<button className="primary-button" onClick={() => setSelected(null)}>Concluir</button></div>
            </div>
          </div>
        </div>
      )}

           {toast && (
        <div className="toast">
          <span>
            <Icon name="check" size={16} />
          </span>
          {toast}
        </div>
      )}
    </div>
  )
}
import { FormEvent, ReactNode, useMemo, useState, useEffect } from 'react'
import { login, logout, cadastrarConta, getVeiculos, criarVeiculo, deletarVeiculo, buscarVeiculoPorId } from './services/api'

type Vehicle = {
  id: number
  name: string
  plate: string
  category: 'SUV' | 'Sedan' | 'Elétrico' | 'Utilitário'
  year: number
  mileage: string
  status: 'Disponível' | 'Em uso' | 'Manutenção'
  image: string
  driver: string
}

const categoryOptions = ['SUV', 'Sedan', 'Elétrico', 'Utilitário'] as const
const statusOptions = ['Disponível', 'Em uso', 'Manutenção'] as const

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
  | 'door'

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
  door: <><path d="M5 19h14" /><polyline points="2 6 20 6" /><line x1="10" y1="11" x2="10" y2="19" /><line x1="18" y1="11" x2="18" y2="19" /></>,
}

const DEFAULT_VEHICLE_IMAGE = '/icone.jpg'

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

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [showAdd, setShowAdd] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showCadastro, setShowCadastro] = useState(false)
  const [selected, setSelected] = useState<Vehicle | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'))
const [perfil, setPerfil] = useState<string | null>(localStorage.getItem('perfil'))

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  async function handleLogout() {
    logout()
    setToken(null)
    setUserEmail(null)
    setPerfil(null)
    setVehicles([])
    setShowLogin(false)
    notify('Logout realizado')
  }

  const filtered = useMemo(() => vehicles.filter((vehicle) => {
    const matchesSearch = `${vehicle.name} ${vehicle.plate}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (filter === 'Todos' || vehicle.status === filter)
  }), [vehicles, search, filter])

  useEffect(() => {
    if (token) {
      loadVehicles()
    }
  }, [token])

  // Inicializar vehicles do localStorage se existir
  useEffect(() => {
    const stored = localStorage.getItem('vehicles')
    if (stored) {
      setVehicles(JSON.parse(stored))
    }
  }, [])

  function removeVehicle(event: React.MouseEvent<HTMLButtonElement>, id: number) {
    event.preventDefault()
    if (!token) {
      setToast('Faça login para excluir veículos')
      return
    }
    if (perfil !== 'Adm') {
      setToast('Apenas administradores podem remover veículos')
      return
    }
    if (confirm('Tem certeza que deseja remover este veículo?')) {
      deletarVeiculo(id, token)
        .then(() => {
          setToast('Veículo removido com sucesso')
          loadVehicles()
        })
        .catch((err) => setToast(err.message))
    }
  }

  async function loadVehicles() {
    setLoading(true)
    try {
      const data = await getVeiculos(token!)
      setVehicles(data)
    } catch (error) {
      setToast('Erro ao carregar veículos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function addVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name'))
    const marca = String(data.get('marca'))
    const plate = String(data.get('plate')).toUpperCase()
    const category = String(data.get('category')) as Vehicle['category']

    if (!token) {
      setShowLogin(true)
      setToast('Faça login para adicionar veículos')
      return
    }

    criarVeiculo(
      { name, marca, plate, category, year: Number(data.get('year')), mileage: '0 km', status: 'Disponível', driver: 'Sem condutor' },
      token
    )
      .then(() => {
        setShowAdd(false)
        notify('Veículo adicionado com sucesso')
        loadVehicles()
      })
      .catch((err) => setToast(err.message))
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email'))
    const senha = String(data.get('password'))

    try {
      const result = await login(email, senha)
      setToken(result.token)
      setUserEmail(result.email)
      setPerfil(result.perfil)
      setShowLogin(false)
      notify('Login realizado com sucesso')
      loadVehicles()
    } catch (error) {
      setToast((error as Error).message)
    }
  }

  async function handleCadastro(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email'))
    const senha = String(data.get('password'))

    try {
      await cadastrarConta(email, senha)
      notify('Conta de Editor criada com sucesso! Agora pode fazer login.')
      setShowCadastro(false)
      setShowLogin(true)
    } catch (error) {
      setToast((error as Error).message)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadVehicleDetails() {
      if (selected && token) {
        try {
          const data = await buscarVeiculoPorId(selected.id, token)
          if (isMounted) {
            setSelected(data)
          }
        } catch (error) {
          setToast('Erro ao carregar detalhes do veículo')
        }
      }
    }

    loadVehicleDetails()

    return () => {
      isMounted = false
    }
  }, [selected, token])

  return (
    <div className="app-shell">
      <aside className={menuOpen ? 'sidebar sidebar-open' : 'sidebar'}>
        <div className="brand"><span className="brand-mark"><Icon name="car" size={24} /></span><strong>nexus</strong></div>
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><Icon name="close" /></button>
        <nav>
          <span className="nav-label">GESTÃO</span>
          <button className="nav-item active"><Icon name="grid" />Visão geral</button>
          <button className="nav-item"><Icon name="car" />Veículos<span className="nav-count">{vehicles.length}</span></button>
          <button className="nav-item"><Icon name="route" />Rotas</button>
          <button className="nav-item"><Icon name="users" />Condutores</button>
          <span className="nav-label nav-label-second">SISTEMA</span>
          <button className="nav-item"><Icon name="settings" />Configurações</button>
          <button className="nav-item"><Icon name="help" />Central de ajuda</button>
        </nav>
        <div className="sidebar-card">
          <span className="sidebar-card-icon"><Icon name="gauge" /></span>
          <strong>Controle sua frota</strong>
          <p>Tenha decisões mais rápidas com dados centralizados.</p>
          <button>Ver relatório <Icon name="arrow" size={16} /></button>
        </div>
        {token && (
          <button className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto' }}>
            <Icon name="door" />Sair
          </button>
        )}
        <div className="sidebar-user">
          <div className="avatar">{userEmail ? userEmail.charAt(0).toUpperCase() : 'RN'}</div>
          <div>
            <strong>{userEmail || 'Rafael Nunes'}</strong>
            <span>{token ? 'Logado' : 'Não logado'}</span>
          </div>
          <Icon name="dots" />
        </div>
      </aside>

      {menuOpen && <button className="sidebar-backdrop" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}

      <main>
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Icon name="menu" /></button>
          <div className="breadcrumbs"><span>Frota</span><Icon name="chevron" size={14} /><b>Visão geral</b></div>
          <div className="top-actions">
            <button className="notification" aria-label="Notificações"><Icon name="bell" /><i /></button>
            {token ? (
              <button className="login-button" onClick={handleLogout}><span className="login-avatar">{userEmail?.charAt(0).toUpperCase()}</span><span className="login-copy"><b>{userEmail}</b><small>Sair</small></span><Icon name="chevron" size={15} /></button>
            ) : (
              <button className="login-button" onClick={() => setShowLogin(true)}><span className="login-avatar">RN</span><span className="login-copy"><b>Entrar</b><small>Acessar conta</small></span><Icon name="chevron" size={15} /></button>
            )}
          </div>
        </header>

        <div className="content">
          {token ? (
            <>
              <section className="welcome">
                <div>
                  <span className="eyebrow">PAINEL DA FROTA</span>
                  <h1>Olá, {userEmail ? userEmail.split('@')[0] : 'usuário'}. <span>Vamos acelerar?</span></h1>
                  <p>Acompanhe o desempenho e mantenha sua operação sempre em movimento.</p>
                </div>
                {!loading && perfil === 'Adm' && (
                  <button className="primary-button" onClick={() => setShowAdd(true)} disabled={loading}><Icon name="plus" />Adicionar veículo</button>
                )}
                {loading && <button className="primary-button" disabled><Icon name="check" size={14} />Carregando...</button>}
              </section>
            </>
          ) : (
            <div className="empty-state">
              <span className="eyebrow">FAÇA LOGIN</span>
              <h2>Acesse sua frota</h2>
              <p>Entre com suas credenciais para começar a gerenciar seus veículos.</p>
            </div>
          )}

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
                      <img src={vehicle.image || DEFAULT_VEHICLE_IMAGE} alt={`${vehicle.name} na frota`} />
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
                        <button
                            className="delete-button"
                            onClick={(e) => removeVehicle(e, vehicle.id)}
                            aria-label={`Remover ${vehicle.name}`}
                        >
                            <Icon name="trash" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span><Icon name="search" size={28} /></span>
                <h3>Nenhum veículo encontrado</h3>
                <p>Tente ajustar sua busca ou selecionar outro filtro.</p>
                {vehicles.length === 0 && <p>Faça login para ver os veículos da sua frota.</p>}
              </div>
            )}
          </section>
        </div>
      </main>

      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head"><div><span className="eyebrow">NOVA ENTRADA</span><h2>Adicionar veículo</h2><p>Preencha os dados principais do novo veículo.</p></div><button onClick={() => setShowAdd(false)} aria-label="Fechar"><Icon name="close" /></button></div>
            <form onSubmit={addVehicle}>
              <label>Modelo<input required name="name" placeholder="Ex.: Volvo XC60" /></label>
              <label>Marca<input required name="marca" placeholder="Ex.: Chevrolet" /></label>
              <div className="form-row"><label>Placa<input required name="plate" maxLength={8} placeholder="ABC-1D23" /></label><label>Ano<input required name="year" type="number" min="1990" max="2030" defaultValue="2024" /></label></div>
              <label>Categoria<select name="category" defaultValue="SUV"><option>SUV</option><option>Sedan</option><option>Elétrico</option><option>Utilitário</option></select></label>
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowAdd(false)}>Cancelar</button><button className="primary-button" type="submit"><Icon name="plus" />Adicionar à frota</button></div>
            </form>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal-backdrop" onClick={() => setShowLogin(false)}>
          <div className="modal login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setShowLogin(false)} aria-label="Fechar"><Icon name="close" /></button>
            <span className="brand-mark login-mark"><Icon name="car" size={27} /></span>
            <span className="eyebrow">BEM-VINDO À NEXUS</span><h2>Acesse sua frota</h2><p>Entre para continuar gerenciando seus veículos.</p>
            <form onSubmit={handleLogin}>
              <label>E-mail<input required type="email" name="email" placeholder="voce@empresa.com.br" /></label>
              <label>Senha<input required type="password" name="password" placeholder="••••••••" /></label>
              <div className="login-options"><label className="checkbox"><input type="checkbox" />Lembrar de mim</label><button type="button">Esqueci minha senha</button></div>
              <button className="primary-button login-submit" type="submit">Entrar <Icon name="arrow" /></button>
            </form>
            { !perfil && (
              <div style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                <a href="#" onClick={() => setShowCadastro(true)} style={{ textDecoration: 'underline', color: '#333' }}>
                  Não tem conta? Crie uma conta de Editor
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      { showCadastro && (
        <div className="modal-backdrop" onClick={() => setShowCadastro(false)}>
          <div className="modal login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setShowCadastro(false)} aria-label="Fechar"><Icon name="close" /></button>
            <span className="brand-mark login-mark"><Icon name="car" size={27} /></span>
            <span className="eyebrow">CADASTRO DE EDITOR</span><h2>Registre-se para acesso de leitura</h2><p>Preencha os dados para criar uma conta de Editor (apenas visualização de veículos).</p>
            <form onSubmit={handleCadastro}>
              <label>E-mail<input required type="email" name="email" placeholder="seu@email.com.br" /></label>
              <label>Senha<input required type="password" name="password" placeholder="••••••••" /></label>
              <button className="primary-button login-submit" type="submit">Criar Conta</button>
            </form>
          </div>
        </div>
      )}

      {selected && token && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal details-modal">
            <div className="details-image">
              <img src={selected.image || DEFAULT_VEHICLE_IMAGE} alt={selected.name} />
              <button onClick={() => setSelected(null)} aria-label="Fechar">
                <Icon name="close" />
              </button>
            </div>
            <div className="details-body">
              <div className="details-title">
                <div><span className="eyebrow">{selected.category}</span><h2>{selected.name}</h2></div>
                <Status value={selected.status} />
              </div>
              <div className="details-grid">
                <div><span>Placa</span><b>{selected.plate}</b></div>
                <div><span>Ano</span><b>{selected.year}</b></div>
                <div><span>Quilometragem</span><b>{selected.mileage}</b></div>
                <div><span>Condutor</span><b>{selected.driver}</b></div>
              </div>
            </div>
            <div className="modal-actions">
            {perfil === 'Adm' && (
              <button className="delete-wide" onClick={(e) => removeVehicle(e, selected.id)}>
                <Icon name="trash" />Remover veículo
              </button>
            )}
              <button className="primary-button" onClick={() => setSelected(null)}>Concluir</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><span><Icon name="check" size={16} /></span>{toast}</div>}
    </div>
  )
}

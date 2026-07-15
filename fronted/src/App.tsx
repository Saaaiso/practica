import { useState, useEffect } from 'react'
import TypeStatsChart, { type TypeTotal } from './TypeStatsChart'
import MonthlyStatsChart, { type MonthByTypeRow } from './MonthlyStatsChart'
import DailyStatsChart, { type DayByTypeRow } from './DailyStatsChart'
import './App.css'

const API_BASE = ''

interface PeriodStat {
  month?: string
  day?: string
  count: number
}

interface TypeStat {
  type: string
  months?: PeriodStat[]
  days?: PeriodStat[]
}

function App() {
  const [typeMonthStats, setTypeMonthStats] = useState<TypeStat[]>([])
  const [typeDayStats, setTypeDayStats] = useState<TypeStat[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    const [monthRes, dayRes] = await Promise.all([
      fetch(`${API_BASE}/Tickets/stats-by-type-and-month`),
      fetch(`${API_BASE}/Tickets/stats-by-type-and-day`),
    ])
    if (!monthRes.ok) throw new Error(`Ошибка получения статистики по месяцам: ${monthRes.status}`)
    if (!dayRes.ok) throw new Error(`Ошибка получения статистики по дням: ${dayRes.status}`)

    setTypeMonthStats(await monthRes.json())
    setTypeDayStats(await dayRes.json())
  }

  const handleUpdate = async () => {
    setLoading(true)
    setError(null)
    try {
      const syncResponse = await fetch(`${API_BASE}/Tickets/glpi_synk_tickets`, {
        method: 'POST',
      })
      if (!syncResponse.ok) throw new Error(`Ошибка синхронизации: ${syncResponse.status}`)
      await syncResponse.json()
      await fetchStats()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleUpdate()
  }, [])

  // По типам — суммарно
  const typeTotals: TypeTotal[] = typeMonthStats.map((t) => ({
    type: t.type,
    count: (t.months ?? []).reduce((sum, m) => sum + m.count, 0),
  }))

  // По месяцам, разбито по типам
  const allTypes = typeMonthStats.map((t) => t.type)
  const monthSet = new Set<string>()
  typeMonthStats.forEach((t) => (t.months ?? []).forEach((m) => monthSet.add(m.month!)))
  const months = Array.from(monthSet).sort()

  const monthByType: MonthByTypeRow[] = months.map((month) => {
    const row: MonthByTypeRow = { month }
    typeMonthStats.forEach((t) => {
      const found = (t.months ?? []).find((m) => m.month === month)
      row[t.type] = found ? found.count : 0
    })
    return row
  })

  // По дням, разбито по типам
  const daySet = new Set<string>()
  typeDayStats.forEach((t) => (t.days ?? []).forEach((d) => daySet.add(d.day!)))
  const days = Array.from(daySet).sort()

  const dayByType: DayByTypeRow[] = days.map((day) => {
    const row: DayByTypeRow = { day }
    typeDayStats.forEach((t) => {
      const found = (t.days ?? []).find((d) => d.day === day)
      row[t.type] = found ? found.count : 0
    })
    return row
  })

  const totalTickets = typeTotals.reduce((sum, t) => sum + t.count, 0)

  return (
    <section id="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Статистика тикетов GLPI</h1>
          <p className="subtitle">Синхронизация с внешним источником данных</p>
        </div>
        <button className="btn-primary" onClick={handleUpdate} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" /> Обновление...
            </>
          ) : (
            'Обновить данные'
          )}
        </button>
      </header>

      {error && <div className="error-banner">⚠ {error}</div>}

      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-label">Всего тикетов</span>
          <span className="stat-value">{totalTickets}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Типов тикетов</span>
          <span className="stat-value">{typeTotals.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Дней в статистике</span>
          <span className="stat-value">{days.length}</span>
        </div>
      </div>

      <TypeStatsChart data={typeTotals} loading={loading} />
      <DailyStatsChart data={dayByType} types={allTypes} loading={loading} />
      <MonthlyStatsChart data={monthByType} types={allTypes} loading={loading} />
    </section>
  )
}

export default App
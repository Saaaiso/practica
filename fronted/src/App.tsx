import { useState, useEffect } from 'react'
import TypeStatsChart, { type TypeTotal } from './TypeStatsChart'
import MonthlyStatsChart, { type MonthByTypeRow } from './MonthlyStatsChart'
import DailyStatsChart, { type DayByTypeRow } from './DailyStatsChart'
import PriorityStatsChart, { type PriorityByTypeRow } from './PriorityStatsChart'
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

interface PriorityStat {
  priorities: string
  count: number
}

interface TypePriorityStat {
  type: string
  status: PriorityStat[]
}

// Маппер для красивых названий типов
const typeNameMap: Record<string, string> = {
  'Incident': '🔴 Инцидент',
  'ChangeRequest': '🟢 Запрос на изменение',
}

const getTypeName = (type: string): string => typeNameMap[type] || type

// Порядок и русские названия приоритетов (соответствует enum GlpiTicketPriority)
const priorityOrder = ['VeryLow', 'Low', 'Medium', 'High', 'VeryHigh', 'Major']
const priorityNameMap: Record<string, string> = {
  VeryLow: 'Очень низкий',
  Low: 'Низкий',
  Medium: 'Средний',
  High: 'Высокий',
  VeryHigh: 'Очень высокий',
  Major: 'Критический',
}

function App() {
  const [typeMonthStats, setTypeMonthStats] = useState<TypeStat[]>([])
  const [typeDayStats, setTypeDayStats] = useState<TypeStat[]>([])
  const [typePriorityStats, setTypePriorityStats] = useState<TypePriorityStat[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      const [monthRes, dayRes, priorityRes] = await Promise.all([
        fetch(`${API_BASE}/Tickets/stats-by-type-and-month`),
        fetch(`${API_BASE}/Tickets/stats-by-type-and-day`),
        fetch(`${API_BASE}/Tickets/stats-by-type-and-priority`),
      ])
      if (!monthRes.ok) throw new Error(`Ошибка получения статистики по месяцам: ${monthRes.status}`)
      if (!dayRes.ok) throw new Error(`Ошибка получения статистики по дням: ${dayRes.status}`)
      if (!priorityRes.ok) throw new Error(`Ошибка получения статистики по приоритетам: ${priorityRes.status}`)

      const monthData = await monthRes.json()
      const dayData = await dayRes.json()
      const priorityData = await priorityRes.json()

      setTypeMonthStats(monthData)
      setTypeDayStats(dayData)
      setTypePriorityStats(priorityData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных')
      console.error(err)
    }
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
    fetchStats()
  }, [])

  // По типам — суммарно
  const typeTotals: TypeTotal[] = typeMonthStats.map((t) => ({
    type: getTypeName(t.type),
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

  // По приоритетам, разбито по типам (в фиксированном порядке важности)
  const priorityTypes = typePriorityStats.map((t) => t.type)
  const priorityByType: PriorityByTypeRow[] = priorityOrder
    .map((priorityKey) => {
      const row: PriorityByTypeRow = { priority: priorityNameMap[priorityKey] }
      typePriorityStats.forEach((t) => {
        const found = t.status.find((s) => s.priorities === priorityKey)
        row[t.type] = found ? found.count : 0
      })
      return row
    })
    // убираем строки приоритетов, которых вообще нет в данных
    .filter((row) =>
      priorityTypes.some((type) => Number(row[type]) > 0)
    )

  const totalTickets = typeTotals.reduce((sum, t) => sum + t.count, 0)
  console.log('RAW typePriorityStats:', JSON.stringify(typePriorityStats, null, 2))
  console.log('priorityTypes:', priorityTypes)
  console.log('priorityByType:', priorityByType)

  return (
    <section id="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>📊 Статистика тикетов GLPI</h1>
          <p className="subtitle">Синхронизация и аналитика с внешним источником данных</p>
        </div>
        <button className="btn-primary" onClick={handleUpdate} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" /> Обновление...
            </>
          ) : (
            '🔄 Обновить данные'
          )}
        </button>
      </header>

      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="stat-cards">
        <div className="stat-card stat-card--primary">
          <span className="stat-label">📈 Всего тикетов</span>
          <span className="stat-value">{totalTickets}</span>
        </div>
        <div className="stat-card stat-card--secondary">
          <span className="stat-label">🏷️ Типов тикетов</span>
          <span className="stat-value">{typeTotals.length}</span>
        </div>
        <div className="stat-card stat-card--tertiary">
          <span className="stat-label">📅 Дней в данных</span>
          <span className="stat-value">{days.length}</span>
        </div>
      </div>

      <TypeStatsChart data={typeTotals} loading={loading} />
      {priorityByType.length > 0 && (
        <PriorityStatsChart data={priorityByType} types={priorityTypes} loading={loading} />
      )}
      {dayByType.length > 0 && (
        <DailyStatsChart data={dayByType} types={allTypes} loading={loading} />
      )}
      {monthByType.length > 0 && (
        <MonthlyStatsChart data={monthByType} types={allTypes} loading={loading} />
      )}
    </section>
  )
}

export default App
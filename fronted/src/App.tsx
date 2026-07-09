
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import './App.css'

const API_BASE = '' // proxy сам подставит адрес через vite.config.js

function App() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [view, setView] = useState('table') // 'table' или 'chart'

  // Получить статистику из своей БД (GET)
  const fetchStats = async () => {
    const response = await fetch(`${API_BASE}/api/tickets/monthly-stats`)
    if (!response.ok) throw new Error(`Ошибка получения статистики: ${response.status}`)
    const data = await response.json()
    setStats(data)
  }

  // Синхронизация с GLPI (POST), затем сразу обновление статистики (GET)
  const handleUpdate = async () => {
    setLoading(true)
    setError(null)
    try {
      const syncResponse = await fetch(`${API_BASE}/api/sync/glpi-tickets`, {
        method: 'POST',
      })
      if (!syncResponse.ok) throw new Error(`Ошибка синхронизации: ${syncResponse.status}`)
      await syncResponse.json() // { message: "Синхронизировано N тикетов" }

      // сразу за POST — вызываем GET, чтобы подтянуть свежие данные
      await fetchStats()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // При первой загрузке страницы — сразу синхронизация + статистика
  useEffect(() => {
    handleUpdate()
  }, [])

  return (
    <section id="center">
      <div>
        <h1>Статистика тикетов GLPI</h1>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button className="counter" onClick={handleUpdate} disabled={loading}>
          {loading ? 'Обновление...' : 'Обновить'}
        </button>

        <button
          className="counter"
          onClick={() => setView(view === 'table' ? 'chart' : 'table')}
        >
          {view === 'table' ? 'Показать график' : 'Показать таблицу'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

      {view === 'table' ? (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Месяц</th>
              <th>Количество тикетов</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((item) => (
              <tr key={item.month}>
                <td>{item.month}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default App
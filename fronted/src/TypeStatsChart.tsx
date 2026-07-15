import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import './TypeStatsChart.css'

export interface TypeTotal {
  type: string
  count: number
}

interface Props {
  data: TypeTotal[]
  loading: boolean
}

function TypeStatsChart({ data, loading }: Props) {
  return (
    <div className="content-card">
      <h2 className="chart-title">Тикеты по типам</h2>
      {loading && data.length === 0 ? (
        <div className="skeleton" />
      ) : data.length === 0 ? (
        <p className="empty-state">Нет данных для отображения</p>
      ) : (
        <div className="chart-box">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default TypeStatsChart
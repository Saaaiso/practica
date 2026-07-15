import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import './MonthlyStatsChart.css'

export interface MonthByTypeRow {
  month: string
  [type: string]: string | number
}

const TYPE_LABELS: Record<string, string> = {
  Incident: 'Инцидент',
  ChangeRequest: 'Запрос на изменение',
}

const TYPE_COLORS: Record<string, string> = {
  Incident: '#e07856',
  ChangeRequest: 'var(--accent)',
}

interface Props {
  data: MonthByTypeRow[]
  types: string[]
  loading: boolean
}

function MonthlyStatsChart({ data, types, loading }: Props) {
  return (
    <div className="content-card">
      <h2 className="chart-title">Тикеты по месяцам</h2>
      {loading && data.length === 0 ? (
        <div className="skeleton" />
      ) : data.length === 0 ? (
        <p className="empty-state">Нет данных для отображения</p>
      ) : (
        <div className="chart-box chart-box--tall">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend formatter={(value) => TYPE_LABELS[value as string] ?? value} />
              {types.map((type) => (
                <Bar
                  key={type}
                  dataKey={type}
                  name={type}
                  stackId="tickets"
                  fill={TYPE_COLORS[type] ?? '#999'}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default MonthlyStatsChart
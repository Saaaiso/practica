import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import './DailyStatsChart.css'

export interface DayByTypeRow {
  day: string
  [type: string]: string | number
}

const TYPE_LABELS: Record<string, string> = {
  Incident: 'Инцидент',
  ChangeRequest: 'Запрос на изменение',
}

const TYPE_COLORS: Record<string, string> = {
  Incident: '#e0208a',
  ChangeRequest: '#2ba6cc',
}

interface Props {
  data: DayByTypeRow[]
  types: string[]
  loading: boolean
}

function DailyStatsChart({ data, types, loading }: Props) {
  return (
    <div className="content-card">
      <h2 className="chart-title">Тикеты по дням</h2>
      {loading && data.length === 0 ? (
        <div className="skeleton" />
      ) : data.length === 0 ? (
        <p className="empty-state">Нет данных для отображения</p>
      ) : (
        <div className="chart-box chart-box--tall">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend formatter={(value) => TYPE_LABELS[value as string] ?? value} />
              {types.map((type) => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  name={type}
                  stroke={TYPE_COLORS[type] ?? '#999'}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default DailyStatsChart
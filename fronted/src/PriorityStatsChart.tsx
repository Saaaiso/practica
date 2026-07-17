import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export interface PriorityByTypeRow {
  priority: string
  [type: string]: string | number
}

interface Props {
  data: PriorityByTypeRow[]
  types: string[]
  loading?: boolean
}

// Цвета по типу тикета
const typeColorMap: Record<string, string> = {
  Incident: '#e53935',       // красный
  ChangeRequest: '#43a047',  // зелёный
}

const typeNameMap: Record<string, string> = {
  Incident: '🔴 Инцидент',
  ChangeRequest: '🟢 Запрос на изменение',
}

export default function PriorityStatsChart({ data, types, loading }: Props) {
  return (
    <div className="chart-card">
      <h3>⚠️ Тикеты по приоритету и типу</h3>
      {loading && data.length === 0 ? (
        <div className="chart-placeholder">Загрузка...</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="priority" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend formatter={(value) => typeNameMap[value] || value} />
            {types.map((type) => (
              <Bar
                key={type}
                dataKey={type}
                name={type}
                fill={typeColorMap[type] || '#8884d8'}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import './MonthlyStatsChart.css'

export interface MonthByTypeRow {
  month: string
  [type: string]: string | number
}

interface Props {
  data: MonthByTypeRow[]
  types: string[]
  loading: boolean
}

const typeNameMap: Record<string, string> = {
  'Incident': 'Инцидент',
  'ChangeRequest': 'Запрос на изменение',
}

const getTypeName = (type: string): string => typeNameMap[type] || type

function MonthlyStatsChart({ data, types, loading }: Props) {
  const getLineColor = (type: string): string => {
    if (type.includes('Incident')) return '#ef4444'
    if (type.includes('ChangeRequest')) return '#10b981'
    return '#6c5ce7'
  }

  const maxValue = data.reduce((max, row) => {
    const rowMax = types.reduce((m, type) => {
      const val = typeof row[type] === 'number' ? (row[type] as number) : 0
      return Math.max(m, val)
    }, 0)
    return Math.max(max, rowMax)
  }, 0)

  const step = 10
  const yMax = Math.ceil((maxValue + 1) / step) * step || step
  const ticks = Array.from({ length: yMax / step + 1 }, (_, i) => i * step)

  return (
    <div className="content-card">
      <div className="chart-header">
        <div>
          <h2 className="chart-title">📊 По месяцам</h2>
          <p className="chart-subtitle">Динамика изменения по месяцам</p>
        </div>
      </div>

      {loading && data.length === 0 ? (
        <div className="skeleton" />
      ) : data.length === 0 ? (
        <p className="empty-state">📭 Нет данных для отображения</p>
      ) : (
        <div className="chart-box chart-box--tall">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#ffffff"
                tick={{ fill: '#ffffff' }}
                style={{ fontSize: '13px' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                dy={10}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                domain={[0, yMax]}
                ticks={ticks}
                allowDecimals={false}
                stroke="#ffffff"
                tick={{ fill: '#ffffff' }}
                style={{ fontSize: '13px' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e2e',
                  border: '2px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                itemStyle={{ color: '#ffffff' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                content={() => (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '13px', color: '#ffffff' }}>
                    {types.map((type) => (
                      <span key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '14px',
                            height: '3px',
                            background: getLineColor(type),
                            borderRadius: '2px',
                          }}
                        />
                        {getTypeName(type)}
                      </span>
                    ))}
                  </div>
                )}
              />
              {types.map((type) => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={getLineColor(type)}
                  strokeWidth={3}
                  dot={{ fill: getLineColor(type), r: 5 }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                  isAnimationActive={true}
                  name={getTypeName(type)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default MonthlyStatsChart
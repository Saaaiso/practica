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
  const colors = [
    '#ef4444',
    '#10b981',
    '#3b82f6',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
  ]

  const chartData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length]
  }))

  return (
    <div className="content-card">
      <div className="chart-header">
        <div>
          <h2 className="chart-title">🗂️ По типам (Гистограмма)</h2>
          <p className="chart-subtitle">Общее распределение тикетов по категориям</p>
        </div>
      </div>

      {loading && data.length === 0 ? (
        <div className="skeleton" />
      ) : data.length === 0 ? (
        <p className="empty-state">📭 Нет данных для отображения</p>
      ) : (
        <>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <defs>
                  {chartData.map((item, index) => (
                    <linearGradient key={`grad-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={item.fill} stopOpacity={0.95}/>
                      <stop offset="100%" stopColor={item.fill} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
                <XAxis
                  dataKey="type"
                  stroke="#ffffff"
                  tick={{ fill: '#ffffff' }}
                  style={{ fontSize: '13px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#ffffff"
                  tick={{ fill: '#ffffff' }}
                  style={{ fontSize: '12px' }}
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
                  formatter={(value) => [`${value}`, 'Количество']}
                />
                {chartData.map((_item, index) => (
                  <Bar
                    key={`bar-${index}`}
                    dataKey="count"
                    fill={`url(#gradient-${index})`}
                    radius={[12, 12, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={600}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-stats">
            {chartData.map((item) => (
              <div key={item.type} className="stat-badge">
                <span className="stat-dot" style={{ backgroundColor: item.fill }}></span>
                <div className="stat-info">
                  <span className="stat-type">{item.type}</span>
                  <span className="stat-count">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TypeStatsChart
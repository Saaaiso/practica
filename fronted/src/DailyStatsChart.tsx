import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import './DailyStatsChart.css'

export interface DayByTypeRow {
  day: string
  [type: string]: string | number
}

interface Props {
  data: DayByTypeRow[]
  types: string[]
  loading: boolean
}

const typeNameMap: Record<string, string> = {
  'Incident': 'Инцидент',
  'ChangeRequest': 'Запрос на изменение',
}

const getTypeName = (type: string): string => typeNameMap[type] || type

function DailyStatsChart({ data, types, loading }: Props) {
  const getBarColor = (type: string): string => {
    if (type.includes('Incident')) return '#e0208a'
    if (type.includes('ChangeRequest')) return '#2ba6cc'
    return '#8b5cf6'
  }

  const last30Days = data.slice(-30)

  // Общее количество за последние 30 дней, по каждому типу и суммарно
  const totalsByType = types.map((type) => ({
    type,
    total: last30Days.reduce((sum, row) => {
      const val = typeof row[type] === 'number' ? (row[type] as number) : 0
      return sum + val
    }, 0),
  }))
  const grandTotal = totalsByType.reduce((sum, t) => sum + t.total, 0)

  return (
    <div className="content-card">
      <div className="chart-header">
        <div>
          <h2 className="chart-title">📈 По дням</h2>
          <p className="chart-subtitle">Гистограмма за последние 30 дней</p>
        </div>
      </div>

      {loading && data.length === 0 ? null : last30Days.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '10px',
            padding: '12px 18px',
            minWidth: '120px',
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Всего</div>
            <div style={{ fontSize: '22px', fontWeight: 600, color: '#ffffff' }}>{grandTotal}</div>
          </div>
          {totalsByType.map(({ type, total }) => (
            <div key={type} style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '12px 18px',
              minWidth: '120px',
              borderLeft: `3px solid ${getBarColor(type)}`,
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{getTypeName(type)}</div>
              <div style={{ fontSize: '22px', fontWeight: 600, color: '#ffffff' }}>{total}</div>
            </div>
          ))}
        </div>
      )}

      {loading && data.length === 0 ? (
        <div className="skeleton" />
      ) : last30Days.length === 0 ? (
        <p className="empty-state">📭 Нет данных для отображения</p>
      ) : (
        <div className="chart-box chart-box--tall">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last30Days} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#ffffff"
                tick={{ fill: '#ffffff' }}
                style={{ fontSize: '11px' }}
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
                            width: '10px',
                            height: '10px',
                            background: getBarColor(type),
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
                <Bar
                  key={type}
                  dataKey={type}
                  fill={getBarColor(type)}
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                  isAnimationActive={true}
                  name={getTypeName(type)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default DailyStatsChart
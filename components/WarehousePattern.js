import { useTheme } from '../contexts/ThemeContext'

export default function WarehousePattern({ warehouses, harvestWeeks, weekColors }) {
  const { theme } = useTheme()

  const getPatternDescription = (warehouse) => {
    const weekData = warehouse.weeklyData
    if (!weekData) return "Standard pattern"

    // Find peak weeks (highest percentages)
    const sortedWeeks = [...weekData].sort((a, b) => b.percentage - a.percentage)
    const topWeeks = sortedWeeks.slice(0, 2).map(w => w.week).sort((a, b) => a - b)

    if (topWeeks[0] <= 2) return "Early harvest specialist"
    if (topWeeks[0] >= 6) return "Late harvest specialist"
    if (topWeeks.length > 1 && Math.abs(topWeeks[1] - topWeeks[0]) > 3) return "Dual-peak pattern"
    if (topWeeks[0] >= 3 && topWeeks[0] <= 5) return "Mid-season focus"
    return "Extended season"
  }

  return (
    <div className="warehouse-patterns">
      <h3>Warehouse Harvest Specialization Patterns</h3>
      <div className="patterns-grid">
        {warehouses.map((warehouse, index) => (
          <div key={index} className="pattern-card">
            <div className="pattern-header">
              <h4>{warehouse.name}</h4>
              <span className="pattern-type">{getPatternDescription(warehouse)}</span>
            </div>
            
            <div className="week-percentages">
              {warehouse.weeklyData && warehouse.weeklyData.map((weekData, weekIndex) => (
                <div key={weekIndex} className="week-bar-container">
                  <div className="week-label">W{weekData.week}</div>
                  <div className="week-bar">
                    <div 
                      className="week-bar-fill"
                      style={{
                        width: `${weekData.percentage}%`,
                        backgroundColor: weekColors[weekIndex],
                        height: '20px',
                        borderRadius: '3px',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    <span className="percentage-label">{weekData.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="warehouse-stats">
              <div className="stat">
                <span className="stat-label">Used:</span>
                <span className="stat-value">{warehouse.usedBins} bins</span>
              </div>
              <div className="stat">
                <span className="stat-label">Capacity:</span>
                <span className="stat-value">{warehouse.totalBins} bins</span>
              </div>
              <div className="stat">
                <span className="stat-label">Utilization:</span>
                <span className="stat-value">{Math.round((warehouse.usedBins / warehouse.totalBins) * 100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .warehouse-patterns {
          margin: 2rem 0;
          padding: 1.5rem;
          background: var(--card-background);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .warehouse-patterns h3 {
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 1.4rem;
        }

        .patterns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .pattern-card {
          background: var(--card-background);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .pattern-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .pattern-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
        }

        .pattern-header h4 {
          color: var(--text-primary);
          margin: 0;
          font-size: 1.1rem;
          text-transform: capitalize;
        }

        .pattern-type {
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-style: italic;
          background: var(--accent-color);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .week-percentages {
          margin-bottom: 1rem;
        }

        .week-bar-container {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          gap: 0.5rem;
        }

        .week-label {
          width: 30px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .week-bar {
          flex: 1;
          position: relative;
          background: var(--background-secondary);
          height: 20px;
          border-radius: 3px;
          overflow: hidden;
        }

        .percentage-label {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem;
          color: var(--text-primary);
          font-weight: 600;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .warehouse-stats {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-color);
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .stat-value {
          font-size: 0.85rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .patterns-grid {
            grid-template-columns: 1fr;
          }
          
          .pattern-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
          
          .warehouse-stats {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}

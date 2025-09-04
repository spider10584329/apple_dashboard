import { useState } from 'react'
import Tooltip from './Tooltip'

export default function OrchardBarChart({ orchards, harvestWeeks, weekColors }) {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 })

  // Find the maximum value to scale all bars proportionally
  const maxBins = Math.max(...orchards.map(orchard => orchard.totalBins))

  const handleMouseEnter = (event, orchard, week, count) => {
    setTooltip({
      show: true,
      content: `${orchard.name}<br/>Week ${week}: ${count} bins`,
      x: event.pageX + 10,
      y: event.pageY - 10
    })
  }

  const handleMouseLeave = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 })
  }

  return (
    <>
      <div className="orchard-bar-chart">
        {orchards.map((orchard, index) => (
          <div key={index} className="orchard-bar-row">
            <div className="orchard-bar-name">{orchard.name}</div>
            <div className="orchard-bar-container">
              <div 
                className="orchard-bar" 
                style={{ 
                  backgroundColor: orchard.color,
                  width: `${(orchard.totalBins / maxBins) * 100}%` // Scale bar width to value
                }}
              >
                {orchard.totalBins > 0 && (
                  <>
                    {Array.from({ length: harvestWeeks }, (_, weekIndex) => {
                      const week = weekIndex + 1
                      const count = orchard.weekDistribution[week] || 0
                      
                      if (count === 0) return null
                      
                      return (
                        <div
                          key={week}
                          className="orchard-bar-segment"
                          style={{
                            backgroundColor: weekColors[weekIndex],
                            width: `${(count / orchard.totalBins) * 100}%`
                          }}
                          onMouseEnter={(e) => handleMouseEnter(e, orchard, week, count)}
                          onMouseLeave={handleMouseLeave}
                        />
                      )
                    })}
                  </>
                )}
              </div>
            </div>
            <div className="orchard-bar-total">{orchard.totalBins}</div>
          </div>
        ))}
      </div>
      
      {tooltip.show && (
        <Tooltip 
          content={tooltip.content} 
          x={tooltip.x} 
          y={tooltip.y} 
        />
      )}
    </>
  )
}

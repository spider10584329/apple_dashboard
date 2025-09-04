import { useState } from 'react'
import Tooltip from './Tooltip'

export default function StorageBin({ bin, harvestWeeks, weekColors }) {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 })

  const handleMouseEnter = (event, week, count) => {
    setTooltip({
      show: true,
      content: `Week ${week}: ${count} bins`,
      x: event.pageX + 10,
      y: event.pageY - 10
    })
  }

  const handleMouseLeave = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 })
  }

  return (
    <>
      <div className="storage-unit">
        <div className="storage-unit-container">
          <div className="storage-unit-name">{bin.name}</div>
          <div className="storage-unit-bar">
            {Array.from({ length: harvestWeeks }, (_, index) => {
              const week = index + 1
              const count = bin.weekDistribution[week] || 0
              
              if (count === 0) return null
              
              return (
                <div
                  key={week}
                  className="bar-segment"
                  style={{
                    backgroundColor: weekColors[index],
                    width: `${(count / bin.totalBins) * 100}%`
                  }}
                  onMouseEnter={(e) => handleMouseEnter(e, week, count)}
                  onMouseLeave={handleMouseLeave}
                />
              )
            })}
            <div className="total-label">{bin.totalBins}</div>
          </div>
          <div className="storage-unit-total">{bin.totalBins}</div>
        </div>
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

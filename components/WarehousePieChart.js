import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import Tooltip from './Tooltip'
import WarehouseBarChart from './WarehouseBarChart'
import WarehouseTable from './WarehouseTable'
import Toast from './Toast'
import { useTheme } from '../contexts/ThemeContext'

export default function WarehousePieChart({ warehouse, harvestWeeks, weekColors }) {
  const svgRef = useRef()
  const { theme } = useTheme()
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 })
  const [showBarChart, setShowBarChart] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!warehouse) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 200
    const height = 200
    const radius = Math.min(width, height) / 2 - 10

    svg.attr('width', width).attr('height', height)

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    // Create pie data with enhanced information
    const pieData = []
    for (let week = 1; week <= harvestWeeks; week++) {
      const count = warehouse.weekDistribution[week] || 0
      if (count > 0) {
        const percentage = Math.round((count / warehouse.usedBins) * 100)
        pieData.push({
          week: week,
          count: count,
          percentage: percentage
        })
      }
    }

    const pie = d3.pie()
      .value(d => d.count)
      .sort(null)

    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius)

    const arcs = g.selectAll('.arc')
      .data(pie(pieData))
      .enter().append('g')
      .attr('class', 'arc')

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => weekColors[d.data.week - 1])
      .attr('stroke', theme === 'dark' ? '#2d2d2d' : '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setTooltip({
          show: true,
          content: `Week ${d.data.week}<br/>${d.data.count} bins (${d.data.percentage}%)<br/>Total capacity: ${warehouse.totalBins}<br/>Warehouse specialization pattern visible`,
          x: event.pageX + 10,
          y: event.pageY - 10
        })
      })
      .on('mouseleave', () => {
        setTooltip({ show: false, content: '', x: 0, y: 0 })
      })

    // Add percentage labels - only show for slices larger than 5%
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', theme === 'dark' ? '#ffffff' : '#000000')
      .attr('font-size', d => d.data.percentage > 15 ? '14px' : '12px')
      .attr('font-weight', 'bold')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.5)')
      .text(d => d.data.percentage > 5 ? `${d.data.percentage}%` : '')

    // Add center text - show occupied bins with percentage info
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('fill', theme === 'dark' ? '#ffffff' : '#000000')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(warehouse.usedBins)
    
    // Add "bins used" label
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .attr('fill', theme === 'dark' ? '#cccccc' : '#666666')
      .attr('font-size', '10px')
      .text('bins used')

  }, [warehouse, harvestWeeks, weekColors, theme])

  return (
    <>
      <div className="warehouse-pie-chart">
        <div className="warehouse-content">
          <div className="warehouse-chart-section">
            <div className="warehouse-header">
              <h4 className="warehouse-title">{warehouse.name}</h4>
              <span className="warehouse-volume">({warehouse.totalBins})</span>
            </div>
            <svg ref={svgRef}></svg>
          </div>
          
          <div className="warehouse-buttons">
            <button 
              className="warehouse-button chart-button"
              onClick={() => setShowBarChart(true)}
              title="View Bar Chart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v8H3v-8zm4-6h2v14H7V7zm4-6h2v20h-2V1zm4 8h2v12h-2V9zm4-4h2v16h-2V5z"/>
              </svg>
            </button>
            
            <button 
              className="warehouse-button table-button"
              onClick={() => setShowTable(true)}
              title="View Data Table"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h18v18H3V3zm2 2v4h4V5H5zm6 0v4h4V5h-4zm6 0v4h4V5h-4zM5 11v4h4v-4H5zm6 0v4h4v-4h-4zm6 0v4h4v-4h-4zM5 17v2h4v-2H5zm6 0v2h4v-2h-4zm6 0v2h4v-2h-4z"/>
              </svg>
            </button>
            
            <button 
              className="warehouse-button viewer-button"
              onClick={() => setShowToast(true)}
              title="View 3D Storage"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.46 9-11V7l-10-5z"/>
                <path d="M8 10h8v2H8v-2zm0 4h8v2H8v-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {tooltip.show && (
        <Tooltip 
          content={tooltip.content} 
          x={tooltip.x} 
          y={tooltip.y} 
        />
      )}
      
      {showBarChart && (
        <WarehouseBarChart 
          warehouse={warehouse}
          harvestWeeks={harvestWeeks}
          weekColors={weekColors}
          onClose={() => setShowBarChart(false)}
        />
      )}
      
      {showTable && (
        <WarehouseTable 
          warehouse={warehouse}
          harvestWeeks={harvestWeeks}
          weekColors={weekColors}
          onClose={() => setShowTable(false)}
        />
      )}
      
      <Toast
        message="Press this button to display a 3D view of the refrigerator."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={4000}
      />

      <style jsx>{`
        .warehouse-pie-chart {
          background: var(--card-background);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .warehouse-pie-chart:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .warehouse-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .warehouse-chart-section {
          flex: 1;
        }

        .warehouse-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .warehouse-title {
          color: var(--text-primary);
          margin: 0;
          font-size: 1.1rem;
          text-transform: capitalize;
        }

        .warehouse-volume {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .warehouse-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-left: 1rem;
        }

        .warehouse-button {
          width: 40px;
          height: 40px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--card-background);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          position: relative;
        }

        .warehouse-button:hover {
          background: var(--accent-color);
          color: var(--text-primary);
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .chart-button:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }

        .table-button:hover {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .viewer-button:hover {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }

        @media (max-width: 768px) {
          .warehouse-content {
            flex-direction: column;
            gap: 0.5rem;
          }

          .warehouse-buttons {
            flex-direction: row;
            justify-content: center;
            margin-left: 0;
          }

          .warehouse-button {
            width: 35px;
            height: 35px;
          }
        }
      `}</style>
    </>
  )
}

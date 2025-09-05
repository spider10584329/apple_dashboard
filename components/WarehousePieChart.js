import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import Tooltip from './Tooltip'
import WarehouseBarChart from './WarehouseBarChart'
import WarehouseTable from './WarehouseTable'
import { useTheme } from '../contexts/ThemeContext'

export default function WarehousePieChart({ warehouse, harvestWeeks, weekColors }) {
  const svgRef = useRef()
  const { theme } = useTheme()
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 })
  const [showBarChart, setShowBarChart] = useState(false)
  const [showTable, setShowTable] = useState(false)

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
          content: `Week ${d.data.week}<br/>${d.data.count} bins (${d.data.percentage}%)<br/>Total capacity: ${warehouse.totalBins}`,
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
              <img src="/chart.svg" alt="Chart" width="20" height="20" />
            </button>
            
            <button 
              className="warehouse-button table-button"
              onClick={() => setShowTable(true)}
              title="View Data Table"
            >
              <img src="/table.svg" alt="Table" width="20" height="20" />
            </button>
            
            <button 
              className="warehouse-button viewer-button"
              onClick={() => window.open('https://3d-grid6.vercel.app/', '_blank')}
              title="View 3D Storage"
            >
              <img src="/3d.png" alt="3D View" width="20" height="20" />
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

        .warehouse-button img {
          filter: brightness(0) saturate(100%) invert(50%);
          transition: filter 0.2s ease;
        }

        .warehouse-button:hover {
          background: var(--accent-color);
          color: var(--text-primary);
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .warehouse-button:hover img {
          filter: brightness(0) saturate(100%) invert(10%);
        }

        /* Specific button hover styles */
        .chart-button:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.2);
        }

        .chart-button:hover img {
          filter: brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(500%) hue-rotate(200deg);
        }

        .table-button:hover {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.2);
        }

        .table-button:hover img {
          filter: brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(500%) hue-rotate(140deg);
        }

        .viewer-button:hover {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.2);
        }

        .viewer-button:hover img {
          filter: brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(500%) hue-rotate(260deg);
        }

        /* Dark theme styles */
        [data-theme="dark"] .warehouse-button img {
          filter: brightness(0) saturate(100%) invert(80%);
        }

        [data-theme="dark"] .warehouse-button:hover img {
          filter: brightness(0) saturate(100%) invert(100%);
        }

        [data-theme="dark"] .chart-button:hover img {
          filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(200%) hue-rotate(200deg);
        }

        [data-theme="dark"] .table-button:hover img {
          filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(200%) hue-rotate(140deg);
        }

        [data-theme="dark"] .viewer-button:hover img {
          filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(200%) hue-rotate(260deg);
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

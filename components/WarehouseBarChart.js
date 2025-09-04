import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../contexts/ThemeContext'

export default function WarehouseBarChart({ warehouse, harvestWeeks, weekColors, onClose }) {
  const svgRef = useRef()
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

  useEffect(() => {
    if (!warehouse || !warehouse.weeklyData) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const width = 500 - margin.left - margin.right
    const height = 300 - margin.bottom - margin.top

    svg.attr('width', width + margin.left + margin.right)
       .attr('height', height + margin.top + margin.bottom)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Prepare data
    const data = warehouse.weeklyData

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => `Week ${d.week}`))
      .range([0, width])
      .padding(0.2)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.percentage)])
      .range([height, 0])

    // Bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(`Week ${d.week}`))
      .attr('y', d => yScale(d.percentage))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.percentage))
      .attr('fill', (d, i) => weekColors[d.week - 1])
      .attr('stroke', theme === 'dark' ? '#ffffff' : '#000000')
      .attr('stroke-width', 1)

    // Value labels on bars
    g.selectAll('.bar-label')
      .data(data)
      .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(`Week ${d.week}`) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.percentage) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', theme === 'dark' ? '#ffffff' : '#000000')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => `${d.percentage}%`)

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', theme === 'dark' ? '#ffffff' : '#000000')

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => `${d}%`))
      .selectAll('text')
      .attr('fill', theme === 'dark' ? '#ffffff' : '#000000')

    // Axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('fill', theme === 'dark' ? '#ffffff' : '#000000')
      .text('Percentage of Total Bins (%)')

  }, [warehouse, harvestWeeks, weekColors, theme])

  if (!warehouse) return null

  return (
    <div className="warehouse-chart-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <div className="modal-header">
          <h3>{warehouse.name} - Harvest Pattern Analysis</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="chart-container">
          <div className="pattern-info">
            <div className="pattern-badge">
              <span className="pattern-type">{getPatternDescription(warehouse)}</span>
            </div>
            <div className="warehouse-stats">
              <div className="stat">
                <span className="stat-label">Used Bins:</span>
                <span className="stat-value">{warehouse.usedBins}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total Capacity:</span>
                <span className="stat-value">{warehouse.totalBins}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Utilization:</span>
                <span className="stat-value">{Math.round((warehouse.usedBins / warehouse.totalBins) * 100)}%</span>
              </div>
            </div>
          </div>
          
          <svg ref={svgRef}></svg>
        </div>
      </div>

      <style jsx>{`
        .warehouse-chart-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
        }

        .modal-content {
          position: relative;
          background: var(--card-background);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow: auto;
          border: 2px solid var(--border-color);
          z-index: 10;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-header h3 {
          margin: 0;
          color: var(--text-primary);
          text-transform: capitalize;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: var(--accent-color);
          color: var(--text-primary);
        }

        .chart-container {
          padding: 1.5rem;
          background: var(--card-background);
          border-radius: 0 0 12px 12px;
        }

        .pattern-info {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: var(--background-secondary);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .pattern-badge {
          margin-bottom: 1rem;
        }

        .pattern-type {
          background: var(--accent-color);
          color: var(--text-primary);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .warehouse-stats {
          display: flex;
          justify-content: space-around;
          gap: 1rem;
          padding: 1rem;
          background: var(--background-secondary);
          border-radius: 8px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .stat-value {
          font-size: 1.1rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 95%;
            margin: 1rem;
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

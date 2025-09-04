import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import Tooltip from './Tooltip'
import { useTheme } from '../contexts/ThemeContext'

export default function CoolRoomsRing({ coolRooms, harvestWeeks, weekColors }) {
  const { theme } = useTheme()
  const svgRef = useRef()
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 })

  useEffect(() => {
    if (!coolRooms.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear previous render

    const width = 800
    const height = 800
    const centerX = width / 2
    const centerY = height / 2
    const outerRadius = 300
    const innerRadius = 150

    svg.attr('width', width).attr('height', height)

    // Create ring segments for each cool room
    const angleStep = (2 * Math.PI) / coolRooms.length

    coolRooms.forEach((coolRoom, index) => {
      const startAngle = index * angleStep
      const endAngle = (index + 1) * angleStep

      // Create segments for each harvest week within this cool room
      const totalBins = coolRoom.totalBins
      let currentRadius = innerRadius
      const radiusStep = (outerRadius - innerRadius) / harvestWeeks

      for (let week = 1; week <= harvestWeeks; week++) {
        const count = coolRoom.weekDistribution[week] || 0
        const proportion = count / totalBins

        if (count > 0) {
          const segmentInnerRadius = currentRadius
          const segmentOuterRadius = currentRadius + (radiusStep * proportion * 3) // Amplify for visibility

          const arc = d3.arc()
            .innerRadius(segmentInnerRadius)
            .outerRadius(segmentOuterRadius)
            .startAngle(startAngle)
            .endAngle(endAngle)

          svg.append('path')
            .datum({ coolRoom, week, count })
            .attr('d', arc)
            .attr('transform', `translate(${centerX}, ${centerY})`)
            .attr('fill', weekColors[week - 1])
            .attr('class', 'ring-segment')
            .on('mouseenter', (event, d) => {
              setTooltip({
                show: true,
                content: `${d.coolRoom.name}<br/>Week ${d.week}: ${d.count} bins`,
                x: event.pageX + 10,
                y: event.pageY - 10
              })
            })
            .on('mouseleave', () => {
              setTooltip({ show: false, content: '', x: 0, y: 0 })
            })
        }

        currentRadius += radiusStep * 0.3 // Small gap between weeks
      }

      // Add cool room label
      const labelAngle = startAngle + angleStep / 2
      const labelRadius = outerRadius + 30
      const labelX = centerX + Math.cos(labelAngle - Math.PI / 2) * labelRadius
      const labelY = centerY + Math.sin(labelAngle - Math.PI / 2) * labelRadius

      svg.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('class', 'cool-room-label')
        .attr('fill', theme === 'dark' ? '#ffffff' : '#212529')
        .text(coolRoom.name)
    })
  }, [coolRooms, harvestWeeks, weekColors, theme])

  return (
    <>
      <div className="cool-rooms-ring">
        <svg ref={svgRef}></svg>
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

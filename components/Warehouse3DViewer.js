import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function Warehouse3DViewer({ warehouse, harvestWeeks, weekColors, onClose }) {
  const canvasRef = useRef()
  const { theme } = useTheme()
  const [rotationX, setRotationX] = useState(-0.5)
  const [rotationY, setRotationY] = useState(0.5)
  const [zoom, setZoom] = useState(1)
  const [isRotating, setIsRotating] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !warehouse) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width = 800
    const height = canvas.height = 600

    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = theme === 'dark' ? '#1a1a1a' : '#f8f9fa'
    ctx.fillRect(0, 0, width, height)

    // 3D projection functions
    const project3D = (x, y, z) => {
      // Apply rotations
      const cosX = Math.cos(rotationX)
      const sinX = Math.sin(rotationX)
      const cosY = Math.cos(rotationY)
      const sinY = Math.sin(rotationY)

      // Rotate around X axis
      const y1 = y * cosX - z * sinX
      const z1 = y * sinX + z * cosX

      // Rotate around Y axis
      const x2 = x * cosY + z1 * sinY
      const z2 = -x * sinY + z1 * cosY

      // Project to 2D
      const perspective = 500
      const scale = perspective / (perspective + z2) * zoom
      
      return {
        x: width / 2 + x2 * scale,
        y: height / 2 - y1 * scale,
        z: z2
      }
    }

    // Generate bin positions based on warehouse data
    const generateBinPositions = () => {
      const bins = []
      const sectionsPerRow = 4
      const rowsPerSection = 3
      const binsPerRow = 5
      let binIndex = 0

      if (warehouse.weeklyData) {
        warehouse.weeklyData.forEach(weekData => {
          for (let i = 0; i < weekData.count && binIndex < warehouse.usedBins; i++) {
            const section = Math.floor(binIndex / (rowsPerSection * binsPerRow))
            const remainder = binIndex % (rowsPerSection * binsPerRow)
            const row = Math.floor(remainder / binsPerRow)
            const position = remainder % binsPerRow

            const x = (section % sectionsPerRow) * 60 - 120
            const z = Math.floor(section / sectionsPerRow) * 60 - 90
            const y = -40 + row * 25

            bins.push({
              x,
              y,
              z,
              week: weekData.week,
              color: weekColors[weekData.week - 1],
              id: binIndex
            })
            binIndex++
          }
        })
      }

      return bins
    }

    const bins = generateBinPositions()

    // Draw warehouse structure
    const drawWarehouseStructure = () => {
      // Floor
      const floorCorners = [
        { x: -150, y: -60, z: -120 },
        { x: 150, y: -60, z: -120 },
        { x: 150, y: -60, z: 120 },
        { x: -150, y: -60, z: 120 }
      ]

      const projectedFloor = floorCorners.map(corner => project3D(corner.x, corner.y, corner.z))
      
      ctx.fillStyle = theme === 'dark' ? '#2d2d2d' : '#e0e0e0'
      ctx.beginPath()
      ctx.moveTo(projectedFloor[0].x, projectedFloor[0].y)
      projectedFloor.forEach(point => ctx.lineTo(point.x, point.y))
      ctx.closePath()
      ctx.fill()

      // Walls
      const walls = [
        [{ x: -150, y: -60, z: -120 }, { x: -150, y: 40, z: -120 }, { x: 150, y: 40, z: -120 }, { x: 150, y: -60, z: -120 }],
        [{ x: -150, y: -60, z: 120 }, { x: -150, y: 40, z: 120 }, { x: -150, y: 40, z: -120 }, { x: -150, y: -60, z: -120 }]
      ]

      walls.forEach(wall => {
        const projectedWall = wall.map(corner => project3D(corner.x, corner.y, corner.z))
        ctx.fillStyle = theme === 'dark' ? '#333333' : '#d0d0d0'
        ctx.beginPath()
        ctx.moveTo(projectedWall[0].x, projectedWall[0].y)
        projectedWall.forEach(point => ctx.lineTo(point.x, point.y))
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = theme === 'dark' ? '#555555' : '#999999'
        ctx.stroke()
      })
    }

    // Draw bins
    const drawBins = () => {
      // Sort bins by z-coordinate for proper depth rendering
      const sortedBins = bins.sort((a, b) => b.z - a.z)

      sortedBins.forEach(bin => {
        const binSize = 8
        const projected = project3D(bin.x, bin.y, bin.z)
        
        if (projected.z > -400) { // Only draw visible bins
          // Draw bin shadow
          const shadowProjected = project3D(bin.x, -58, bin.z)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
          ctx.beginPath()
          ctx.arc(shadowProjected.x, shadowProjected.y, binSize * 0.8, 0, Math.PI * 2)
          ctx.fill()

          // Draw bin
          const brightness = Math.max(0.4, 1 - (projected.z + 200) / 600)
          const binColor = adjustColorBrightness(bin.color, brightness)
          
          ctx.fillStyle = binColor
          ctx.beginPath()
          ctx.arc(projected.x, projected.y, binSize, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.strokeStyle = theme === 'dark' ? '#ffffff' : '#000000'
          ctx.lineWidth = 0.5
          ctx.stroke()

          // Add week label for closer bins
          if (projected.z > -200 && binSize > 6) {
            ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000'
            ctx.font = '10px Arial'
            ctx.textAlign = 'center'
            ctx.fillText(bin.week, projected.x, projected.y + 3)
          }
        }
      })
    }

    const adjustColorBrightness = (color, brightness) => {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      const newR = Math.floor(r * brightness)
      const newG = Math.floor(g * brightness)
      const newB = Math.floor(b * brightness)
      
      return `rgb(${newR}, ${newG}, ${newB})`
    }

    // Draw legend
    const drawLegend = () => {
      const legendX = 20
      const legendY = 20
      
      ctx.fillStyle = theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)'
      ctx.fillRect(legendX - 10, legendY - 10, 180, harvestWeeks * 25 + 40)
      ctx.strokeStyle = theme === 'dark' ? '#555555' : '#cccccc'
      ctx.strokeRect(legendX - 10, legendY - 10, 180, harvestWeeks * 25 + 40)

      ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000'
      ctx.font = '14px Arial'
      ctx.fillText('Harvest Weeks', legendX, legendY + 15)

      for (let week = 1; week <= harvestWeeks; week++) {
        const y = legendY + 25 + week * 20
        
        ctx.fillStyle = weekColors[week - 1]
        ctx.beginPath()
        ctx.arc(legendX + 15, y, 8, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000'
        ctx.font = '12px Arial'
        ctx.fillText(`Week ${week}`, legendX + 35, y + 4)
      }
    }

    // Render the scene
    drawWarehouseStructure()
    drawBins()
    drawLegend()

    // Add controls text
    ctx.fillStyle = theme === 'dark' ? '#cccccc' : '#666666'
    ctx.font = '12px Arial'
    ctx.textAlign = 'right'
    ctx.fillText('Click and drag to rotate • Scroll to zoom', width - 20, height - 20)

  }, [warehouse, harvestWeeks, weekColors, theme, rotationX, rotationY, zoom])

  const handleMouseDown = (e) => {
    setIsRotating(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e) => {
    if (!isRotating) return

    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y

    setRotationY(prev => prev + deltaX * 0.01)
    setRotationX(prev => Math.max(-Math.PI/2, Math.min(Math.PI/2, prev - deltaY * 0.01)))

    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsRotating(false)
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)))
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isRotating, lastMousePos])

  if (!warehouse) return null

  return (
    <div className="warehouse-3d-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <div className="modal-header">
          <h3>{warehouse.name} - 3D Storage View</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="viewer-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            style={{ cursor: isRotating ? 'grabbing' : 'grab' }}
          />
          
          <div className="controls-panel">
            <div className="control-group">
              <label>Zoom: {zoom.toFixed(1)}x</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
            </div>
            
            <div className="control-group">
              <label>Rotation X: {(rotationX * 180 / Math.PI).toFixed(0)}°</label>
              <input
                type="range"
                min={-Math.PI/2}
                max={Math.PI/2}
                step="0.1"
                value={rotationX}
                onChange={(e) => setRotationX(parseFloat(e.target.value))}
              />
            </div>
            
            <div className="control-group">
              <label>Rotation Y: {(rotationY * 180 / Math.PI).toFixed(0)}°</label>
              <input
                type="range"
                min={-Math.PI}
                max={Math.PI}
                step="0.1"
                value={rotationY}
                onChange={(e) => setRotationY(parseFloat(e.target.value))}
              />
            </div>
            
            <button 
              className="reset-button"
              onClick={() => {
                setRotationX(-0.5)
                setRotationY(0.5)
                setZoom(1)
              }}
            >
              Reset View
            </button>
          </div>
        </div>

        <div className="warehouse-info">
          <div className="info-item">
            <span className="info-label">Total Bins:</span>
            <span className="info-value">{warehouse.usedBins}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Capacity:</span>
            <span className="info-value">{warehouse.totalBins}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Utilization:</span>
            <span className="info-value">{Math.round((warehouse.usedBins / warehouse.totalBins) * 100)}%</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .warehouse-3d-modal {
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
          max-width: 95%;
          width: 1000px;
          max-height: 90vh;
          overflow: hidden;
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

        .viewer-container {
          display: flex;
          padding: 1rem;
          gap: 1rem;
        }

        canvas {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--background-secondary);
        }

        .controls-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 180px;
          padding: 1rem;
          background: var(--background-secondary);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          height: fit-content;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .control-group label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .control-group input[type="range"] {
          width: 100%;
        }

        .reset-button {
          padding: 0.5rem 1rem;
          background: var(--accent-color);
          color: var(--text-primary);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .reset-button:hover {
          background: var(--border-color);
        }

        .warehouse-info {
          display: flex;
          justify-content: center;
          gap: 2rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-color);
          background: var(--background-secondary);
        }

        .info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }

        .info-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .info-value {
          font-size: 1.1rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 98%;
            max-height: 95vh;
          }
          
          .viewer-container {
            flex-direction: column;
          }
          
          canvas {
            width: 100%;
            height: auto;
          }
          
          .warehouse-info {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

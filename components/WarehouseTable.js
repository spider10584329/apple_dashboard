import { useState, useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function WarehouseTable({ warehouse, harvestWeeks, weekColors, onClose }) {
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('week')
  const [sortDirection, setSortDirection] = useState('asc')
  const [filterWeek, setFilterWeek] = useState('all')
  const [filterRange, setFilterRange] = useState('all')

  // Generate detailed bin data for the table
  const generateBinData = () => {
    const binData = []
    let binId = 1
    
    if (warehouse.weeklyData) {
      warehouse.weeklyData.forEach(weekData => {
        for (let i = 0; i < weekData.count; i++) {
          binData.push({
            id: binId++,
            week: weekData.week,
            binNumber: `${warehouse.name.toUpperCase()}-${String(binId).padStart(4, '0')}`,
            variety: getRandomVariety(),
            quality: getRandomQuality(),
            weight: Math.floor(Math.random() * 20) + 15, // 15-35 kg
            storageDate: getStorageDate(weekData.week),
            location: getRandomLocation(),
            temperature: Math.round((Math.random() * 2 + 2) * 10) / 10, // 2.0-4.0°C
            status: 'stored'
          })
        }
      })
    }
    
    return binData
  }

  const getRandomVariety = () => {
    const varieties = ['Gala', 'Fuji', 'Honeycrisp', 'Granny Smith', 'Red Delicious', 'Golden Delicious']
    return varieties[Math.floor(Math.random() * varieties.length)]
  }

  const getRandomQuality = () => {
    const qualities = ['Premium', 'Grade A', 'Grade B', 'Export Quality']
    return qualities[Math.floor(Math.random() * qualities.length)]
  }

  const getRandomLocation = () => {
    const sections = ['A', 'B', 'C', 'D']
    const rows = Math.floor(Math.random() * 10) + 1
    const position = Math.floor(Math.random() * 20) + 1
    return `${sections[Math.floor(Math.random() * sections.length)]}-${rows}-${position}`
  }

  const getStorageDate = (week) => {
    const baseDate = new Date('2024-08-01')
    baseDate.setDate(baseDate.getDate() + (week - 1) * 7 + Math.floor(Math.random() * 7))
    return baseDate.toLocaleDateString()
  }

  const binData = useMemo(() => generateBinData(), [warehouse])

  const filteredAndSortedData = useMemo(() => {
    let filtered = binData.filter(bin => {
      const matchesSearch = searchTerm === '' || 
        bin.binNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bin.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bin.quality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bin.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesWeek = filterWeek === 'all' || bin.week.toString() === filterWeek

      const matchesRange = filterRange === 'all' || 
        (filterRange === 'early' && bin.week <= 2) ||
        (filterRange === 'mid' && bin.week >= 3 && bin.week <= 5) ||
        (filterRange === 'late' && bin.week >= 6)

      return matchesSearch && matchesWeek && matchesRange
    })

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    return filtered
  }, [binData, searchTerm, sortField, sortDirection, filterWeek, filterRange])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  if (!warehouse) return null

  return (
    <div className="warehouse-table-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <div className="modal-header">
          <h3>{warehouse.name} - Storage Inventory</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search bins, varieties, quality, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <select 
              value={filterWeek} 
              onChange={(e) => setFilterWeek(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Weeks</option>
              {Array.from({ length: harvestWeeks }, (_, i) => (
                <option key={i + 1} value={i + 1}>Week {i + 1}</option>
              ))}
            </select>
            
            <select 
              value={filterRange} 
              onChange={(e) => setFilterRange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Periods</option>
              <option value="early">Early Harvest (Weeks 1-2)</option>
              <option value="mid">Mid Season (Weeks 3-5)</option>
              <option value="late">Late Harvest (Weeks 6+)</option>
            </select>
          </div>
        </div>

        <div className="table-info">
          <span>Showing {filteredAndSortedData.length} of {binData.length} bins</span>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('binNumber')} className="sortable">
                  Bin ID {sortField === 'binNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('week')} className="sortable">
                  Week {sortField === 'week' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('variety')} className="sortable">
                  Variety {sortField === 'variety' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('quality')} className="sortable">
                  Quality {sortField === 'quality' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('weight')} className="sortable">
                  Weight (kg) {sortField === 'weight' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('location')} className="sortable">
                  Location {sortField === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('temperature')} className="sortable">
                  Temp (°C) {sortField === 'temperature' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('storageDate')} className="sortable">
                  Storage Date {sortField === 'storageDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((bin) => (
                <tr key={bin.id}>
                  <td className="bin-id">{bin.binNumber}</td>
                  <td>
                    <span 
                      className="week-badge" 
                      style={{ backgroundColor: weekColors[bin.week - 1] }}
                    >
                      {bin.week}
                    </span>
                  </td>
                  <td>{bin.variety}</td>
                  <td>
                    <span className={`quality-badge ${bin.quality.toLowerCase().replace(' ', '-')}`}>
                      {bin.quality}
                    </span>
                  </td>
                  <td>{bin.weight}</td>
                  <td className="location">{bin.location}</td>
                  <td>{bin.temperature}</td>
                  <td>{bin.storageDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .warehouse-table-modal {
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
          width: 1200px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 2px solid var(--border-color);
          z-index: 10;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          flex-shrink: 0;
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

        .filters-section {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          flex-shrink: 0;
        }

        .search-box {
          flex: 1;
          min-width: 200px;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--background-secondary);
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent-color);
        }

        .filter-controls {
          display: flex;
          gap: 0.5rem;
        }

        .filter-select {
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--background-secondary);
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .table-info {
          padding: 0.5rem 1.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          background: var(--background-secondary);
          flex-shrink: 0;
        }

        .table-container {
          flex: 1;
          overflow: auto;
          padding: 0 1.5rem 1.5rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .data-table th {
          background: var(--accent-color);
          color: var(--text-primary);
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .data-table th.sortable {
          cursor: pointer;
          user-select: none;
        }

        .data-table th.sortable:hover {
          background: var(--border-color);
        }

        .data-table td {
          padding: 0.75rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .data-table tr:hover {
          background: var(--background-secondary);
        }

        .bin-id {
          font-family: monospace;
          font-weight: 600;
        }

        .week-badge {
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .quality-badge {
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .quality-badge.premium {
          background: #22c55e;
          color: white;
        }

        .quality-badge.grade-a {
          background: #3b82f6;
          color: white;
        }

        .quality-badge.grade-b {
          background: #f59e0b;
          color: white;
        }

        .quality-badge.export-quality {
          background: #8b5cf6;
          color: white;
        }

        .location {
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 98%;
            max-height: 95vh;
          }
          
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-controls {
            justify-content: center;
          }
          
          .data-table {
            font-size: 0.8rem;
          }
          
          .data-table th,
          .data-table td {
            padding: 0.5rem 0.25rem;
          }
        }
      `}</style>
    </div>
  )
}

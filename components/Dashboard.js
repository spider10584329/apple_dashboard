import { useState, useEffect } from 'react'
import Header from './Header'
import OrchardBarChart from './OrchardBarChart'
import WarehousePieChart from './WarehousePieChart'
import FlowStatsSection from './FlowStatsSection'
import { generateOrchardData, generateWarehouseData } from '../utils/dataGenerator'
import { useTheme } from '../contexts/ThemeContext'

export default function Dashboard() {
  const [orchards, setOrchards] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()

  const harvestWeeks = 8
  
  // Static week colors - consistent across all themes
  const weekColors = [
    '#E53E3E', // Week 1 - Darker Red for light theme
    '#319795', // Week 2 - Darker Teal
    '#3182CE', // Week 3 - Darker Blue
    '#38A169', // Week 4 - Darker Green
    '#D69E2E', // Week 5 - Darker Yellow
    '#B794C4', // Week 6 - Darker Plum
    '#4FD1C7', // Week 7 - Darker Mint
    '#D69E2E'  // Week 8 - Darker Gold
  ]

  useEffect(() => {
    // Generate data on client side to avoid hydration issues
    // Data should be static and not change with theme
    const orchardData = generateOrchardData(harvestWeeks)
    const warehouseData = generateWarehouseData(harvestWeeks)
    
    setOrchards(orchardData)
    setWarehouses(warehouseData)
    setIsLoading(false)
  }, []) // Removed theme dependency - data should be static

  if (isLoading) {
    return (
      <div className="dashboard">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2em',
          color: 'var(--text-primary)'
        }}>
          Loading Apple Harvest Dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <Header harvestWeeks={harvestWeeks} weekColors={weekColors} />
      
      <main>
        <div className="main-content">
          <section className="orchard-storage-section">
            <h2>Orchard Storage Rooms</h2>
            <OrchardBarChart 
              orchards={orchards} 
              harvestWeeks={harvestWeeks} 
              weekColors={weekColors} 
            />
          </section>
          
          <section className="pack-house-section">
            <h2>Pack House</h2>
            <div className="warehouses-grid">
              {warehouses.map((warehouse, index) => (
                <WarehousePieChart 
                  key={index}
                  warehouse={warehouse}
                  harvestWeeks={harvestWeeks}
                  weekColors={weekColors}
                />
              ))}
            </div>
          </section>
        </div>
        
        <FlowStatsSection 
          orchards={orchards} 
          warehouses={warehouses} 
        />
      </main>
    </div>
  )
}

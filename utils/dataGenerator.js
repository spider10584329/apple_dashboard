export function generateOrchardData(harvestWeeks) {
  // Static orchard storage data - simulates database values
  // These values should remain constant and not change with theme or other factors
  const orchardData = [
    { name: 'Orchard 1', totalBins: 200, color: '#ff9999' },
    { name: 'Orchard 2', totalBins: 3000, color: '#6699ff' },
    { name: 'Orchard 3', totalBins: 100, color: '#ff9999' },
    { name: 'Orchard 4', totalBins: 0, color: '#f0f0f0' },
    { name: 'Orchard 5', totalBins: 480, color: '#ff6666' },
    { name: 'Orchard 6', totalBins: 380, color: '#ff9999' },
    { name: 'Orchard 7', totalBins: 200, color: '#ff9999' },
    { name: 'Orchard 8', totalBins: 3000, color: '#ffaa00' },
    { name: 'Orchard 9', totalBins: 100, color: '#ff9999' },
    { name: 'Orchard 10', totalBins: 0, color: '#f0f0f0' },
    { name: 'Orchard 11', totalBins: 480, color: '#ffaa00' },
    { name: 'Orchard 12', totalBins: 380, color: '#00cc00' },
    // Additional orchards to demonstrate scalability (up to 100)
    { name: 'Orchard 13', totalBins: 150, color: '#ff9999' },
    { name: 'Orchard 14', totalBins: 2500, color: '#6699ff' },
    { name: 'Orchard 15', totalBins: 75, color: '#ff9999' },
    { name: 'Orchard 16', totalBins: 320, color: '#ffaa00' },
    { name: 'Orchard 17', totalBins: 180, color: '#ff9999' },
    { name: 'Orchard 18', totalBins: 450, color: '#00cc00' },
    { name: 'Orchard 19', totalBins: 280, color: '#ff9999' },
    { name: 'Orchard 20', totalBins: 1800, color: '#6699ff' }
  ]

  // Static harvest week distribution - simulates database values
  // These distributions are predetermined and don't change
  const staticDistributions = [
    { 1: 50, 2: 40, 3: 30, 4: 80 }, // Orchard 1
    { 1: 500, 2: 600, 3: 450, 4: 800, 5: 350, 6: 300 }, // Orchard 2
    { 1: 25, 2: 30, 3: 45 }, // Orchard 3
    {}, // Orchard 4 (empty)
    { 2: 120, 3: 160, 4: 200 }, // Orchard 5
    { 1: 80, 3: 150, 5: 150 }, // Orchard 6
    { 1: 60, 2: 70, 4: 70 }, // Orchard 7
    { 1: 600, 2: 500, 3: 400, 4: 700, 5: 450, 6: 350 }, // Orchard 8
    { 2: 40, 4: 60 }, // Orchard 9
    {}, // Orchard 10 (empty)
    { 3: 180, 4: 150, 5: 150 }, // Orchard 11
    { 1: 90, 2: 140, 4: 150 }, // Orchard 12
    { 1: 40, 3: 60, 5: 50 }, // Orchard 13
    { 1: 400, 2: 500, 3: 600, 4: 500, 5: 300, 6: 200 }, // Orchard 14
    { 2: 25, 4: 50 }, // Orchard 15
    { 1: 80, 3: 120, 5: 120 }, // Orchard 16
    { 1: 50, 2: 60, 4: 70 }, // Orchard 17
    { 2: 150, 3: 150, 4: 150 }, // Orchard 18
    { 1: 70, 3: 100, 5: 110 }, // Orchard 19
    { 1: 300, 2: 400, 3: 500, 4: 400, 5: 200 } // Orchard 20
  ]

  return orchardData.map((orchard, index) => ({
    ...orchard,
    weekDistribution: staticDistributions[index] || {}
  }))
}

function generateTemporaryStorageBins(harvestWeeks) {
  // Generate storage units like "Span A", "Span B", etc.
  const storageUnits = []
  const spanNames = ['Span A', 'Span B', 'Span C', 'Span D', 'Span E', 'Span F', 'Span G', 'Span H']
  
  // Each orchard has 6-8 storage units
  const numUnits = Math.floor(Math.random() * 3) + 6
  
  for (let i = 0; i < numUnits; i++) {
    const unitName = spanNames[i] || `Unit ${i + 1}`
    const weekDistribution = {}
    
    // Each storage unit has a total capacity of 40-80 bins
    const totalCapacity = Math.floor(Math.random() * 41) + 40
    let remainingCapacity = totalCapacity
    
    // Distribute bins across harvest weeks (some weeks might be empty)
    for (let week = 1; week <= harvestWeeks; week++) {
      if (remainingCapacity > 0 && Math.random() > 0.3) { // 70% chance of having bins in this week
        const binsForWeek = Math.floor(Math.random() * Math.min(remainingCapacity, 20))
        if (binsForWeek > 0) {
          weekDistribution[week] = binsForWeek
          remainingCapacity -= binsForWeek
        }
      }
    }
    
    // Add any remaining capacity to random weeks
    while (remainingCapacity > 0) {
      const randomWeek = Math.floor(Math.random() * harvestWeeks) + 1
      const additionalBins = Math.min(remainingCapacity, Math.floor(Math.random() * 5) + 1)
      weekDistribution[randomWeek] = (weekDistribution[randomWeek] || 0) + additionalBins
      remainingCapacity -= additionalBins
    }
    
    storageUnits.push({
      name: unitName,
      weekDistribution: weekDistribution,
      totalBins: Object.values(weekDistribution).reduce((sum, count) => sum + count, 0)
    })
  }
  
  // Sort by total bins (descending) to match the reference image style
  return storageUnits.sort((a, b) => b.totalBins - a.totalBins)
}

export function generateWarehouseData(harvestWeeks) {
  // Static warehouse data with distinctly different percentage distributions for each warehouse
  // Each warehouse has a unique harvest pattern based on location, variety, and processing priorities
  const warehouseData = [
    {
      name: 'warehouse 1',
      totalBins: 5800,
      usedBins: 4760,
      // Early harvest focus - peaks in weeks 1-2
      weekDistribution: { 1: 1190, 2: 1095, 3: 714, 4: 619, 5: 476, 6: 333, 7: 238, 8: 95 }
    },
    {
      name: 'warehouse 2', 
      totalBins: 6200,
      usedBins: 5100,
      // Mid-season focus - peaks in weeks 3-4
      weekDistribution: { 1: 408, 2: 561, 3: 1071, 4: 1173, 5: 816, 6: 612, 7: 306, 8: 153 }
    },
    {
      name: 'warehouse 3',
      totalBins: 4800,
      usedBins: 3850,
      // Late harvest specialist - peaks in weeks 5-6
      weekDistribution: { 1: 231, 2: 308, 3: 462, 4: 693, 5: 1001, 6: 924, 7: 154, 8: 77 }
    },
    {
      name: 'warehouse 4',
      totalBins: 7000,
      usedBins: 5600,
      // Extended season - more even distribution
      weekDistribution: { 1: 784, 2: 840, 3: 896, 4: 896, 5: 840, 6: 728, 7: 448, 8: 168 }
    },
    {
      name: 'warehouse 5',
      totalBins: 5200,
      usedBins: 4200,
      // Peak late season - weeks 6-7
      weekDistribution: { 1: 168, 2: 252, 3: 378, 4: 546, 5: 714, 6: 1134, 7: 882, 8: 126 }
    },
    {
      name: 'warehouse 6',
      totalBins: 6500,
      usedBins: 5300,
      // Two-peak pattern - weeks 2 and 6
      weekDistribution: { 1: 371, 2: 1113, 3: 477, 4: 636, 5: 583, 6: 1325, 7: 636, 8: 159 }
    }
  ]

  return warehouseData.map(warehouse => {
    // Calculate percentages based on the actual distribution
    const percentages = []
    const weeklyData = []
    
    for (let week = 1; week <= harvestWeeks; week++) {
      const count = warehouse.weekDistribution[week] || 0
      const percentage = warehouse.usedBins > 0 ? Math.round((count / warehouse.usedBins) * 100) : 0
      percentages.push(percentage)
      
      weeklyData.push({
        week: week,
        count: count,
        percentage: percentage
      })
    }

    return {
      ...warehouse,
      percentages: percentages,
      weeklyData: weeklyData
    }
  })
}

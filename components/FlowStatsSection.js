export default function FlowStatsSection({ orchards, warehouses }) {
  // Calculate orchard bins (bins currently in orchards)
  const totalOrchardBins = orchards.reduce((sum, orchard) => sum + orchard.totalBins, 0)
  
  // Calculate warehouse bins (bins currently stored in warehouses)
  const totalWarehouseBins = warehouses.reduce((sum, warehouse) => sum + warehouse.usedBins, 0)
  
  // Calculate orchard-warehouse bins (bins being transported from orchards to warehouses)
  const orchardWarehouseBins = Math.round(totalOrchardBins * 0.15) // Estimated 15% in transit to warehouses
  
  // Calculate collection bins (empty bins stored in collection warehouse after product packaging)
  const collectionBins = Math.round(totalWarehouseBins * 0.25) // Estimated 25% processed and sent to collection
  
  // Calculate collection-orchard bins (bins being transported from collection back to orchards)
  const collectionOrchardBins = Math.round(collectionBins * 0.2) // Estimated 20% in transit back to orchards
  
  // Calculate total bins across entire company (sum of all bin locations and states)
  const totalBins = totalOrchardBins + orchardWarehouseBins + totalWarehouseBins + collectionBins + collectionOrchardBins

  const stats = [
    { title: 'Total Orchards', value: orchards.length, label: 'orchards' },
    { title: 'Total Warehouses', value: warehouses.length, label: 'warehouses' },
    { title: 'Total Bins', value: totalBins.toLocaleString(), label: 'bins' },
    { title: 'Total Orchard Bins', value: totalOrchardBins.toLocaleString(), label: 'bins' },
    { title: 'Orchard-Warehouse Bins', value: orchardWarehouseBins.toLocaleString(), label: 'bins' },
    { title: 'Total Warehouse Bins', value: totalWarehouseBins.toLocaleString(), label: 'bins' },
    { title: 'Collection Bins', value: collectionBins.toLocaleString(), label: 'bins' },
    { title: 'Collection-Orchard Bins', value: collectionOrchardBins.toLocaleString(), label: 'bins' }
  ]

  return (
    <section className="bin-flow-section">
      <h2>Bin Flow Summary</h2>
      <div className="flow-stats">
        {stats.map((stat, index) => (
          <div key={index} className="flow-stat-card">
            <h4>{stat.title}</h4>
            <div className="value">{stat.value}</div>
            <div className="label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

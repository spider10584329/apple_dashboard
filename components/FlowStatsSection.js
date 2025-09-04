export default function FlowStatsSection({ orchards, warehouses }) {
  // Calculate totals
  const totalOrchardBins = orchards.reduce((sum, orchard) => sum + orchard.totalBins, 0)
  const totalWarehouseBins = warehouses.reduce((sum, warehouse) => sum + warehouse.totalBins, 0)
  const totalUsedWarehouseBins = warehouses.reduce((sum, warehouse) => sum + warehouse.usedBins, 0)
  
  const averageBinsPerOrchard = Math.round(totalOrchardBins / (orchards.length || 1))
  const averageBinsPerWarehouse = Math.round(totalWarehouseBins / (warehouses.length || 1))

  const stats = [
    { title: 'Total Orchards', value: orchards.length, label: 'orchards' },
    { title: 'Total Orchard Bins', value: totalOrchardBins.toLocaleString(), label: 'bins' },
    { title: 'Total Warehouses', value: warehouses.length, label: 'warehouses' },
    { title: 'Total Warehouse Bins', value: totalWarehouseBins.toLocaleString(), label: 'bins' },
    { title: 'Used Warehouse Bins', value: totalUsedWarehouseBins.toLocaleString(), label: 'bins' },
    { title: 'Avg Bins/Warehouse', value: averageBinsPerWarehouse.toLocaleString(), label: 'bins' }
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

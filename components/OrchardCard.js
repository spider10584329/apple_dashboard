import { useState } from 'react'
import StorageBin from './StorageBin'

export default function OrchardCard({ orchard, harvestWeeks, weekColors }) {
  return (
    <div className="orchard-card">
      <div className="orchard-title">{orchard.name}</div>
      {orchard.storageUnits.map((unit, index) => (
        <StorageBin 
          key={index}
          bin={unit}
          harvestWeeks={harvestWeeks}
          weekColors={weekColors}
        />
      ))}
    </div>
  )
}

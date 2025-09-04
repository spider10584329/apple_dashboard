export default function WeekLegend({ harvestWeeks, weekColors }) {
  return (
    <div className="legend">
      <h3>Harvest Weeks</h3>
      <div className="legend-items">
        {Array.from({ length: harvestWeeks }, (_, index) => {
          const week = index + 1
          return (
            <div key={week} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: weekColors[index] }}
              />
              <span>Week {week}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

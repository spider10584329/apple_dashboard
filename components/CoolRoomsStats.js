export default function CoolRoomsStats({ coolRooms, harvestWeeks, weekColors }) {
  return (
    <div className="cool-rooms-stats">
      {coolRooms.map((coolRoom, index) => (
        <div key={index} className="cool-room-stat">
          <h4>{coolRoom.name}</h4>
          <div className="total-bins">{coolRoom.totalBins.toLocaleString()}</div>
          <div className="week-breakdown">
            {Array.from({ length: harvestWeeks }, (_, weekIndex) => {
              const week = weekIndex + 1
              const count = coolRoom.weekDistribution[week] || 0
              
              if (count === 0) return null
              
              return (
                <div key={week} className="week-count">
                  <div 
                    className="week-color"
                    style={{ backgroundColor: weekColors[weekIndex] }}
                  />
                  <span>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

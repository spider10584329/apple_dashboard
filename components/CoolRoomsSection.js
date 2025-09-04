import CoolRoomsRing from './CoolRoomsRing'
import CoolRoomsStats from './CoolRoomsStats'

export default function CoolRoomsSection({ coolRooms, harvestWeeks, weekColors }) {
  return (
    <section className="packhouse-section">
      <h2>Packhouse - Cool Rooms</h2>
      <div className="cool-rooms-container">
        <CoolRoomsRing 
          coolRooms={coolRooms} 
          harvestWeeks={harvestWeeks} 
          weekColors={weekColors} 
        />
        <CoolRoomsStats 
          coolRooms={coolRooms} 
          harvestWeeks={harvestWeeks} 
          weekColors={weekColors} 
        />
      </div>
    </section>
  )
}

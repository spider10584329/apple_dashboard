import OrchardCard from './OrchardCard'

export default function OrchardsSection({ orchards, harvestWeeks, weekColors }) {
  return (
    <section className="orchards-section">
      <h2>Orchards - Storage Units</h2>
      <div className="orchards-grid">
        {orchards.map((orchard, index) => (
          <OrchardCard 
            key={index}
            orchard={orchard}
            harvestWeeks={harvestWeeks}
            weekColors={weekColors}
          />
        ))}
      </div>
    </section>
  )
}

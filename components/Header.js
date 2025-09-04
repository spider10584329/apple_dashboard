import WeekLegend from './WeekLegend'
import ThemeToggle from './ThemeToggle'

export default function Header({ harvestWeeks, weekColors }) {
  return (
    <header>
      <div className="header-left">
        <h1>Apple Harvest & Storage Dashboard</h1>
      </div>
      <div className="header-center">
        <WeekLegend harvestWeeks={harvestWeeks} weekColors={weekColors} />
      </div>
      <div className="header-right">
        <ThemeToggle />
      </div>
    </header>
  )
}

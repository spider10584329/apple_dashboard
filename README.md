# Apple Harvest Dashboard

A comprehensive dashboard built with Next.js for tracking apple harvest and storage processes across orchards, temporary storage bins, and cool rooms.

## Features

- **Orchards Visualization**: Horizontal bar charts showing temporary storage bins with color-coded harvest weeks
- **Cool Rooms Ring Diagram**: Circular visualization of 6 cool rooms with harvest week distribution
- **Interactive Tooltips**: Detailed information on hover
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Dynamic data generation for realistic simulation

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository or download the project files

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
apple-harvest-dashboard/
├── components/           # React components
│   ├── Dashboard.js     # Main dashboard component
│   ├── Header.js        # Header with title and legend
│   ├── WeekLegend.js    # Harvest week color legend
│   ├── OrchardsSection.js
│   ├── OrchardCard.js
│   ├── StorageBin.js
│   ├── CoolRoomsSection.js
│   ├── CoolRoomsRing.js # D3.js ring visualization
│   ├── CoolRoomsStats.js
│   ├── FlowStatsSection.js
│   └── Tooltip.js       # Reusable tooltip component
├── pages/
│   ├── _app.js          # Next.js app wrapper
│   └── index.js         # Home page
├── styles/
│   └── globals.css      # Global styles
├── utils/
│   └── dataGenerator.js # Data generation utilities
├── package.json
├── next.config.js
└── README.md
```

## Data Model

### Orchards
- 5 orchards (A-E)
- Each orchard has 80-100 temporary storage bins
- Each storage bin contains 20-70 bins distributed across 8 harvest weeks

### Cool Rooms
- 6 cool rooms
- Each cool room contains 3,000-5,000 bins
- Bins are distributed across 8 harvest weeks with color coding

### Harvest Weeks
- 8-week harvest season
- Each week has a unique color identifier
- Color coding is consistent across all visualizations

## Technologies Used

- **Next.js**: React framework for production
- **React**: UI library
- **D3.js**: Data visualization for ring diagram
- **CSS**: Styling with modern design principles
- **JavaScript**: ES6+ features

## Customization

### Changing Colors
Edit the `weekColors` array in `components/Dashboard.js`:

```javascript
const weekColors = [
  '#FF6B6B', // Week 1 - Red
  '#4ECDC4', // Week 2 - Teal
  // ... add more colors
]
```

### Modifying Data Generation
Update the data generation logic in `utils/dataGenerator.js` to change:
- Number of orchards
- Number of storage bins per orchard
- Number of cool rooms
- Bin distribution patterns

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is for demonstration purposes.

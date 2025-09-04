export default function Tooltip({ content, x, y }) {
  return (
    <div 
      className="tooltip" 
      style={{ 
        left: x, 
        top: y,
        display: 'block'
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

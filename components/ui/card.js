export function Card({ className = '', ...props }) {
  return <div className={`ui-card ${className}`.trim()} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={`ui-card-content ${className}`.trim()} {...props} />;
}

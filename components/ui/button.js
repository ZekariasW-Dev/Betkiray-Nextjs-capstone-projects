export function Button({ className = '', variant = 'primary', size = 'default', type = 'button', ...props }) {
  return <button type={type} className={`ui-button ui-button-${variant} ui-button-${size} ${className}`.trim()} {...props} />;
}

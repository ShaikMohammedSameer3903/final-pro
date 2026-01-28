export default function Button({ variant = 'primary', size = 'md', className = '', ...props }) {
  const cls = `btn btn-${variant} btn-${size} ${className}`.trim()
  return <button className={cls} {...props} />
}

const ColorSchemeCell = ({ colorScheme }) => (
  <div>
    {colorScheme.map(scheme => <div className="badge badge-light-primary me-1" key={scheme.id}>{scheme.name}</div>)}
  </div>
)

export { ColorSchemeCell }

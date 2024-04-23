const ColorsCell = ({ colorList }) => (
  <div className="d-flex flex-column">
    {colorList.map(color => <div className="badge badge-secondary d-inline-block mb-2" key={color.id}>{color.name}</div>)}
  </div>
)

export { ColorsCell }

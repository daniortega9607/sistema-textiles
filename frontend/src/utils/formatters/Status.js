export const StatusTypes = [
  { id: 1, value: "Cancelado" },
  { id: 2, value: "Pendiente" },
  { id: 3, value: "Completado" }
];

export const Status = ({ props }) => (
  <div>{StatusTypes.find(item => item.id == props.value).value}</div>
)

export default Status;
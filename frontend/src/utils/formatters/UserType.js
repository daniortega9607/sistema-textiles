export const UserTypes = [
  { id: 1, value: "Administrador" },
  { id: 2, value: "Vendedor" },
  { id: 3, value: "Cliente" }
];

export const UserType = ({ props }) => (
  <div>{UserTypes.find(item => item.id == props.value).value}</div>
)

export default UserType;
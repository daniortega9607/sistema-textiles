import { UserTypes, UserType } from "../utils";
import SearchBoxList from "../components/Form/SearchBoxList";

export const User = {
  name: 'User',
  display_name: 'Usuarios',
  display_single_name: 'Usuario',
  url: 'users',
  field_configurations: {
    form: [
      { key: 'name', render_type: 'text', attributes: { required: true, placeholder: 'Ejemplo: Carlos Rivera' } },
      { key: 'email', render_type: 'email', attributes: { required: true } },
      { key: 'password', render_type: 'password', attributes: { required: true } },
      { key: 'c_password', render_type: 'password', attributes: { required: true } },
      { key: 'user_type', render_type: 'select', props: { values: UserTypes } },
      {
        key: 'customer_id', render_type: 'custom', renderer: SearchBoxList, props: { entity: 'Customer' }
      },
    ],
    list: {
      order: ['id', 'name', 'email', 'user_type'],
      fields: {
        user_type: { formatter: UserType },
      },
      showEditButton: true,
      showDeleteButton: true,
    }
  },
  fields: {
    id: {
      type: Number,
      is_primary: true,
      auto_generated: true,
      display_name: 'ID'
    },
    name: { type: String, display_name: 'Nombre', required: true },
    email: { type: String, display_name: 'Correo', required: true },
    password: { type: String, display_name: 'Contraseña', required: true },
    c_password: { type: String, display_name: 'Confirmar Contraseña', auto_generated: true },
    user_type: { type: Number, display_name: 'Tipo de Usuario', required: true },
    customer_id: { type: Number, display_name: 'Cliente' },
  }
}

export default User;
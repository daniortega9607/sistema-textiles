import { UserType, UserTypes } from "../formatters/UserType";
import SearchBoxList from "../../components/SearchBoxList";

export const User = {
  name: 'User',
  store_entity: true,
  display_name: 'Usuarios',
  display_single_name: 'Usuario',
  url: 'users',
  field_configurations: {
    form: {
      order: ['name', 'email', 'password', 'c_password', 'user_type','customer_id'],
      showDeleteButton: true,
    },
    list: {
      order: ['id', 'name', 'email', 'user_type','customer.name'],
      showCreateButton: true,
      showEditButton: true,
      showDeleteButton: true,
    }
  },
  fields: {
    id: { type: Number, is_primary: true, auto_generated: true, display_name: 'ID' },
    name: { type: String, display_name: 'Nombre', required: true, render_type: 'text' },
    email: { type: String, display_name: 'Correo', required: true, render_type: 'email' },
    password: { type: String, display_name: 'Contraseña', required: true, render_type: 'password', hideOnUpdate: true },
    c_password: { type: String, display_name: 'Confirmar Contraseña', required: true, render_type: 'password', hideOnUpdate: true},
    user_type: {
      type: Number,
      display_name: 'Tipo de Usuario', 
      required: true, 
      formatter: UserType, 
      class: "text-center", 
      render_type: 'select',
      props: { values: UserTypes }
    },
    customer: { type: Object, display_name: 'Cliente' },
    customer_id: { type: Number, display_name: 'Cliente', render_type: 'custom', renderer: SearchBoxList, props: { entity:'customers' }, hideOnUpdate: true  },
  }
}

export default User;
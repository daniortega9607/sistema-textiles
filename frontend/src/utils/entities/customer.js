export const Customer = {
  name: 'Customer',
  store_entity: true,
  display_name: 'Clientes',
  display_single_name: 'Cliente',
  url: 'customers',
  field_configurations: {
    form: {
      order: ['name','address','phone','mobilephone','email','credit_days','comments'],
      showDeleteButton: true,
    },
    list: {
      order: ['id','name','address','phone','mobilephone','email','credit_days','comments'],
      showCreateButton: true,
      showEditButton: true,
      showDeleteButton: true,
    }
  },
  fields: {
    id: { type: Number, is_primary: true, auto_generated: true, display_name: 'ID' },
    name: { type: String, display_name: 'Nombre', required: true, render_type: 'text' },
    address: { type: String, display_name: 'Dirección', render_type: 'text' },
    phone: { type: String, display_name: 'Teléfono', render_type: 'text' },
    mobilephone: { type: String, display_name: 'Celular', render_type: 'text' },
    email: { type: String, display_name: 'Correo', render_type: 'email' },
    credit_days: { type: Number, display_name: 'Dias de crédito', render_type: 'number' },
    comments: { type: String, display_name: 'Observaciones', render_type: 'textarea' },
  }
}

export default Customer;
export const Office = {
  name: 'Office',
  store_entity: true,
  display_name: 'Sucursales',
  display_single_name: 'Sucursal',
  url: 'offices',
  field_configurations: {
    form: {
      order: ['name', 'address', 'phone'],
      showDeleteButton: true,
    },
    list: {
      order: ['id', 'name', 'address', 'phone'],
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
  }
}

export default Office;
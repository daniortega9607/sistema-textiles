export const Supplier = {
  name: 'Supplier',
  display_name: 'Proveedores',
  display_single_name: 'Proveedor',
  url: 'suppliers',
  field_configurations: {
    form: [
      { key: 'name', render_type: 'text', attributes: { required: true, placeholder: 'Ejemplo: Carlos Rivera' } },
      { key: 'address', render_type: 'text' },
      { key: 'telephone', render_type: 'text' },
      { key: 'mobilephone', render_type: 'text' },
      { key: 'email', render_type: 'text' },
      { key: 'comments', render_type: 'textarea' },
    ],
    list: {
      order: ['id', 'name', 'address', 'telephone', 'mobilephone', 'email', 'comments'],
      fields: {},
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
    address: { type: String, display_name: 'Dirección' },
    telephone: { type: String, display_name: 'Teléfono' },
    mobilephone: { type: String, display_name: 'Celular' },
    email: { type: String, display_name: 'Correo' },
    comments: { type: String, display_name: 'Observaciones' },
  }
}

export default Supplier;
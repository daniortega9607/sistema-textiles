export const Design = {
  name: 'Design',
  display_name: 'Diseños',
  display_single_name: 'Diseño',
  url: 'designs',
  field_configurations: {
    form: [
      { key: 'name', render_type: 'text', attributes: { required: true, placeholder: 'Ejemplo: Estampado' } },
    ],
    list: {
      order: ['id', 'name'],
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
  }
}

export default Design;
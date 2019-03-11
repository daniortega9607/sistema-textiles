export const Design = {
  name: 'Design',
  store_entity: true,
  display_name: 'Diseños',
  display_single_name: 'Diseño',
  url: 'designs',
  field_configurations: {
    form: {
      order: ['name'],
      showDeleteButton: true,
    },
    list: {
      order: ['id', 'name'],
      showCreateButton: true,
      showEditButton: true,
      showDeleteButton: true,
    }
  },
  fields: {
    id: { type: Number, is_primary: true, auto_generated: true, display_name: 'ID' },
    name: { type: String, display_name: 'Nombre', required: true, render_type: 'text' },
  }
}

export default Design;
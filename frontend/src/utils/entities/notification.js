export const Notification = {
  name: 'Notification',
  store_entity: true,
  display_name: 'Notificaciones',
  display_single_name: 'Notificacion',
  url: 'notifications',
  field_configurations: {
    form: {
      order: ['name'],
      showDeleteButton: true,
    },
    list: {
      order: ['id', 'message','created_at'],
      showCreateButton: true,
      showDeleteButton: true,
    }
  },
  fields: {
    id: { type: Number, is_primary: true, auto_generated: true, display_name: 'ID' },
    created_at: { type: String, display_name: 'Fecha' },
    message: { type: String, display_name: 'Mensaje', required: true, render_type: 'text' },
  }
}

export default Notification;
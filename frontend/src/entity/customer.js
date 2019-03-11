import { CurrencyFormatter } from "../utils";

export const Customer = {
  name: 'Customer',
  display_name: 'Clientes',
  display_single_name: 'Cliente',
  url: 'customers',
  field_configurations: {
    form: [
      { key: 'name', render_type: 'text', attributes: { required: true, placeholder: 'Ejemplo: Carlos Rivera' } },
      { key: 'address', render_type: 'text' },
      { key: 'telephone', render_type: 'text' },
      { key: 'mobilephone', render_type: 'text' },
      { key: 'email', render_type: 'text' },
      { key: 'credit_days', render_type: 'number' },
      { key: 'comments', render_type: 'textarea' },
    ],
    list: {
      order: ['id', 'name', 'address', 'telephone', 'mobilephone', 'email', 'credit_days', 'comments'],
      fields: {
        credit_days: { attributes: { class: { 'text-center': true } } },
      },
      showEditButton: true,
      showDeleteButton: true,
    },
    report: {
      order: ['id', 'name', 'balance.total', 'address', 'telephone', 'mobilephone', 'email', 'credit_days', 'comments'],
      fields: {
        balance_id: { formatter: CurrencyFormatter, attributes: { class: { 'text-right': true } } },
      }
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
    balance_id: { type: String, display_name: 'Saldo', auto_generated:true, is_primary:true },
    address: { type: String, display_name: 'Dirección' },
    telephone: { type: String, display_name: 'Teléfono' },
    mobilephone: { type: String, display_name: 'Celular' },
    email: { type: String, display_name: 'Correo' },
    credit_days: { type: Number, display_name: 'Dias de crédito' },
    comments: { type: String, display_name: 'Observaciones' },
  }
}

export default Customer;
import { CurrencyFormatter } from "../utils";

export const Fabric = {
  name: 'Fabric',
  display_name: 'Telas',
  display_single_name: 'Tela',
  url: 'fabrics',
  field_configurations: {
    form: [
      { key: 'name', render_type: 'text', attributes: { required: true, placeholder: 'Ejemplo: Brush' } },
      { key: 'buy_price', render_type: 'number' },
      { key: 'sell_price', render_type: 'number' },
    ],
    list: {
      order: ['id', 'name', 'buy_price', 'sell_price'],
      fields: {
        buy_price: { formatter: CurrencyFormatter, attributes: { class: { 'text-right': true } } },
        sell_price: { formatter: CurrencyFormatter, attributes: { class: { 'text-right': true } } },
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
    buy_price: { type: Number, display_name: 'Precio de Compra' },
    sell_price: { type: Number, display_name: 'Precio de Venta' },
  }
}

export default Fabric;
import Currency from "../formatters/Currency";

export const Fabric = {
  name: 'Fabric',
  store_entity: true,
  display_name: 'Telas',
  display_single_name: 'Tela',
  url: 'fabrics',
  field_configurations: {
    form: {
      order: ['name','buy_price','sell_price'],
      showDeleteButton: true,
    },
    list: {
      order: ['id', 'name', 'buy_price', 'sell_price'],
      showCreateButton: true,
      showEditButton: true,
      showDeleteButton: true,
    }
  },
  fields: {
    id: { type: Number, is_primary: true, auto_generated: true, display_name: 'ID' },
    name: { type: String, display_name: 'Nombre', required: true, render_type: 'text' },
    buy_price: { type: String, display_name: 'Precio de Compra', formatter: Currency, class:"text-right", render_type: 'number' },
    sell_price: { type: String, display_name: 'Precio de Venta', formatter: Currency, class:"text-right", render_type: 'number' },
  }
}

export default Fabric;
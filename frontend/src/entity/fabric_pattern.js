import SearchBoxList from "../components/Form/SearchBoxList";

export const FabricPattern = {
    name: 'FabricPattern',
    display_name: 'Modelos',
    display_single_name: 'Modelo',
    url: 'fabric_patterns',
    field_configurations: {
      form: [
        { key: 'sku', render_type: 'text', attributes: { placeholder: 'Ejemplo: Brush-1234' } },
        { 
          key: 'fabric_id', render_type: 'custom', attributes: { required: true },
          renderer: SearchBoxList, props: { entity:'Fabric' }
        },
        { 
          key: 'design_id', render_type: 'custom', renderer: SearchBoxList, props: { entity:'Design' }
        },
        { 
          key: 'color_id', render_type: 'custom', renderer: SearchBoxList, props: { entity:'Color' }
        },
      ],
      list: {
        order: ['id', 'sku', 'fabric.name', 'design.name', 'color.name'],
        fields: {}
      }
    },
    fields: {
      id: {
        type: Number,
        is_primary: true,
        auto_generated: true,
        display_name: 'ID'
      },
      sku: { type: String, display_name: 'Código' },
      fabric: { type: Object, entity:'Fabric' },
      fabric_id: { type: Number, display_name: 'Tela' },
      color: { type: Object, entity:'Fabric' },
      color_id: { type: Number, display_name: 'Color' },
      design: { type: Object, entity:'Fabric' },
      design_id: { type: Number, display_name: 'Diseño' },
    }
  }
  
  export default FabricPattern;
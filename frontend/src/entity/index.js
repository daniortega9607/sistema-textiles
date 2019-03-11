import Color from "./color";
import Customer from "./customer";
import Design from "./design";
import FabricPattern from "./fabric_pattern";
import Fabric from "./fabric";
import PurchaseArticle from "./purchase_article";
import Purchase from "./purchase";
import SaleArticle from "./sale_article";
import Sale from "./sale";
import Supplier from "./supplier";
import User from "./user";
import { getDataFromKey } from "../utils";

export const Entities = {
  Color, Customer, Design, FabricPattern, Fabric, PurchaseArticle, Purchase,
  SaleArticle, Sale, Supplier, User
}

const mappedEntities = {
  'colores': 'Color',
  'clientes': 'Customer',
  'disenos': 'Design',
  'modelos': 'FabricPattern',
  'telas': 'Fabric',
  'articulos_compras': 'PurchaseArticle',
  'compras': 'Purchase',
  'articulos_ventas': 'SaleArticle',
  'ventas': 'Sale',
  'proveedores': 'Supplier',
  'usuarios': 'User',
}

export const isValidEntity = (entity) => {
  return entity && (Entities[entity] || mappedEntities[entity]) ? true : false;
}

export const getEntityForm = (entity_name) => {
  const fields = [];
  const entity = Entities[entity_name] || Entities[mappedEntities[entity_name]];
  entity.field_configurations.form.forEach(field => {
    fields.push({
      ...field,
      label: entity.fields[field.key].display_name
    })
  });
  return {
    display_name: entity.display_single_name,
    url: entity.url,
    fields
  };
}

export const getDataGrid = (grid, items = [], rowConfiguration = {}) => {
  const rows = [];
  items.forEach((item, index) => {
    rows.push({
      id: item.id,
      ...rowConfiguration,
      data: []
    });
    grid.forEach(field => {
      rows[index].data.push({
        ...field.field,
        key:field.key,
        value: field.key.indexOf('.') > -1 ? getDataFromKey(item, field.key.split('.')) : item[field.key]
      });
    })
  })
  return rows;
}

export const getEntityList = (entity_name) => {
  const fields = [];
  const entity = Entities[entity_name] || Entities[mappedEntities[entity_name]];
  entity.field_configurations.list.order.forEach(field => {
    let field_name = [field];
    if(field.indexOf('.') > -1) {
      field_name = field.split('.');
      field_name[0] = field_name[0]+'_id';
    }
    fields.push({
      key: field,
      field: { ...entity.field_configurations.list.fields[field_name[0]], is_primary: entity.fields[field_name[0]].is_primary },
      display_name: entity.fields[field_name[0]].display_name
    })
  })
  return {
    display_name: entity.display_name,
    url: entity.url,
    fields,
    showEditButton: entity.field_configurations.list.showEditButton,
    showDeleteButton: entity.field_configurations.list.showDeleteButton,    
  };
}

export const getEntityReport = (entity_name) => {
  const fields = [];
  const entity = Entities[entity_name] || Entities[mappedEntities[entity_name]];
  entity.field_configurations.report.order.forEach(field => {
    let field_name = [field];
    if(field.indexOf('.') > -1) {
      field_name = field.split('.');
      field_name[0] = field_name[0]+'_id';
    }
    fields.push({
      key: field,
      field: { ...entity.field_configurations.report.fields[field_name[0]], is_primary: entity.fields[field_name[0]].is_primary },
      display_name: entity.fields[field_name[0]].display_name
    })
  })
  return {
    display_name: entity.display_name,
    url: entity.url,
    fields
  };
}

const getInstanceFromModel = (entity, model, type) => {
  const instance = {}
  Object.keys(entity).forEach(field => {
    if (entity[field] && entity[field].constructor === Object) {
      instance[field] = model[field] ? getInstanceFromModel(entity[field], model[field]) : entity[field];
    } else if (entity[field] && entity[field].constructor === Array) {
      instance[field] = entity[field];
      if (model[field])
        model[field].forEach(item => {
          const listItem = generateEntityInstance(Entities[type].fields[field]['entity'], item, true);
          instance[field].push(listItem);
        })
    }
    else instance[field] = model[field] !== undefined ? model[field] : entity[field];
  });
  return instance;
}

export const generateEntityInstance = (entity_name, model = {}, isNewInstance = false) => {
  const entity = Entities[entity_name] || Entities[mappedEntities[entity_name]];
  let instance = {};
  let fields = entity && entity.fields ? entity.fields : {};
  Object.keys(fields).forEach(field => {
    const fieldModel = fields[field];
    if (fieldModel.auto_generated || fieldModel.type === Number || fieldModel.type === String) {
      if (fieldModel.required && !isNewInstance && (model[field] === undefined || model[field] === null)) {
        console.error(`Error en campo requerido: ${entity.name}.${field}`);
      }
      instance[field] = fieldModel.default !== undefined ? fieldModel.default : null
    } else {
      if (fieldModel.type === Array) {
        instance[field] = [];
      } else if (fieldModel.type === Object) {
        instance[field] = generateEntityInstance(fieldModel['entity'], model[field] || {}, isNewInstance)
      }
    }
  });
  instance = getInstanceFromModel(instance, model, entity.name);
  return {
    ...instance
  }
}

export default Entities;
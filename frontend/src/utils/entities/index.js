import Office from "./office";
import Color from "./color";
import Design from "./design";
import Fabric from "./fabric";
import Product from "./product";
import Supplier from "./supplier";
import Customer from "./customer";
import User from "./user";
import Stock from "./stock";
import StockMovement from "./stock_movement";
import Notification from "./notification";

export const Entities = {
  Office, Color, Design, Fabric, Product, Supplier, Customer, User, Stock, StockMovement, Notification
}

export const MappedEntities = {
  sucursales: 'Office',
  colores: 'Color',
  disenos: 'Design',
  telas: 'Fabric',
  modelos: 'Product',
  clientes: 'Customer',
  proveedores: 'Supplier',
  usuarios: 'User',
  almacen: 'Stock',
  'movimientos-almacen': 'StockMovement',
  notificaciones: 'Notification',
}

export const getMappedKeyEntity = (url) => {
  let entityInfo;
  Object.keys(Entities).forEach(entity => {
    if (Entities[entity].url == url) {
      entityInfo = Entities[entity];
    }
  })
  Object.keys(MappedEntities).forEach(item => {
    if(MappedEntities[item] == entityInfo.name) entityInfo = item;
  })
  return entityInfo;
}

export const getEntityInfo = (entity) => {
  return Entities[entity] || Entities[MappedEntities[entity]];
}

export const isValidEntity = (entity) => {
  return !!Entities[entity] || !!Entities[MappedEntities[entity]];
}

export const getStoredEntities = () => {
  const entities = {};
  Object.keys(Entities).forEach(entity => {
    if (Entities[entity].store_entity) {
      entities[Entities[entity].url] = [];
    }
  })
  return entities;
}
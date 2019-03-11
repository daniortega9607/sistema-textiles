import Office from "./office";
import Color from "./color";
import Design from "./design";
import Fabric from "./fabric";
import Product from "./product";
import Supplier from "./supplier";
import Customer from "./customer";
import User from "./user";
import Stock from "./stock";

export const Entities = {
  Office, Color, Design, Fabric, Product, Supplier, Customer, User, Stock
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
  almacen: 'Stock'
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
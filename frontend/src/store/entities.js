import Vue from "vue";
import { fetch, filterData } from "../utils";
import { getStoredEntities } from "../utils/entities";

const state = {
  ...getStoredEntities()
};

const getters = {
  entityItems: state => ({entity, params = { search: '' }}) => {
    if (params.search) return filterData(state[entity], params.search, params.keys)
    return state[entity];
  },
  entityItem: state => ({entity, id}) => {
    return state[entity].find(item => item.id == id);
  }
};
const actions = {
  async setNotifications({ state, commit }, notifications) {
    const improvePerformance = {};
    notifications.forEach(item => {
      if (!improvePerformance[item.entity_id]) {
        improvePerformance[item.entity_id] = [];
      }
      improvePerformance[item.entity_id].push(item);
    });
    notifications = [];
    Object.keys(improvePerformance).forEach(item => {
      if (improvePerformance[item].length > 2) {
        notifications.push({ ...improvePerformance[item][0], type: 2 });
      } else {
        notifications = notifications.concat(improvePerformance[item]);
      }
    })
    notifications.forEach(async item => {
      if (item.type == 1) {
        const [err, createdValue] = await fetch({
          url: `/api/${item.entity.name}/${item.entity_value_id}`,
        });
        if (!err) {
          commit('onCreate', { entity: item.entity.name, createdValue});
        }
      } else if(item.type == 2) {
        const [err, items] = await fetch({url: `/api/${item.entity.name}`,});
        if (!err) {
          commit('setInitialValues', { [item.entity.name]: items });
        }
      } else if(item.type == 3) {
        const [err, updatedValue] = await fetch({
          url: `/api/${item.entity.name}/${item.entity_value_id}`,
        });
        if (!err) {
          commit('onUpdate', { entity: item.entity.name, id: item.entity_value_id, updatedValue});
        }
      } else if(item.type == 4) {
        commit('onDelete', { entity: item.entity.name, id: item.entity_value_id});
      }
    });
  }
};

const mutations = {
  setInitialValues(state, { ...entities }) {
    Object.keys(entities).forEach(entity => state[entity] = entities[entity]);
  },
  onCreate(state, { entity, createdValue }) {
    state[entity].push(createdValue);
  },
  onUpdate(state, { entity, id, updatedValue }) {
    const index = state[entity].findIndex((item) => item.id == id);
    if (index > -1) {
      Vue.set(state[entity], index, updatedValue )
      //state[entity][index] = updatedValue; Issue with reactiveness
    } else {
      state[entity].push(updatedValue);
    }
  },
  onDelete(state, { entity, id }) {
    const index = state[entity].findIndex((item) => item.id == id);
    if (index > -1) {
      state[entity].splice(index, 1);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
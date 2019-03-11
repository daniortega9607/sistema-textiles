import './scss/global.scss';
import PNotify from 'pnotify/dist/es/PNotify';
import 'pnotify/dist/es/PNotifyButtons';
import 'pnotify/dist/es/PNotifyMobile';
import 'pnotify/dist/es/PNotifyConfirm';
PNotify.defaults.styling = 'bootstrap4';
PNotify.defaults.icons = 'fontawesome5';

window.PNotify = PNotify;
window._ = require('lodash');
try {
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {}

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
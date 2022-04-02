import { createApp } from 'vue'
import App from './App.vue'

import ganttastic from "@infectoone/vue-ganttastic";

import axios from 'axios';
import VueAxios from 'vue-axios';

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setTime(this.getTime() + (days * 60 * 60 * 1000));
    return date;
}

const app = createApp(App)

app
    .use(VueAxios, axios)
    .use(ganttastic)
    .mount('#app')

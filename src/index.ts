import Vue from 'vue';
import App from './App.vue';
import './style.css'

let vm = new Vue({
    el:"#root",
    // render:h=>h('h1',{'class':'red'},'hello world')
    render:h=>h(App)
})
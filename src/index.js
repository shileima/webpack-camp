import React from 'react';
import ReactDOM from 'react-dom';
import './style.css'
import('jquery');
import 'lodash';

/* import $ from 'jquery'
console.log($) */

/* 只加载calc文件中的minus方法 */
/* import {minus} from './calc'
console.log(minus(2,1)) */

/* 动态导入 类比 路由懒加载 import语法 jsonp原理*/
let button = document.createElement('button');
button.addEventListener('click',()=>{
    import(/* webpackChunkName:'add' */'./calc.js').then(({add})=>{
        console.log(add(1,2))
    })
})
button.innerHTML = 'click me'
document.body.appendChild(button)

// import test from './test'

ReactDOM.render(<div>from index.js</div>,document.getElementById('root'));
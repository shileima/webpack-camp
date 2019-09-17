let rs = require('./a-module');
import './index.scss';
import './less.less';
import './style.css';

console.log(rs)
import logo from './logo.jpg';
console.log(logo)

let img = document.createElement('img');

img.src = logo;

document.body.append(img)
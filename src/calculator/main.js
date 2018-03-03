import CalculatorApp from './Calculator.vue'
import Vue from 'vue'

document.addEventListener('DOMContentLoaded', () => {
  new Vue(CalculatorApp).$mount('#app')
})

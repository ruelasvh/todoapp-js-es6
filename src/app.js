import Store from './store'
import View from './view'
import Template from './template'
import Controller from './controller'
import { $on } from "./utils"

const store = new Store('todos-app')

const template = new Template()
const view = new View(template)

const controller = new Controller(store, view)

const renderView = () => controller.route(document.location.hash)
$on(window, 'load', renderView)
$on(window, 'hashchange', renderView)
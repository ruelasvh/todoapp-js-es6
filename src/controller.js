import { Todo } from "./model"
import routes from './routes'

/**
 * Takes in Store and View and dispatches actions.
 */
export default class Controller {
    constructor (store, view) {
        this.store = store
        this.view = view

        view.bindAddTodo(this.addTodo.bind(this))


        this._activeRoute = ''
        this._lastActiveRoute = null
    }

    route(raw) {
        const route = raw.replace(/^#\//, '')
        this._activeRoute = route
        this.renderView()
    }

    addTodo(title) {
        this.store.insert(
            Object.assign({}, Todo, {title}), () => {
            this.view.clearNewTodo()
            this.renderView(true)
        })
    }

    renderView(force) {
        const route = this._activeRoute

        if (force || this._lastActiveRoute !== '' || this._lastActiveRoute !== route) {
            this.store.findByRoute(routes[route], this.view.showTodos.bind(this.view))
        }

        this.store.count((total, active, completed) => {
            this.view.setTodosLeft(active)
            this.view.setCompleteAllCheckbox(completed === total)
            this.view.setMainVisibility(total)
        })

        this._lastActiveRoute = route
    }
}
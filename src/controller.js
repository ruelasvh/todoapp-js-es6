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
        view.bindRemoveTodo(this.removeTodo.bind(this))
        view.bindToggleTodo(this.toggleTodo.bind(this))
        view.bindToggleAll(this.toggleAll.bind(this))
        view.bindEditTodo(this.editTodo.bind(this))
        view.bindEditTodoSave(this.editTodoSave.bind(this))
        view.bindMoveUpTodo(this.moveUpTodo.bind(this))
        view.bindMoveDownTodo(this.moveDownTodo.bind(this))
        view.bindOnSearch(this.searchTodos.bind(this))

        this._activeRoute = ''
        this._lastActiveRoute = null
    }

    route (raw) {
        const route = raw.replace(/^#/, '')
        this._activeRoute = route
        this.renderView()
    }

    addTodo (title) {
        this.store.insert(
            Object.assign({}, Todo, {id: Date.now(), title}), () => {
            this.view.clearNewTodo()
            this.renderView(true)
        })
    }

    editTodo (id) {
        this.view.editTodo(id)
    }

    searchTodos () {
        this.view.searchTodos()
    }

    editTodoSave (id, title) {
        if (title.length) {
            this.store.update({id, title}, () => {
                this.view.editTodoDone(id, title)
            })
        }

        this.renderView(true)
    }

    removeTodo (id) {
        this.store.remove({id}, () => {
            this.renderView()
            this.view.removeTodo(id)
        })
    }

    moveUpTodo (id) {
        this.store.moveUp(id, () => {
            this.renderView(true)
        })
    }

    moveDownTodo (id) {
        this.store.moveDown(id, () => {
            this.renderView(true)
        })
    }

    toggleTodo (id, completed) {
        this.toggleCompleted(id, completed)
        this.renderView()
    }

    toggleAll (completed) {
        this.store.find({completed: !completed}, todos => {
            for (let {id} of todos) {
                this.toggleCompleted(id, completed)
            }
        })

        this.renderView()
    }

    toggleCompleted (id, completed) {
        this.store.update({id, completed}, () => {
            this.view.setTodoCompleted(id, completed)
        })
    }

    renderView (force) {
        const route = this._activeRoute

        if (force || this._lastActiveRoute !== '' || this._lastActiveRoute !== route) {
            this.store.find(routes[route], this.view.showTodos.bind(this.view))
        }

        this.store.count((total, active, completed) => {
            this.view.setTodosLeft(active)
            this.view.setCompleteAllCheckbox(completed === total)
            this.view.setMainVisibility(total)
            this.view.setSearchBarVisibility(total)
        })

        this._lastActiveRoute = route
    }
}
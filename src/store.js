import { move } from "./utils";

/**
 * Database that holds app's state
 */
export default class Store {
    /**
     * @param identifier This Store's name
     * @param action Callback called when the Store is ready
     */
    constructor (identifier, action) {
        const localStorage = window.localStorage

        let liveTodos

        this.getLocalStorage = () => {
            return liveTodos || JSON.parse(localStorage.getItem(identifier) || '[]')
        }

        this.setLocalStorage = (todos) => {
            localStorage.setItem(identifier, JSON.stringify(liveTodos = todos))
        }

        if (action) {
            action()
        }
    }

    /**
     * @param query {id: number}|{completed: boolean}|{}
     * @param action Callback called when query is finished
     */
    find (query, action) {
        let key

        const todos = this.getLocalStorage().filter(todo => {
            for (key in query) {
                if (query[key] !== todo[key]) {
                    return false
                }
            }
            return true
        })

        if (action) {
            action(todos)
        }
    }

    /**
     * @param todo Todo to add
     * @param action Callback called when insertion is done
     */
    insert (todo, action) {
        const todos = this.getLocalStorage()
        todos.push(todo)
        this.setLocalStorage(todos)

        if (action) {
            action()
        }
    }

    /**
     * @param todo Todo to update
     * @param action Callback called when update is complete
     */

    update (todo, action) {
        const id = todo.id
        const todos = this.getLocalStorage()
        let index = todos.length
        let key

        while (index--) {
            if (todos[index].id === id) {
                for (key in todo) {
                    todos[index][key] = todo[key]
                }
                break;
            }
        }

        this.setLocalStorage(todos)

        if (action) {
            action()
        }
    }

    /**
     * @param query {id: number}|{completed: boolean}|{}
     * @param action Callback called when insertion is done
     */
    remove (query, action) {
        let key

        const todos = this.getLocalStorage().filter(todo => {
            for (key in query) {
                if (query[key] !== todo[key]) {
                    return true
                }
            }
            return false
        })
        
        this.setLocalStorage(todos)
        
        if (action) {
            action(todos)
        }
    }

    moveUp (todoId, action) {
        let todos = this.getLocalStorage()
        move(todos, todoId, -1)

        this.setLocalStorage(todos)

        if (action) {
            action()
        }
    }

    moveDown (todoId, action) {
        let todos = this.getLocalStorage()
        move(todos, todoId, 1)

        this.setLocalStorage(todos)

        if (action) {
            action()
        }
    }

    /**
     * @param action Callback called when count is done
     */
    count (action) {
        const todos = this.getLocalStorage()
        const total = todos.length
        let completed = 0
        let index = total

        while (index--) {
            completed += todos[index].completed
        }

        if (action) {
            action(total, total - completed, completed)
        }
    }
}
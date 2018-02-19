import { escape } from './utils'

export default class Template {
    /**
     * @param todos Array containing todos
     */
    todoList (todos) {
        return todos.reduce((todoListHTML, todo) => {
            return todoListHTML + `
                <li data-id="${todo.id}" ${todo.completed ? 'class="completed"' : ''}>
                    <input id="${todo.id}" class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <label for="${todo.id}">${escape(todo.title)}</label>
                    <button class="move-up">Move up</button>
                    <button class="move-down">Move down</button>
                    <button class="destroy">Delete</button>
                </li>`}, '')
    }

    /**
     * @param activeTodos Number of active todos
     * @returns {string} Text for todos remaining
     */
    todoCounter (activeTodos) {
        return `${activeTodos} todo${activeTodos !== 1 ? 's' : ''} remaining`
    }
}
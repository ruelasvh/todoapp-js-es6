import { escape } from './utils'

export default class Template {
    /**
     * @param todos Array containing todos
     */
    todoList (todos) {
        return todos.reduce((todoListHTML, todo) => {
            return todoListHTML + `
                <li data-id="${todo.id}" ${todo.completed ? 'class="completed"' : ''}>
                    <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <label>${escape(todo.title)}</label>
                    <div class="move-up"></div>
                    <div class="move-down"></div>
                    <div class="destroy"></div>
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
import { getNodeId, querySelector, $on, $delegate } from "./utils"

/**
 * Class that takes a Template and binds events to nodes in the document object.
 */

export default class View {
    constructor (template) {
        this.template = template
        this.$todoList = querySelector('.todo-list')
        this.$todoActiveCounter = querySelector('.todo-count')
        this.$main = querySelector('.main')
        this.$toggleAll = querySelector('.toggle-all')
        this.$newTodo = querySelector('.new-todo')
        $delegate(this.$todoList, 'li label', 'dblclick', ({ target }) => {
            this.editItem(target)
        })
    }

    bindAddTodo (handler) {
        $on(this.$newTodo, 'change', ({ target }) => {
            const title = target.value.trim()
            if (title) {
                handler(title)
            }
        })
    }

    bindRemoveTodo (handler) {
        $delegate(this.$todoList, '.destroy', 'click', ({ target }) => {
            handler(getNodeId(target))
        })
    }

    bindToggleTodo (handler) {
        $delegate(this.$todoList, '.toggle', 'click', ({ target }) => {
            handler(getNodeId(target), target.checked)
        })
    }

    bindToggleAll (handler) {
        $on(this.$toggleAll, 'click', ({ target }) => {
            handler(target.checked)
        })
    }

    editTodo (target) {
        const todo = target.parentElement

        todo.classList.add('editing')

        const input = document.createElement('input')
        input.className = 'edit'

        input.value = target.innerText
        todo.appendChild(input)
        input.focus()
    }

    removeTodo (id) {
        const todoNode = querySelector(`[data-id="${id}"]`)

        if (todoNode) {
            this.$todoList.removeChild(todoNode)
        }
    }

    clearNewTodo () {
        this.$newTodo.value = ''
    }

    showTodos (todos) {
        this.$todoList.innerHTML = this.template.todoList(todos)
    }

    setTodoCompleted (id, completed) {
        const todoNode = querySelector(`[data-id="${id}"`)

        if (todoNode) {
            todoNode.className = completed ? 'completed' : ''

            // In case it was toggled from an event and not by clicking the checkbox
            querySelector('input', todoNode).checked = completed
        }
    }

    setTodosLeft (count) {
        this.$todoActiveCounter.innerHTML = this.template.todoCounter(count)
    }

    setMainVisibility (visible) {
        this.$main.style.display = !!visible ? 'block' : 'none'
    }

    setCompleteAllCheckbox (checked) {
        this.$toggleAll.checked = !!checked
    }
}


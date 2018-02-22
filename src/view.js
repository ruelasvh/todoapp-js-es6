import { getNodeId, querySelector, $on, $delegate } from "./utils"

const ENTER_KEY = 13

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
        this.$search = querySelector('.search')

        this._clickTimer = null
    }

    bindOnSearch (handler) {
        $on(this.$search, 'keyup', () => {
            handler()
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

    bindEditTodo (handler) {
        $delegate(this.$todoList, 'li label', 'click', ({ target }) => {
            if (this._clickTimer == null) {
                this._clickTimer = setTimeout(function () {
                    this._clickTimer = null;
                }, 500)
            } else {
                clearTimeout(this._clickTimer);
                this._clickTimer = null;
                handler(target)
            }
        })
    }

    bindEditTodoSave (handler) {
        $delegate(this.$todoList, 'li .edit', 'blur', ({ target }) => {
            if (!target.dataset.iscanceled) {
                handler(getNodeId(target), target.value.trim())
            }
        }, true)

        $delegate(this.$todoList, 'li .edit', 'keypress', ({ target, keyCode }) => {
            if (keyCode === ENTER_KEY) {
                target.blur()
            }
        })
    }


    bindMoveUpTodo (handler) {
        $delegate(this.$todoList, '.move-up', 'click', ({ target }) => {
            handler(getNodeId(target))
        })
    }

    bindMoveDownTodo (handler) {
        $delegate(this.$todoList, '.move-down', 'click', ({ target }) => {
            handler(getNodeId(target))
        })
    }

    searchTodos () {
        let filter, li, label, i
        filter = this.$search.value.toUpperCase()
        li = this.$todoList.getElementsByTagName('li')
        for (i = 0; i < li.length; i++) {
            label = li[i].getElementsByTagName('label')[0]
            if (label.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = ''
            } else {
                li[i].style.display = 'none'
            }
        }
    }

    editTodo (target) {
        const todoNode = target.parentElement

        const input = document.createElement('input')
        input.className = 'edit'

        input.value = target.innerText
        while (todoNode.firstChild) {
            todoNode.removeChild(todoNode.firstChild)
        }
        todoNode.appendChild(input)
        input.focus()
    }

    editTodoDone (id) {
        const todoNode = querySelector(`[data-id="${id}"`)
        const input = querySelector('input.edit', todoNode)

        todoNode.removeChild(input)
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

    setSearchBarVisibility (visible) {
        this.$search.style.display = !!visible ? 'block' : 'none'
    }
}


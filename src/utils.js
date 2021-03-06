/**
 * Encode HTML for display
 * @param str String to escape
 * @returns {void|string|*} String escaped with entity codes
 */
export const escape = str => str.replace(/[&<]/g, char => char === '&' ? '&amp;' : '&lt;')

/**
 * @param node Node to get id for
 * @returns {number} Integer id
 */
export const getNodeId = node => parseInt(node.parentNode.dataset.id, 10)

/**
 * @param selector String selector to query
 * @param scope Context for querying selector
 * @returns {ElementTagNameMap[keyof ElementTagNameMap] | null}
 */
export const querySelector = (selector, scope) => {
    return (scope || document).querySelector(selector)
}

/**
 * @param target Target node
 * @param type Event name to bind to
 * @param callback Event callback
 * @param capture Capture the event
 */
export const $on = (target, type, callback, capture) => {
    target.addEventListener(type, callback, !!capture )
}

/**
 * Add event handler to events for all nodes matching target node
 * @param target
 * @param selector
 * @param type
 * @param handler
 * @param capture
 */
export const $delegate = (target, selector, type, handler, capture) => {
    const dispatchEvent = event => {
        const targetNode = event.target
        const potentialNodes = target.querySelectorAll(selector)
        let index = potentialNodes.length

        while (index--) {
            if (potentialNodes[index] === targetNode) {
                handler.call(targetNode, event)
                break
            }
        }
    }

    $on(target, type, dispatchEvent, !!capture)
}

/**
 * Function which moves a todo in an arbitrary position up or down
 * @param todoList
 * @param todoId
 * @param delta
 */
export const move = (todoList, todoId, delta) => {
    let currIndex = todoList.findIndex(todo => { return todo.id === todoId})
    let newIndex = currIndex + delta
    if (newIndex < 0  || newIndex == todoList.length) {
        // At top or bottom, exit
        return
    }

    let indeces = [currIndex, newIndex].sort()
    todoList.splice(indeces[0], 2, todoList[indeces[1]], todoList[indeces[0]])
};
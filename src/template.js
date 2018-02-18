import { escape } from './utils'

export default class Template {
    /**
     *
     * @param items Object containing Items
     */
    itemList (items) {
        return items.reduce((collection, item) => {
            return collection + `
                <li data-id="${item.id}" ${item.completed ? 'class="completed"' : ''}>
                    <input class="toggle" type="checkbox" ${item.completed ? 'checked' : ''}>
                    <label>${escape(item.title)}</label>
                    <button class="destroy"></button>
                </li>`, ''})
    }

    itemCounter (activeItems) {
        return `${activeItems} item${activeItems !== 1 ? 's' : ''} remaining`
    }
}
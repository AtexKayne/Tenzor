/*
    Дисклеймер:
    Моей целью было не столько сделать фичу, сколько продемонстрировать глубокое понимание нативного языка.

    Я как мог пытался усложнить себе жизнь и поставил ряд ограничений и некоторые допущения:
    - Данные приходят с сервера и рендерятся на клиенте.
    - У меня нет информации о количестве колонок и элементов в них.
    - Использовать непривычный для меня функциональный стиль.

    В первом варианте исполнения (app.js), я шибко перемудрил и в итоге прострелил себе пятку.
    Но удалять код не буду, мои ошибки тоже могут о многом рассказать.

    В стилях тоже нарочно усложнил верстку (насколько это возможно для CSS).

    На обычных проектах, в условиях ограниченного времени, конечно, так не делаю.

    На задачу ушло 3ч 27м.
*/

const $app   = document.querySelector('#app')
const params = [
    [
        { text: 'HTML',       isActive: true  },
        { text: 'CSS',        isActive: false },
        { text: 'JavaScript', isActive: false },
        { text: 'TypeScript', isActive: false },
        { text: 'Git',        isActive: false }
    ],
    [
        { text: 'React',      isActive: false },
    ],
    []
]
const classList = {
    list: 'data-list',
    item: 'data-list__item',
}
let $active, $container

const init = () => {
    $app.innerHTML = ''
    for (let item of params) {
        const $parent = addElement($app, 'ul', { class: classList.list })

        if (item.length) {
            item.forEach(el => {
                el.node = addElement($parent, 'li', { class: classList.item, active: el.isActive, draggable: 'true' })
                el.node.innerHTML = el.text
            })
        }
    }

    $active    = $app.querySelector(`.${classList.item}[active="true"]`)
    $container = $active.parentNode
}

/**
 * @param {Node} $parent
 * @param {String} tag
 * @param {Object} options
 * @return {Node}
 */
const addElement = ($parent, tag, options = {}) => {
    const node = document.createElement(tag)

    if (options) {
        for (let prop in options ) {
            if (options.hasOwnProperty(prop)) node.setAttribute(prop, options[prop])
        }
    }

    return $parent.appendChild(node)
}

init()

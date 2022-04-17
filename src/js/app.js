/*
    Идея состояла в том, чтобы запроксировать объект с номером колонки и строки активного элемента.
    Тогда я бы просто менял свойства объекта, а все вычисления запихнул в сеттер. 
    Так же хотел избежать навигации по нодам, сохранив их заранее в массиве.  
    По итогу удалось добиться того, что код стал нечитаемым.
*/
(function() {
    Array.prototype.last = function() {
        return this[this.length - 1]
    }

    const $app      = document.querySelector('#app')
    const classList = {
        container: '',
        list:      'data-list',
        item:      'data-list__item',
        emptyItem: 'data-list__empty'
    }
    const params = [
        [
            { text: 'HTML',         isActive: true  },
            { text: 'CSS',          isActive: false },
            { text: 'JavaScript',   isActive: false },
            { text: 'TypeScript',   isActive: false },
            { text: 'Git',          isActive: false }
        ],
        [
            { text: 'React',        isActive: false },
        ],
        []
    ]

    const emptyPosition = {column: 1, row: 1}
    const $containers   = []
    let isShifted       = false
    let emptyItem

    const activeItem = new Proxy (
        {...emptyPosition}, 
        {
            // get(target, prop) {},
            set(target, prop, value) {
                if (!target.hasOwnProperty(prop)) throw new Error (`Adding a new property(${prop}) is blocked`)

                target[prop] = calulateValue(target, prop, value)
            }
        }
    )
    
    const calulateValue = (target, prop, value) => {
        if (value <= 0) return 1

        let maxValue

        if (!isShifted) {
            if (prop === 'column') {
                const decValue  = value - 1
                const colLength = params[decValue].length
                
                maxValue = (!!colLength) ? params.length : decValue;

                if (colLength < target.row && maxValue !== decValue) target.row = colLength
            } else {
                maxValue = params[target.column - 1].length
            }

            return (value < maxValue) ? value : maxValue;
        } else {
            // if (prop === 'column') {
            //     const decValue  = value - 1
            //     const colLength = params[decValue].length
                
            //     maxValue = (!!colLength) ? params.length : decValue;

            //     if (colLength < target.row && maxValue !== decValue) target.row = colLength
            // } else {
            //     maxValue = params[target.column - 1].length
            // }

            // return (value < maxValue) ? value : maxValue;
        }
        

    }

    emptyPosition.update = function() {
        this.column = activeItem.column
        this.row    = activeItem.row
    }

    const init = () => {
        $app.innerHTML = ''
        for (let item of params) {
            $containers.push(addElement($app, 'ul', { class: classList.list }))

            if (item.length) {
                item.forEach(el => {
                    el.node = addElement($containers.last(), 'li', { class: classList.item, active: el.isActive })
                    el.node.innerHTML = el.text
                })
            }
        }

        document.addEventListener('keydown', keyDownHandler)
        document.addEventListener('keyup', keyUpHandler)
    }

    const keyDownHandler = event => {
        const key = event.key
        isShifted = event.shiftKey

        if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(key)) return

        if (key === 'ArrowDown') {
            activeItem.row++
        } else if (key === 'ArrowUp') {
            activeItem.row--
        } else if (key === 'ArrowLeft') {
            activeItem.column--
        } else {
            activeItem.column++
        }

        if (isShifted) {
            moveEmpty()
        } else {
            setActive() 
        }
    }

    /**
     * @param {Node} $parent
     * @param {String} tag
     * @param {Object} options
     * @param {Node} beforeNode
     * @return {Node}
     */
    const addElement = ($parent, tag, options = {}, beforeNode = false) => {
        const node = document.createElement(tag)

        if (options) {
            for (let prop in options ) {
                if (options.hasOwnProperty(prop)) node.setAttribute(prop, options[prop])
            }
        }

        return (beforeNode) ? $parent.insertBefore(node, beforeNode) : $parent.appendChild(node);
    }

    const moveEmpty = () => {
        if (emptyItem) emptyItem.remove()

        const {col, row, ecol, erow} = getPositions()
        const mirrorItem = params[ecol][erow]
        const nodeEmpty  = document.createElement('li')

        let nodeAfter
        if (row - erow === 1) {
            nodeAfter  = params[col][row+1]

            if (nodeAfter) {
                emptyItem = $containers[col].insertBefore(nodeEmpty, nodeAfter.node)
            } else {
                emptyItem = $containers[col].appendChild(nodeEmpty)
            }
        } else if (row - erow === -1) {
            nodeAfter  = params[col][row].node

            if (row !== 0) {
                emptyItem = $containers[col].insertBefore(nodeEmpty, nodeAfter)
            }
        } else if (row === erow && row !== 0) {
            emptyItem = $containers[col].appendChild(nodeEmpty)
        } else {
            emptyItem = $containers[col].prepend(nodeEmpty)
        }

        
        nodeEmpty.classList.add(classList.emptyItem)
        

        params[ecol].splice(erow, 1)
        params[col].splice(row, 0, mirrorItem)

        emptyPosition.update()
    }

    const keyUpHandler = (event) => {
        if (event.key !== 'Shift' || typeof emptyItem === 'undefined') return
        
        const {col, row, ecol, erow} = getPositions()
        const mirrorItem = params[ecol][erow]
        const attrs      = { class: classList.item, 'active': 'true' }
        const $parent    = $containers[col]
        const $newItem   = addElement($parent, 'li', attrs, emptyItem)

        mirrorItem.node.remove()
        emptyItem.remove()

        params[col][row].node = $newItem
        $newItem.innerHTML = params[col][row].text

        setActive()      
    }

    const setActive = function () {
        if (emptyPosition.column === activeItem.column && emptyPosition.row === activeItem.row) return

        const {col, row, ecol, erow} = getPositions()
        const mirrorItem = params[ecol][erow]
        const item       = params[col][row]

        mirrorItem.node.setAttribute('active', false)
        mirrorItem.isActive = false
        item.node.setAttribute('active', true)
        item.isActive = true

        emptyPosition.update()
    }

    const getPositions = () => {
        return {
            col:  activeItem.column - 1,
            row:  activeItem.row - 1,
            ecol: emptyPosition.column - 1,
            erow: emptyPosition.row - 1
        }
    }

    init()
})()

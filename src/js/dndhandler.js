/* global $container, $active */

(function(){
    const dragStartHandler = function (event) {
        this.style.opacity = '0.2'
        dragSrcEl = this
      
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/html', this.innerHTML)

        $active.removeAttribute('active')
        this.setAttribute('active', true)

        $active     = this
        $container  = this.parentNode
    }
    
    const dragEndHandler = function () {
        this.style.opacity = '1'
    }

    const dragOverHandler = function (event) {
        if (event.preventDefault) {
            event.preventDefault()
        }
    
        return false
    }
    
    const dragEnterHandler = function () {
        if (dragSrcEl !== this) {
            this.classList.add(`${classList.item}--enter`)
        }
    }
    
    const dragLeaveHandler = function () {
        this.classList.remove(`${classList.item}--enter`)
    }
    
    const dropHandler = function () {     
        if (dragSrcEl !== this) {
            this.parentNode.insertBefore(dragSrcEl, this)
            this.classList.remove(`${classList.item}--enter`)

            $container  = this.parentNode
        }
      
        return false
    }

    const dropContainerHandler = function (e) {
        if (dragSrcEl.parentNode !== this) {
            this.appendChild(dragSrcEl)
            $container = this
        }
      
        return false
    }
    
    const $containers = $app.querySelectorAll(`.${classList.list}`)
    const $items      = $app.querySelectorAll(`.${classList.item}`)

    $items.forEach(item => {
        item.addEventListener('dragstart', dragStartHandler)
        item.addEventListener('dragover',  dragOverHandler)
        item.addEventListener('dragenter', dragEnterHandler)
        item.addEventListener('dragleave', dragLeaveHandler)
        item.addEventListener('dragend',   dragEndHandler)
        item.addEventListener('drop',      dropHandler)
    })

    $containers.forEach(item => {
        item.addEventListener('drop',      dropContainerHandler)
        item.addEventListener('dragover',  dragOverHandler)
        item.addEventListener('dragenter', dragEnterHandler)
        item.addEventListener('dragleave', dragLeaveHandler)
        item.addEventListener('dragend',   dragEndHandler)
    })

})()

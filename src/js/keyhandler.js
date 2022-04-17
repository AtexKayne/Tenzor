/* global $container, $active */

(function() {
    const activeMutation = {
        ArrowLeft($prevNode = $container.previousSibling) {
            if ($prevNode && !!$prevNode.childNodes.length) {
                const $newContainer = $prevNode
                const $newActive    = $newContainer.firstChild

                return this.setActive( $newContainer, $newActive )
            } else {
                const $newPrevNode = ($prevNode) ? $prevNode.previousSibling : $app.lastChild;
                return this.ArrowLeft($newPrevNode)
            }
        },
        ArrowRight($nextNode = $container.nextSibling) {
            if ($nextNode && !!$nextNode.childNodes.length) {
                const $newContainer = $nextNode
                const $newActive    = $newContainer.firstChild

                return this.setActive( $newContainer, $newActive )
            } else {
                const $newNextNode = ($nextNode) ? $nextNode.nextSibling : $app.firstChild;
                return this.ArrowRight($newNextNode)
            }
        },
        ArrowDown() {
            const $newContainer = $container
            const $newActive    = $active.nextSibling || $container.firstChild

            return this.setActive( $newContainer, $newActive )
        },
        ArrowUp() {
            const $newContainer = $container
            const $newActive    = $active.previousSibling || $container.lastChild

            return this.setActive( $newContainer, $newActive )
        },
        setActive($newContainer, $newActive) {
            $active.removeAttribute('active')
            $newActive.setAttribute('active', true)

            $container = $newContainer
            $active    = $newActive
        }
    }

    const shiftMutation = {
        ArrowLeft() {
            $container = $container.previousSibling || $app.lastChild
            return $container.appendChild($active)
        },
        ArrowRight() {
            $container = $container.nextSibling || $app.firstChild
            return $container.appendChild($active)
        },
        ArrowDown() {
            const $nextNode = ($active.nextSibling) 
                ? $active.nextSibling.nextSibling
                : $container.firstChild ;

            return $container.insertBefore($active, $nextNode)
        },
        ArrowUp() {
            return $container.insertBefore($active, $active.previousSibling)
        },
    }

    const keyDownHandler = event => {
        const key = event.key

        if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(key)) return

        if (event.shiftKey) {
            shiftMutation[key]()
        } else {
            activeMutation[key]()
        }
    }

    document.addEventListener('keydown', keyDownHandler)
})()

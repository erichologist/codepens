/* developed © Maxuiux */

;(() => {
    const slider = document.getElementById('slider')
    const progress = document.getElementById('progress')
    const thumb = document.getElementById('thumb')

    let isDragging = false
    let sliderRect = slider.getBoundingClientRect()

    const updateThumbAndProgress = (percent) => {
        percent = Math.max(0, Math.min(100, percent))
        const px = (percent / 100) * sliderRect.width
        progress.style.width = `${percent}%`
        thumb.style.left = `${px}px`
    }

    const getPercentFromClientX = (clientX) => {
        const offsetX = clientX - sliderRect.left
        return (offsetX / sliderRect.width) * 100
    }

    const onMove = (clientX) => {
        const percent = getPercentFromClientX(clientX)
        updateThumbAndProgress(percent)
    }

    const onMouseDown = (e) => {
        isDragging = true
        sliderRect = slider.getBoundingClientRect()
        onMove(e.clientX)
        thumb.classList.add('active')
    }

    const onTouchStart = (e) => {
        isDragging = true
        sliderRect = slider.getBoundingClientRect()
        onMove(e.touches[0].clientX)
        thumb.classList.add('active')
    }

    const onMouseMove = (e) => {
        if (isDragging) onMove(e.clientX)
    }

    const onTouchMove = (e) => {
        if (isDragging) onMove(e.touches[0].clientX)
    }

    const stopDrag = () => {
        isDragging = false
        thumb.classList.remove('active')
    }

    const init = (initialValue = 40) => {
        sliderRect = slider.getBoundingClientRect()
        updateThumbAndProgress(initialValue)
    }

    // Events
    thumb.addEventListener('mousedown', onMouseDown)
    thumb.addEventListener('touchstart', onTouchStart, { passive: true })

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', stopDrag)

    slider.addEventListener('mousedown', (e) => {
        sliderRect = slider.getBoundingClientRect()
        onMove(e.clientX)
    })

    slider.addEventListener(
        'touchstart',
        (e) => {
            sliderRect = slider.getBoundingClientRect()
            onMove(e.touches[0].clientX)
        },
        { passive: true }
    )

    init(40)
})()

/* developed © Maxuiux */
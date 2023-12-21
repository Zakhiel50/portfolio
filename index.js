class Carousel {

    /**
     * @callback moveCallBack
     * @param {number} index
     */

    /**
     * 
     * @param {HTMLElement} element 
     * @param {Object} options 
     * @param {Object} [options.slideToScroll=1] Nombre d'éléments à faire défiler
     * @param {Object} [options.slidesVisible=1] Nombre d'éléments visible dans un slide
     * @param {boolean} [options.loop=false] Doit-on boucler en fin de carousel ?
     */
    constructor(element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slideToScroll: 1,
            slidesVisible: 1,
            loop: false
        }, options)

        let children = [].slice.call(element.children)
        this.isMobile = false
        this.currentItem = 0

        // Modification du DOM
        this.root = this.createDivWithClass("carousel")
        this.container = this.createDivWithClass("carousel-container")
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.moveCallbacks = []
        this.items = children.map((child) => {
            let item = this.createDivWithClass("carousel-item")
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        });
        this.setStyle()
        this.createNavigation()
        
        // Evenements
        this.moveCallbacks.forEach(callBack => callBack(0))
        this.onWindowResize()
        window.addEventListener("resize", this.onWindowResize.bind(this))
    } 

    /**
     * Applique les bonnes dimensions aux éléments du carousel
     */
    setStyle () {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = (ratio * 100) + "%";
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%");
    }

    /**
     * 
     */
    createNavigation() {
        let nextButton = this.createDivWithClass("carousel-next");
        let prevButton = this.createDivWithClass("carousel-prev");
    
        this.root.appendChild(nextButton);
        this.root.appendChild(prevButton);
        nextButton.addEventListener("click", this.next.bind(this));
        prevButton.addEventListener("click", this.prev.bind(this));
        if(this.options.loop === true) {
            return
        }
        this.onMove(index => {
            if(index === 0) {
                prevButton.classList.add("carousel-prev-hidden")
            } else {
                prevButton.classList.remove("carousel-prev-hidden")
            }
            if(this.items[this.currentItem + this.slidesVisible] === undefined) {
                nextButton.classList.add("carousel-next-hidden")
            } else {
                nextButton.classList.remove("carousel-next-hidden")
            }
        })
    }

    next() {
        this.gotoItem(this.currentItem + this.slidesToScroll);
    }
    
    prev() {
        this.gotoItem(this.currentItem - this.slidesToScroll);
    }

    /**
     * Déplace le carousel vers l'élément ciblé
     * @param {number} index 
     */
    gotoItem (index) {
        if(index < 0) {
            index = this.items.length - this.slidesVisible
        }else if(index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem )) {
            index = 0
        }
        let translateX = index * -100 / this.items.length
        this.container.style.transform = "translate3d(" + translateX + "%, 0, 0)"
        this.currentItem = index
        this.moveCallbacks.forEach(callBack => callBack(index))
    }

    /**
     * 
     * @param {moveCallBack} callBack 
     */
    onMove(callBack) {
        this.moveCallbacks.push(callBack)
    }

    onWindowResize() {
        let mobile = window.innerWidth < 800
        if(mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
            this.moveCallbacks.forEach(callBack => callBack(this.currentItem))
        }
    }

    /**
     * 
     * @param {string} className 
     * @returns {HTMLElement}
     */
    createDivWithClass(className) {
        let div = document.createElement("div")
        div.setAttribute("class", className)
        return div
    }

    /**
     * @returns {number}
     */
    get slidesToScroll () {
        return this.isMobile ? 1 : this.options.slideToScroll
    }

    /**
     * @returns {number}
     */
    get slidesVisible () {
        return this.isMobile ? 1 : this.options.slidesVisible
    }
}

document.addEventListener("DOMContentLoaded", function() {

    new Carousel(document.querySelector("#carousel1"), {
        
        slidesVisible: 3,
        slideToScroll: 2
    })

})
new Carousel(document.querySelector("#carousel1"), {
        
    slidesVisible: 3,
    slideToScroll: 1,
    loop: true
})
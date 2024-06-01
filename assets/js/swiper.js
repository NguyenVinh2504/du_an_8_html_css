// Hàm slide
class Slider {
    constructor() {
        this.sliderWrapper = $('#js-slider-wrap')
        this.sliders = $$('.js-slider-item');
        this.pageMin = $('#js-page-min');
        this.pageMax = $('#js-page-max');
        this.prevBtn = $('#js-prev-btn');
        this.nextBtn = $('#js-next-btn');
        this.currentUser = 1;
        this.isInifity = false;
        this.loop = true;
        this.idSetInterval = null;
        this.timeLoop = this.sliderWrapper.getAttribute("timeLoop") ?? 2000
    }
    handleLoop() {
        this.idSetInterval = setInterval(() => {
            this.nextUser();
        }, this.timeLoop);
    }
    handleEvent() {
        // this.prevBtn.onclick = () => {
        //     this.prevUser();
        //     clearInterval(this.idSetInterval);
        // };
        // this.nextBtn.onclick = () => {
        //     this.nextUser();
        //     clearInterval(this.idSetInterval);
        // };
        this.sliderWrapper.addEventListener('transitionend', () => {
            if (this.currentUser === this.sliders.length - 1) {
                this.currentUser = 1;
                this.sliderWrapper.style.transform = `translateX(${-this.sliderWrapper.offsetWidth * this.currentUser
                    }px)`;
                this.sliderWrapper.style.transition = 'none';
            }

            if (this.currentUser === 0) {
                this.currentUser = this.sliders.length - 2;
                this.sliderWrapper.style.transform = `translateX(${-this.sliderWrapper.offsetWidth * this.currentUser
                    }px)`;
                this.sliderWrapper.style.transition = 'none';
            }
        });
    }

    renderPageNumber() {
        if (this.pageMin && this.pageMax) {
            if (this.pageMin.innerText < this.sliders.length - 2) {
                this.pageMin.innerText++
            } else {
                this.pageMin.innerText = 1
            }
        }
    }

    tranlateList() {
        this.sliderWrapper.style.transform = `translateX(${-this.sliderWrapper.offsetWidth * this.currentUser
            }px)`;
        this.sliderWrapper.style.transition = 'all 1s';
    }

    prevUser() {
        if (this.currentUser <= 0) {
            return;
        }
        this.currentUser--;
        this.tranlateList();
    }
    nextUser() {
        if (this.currentUser >= this.sliders.length - 1) {
            return;
        }
        this.currentUser++;
        this.tranlateList();
        this.renderPageNumber()
    }
    render() {
        const firtEmlemntClone = this.sliders[0].cloneNode(true);
        const lastEmlemntClone = this.sliders[this.sliders.length - 1].cloneNode(true);
        this.sliderWrapper.appendChild(firtEmlemntClone);
        this.sliderWrapper.prepend(lastEmlemntClone);

        this.sliders = document.querySelectorAll('.js-slider-item');
        this.sliderWrapper.style.transform = `translateX(${-this.sliderWrapper.offsetWidth * this.currentUser
            }px)`;
    }
    start() {
        this.render();
        this.handleEvent();

        if (this.pageMin && this.pageMax) {
            this.pageMin.innerText = 1
            this.pageMax.innerText = this.sliders.length - 2
        }

        if (this.loop) {
            this.handleLoop();
            // this.nextBtn.addEventListener('mouseleave', () => {
            //     clearInterval(this.idSetInterval);
            //     this.handleLoop();
            // });
            // this.prevBtn.addEventListener('mouseleave', () => {
            //     clearInterval(this.idSetInterval);
            //     this.handleLoop();
            // });
        }
    }
}
window.addEventListener('DOMContentLoaded', () => {
    const newApp = new Slider();
    newApp.start()
})
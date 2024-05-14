// Hàm slide

const sliderWrapper = $('#js-slider-wrap');
let sliders = $$('.js-slider-item');
const prevBtn = $('#js-prev-btn');
const nextBtn = $('#js-next-btn');

const pageMin = $('#js-page-min');
const pageMax = $('#js-page-max');
class Slider {
    constructor() {
        this.currentUser = 1;
        this.isInifity = false;
        this.loop = true;
        this.idSetInterval = null;
        this.timeLoop = sliderWrapper.getAttribute("timeLoop") ?? 2000
    }
    handleLoop() {
        this.idSetInterval = setInterval(() => {
            this.nextUser();
        }, this.timeLoop);
    }
    handleEvent() {
        // prevBtn.onclick = () => {
        //     this.prevUser();
        //     clearInterval(this.idSetInterval);
        // };
        // nextBtn.onclick = () => {
        //     this.nextUser();
        //     clearInterval(this.idSetInterval);
        // };
        sliderWrapper.addEventListener('transitionend', () => {
            if (this.currentUser === sliders.length - 1) {
                this.currentUser = 1;
                sliderWrapper.style.transform = `translateX(${-sliderWrapper.offsetWidth * this.currentUser
                    }px)`;
                sliderWrapper.style.transition = 'none';
            }

            if (this.currentUser === 0) {
                this.currentUser = sliders.length - 2;
                sliderWrapper.style.transform = `translateX(${-sliderWrapper.offsetWidth * this.currentUser
                    }px)`;
                sliderWrapper.style.transition = 'none';
            }
        });
    }

    renderPageNumber() {
        if (pageMin && pageMax) {
            if (pageMin.innerText < sliders.length - 2) {
                pageMin.innerText++
            } else {
                pageMin.innerText = 1
            }
        }
    }

    tranlateList() {
        sliderWrapper.style.transform = `translateX(${-sliderWrapper.offsetWidth * this.currentUser
            }px)`;
        sliderWrapper.style.transition = 'all 1s';
    }

    prevUser() {
        if (this.currentUser <= 0) {
            return;
        }
        this.currentUser--;
        this.tranlateList();
    }
    nextUser() {
        if (this.currentUser >= sliders.length - 1) {
            return;
        }
        this.currentUser++;
        this.tranlateList();
        this.renderPageNumber()
    }
    render() {
        const firtEmlemntClone = sliders[0].cloneNode(true);
        const lastEmlemntClone = sliders[sliders.length - 1].cloneNode(true);
        sliderWrapper.appendChild(firtEmlemntClone);
        sliderWrapper.prepend(lastEmlemntClone);

        sliders = document.querySelectorAll('.js-slider-item');
        sliderWrapper.style.transform = `translateX(${-sliderWrapper.offsetWidth * this.currentUser
            }px)`;
    }
    start() {
        this.render();
        this.handleEvent();

        if (pageMin && pageMax) {
            pageMin.innerText = 1
            pageMax.innerText = sliders.length - 2
        }

        if (this.loop) {
            this.handleLoop();
            // nextBtn.addEventListener('mouseleave', () => {
            //     clearInterval(this.idSetInterval);
            //     this.handleLoop();
            // });
            // prevBtn.addEventListener('mouseleave', () => {
            //     clearInterval(this.idSetInterval);
            //     this.handleLoop();
            // });
        }
    }
}
const newApp = new Slider();
newApp.start();
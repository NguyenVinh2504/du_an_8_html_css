const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        $(selector).innerHTML = cached;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                $(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}

/**
 * Hàm kiểm tra một phần tử
 * có bị ẩn bởi display: none không
 */
function isHidden(element) {
    if (!element) return true;

    if (window.getComputedStyle(element).display === "none") {
        return true;
    }

    let parent = element.parentElement;
    while (parent) {
        if (window.getComputedStyle(parent).display === "none") {
            return true;
        }
        parent = parent.parentElement;
    }

    return false;
}

/**
 * Hàm buộc một hành động phải đợi
 * sau một khoảng thời gian mới được thực thi
 */
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

/**
 * Hàm tính toán vị trí arrow cho dropdown
 *
 * Cách dùng:
 * 1. Thêm class "js-dropdown-list" vào thẻ ul cấp 1
 * 2. CSS "left" cho arrow qua biến "--arrow-left-pos"
 */
const calArrowPos = debounce(() => {
    if (isHidden($(".js-dropdown-list"))) return;

    const items = $$(".js-dropdown-list > li");

    items.forEach((item) => {
        const arrowPos = item.offsetLeft + item.offsetWidth / 2;
        item.style.setProperty("--arrow-left-pos", `${arrowPos}px`);
    });
});

// Tính toán lại vị trí arrow khi resize trình duyệt
window.addEventListener("resize", calArrowPos);

// Tính toán lại vị trí arrow sau khi tải template
window.addEventListener("template-loaded", calArrowPos);

/**
 * Giữ active menu khi hover
 *
 * Cách dùng:
 * 1. Thêm class "js-menu-list" vào thẻ ul menu chính
 * 2. Thêm class "js-dropdown" vào class "dropdown" hiện tại
 *  nếu muốn reset lại item active khi ẩn menu
 */
window.addEventListener("template-loaded", handleActiveMenu);

function handleActiveMenu() {
    const dropdowns = $$(".js-dropdown");
    const menus = $$(".js-menu-list");
    const activeClass = "menu-column__item--active";

    const removeActive = (menu) => {
        menu.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
    };

    const init = () => {
        menus.forEach((menu) => {
            const items = menu.children;
            if (!items.length) return;

            removeActive(menu);
            if (window.innerWidth > 991) items[0].classList.add(activeClass);

            Array.from(items).forEach((item) => {
                item.onmouseenter = () => {
                    if (window.innerWidth <= 991) return;
                    removeActive(menu);
                    item.classList.add(activeClass);
                };
                item.onclick = () => {
                    if (window.innerWidth > 991) return;
                    removeActive(menu);
                    item.classList.add(activeClass);
                    item.scrollIntoView({ behavior: "smooth", block: "start", });
                };
            });
        });
    };

    init();

    dropdowns.forEach((dropdown) => {
        dropdown.onmouseleave = () => init();
    });
}

/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {

    const body = $('body')


    $$(".js-toggle").forEach((button) => {
        const target = button.getAttribute("toggle-target");
        if (!target) {
            document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
        }
        button.onclick = (e) => {
            e.preventDefault();

            if (!$(target)) {
                return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
            }
            const isHidden = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("hide", !isHidden);
                $(target).classList.toggle("show", isHidden);
            });
            console.log(isHidden);

            if (target === '#home-filter') {
                body.classList.toggle("overflow-y");
            } else {
                if (isHidden) {
                    body.style.overflowY = 'hidden'
                } else {
                    body.style = ''
                }
            }
        };
        document.onclick = function (e) {
            if (!e.target.closest(target)) {
                const isHidden = $(target).classList.contains("hide");
                if (!isHidden) {
                    button.click();
                }
            }
        };
    });
}

window.addEventListener("template-loaded", () => {
    const links = $$(".js-dropdown-list > li > a");

    links.forEach((link) => {
        link.onclick = () => {
            if (window.innerWidth > 991) return;
            const item = link.closest("li");
            item.classList.toggle("navbar__item--active");
        };
    });
});

window.addEventListener("template-loaded", () => {
    const tabsSelector = "prod-tab__item";
    const contentsSelector = "prod-tab__content";

    const tabActive = `${tabsSelector}--current`;
    const contentActive = `${contentsSelector}--current`;

    const tabContainers = $$(".js-tabs");
    tabContainers.forEach((tabContainer) => {
        const tabs = tabContainer.querySelectorAll(`.${tabsSelector}`);
        const contents = tabContainer.querySelectorAll(`.${contentsSelector}`);
        tabs.forEach((tab, index) => {
            tab.onclick = () => {
                tabContainer.querySelector(`.${tabActive}`)?.classList.remove(tabActive);
                tabContainer.querySelector(`.${contentActive}`)?.classList.remove(contentActive);
                tab.classList.add(tabActive);
                contents[index].classList.add(contentActive);
            };
        });
    });
});

window.addEventListener("template-loaded", () => {
    const switchBtn = document.querySelector("#switch-theme-btn");
    if (switchBtn) {
        switchBtn.onclick = function () {
            const isDark = localStorage.dark === "true";
            document.querySelector("html").classList.toggle("dark", !isDark);
            localStorage.setItem("dark", !isDark);
            switchBtn.querySelector("span").textContent = isDark ? "Dark mode" : "Light mode";
        };
        const isDark = localStorage.dark === "true";
        switchBtn.querySelector("span").textContent = isDark ? "Light mode" : "Dark mode";
    }
});

// const isDark = localStorage.dark === "true";
// document.querySelector("html").classList.toggle("dark", isDark);

class PreviewProduct {
    constructor() {
        this.previewWrapper = $('#prod-preview__list')
        this.previewTouchArea = $('#prod-preview__wrapper')
        this.listProductThumb = $$('.prod-preview__thumb-img')
        this.listProduct = $$('.prod-preview__item')
        this.currentIndex = 0
        this.activeClass = 'prod-preview__thumb-img--current'
        this.previewWrapperOffsetWidth = this.previewWrapper.offsetWidth
        this.previewWrapperWith = debounce.call(this, () => { this.previewWrapperOffsetWidth = this.previewWrapper.offsetWidth; this.translatePreviewWrapper() })
        this.mouseX = 0;
        this.initialX = 0;
        this.mouseY = 0;
        this.initialY = 0;
        this.isSwiped = false;
        this.prevPageX = 0
        this.prevScrollLeft = 0
        this.positionDiff = 0
        this.events = {
            mouse: {
                down: "mousedown",
                move: "mousemove",
                up: "mouseup",
            },
            touch: {
                down: "touchstart",
                move: "touchmove",
                up: "touchend",
            },
        };
        this.deviceType = ""
        this.rectLeft = this.previewTouchArea.getBoundingClientRect().left;
        this.rectTop = this.previewTouchArea.getBoundingClientRect().top;
        this.slidingSegment = 0
        this.translateXCurrent = 0
        this.direction = null

        this.checkElementInView = new IntersectionObserver(this.callBackIntersectionObserver, {
            threshold: 0.5
        })

        this.initialTime = 0
        this.swipeSpeed = 500
        this.clickTime = this.swipeSpeed
    }

    callBackIntersectionObserver = (entries) => {
        console.log(entries, this.clickTime, this.swipeSpeed);
        entries.forEach((entry) => {
            if (entry.isIntersecting && this.clickTime >= this.swipeSpeed) {
                console.log('Kiem tra phan tu co vao khung nhin', entry);
                this.currentIndex = Number(entry.target.getAttribute('tabIndex'));
                console.log('Kiem tra index khi vao khung nhin', this.currentIndex);
            }
        });
    }

    isTouchDevice = () => {
        try {
            //We try to create TouchEvent (it would fail for desktops and throw error)
            document.createEvent("TouchEvent");
            this.deviceType = "touch";
            return true;
        } catch (e) {
            this.deviceType = "mouse";
            return false;
        }
    };

    getXY = (e) => {
        this.mouseX = (!this.isTouchDevice() ? e.pageX : e.touches[0].pageX) - this.rectLeft;
        this.mouseY = (!this.isTouchDevice() ? e.pageY : e.touches[0].pageY) - this.rectTop;
    };

    removeActive() {
        $(`.${this.activeClass}`)?.classList.remove(this.activeClass);
    }

    getTranslateX() {
        var style = window.getComputedStyle(this.previewWrapper);
        var matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }

    handleEvent() {
        this.listProduct.forEach((product, index) => {
            this.checkElementInView.observe(product);
        });

        this.listProductThumb.forEach((productThumb) => {
            productThumb.onclick = () => {
                this.currentIndex = productThumb.getAttribute('tabIndex')
                this.activeThumb()
                this.translatePreviewWrapper()
            }
        })
        window.addEventListener('resize', this.previewWrapperWith)
        this.previewTouchArea.addEventListener(this.events[this.deviceType].down, (event) => {
            // this.isSwiped = true;
            // //Get X and Y Position
            // this.getXY(event);
            // this.initialX = this.mouseX;
            // this.initialY = this.mouseY;
            // // this.translateXCurrent = this.getTranslateX()
            // this.translateXCurrent = this.previewWrapper.scrollLeft
            // this.initialTime = Date.now()
            this.startSwipe(event)
        });

        this.previewTouchArea.addEventListener(this.events[this.deviceType].move, (event) => {
            // if (!this.isTouchDevice()) {
            //     event.preventDefault();
            // }

            // if (this.isSwiped) {
            //     console.log(event.movementX);

            //     // this.movePreviewWrapper(this.getTranslateX() + event.movementX);
            //     this.previewWrapper.scrollLeft -= event.movementX
            //     this.getXY(event);
            //     let diffX = this.mouseX - this.initialX;
            //     let diffY = this.mouseY - this.initialY;
            //     this.slidingSegment = Math.abs(Math.abs(diffX) / this.previewWrapper.offsetWidth) * this.previewWrapperOffsetWidth

            //     if (Math.abs(diffY) > Math.abs(diffX)) {
            //         let output = diffY > 0 ? "Down" : "Up";
            //         // console.log(output);
            //     } else {
            //         this.direction = diffX > 0 ? "Right" : "Left";
            //         // console.log(output);
            //         const translateXTotal = this.translateXCurrent + (this.direction === "Right" ? this.slidingSegment : -this.slidingSegment);
            //         if ((this.direction === 'Left' && this.currentIndex < this.listProductThumb.length - 1) ||
            //             (this.direction === 'Right' && this.currentIndex > 0)) {
            //             // this.movePreviewWrapper(translateXTotal);
            //         }
            //     }
            // }

            this.moveSwipe(event)
        });

        this.previewTouchArea.addEventListener(this.events[this.deviceType].up, this.endSwipe);

        this.previewTouchArea.addEventListener("mouseleave", this.endSwipe);
    }

    startSwipe = (e) => {
        this.isSwiped = true;
        this.prevPageX = e.pageX || e.touches[0].pageX
        this.prevScrollLeft = this.previewTouchArea.scrollLeft
    }
    moveSwipe = (e) => {
        if (!this.isSwiped) return
        if (this.previewTouchArea === null) return
        e.preventDefault();
        this.previewTouchArea.style.scrollBehavior = 'auto'
        this.positionDiff = (e.pageX || e.touches[0].pageX) - this.prevPageX
        this.previewTouchArea.scrollLeft = this.prevScrollLeft - this.positionDiff
    }

    autoSwipe = () => {
        if (this.previewTouchArea.scrollLeft == (this.previewTouchArea.scrollWidth - this.previewWrapperOffsetWidth)) return

        this.positionDiff = Math.abs(this.positionDiff)
        let previewWrapperOffsetWidth = this.previewWrapperOffsetWidth
        let valDifference = previewWrapperOffsetWidth - this.positionDiff
        console.log('this.previewTouchArea.scrollLeft', this.previewTouchArea.scrollLeft, "this.positionDiff", this.positionDiff);
        if (this.previewTouchArea.scrollLeft > this.prevScrollLeft) {
            this.previewTouchArea.scrollLeft = this.previewTouchArea.scrollLeft + (this.positionDiff > previewWrapperOffsetWidth / 3 ? valDifference : -this.positionDiff)
            return
        }
        this.previewTouchArea.scrollLeft -= this.positionDiff > previewWrapperOffsetWidth / 3 ? valDifference : -this.positionDiff
    }

    endSwipe = () => {
        this.isSwiped = false;
        if (this.slidingSegment > this.previewWrapperOffsetWidth / 5) {
            if (this.direction === 'Left' && this.currentIndex < this.listProductThumb.length - 1) {
                this.currentIndex++;
            } else if (this.direction === 'Right' && this.currentIndex > 0) {
                this.currentIndex--;
            }
        }
        // this.clickTime = Date.now() - this.initialTime;
        // if (this.clickTime < this.swipeSpeed) {
        //     console.log('click nhanh', this.clickTime);
        //     if (this.direction === 'Left' && this.currentIndex < this.listProductThumb.length - 1) {
        //         this.currentIndex++;
        //     } else if (this.direction === 'Right' && this.currentIndex > 0) {
        //         this.currentIndex--;
        //     }
        //     console.log('Kiem tra index', this.currentIndex);

        // }
        // this.translatePreviewWrapper();
        this.activeThumb()
        this.direction = null;
        this.clickTime = this.swipeSpeed
        this.previewTouchArea.style.scrollBehavior = 'smooth'

        this.autoSwipe()
    };

    translatePreviewWrapper() {
        this.previewWrapper.style.transform = `translateX(${-this.previewWrapperOffsetWidth * this.currentIndex
            }px)`;
        this.previewWrapper.style.transitionDuration = '0.25s';
        this.previewWrapper.style.transitionTimingFunction = 'ease-in-out'
    }

    movePreviewWrapper(translateXTotal) {
        this.previewWrapper.style.transform = `translateX(${translateXTotal}px)`;
        this.previewWrapper.style.transitionDuration = '0s';
        this.previewWrapper.style.transitionTimingFunction = 'initial'
    }

    addIndex() {
        this.listProductThumb.forEach((productThumb, index) => {
            productThumb.setAttribute('tabIndex', index)
        })
        this.listProduct.forEach((product, index) => {
            product.setAttribute('tabIndex', index)
        })
    }

    activeThumb() {
        this.removeActive()
        this.listProductThumb.forEach((productThumb) => {
            const tabIndex = productThumb.getAttribute('tabIndex')
            if (tabIndex == this.currentIndex) productThumb.classList.add(this.activeClass);
        })
    }
    start() {
        if (!this.previewWrapper) return
        this.isTouchDevice();
        this.isSwiped = false
        this.handleEvent()
        this.addIndex()
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const previewProduct = new PreviewProduct()
    previewProduct.start()
})

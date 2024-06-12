export function initRespensive() {
    scrollTo();
    menuBurger();
    // _menuMobile();
    _showProfile();

};
function scrollTo() {
    var headerFixed = document.getElementsByClassName(".top-banner") as HTMLCollectionOf<HTMLElement>;
    if (headerFixed && headerFixed.length > 0) {
        window.addEventListener("scroll", () => {
            var topPos = window.screenTop;
            if (topPos > 20) {
                headerFixed[0].style.display = "none";
            } else {
                headerFixed[0].style.display = "block";
            }
        })
    }
}

function menuBurger() {

    window.addEventListener('resize', () => {
        var items = document.querySelectorAll(".main-menu .level-0-li");
        for (let index = 0; index < items.length; index++) { items[index].setAttribute("style", "background:none") }
        document.querySelector(".menuBurger")?.classList.remove("open")
        document.querySelector(".main-menu")?.classList.remove("show")
        document.querySelector("body")?.classList.remove("isOpen");
        document.body.style.overflow = "auto "
        let header = document.getElementsByClassName("container menu-container") as HTMLCollectionOf<HTMLElement>;
        if (document.querySelector(".main-menu")?.classList.contains("show")) {
            header[0].style.height = "100vh";
            header[0].style.overflow = "auto";
        } else {
            header[0].style.height = "auto";
            header[0].style.overflow = "visible";

        }
    })
    document.querySelector(".menuBurger")?.addEventListener("click", () => {
        var items = document.querySelectorAll(".main-menu .level-0-li");
        for (let index = 0; index < items.length; index++) { items[index].setAttribute("style", "background:none") }
        document.querySelector(".menuBurger")?.classList.toggle("open")
        document.querySelector(".main-menu")?.classList.toggle("show")
        document.querySelector("body")?.classList.remove("isOpen");
        if (document.querySelector(".menuBurger")?.classList.contains("open")) {
            document.body.style.overflow = "hidden "
        } else {
            document.body.style.overflow = "auto ";
        }
        let header = document.getElementsByClassName("container menu-container") as HTMLCollectionOf<HTMLElement>;
        if (document.querySelector(".main-menu")?.classList.contains("show")) {
            header[0].style.height = "100vh";
            header[0].style.overflow = "auto";

        } else {
            header[0].style.height = "auto";
            header[0].style.overflow = "visible";
        }
    })
}
export function _menuMobile(target: any, idx: number) {
    if (window.innerWidth < 1097) {
        var items = document.querySelectorAll(".main-menu .level-0-li");

        items.forEach((rmItem, _index) => {
            if (_index != idx) {
                rmItem.querySelector(".submenu-container")?.classList.remove("show")
                rmItem.setAttribute("style", "background:none")
            }
        })

        if (target.querySelector(".submenu-container")?.classList.contains("show") == true) {
            target.querySelector(".submenu-container")?.classList.remove("show");
        } else {
            target.querySelector(".submenu-container")?.classList.add("show");
        }

        if (target.querySelector(".submenu-container")?.classList.contains("show") == true) {
            target.setAttribute("style", "background:#f8c43d")
        } else {
            target.setAttribute("style", "background:none")
        }

        target.querySelectorAll(".submenu-container").forEach((item: any) => {
            item.addEventListener('click', (ev: any) => {
                item.querySelectorAll("level-1-li").forEach((level: any) => {
                    level.addEventListener("click", () => {
                        level?.classList.toggle("active");
                    })
                })
                ev.stopPropagation();
            })
        })

        document.querySelectorAll(".submenu-contenu ul li").forEach(item => {
            item.classList.add("arrow")
        })

        document.querySelectorAll(".level-2").forEach(leveltwo => {
            if (leveltwo.querySelectorAll("ul").length > 0) {
                leveltwo.addEventListener('click', () => {
                    leveltwo.classList.toggle("active")
                })
            }
        })
    }
}

function _showProfile() {
    document.querySelector(".profile")?.addEventListener('click', () => {
        document.querySelector(".wrapperProfile")?.classList.toggle("open")
    })
}



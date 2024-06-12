
export const MaskedDate = (event: any): any => {
    const v = event.target.value;
    if (localStorage.getItem('language') === 'en') {
        if (v.match(/^\d{4}$/) !== null) {
            event.target.value = v + '-';
        } else if (v.match(/^\d{4}\-\d{2}$/) !== null) {
            event.target.value = v + '-';
        }
    }
    else if (localStorage.getItem('language') === 'fr') {
        if (v.match(/^\d{2}$/) !== null) {
            event.target.value = v + '-';
        } else if (v.match(/^\d{2}\-\d{2}$/) !== null) {
            event.target.value = v + '-';
        }
    }
}

export const ReplaceDot = (event: any): any => {
    const v = event.target.value;
    if (v.match(',')) {
        event.target.value = v.replace(',', '.');
    }
}

export const AddToPrice = (event: any): any => {
    const v = event.target.value;
    setTimeout(() => {
        if (v !== '' && (!v.match('.') || !v.match(','))) {
            event.target.value = v + '.00';
        }
    }, 800);
}

export const cloneHeader = () => {
    const $header = document.getElementById('header')?.offsetHeight;

    const ele = document.getElementById('cloned-margin');
    if (ele) ele.style.marginTop = `${$header}px`;

    return $header ?? 0;
}

// For Scroll Offset in Router Module
export const cloneHeaderTuple: [number, number] | (() => [number, number]) | undefined = () => {
    const val = cloneHeader()
    return [0, val]
}

export const scrollTop = (): void => {
    window.scrollTo(0, 150)
}

export const scrollTop0 = (): void => {
    window.scrollTo(0, 0)
}

export const mobileConversation = (): void => {
    const width = window.innerWidth;
    document.getElementsByClassName(".conversations")
    const conversationsElem = document.getElementsByClassName("conversations");
    for (let index = 0; index < conversationsElem.length; index++) {
        conversationsElem[index].addEventListener('clik', () => {
            if (width < 780) {
                const children = conversationsElem[index].getElementsByClassName("tabs");
                for (let j = 0; j < children.length; j++) {
                    children[j].classList.toggle("open")
                }
            }
        })

    }
}

export const mainMenu = (): void => {
    const width = window.innerWidth;
}

export const menuMobile = (): void => {

    const width = window.innerWidth;
    const mainMenu = document.getElementsByClassName("mainMenu");
    for (let index = 0; index < mainMenu.length; index++) {
        mainMenu[index].prepend(`<li class="languageMobile"><a href="#" class="fr">FR</a><a href="#" class="en">EN</a></li>`)
    }
    if (width < 769) {
        for (let index = 0; index < mainMenu.length; index++) {
            const children = mainMenu[index].getElementsByTagName("li");
            for (let j = 0; j < children.length; j++) {
                children[j].querySelector(".submenu")?.parentElement?.classList.add("arrow")
                children[j].addEventListener("click", () => {
                    children[j].querySelector(".submenu")?.classList.add("showSubMenu")
                })
            }
        }
        const subMenus = document.getElementsByClassName("submenu_content");
        for (let index = 0; index < subMenus.length; index++) {
            const children = mainMenu[index].getElementsByTagName("ul");
            for (let j = 0; j < children.length; j++) {
                children[j].querySelector("li")?.classList.add("arrow");
            }
        }

    }
}

export const inputDateFormatByLangue = localStorage.getItem('language') === 'en' ? 'YYYY-MM-DD' : 'DD-MM-YYYY';
export const      dateFormatByLangue = localStorage.getItem('language') === 'en' ? 'yyyy-MM-dd' : 'dd-MM-yyyy';

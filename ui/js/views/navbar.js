 /**
     * Dùng để tạo sự kiện ẩn hiện menu bar
     * LTTRUNG (19.07.2022)
     */

const showMenu = (toogleClass, navbarId, navCategory, navLogo, iconDirection, navIcon, listEmployee ) => {
    const toggle = $(toogleClass),
    navbar = $(navbarId),
    navcategory = $(navCategory),
    navlogo = $(navLogo),
    icondirection = $(iconDirection),
    navicon = $(navIcon),
    table = $(listEmployee);
    if(toggle && navbar) {
        toggle.click(function() {
            navbar.toggleClass("direction");
            icondirection.toggleClass("rotate");
            navcategory.toggleClass("hide");
            navlogo.toggleClass("hide");
            navicon.toggleClass("display-center");
            table.toggleClass("direction-table");
        });
    }
}

showMenu(".nav-toggle", "#navbar", ".nav-category", ".nav-logo", ".icon-direction", ".nav-item-icon", ".list-emp");
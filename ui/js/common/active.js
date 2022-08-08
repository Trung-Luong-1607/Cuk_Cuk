 /**
     * Dùng tạo sự kiện khi focus
     * LTTRUNG (19.07.2022)
     */

// active navbar
    $(".nav-item").click(function () {
        $(".nav-item").removeClass("active");
        $(this).addClass("active");  
    });

// active number page
    $(".numb-page").click(function () {
        $(".numb-page").removeClass("active");
        $(this).addClass("active");  
    });
    $(".route-page").click(function () {
        $(".route-page").removeClass("active");
        $(this).addClass("active");  
    });


class Department{
    // Hàm khởi tạo
    constructor(gridId){
        let me = this;

        // Lưu lại grid đang thao tác
        me.grid = $(`#${gridId}`);

        // Dùng khởi tạo sự kiện
        me.initEvents();

        // Khởi tạo khung cho phòng ban
        me.renderListDepartment();

        // Lấy dữ liệu phòng ban
        me.getDataDepartment();

        // Lấy dữ liệu Department input 
        me.getDataDepartmentInput();

        // Lấy dữ liệu của dòng được chọn sau khi load lại
        // me.prevSelectRow();

        // Hiển thị danh sách phòng ban
        me.showListDepartment();

    }

    /**
     * Render list department
     */
    renderListDepartment() {
        let me = this,
            wrapList = $(`<div class="list-item list-department-item"></div>`),
            ul = $(`<ul class="ul-department"></ul>`),
            listitem = $('<li class="noti">Không có nội dung được hiển thị</li>');
            wrapList.append(ul);
            ul.append(listitem);
            me.grid.append(wrapList);
        }

    /**
     * Show/Hide list department
     */
    showListDepartment() {
        const listitem = $('.list-department-item'),
        inputSearchDepartment = $('.department-input'),
        icondirection = $('.show-list-dep');
        if(icondirection) {
            icondirection.click(function() {
                inputSearchDepartment.addClass("focus-input");
                listitem.toggleClass("show");
                icondirection.toggleClass("rotate-not-trans");
            });
        }

        if(inputSearchDepartment) {
            inputSearchDepartment.focus(function() {
                inputSearchDepartment.addClass("focus-input");
                listitem.addClass("show");
                icondirection.addClass("rotate-not-trans");
            });
        }

        if(listitem) {
            listitem.click(function() {
                listitem.removeClass("show");
                icondirection.removeClass("rotate-not-trans");
            });
        }

        $(document).click(function(e) {
            if ((!(listitem).is(e.target) && listitem.has(e.target).length === 0) && 
            (!(inputSearchDepartment).is(e.target) && inputSearchDepartment.has(e.target).length === 0)
            && (!(icondirection).is(e.target) && icondirection.has(e.target).length === 0)) {
                inputSearchDepartment.removeClass("focus-input");
                icondirection.removeClass("rotate-not-trans");
                listitem.removeClass("show");
              }
        });
    }

    /**
     * Load dữ liệu
     */
        loadDataDepartment(data){
            let me = this;
            if(data)
            {
                // Render dữ liệu cho grid
                $(".list-department-item ul").remove();
                me.renderGridDepartment(data);
            }
        }

    /**
     * Render dữ liệu cho grid
     */
     renderGridDepartment(data){
        let me = this,
        wrapList = $('.list-department-item'),
        ulDepartment = me.renderUlDepartment(data);
        wrapList.append(ulDepartment);
    }

     /**
     * Render danh sách phòng ban
     */
        renderUlDepartment(data){
            let me = this,
            ulDepartment = $(`<ul class="ul-department"></ul>`),
            notification = $('<p class="noti">Không có nội dung được hiển thị</p>');
    
            if(data && data.length > 0){
                data.filter(function(item){
                    let listItem = $('<li></li>'),
                    icon = $(`<i class="far fa-check icon-check"></i>`);
                    
                    me.grid.find(".col").each(function(){
                        let fieldName = $(this).attr("FieldName"),
                            depName = $('<p></p>'),
                            value = me.getValueCellDepartment(item, fieldName);
                            depName.text(value);
                            listItem.append(icon);
                            listItem.append(depName);
                    });
                    ulDepartment.append(listItem);
                    // Lưu lại data để sau lấy ra dùng
                    listItem.data("data", item);
                });
            }
            else {
                ulDepartment.append(notification);
            }
    
            return ulDepartment;           
        }

    /**
     * Xử lý một số thứ sau khi binding xong
     */
        afterBinding(){
            let me = this,
            data = me.grid.find(".list-department-item ul li.active").eq(0).data("data"),
            departmentID = data["departmentID"];
            // Lấy Id để phân biệt các bản ghi  
            me.grid.attr("ItemId",departmentID);
            me.ItemId = me.grid.attr("ItemId");
            return data;
        }

    /**
     * Lấy ra bản ghi đang được select
     * @returns 
     */
        // getSelectedRecord(){
        //     let me = this,
        //     data = me.grid.find(".active").eq(0).data("data");
        //     return data;
        // }

     /**
     * Lấy giá trị ô
     * @param {} item 
     * @param {*} fieldName 
     */
        getValueCellDepartment(item, fieldName){
            let me = this,
                value = item[fieldName];
            return value;
        }

    /**
     * Hàm dùng để lấy dữ liệu danh sách phòng ban
     */
        getDataDepartment(){
            let input = $('#department').val();
            let params = "departmentName=" + input ;
            let 
            me = this,
            url = "https://localhost:7256/api/v1/Departments?" + params;
            CommonFn.Ajax(url, Resource.Method.Get, {}, function(response){
            if(response){
                me.loadDataDepartment(response);
            }else{
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
            });
        }

    /**
     * Hàm dùng để lấy dữ liệu từ Department input
     */
    getDataDepartmentInput() {
        let me = this,
        listitem = $('.list-department-item');
        $('#department').on('keyup', function() {
            listitem.addClass("show");
            me.getDataDepartment();
            if($('#department').val().length === 0)
            {
                me.grid.attr("ItemId","");
            }
        });
    }

    /**
     * Dùng để khởi tạo các sự kiện cho phòng ban
     */
        initEvents(){
            let me = this;   
            // Khởi tạo sự kiện cho phòng ban
            me.initEventsDepartment();
        }

    /**
     * Khởi tạo sự kiện cho phòng ban
     */
        initEventsDepartment(){
            let me = this,
            textInput = $('#department'),
            selectDepItem = '';
    
            // Khởi tạo sự kiện khi click vào dòng
            me.grid.off("click", ".list-department-item ul li");
            me.grid.on("click",".list-department-item ul li", function(){
                me.grid.find(".active").removeClass("active");
                $(this).addClass("active");
                selectDepItem = $(this).text();
                textInput.val(selectDepItem);
                // Làm một số thứ sau khi binding xong
                me.afterBinding();
            });
        }
}

// Khởi tạo một biến cho Department
var department = new Department("department-input");
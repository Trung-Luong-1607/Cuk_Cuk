class EmployeePage{
    // Hàm khởi tạo
    constructor(gridId){
        let me = this;

        // Lưu lại grid đang thao tác
        me.grid = $(`#${gridId}`);

        // Dùng khởi tạo sự kiện
        me.initEvents();

        // Lấy dữ liệu từ server
        me.getDataServer();

        // Lưu lại dữ liệu
        me.cacheData = [];

        me.totalCount = [];

        // Làm mới dữ liệu
        me.refreshData();

        // KHởi tạo form detail
        me.initFormDetail();

        // Lấy ra cấu hình các cột
        me.columnConfig = me.getColumnConfig();

        // Khởi tạo table và header
        me.renderTableAndHeader();

        // Lấy dữ liệu
        me.getData();

        // Lấy dữ liệu search input 
        me.getDataSearchInput();

        // Lấy dữ liệu position input 
        me.getDataPositionInput();

        // Lấy dữ liệu department input 
        me.getDataDepartmentInput();

        // Refresh data
        me.refresh();

        // Lấy dữ liệu số lượng bản ghi / trang
        me.getRowOfPage();

        me.bindRowOfPage();

    }

    

    /**
     * Lấy config các cột
     * @returns 
     */
    getColumnConfig(){
        let me = this,
            columnDefault = {
                FieldName: "",
                DataType: "String",
                EnumName: "",
                Text: ""
            },
            columns = [];

        // Duyệt từng cột để vẽ header
        me.grid.find(".col").each(function(){
            let column = {...columnDefault},
                that = $(this);

            Object.keys(columnDefault).filter(function(proName){
                let value = that.attr(proName);

                if(value){
                    column[proName] = value;
                }

                column.Text = that.text();
            });

            columns.push(column)
        });

        return columns;
    }

    /**
     * Dùng để khởi tạo các sự kiện cho trang 
     */
    initEvents(){
        let me = this;

        // Khởi tạo sự kiện click button delete
        me.initButtonDeleteClick();

        // Khởi tạo sự kiện click icon close
        me.initIconCloseClick();

        // Khởi tạo sự kiện click button cancel
        me.initButtonCancelClick();

        // Khởi tạo sự kiện close form delete bằng ESC
        me.initCloseFormDeleteESC();

        // Khởi tạo sự kiện delete employee
        me.initDeleteEmployee();

        // Khởi tạo sự kiện delete employee bằng enter
        me.initDeleteEmployeeEnter();

        // Khởi tạo sự kiện cho table
        me.initEventsTable();

        // Khởi tạo sự kiện thêm mới nhân viên
        me.addEvent();

        // Khởi tạo sự kiện nhân bản nhân viên
        me.duplicateEvent();
    }

    // Show total count
    showTotalCount() {
        let me = this,
        totalCount = $(".paging-section-left .total-count");
        totalCount.text(me.totalCount[0]);
        me.getPageNumber();
    }

    getPageNumber() {
        let me = this,
        totalCountRecord = me.totalCount[0],
        totalCountNumber = Math.ceil(totalCountRecord / parseInt($('.row-page').val())),
        currentPage = $(".numb-page").text();
        // $(".next-page").click(function() {
        //     $(".paging-section-center").find(".numb-page").text(parseInt(currentPage) + 1)
        // });
        // console.log(totalCountNumber);
        // for(let i = 1; i <= totalCountNumber; i++) {
        //     $(".numb-page").text() = i;
        // }
    }

    // Bind row of page
    bindRowOfPage() {
        let me = this,
        totalRow = $(".paging-section-left .total-row-page");
        totalRow.text($('.row-page').val());
    }

    // Khởi tạo sự kiện click button delete
        initButtonDeleteClick() {
            let me = this;   
            // Khởi tạo các sự kiện button trên form
            $("button[CommandType='delete']").click(function() {
                me.showPopUpDelete();
            });
        }

    // Khởi tạo sự kiện click icon close
        initIconCloseClick() {
            let me = this;   
            $(".icon-close").click(function() {
                me.closePopUpDelete();
            });
        }

    // Khởi tạo sự kiện click button cancel
        initButtonCancelClick() {
            let me = this;   
            $(".btn-cancel").click(function() {
                me.closePopUpDelete();
            });
        }

    // Khởi tạo sự kiện close form delete bằng ESC
        initCloseFormDeleteESC() {
            let me = this,
            popUp = $(".pop-up-notice");
            $(document).keydown(function(e) {
                let code = e.keyCode || e.which;
                if (code == 27) popUp.hide();
            });
        }

    // Khởi tạo sự kiện delete employee bằng enter
        initDeleteEmployeeEnter() {
            let me = this,
            popUp = $(".pop-up-notice");
            $(document).keydown(function(e) {
                let code = e.keyCode || e.which;
                if (code == 13) {
                    me.delete();
                }
            });
        }

    // Khởi tạo sự kiện delete employee
        initDeleteEmployee() {
        let me = this;
        $(".btn-delete").click(function() {
            me.delete();
        });
    }
    

    // Mở form pop up delete
    showPopUpDelete(){
        let me = this,
        popUp = $(".pop-up-notice");
        popUp.show();
    }

    /**
     * Đóng form pop up delete
     */
    closePopUpDelete(){
        let me = this,
        popUp = $(".pop-up-notice");
        popUp.hide();
    }

    // Thêm mới nhân viên
    addEvent() {
        let me = this,
        btnAdd = $("button[CommandType='add']");
        btnAdd.click(function() {
            me.add();
        });
    }

    // Nhân bản nhân viên
    duplicateEvent() {
        let me = this,
        btnDuplicate = $("button[CommandType='duplicate']");
        btnDuplicate.click(function() {
            me.duplicate();
        });
    };

    /**
     * THêm mới
     */
    add(){
        let me = this,
        param = {
            parent: me,
            formMode: Enumeration.FormMode.Add,
            record: {}
        };

    // Nếu có form detail thì show form
        if(me.formDetail){
        me.formDetail.open(param);
    }
    }

    /**
     * Sửa
     */
    edit(){
        let me = this,
        param = {
            parent: me,
            formMode: Enumeration.FormMode.Edit,
            itemId: me.ItemId,
            record: {...me.getSelectedRecord()}
        };

    // Nếu có form detail thì show form
        if(me.formDetail){
        me.formDetail.open(param);
        }
    }

    /**
     * Nhân bản
     */
    duplicate(){
        let me = this,
        param = {
            parent: me,
            formMode: Enumeration.FormMode.Duplicate,
            itemId: me.ItemId,
            record: {...me.getSelectedRecord()}
        };

    // Nếu có form detail thì show form
        if(me.formDetail){
        me.formDetail.open(param);
        }
    }

    /**
     * Xóa
     */
    delete(){
        let  me = this,
        popUp = $(".pop-up-notice"),
        toastSuccess = $(".toast-success"),
        toastError = $(".toast-error"),
        employee = $('.pop-up-notice').attr('ItemId'),
        url = "https://localhost:7256/api/v1/Employees/" + employee;
        if(employee) {
            CommonFn.Ajax(url, Resource.Method.Delete, {}, function(response){
                if(response){
                    $(".pop-up-notice").attr("ItemId","");
                    me.getData();
                    popUp.hide();
                    toastSuccess.show();
                    setTimeout(function(){
                        toastSuccess.hide();
                    }, 2000);
                }else{
                    me.getData();
                    popUp.hide();
                    toastError.show();
                    setTimeout(function(){
                        toastError.hide();
                    }, 2000);
                }
            })
        } else {
            popUp.hide();
        }
    }

    /**
     * Hàm nạp mới dữ liệu
     */
    refresh(){
        let me = this;
        // me.getDataServer();
        me.getData();
        me.formDetail.getNewCodeToServer();
    }

    /**
     * Triển khai nạp mới dữ liệu
     */
    refreshData() {
        let me = this;
        $("button[CommandType='refresh']").click(function() {
            $("#search-input").val("");
            $(".department-input").val("");
            $("#position").val("");
            $(".department-input").removeClass("focus-input");
            $('.list-department-item').removeClass("show");
            $('.show-list-dep').removeClass("rotate-not-trans");
            $(".position-input").removeClass("focus-input");
            $('.list-position-item').removeClass("show");
            $('.show-list-pos').removeClass("rotate-not-trans");
            $(".list-position-item ul li.active").removeClass("active");
            $(".list-department-item ul li.active").removeClass("active");
            $("#gridEmployee").attr("ItemId","");
            $(".pop-up-notice").attr("ItemId","");
            me.refresh();
        });
    }
    /**
     * Khởi tạo trang detail
     * 
     */
    initFormDetail(){
        let me = this;

        // Khởi tạo đối tượng form detail
        me.formDetail = new EmployeeDetail("EmployeeDetail");
    }

    /**
     * Khởi tạo sự kiện cho table
     */
    initEventsTable(){
        let me = this,
        btnDup = $("button[CommandType='duplicate']");

        // Khởi tạo sự kiện khi click vào dòng
        me.grid.off("click", ".tbody .tr");
        me.grid.on("click",".tbody .tr", function(){
            me.grid.find(".active-row").removeClass("active-row");
            $(this).addClass("active-row");
            btnDup.removeAttr("disabled");
            // Làm một số thứ sau khi binding xong
            me.afterBinding();
        });

        // Thực hiện sửa nhân viên khi double click vào dòng
        me.grid.on("dblclick",".tbody .tr", function(){
            me.edit();
        });
    }

    /**
     * Xử lý một số thứ sau khi binding xong
     */
        afterBinding(){
            let me = this,
            data = me.grid.find(".active-row").eq(0).data("data"),
            employeeID = data["employeeID"],
            employeeCode = data["employeeCode"];

            $(".pop-up-title-header p").text(employeeCode);
            $(".notice-details p").text(employeeCode);

            $("#gridEmployee").attr("ItemId",employeeID);
            $(".pop-up-notice").attr("ItemId",employeeID);
            $("input[FieldName='employeeCode']").attr("empCode",employeeCode);

            // Lấy Id để phân biệt các bản ghi
            me.ItemId = me.grid.attr("ItemId");
            return data;
        }

    /**
     * Lấy ra bản ghi đang được select
     * @returns 
     */
        getSelectedRecord(){
            let me = this,
                empCode = "",
                data = me.grid.find(".active-row").eq(0).data("data");
                empCode = data["employeeCode"];
                localStorage.setItem('employeeCode', empCode); 
            return data;
        }

     /**
     * Hàm dùng để lấy dữ liệu cho trang
     */
    getData(){
        let me = this,
        code = $('#search-input').val(),
        name = $('#search-input').val(),
        phoneNumber = $('#search-input').val(),
        position = $('#position-input').attr('ItemId'),
        department = $('#department-input').attr('ItemId'),
        pageSize = $('.row-page').val(),
        pageNumber = 1,
        params = "code=" + code + "&name=" + name + "&phoneNumber=" + phoneNumber + 
            "&positionID=" + position + "&departmentID=" + department +
            "&pageSize=" + pageSize + "&pageNumber=" + pageNumber,
        url = "https://localhost:7256/api/v1/Employees?" + params;
        CommonFn.Ajax(url, Resource.Method.Get, {}, function(response){
        if(response){
            me.totalCount = [response.totalCount];
            me.showTotalCount();
            me.loadData(response);
        }else{
            console.log("Có lỗi khi lấy dữ liệu từ server");
        }
        });
    }

     /**
     * Hàm dùng để lấy dữ liệu từ search input
     */
    getDataSearchInput() {
        let me = this;
        $('#search-input').on('keyup', function() {
            me.getData();
        });
    }

    getDataPositionInput() {
        let me = this;
        // Load dữ liệu khi chọn chức vụ
            $("#position-input").on("click",".list-position-item ul li", function(){
                me.getData();
            });
        // Load lại dữ liệu khi chức vụ trống
            $('#position').on('keyup', function() {
                me.getData();
            }); 
    }

    getDataDepartmentInput() {
        let me = this;
        // Load dữ liệu khi chọn phòng ban
        $("#department-input").on("click",".list-department-item ul li", function(){
            me.getData();
        });

        // Load dữ liệu khi phòng ban trống
        $('#department').on('keyup', function() {
            me.getData();
        });
    }

    getRowOfPage() {
        let me = this;
        $('.row-page').on('change', function() {
            me.bindRowOfPage();
            me.getData();
        });
    }

    /**
     * Hàm lấy dữ liệu từ server
     */
        getDataServer(){
            let me = this,
                pageSize = 1000,
                pageNumber = 1,
                params = "pageSize=" + pageSize + "&pageNumber=" + pageNumber,
                url = "https://localhost:7256/api/v1/Employees?" + params;
    
            // Gọi ajax lấy dữ liệu trên server
            CommonFn.Ajax(url, Resource.Method.Get, {}, function(response){
                if(response){ 
                    me.cacheData = [response];
                    me.loadData(response);
                }else{
                    console.log("Có lỗi khi lấy dữ liệu từ server");
                }
            });
        }

    /**
     * Load dữ liệu
     */
    loadData(data){
        let me = this;
        if(data)
        {
            // Render dữ liệu cho grid
            $(".tbody").remove();
            me.renderGrid(data);
        }
    }

    renderTableAndHeader() {
        let me = this,
            table = $(`<div class="table"></div>`),
            thead = me.renderThead(),
            tbody = $(`<div class="tbody"></div>`),
            p = $(`<p class="notification-table">Không có nội dung được hiển thị</p>`);
            table.append(thead);
            table.append(tbody);
            tbody.append(p);
            me.grid.append(table);
    }

    /**
     * Render header
     */
        renderThead(){
            let me = this,
                thead = $(`<div class="thead"></div>`),
                tr = $(`<div class="tr"></div>`);   
                me.columnConfig.filter(function(column){
                let text = column.Text,
                dataType = column.DataType,
                className = me.getClassFormat(dataType),
                th = $(`<div class="th label-filed-input-font"></div>`);
    
                th.text(text);
                th.addClass(className);
    
                tr.append(th);
            })
    
            thead.append(tr);
    
            return thead;
        }

    /**
     * Render dữ liệu cho grid
     */
    renderGrid(data){
        let me = this,
        table = $(".table"),
        tbody = me.renderTbody(data);    
        table.append(tbody);
    }

    /**
     * Renderbody
     */
    renderTbody(data){
        let me = this,
            tbody = $(`<div class="tbody"></div>`),
            p = $(`<p class="notification-table">Không có nội dung được hiển thị</p>`);

        if(data && data.data.length > 0){
            data.data.filter(function(item){
                let tr = $(`<div class="tr"></div>`);

                // Duyệt từng cột để vẽ header
                me.grid.find(".col").each(function(){
                    let fieldName = $(this).attr("FieldName"),
                        dataType = $(this).attr("DataType"),
                        td = $(`<div class="td"></div>`),
                        value = me.getValueCell(item, fieldName, dataType),
                        className = me.getClassFormat(dataType);

                    td.text(value);
                    td.addClass(className);

                    tr.append(td);
                });
                
                // Lưu lại data để sau lấy ra dùng
                tr.data("data", item);
                tbody.append(tr);
            });
        }
        else {
            tbody.append(p);
        }

        return tbody;
    }

     /**
     * Lấy giá trị ô
     * @param {} item 
     * @param {*} fieldName 
     * @param {*} dataType 
     */
      getValueCell(item, fieldName, dataType){
        let me = this,
            value = item[fieldName];
            if(fieldName == "gender") {
                let arr = Object.keys(Enumeration.Gender);
                let req = arr[item[fieldName]]; 
                value = Resource.Gender[req];   
            }

            if(fieldName == "workStatus") {
                let arr = Object.keys(Enumeration.WorkStatus);
                let req = arr[item[fieldName]]; 
                value = Resource.WorkStatus[req];  
            }

        switch(dataType){
            case Resource.DataTypeColumn.Number:
                value = CommonFn.formatMoney(value);
                break;
            case Resource.DataTypeColumn.Date:
                value = CommonFn.formatDate(value);
            // case Resource.DataTypeColumn.Enum:
            //     let arr = Object.keys(Enumeration.Gender);
            //     let req = arr[item[fieldName]]; 
            //     value = Resource.Gender[req];             
            //     break;
        }

        return value;
    }

     /**
     * Hàm dùng để lấy class format cho từng kiểu dữ liệu
     */
    getClassFormat(dataType){
        let className = "";
    
        switch(dataType){
            case Resource.DataTypeColumn.Number:
                className = "salary";
                break;
            case Resource.DataTypeColumn.Enum:
                className = "short";
                break;
            case Resource.DataTypeColumn.Date:
                className = "short";
                break;
            case Resource.DataTypeColumn.StringMedium:
                className = "medium";
                break;
            case Resource.DataTypeColumn.Email:
                className = "long-lg";
            break;
            case Resource.DataTypeColumn.StringLong:
                className = "long";
                break;
        }
    
        return className;
    }
}


// Khởi tạo một biến cho trang nhân viên
var employeePage = new EmployeePage("gridEmployee");
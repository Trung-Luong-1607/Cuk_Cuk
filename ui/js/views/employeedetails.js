class EmployeeDetail{
    constructor(formId){
        let me = this;

        me.form = $(`#${formId}`);

        // Khởi tạo sự kiện cho form
        me.initEvents();

        // Lấy dữ liệu mã nhân viên mới nhất từ server
        me.getNewCodeToServer();

        // Hàm sử dụng để lấy danh sách phòng ban
        me.getDataDepartment();

        // Hàm sử dụng để lấy danh sách vị trí chức vụ
        me.getDataPosition();

        // Lưu lại mã nhân viên mới nhất
        me.saveNewCode = "";

        // Hủy sự kiên submit mặc định của form
        me.removeEventSubmitForm();
    }

    /**
     * Khởi tạo sự kiện cho form
     */
    initEvents(){
        let me = this;

        // Khởi tạo sự kiện button trên toolbar dưới form
        me.form.find(".toolbar-form [CommandType]").off("click");
        me.form.find(".toolbar-form [CommandType]").on("click", function(){
            let commandType = $(this).attr("CommandType");

            // Gọi đến hàm động 
            if(me[commandType] && typeof me[commandType] == "function"){
                me[commandType]();
            }
        });
    
        // Khởi tạo sự kiện đóng form khi click icon closse
        me.initEventsCloseFormByIcon();

        // Khởi tạo sự kiện đóng form khi ấn phím ESC
        me.initEventsCloseFormByESC();

        // Khởi tạo sự kiện đóng form khi click button Hủy
        me.initEventsCloseFormByCancelButton();

        // khởi tạo sự kiện save form
        me.saveDataForm();
    }

    // Hủy sự kiên submit mặc định của form
    removeEventSubmitForm() {
        let me = this,
        form = $("#FormEmployee");
        form.on("submit",function (e) {
            e.preventDefault(); //To not refresh the page
        });
    }

    /**
     * Hàm dùng để lấy dữ liệu danh sách phòng ban
     */
        getDataDepartment(){
            let me = this,
            url = "https://localhost:7256/api/v1/Departments";
            CommonFn.Ajax(url, Resource.Method.Get, {}, function(response){
            if(response){
                me.loadDataDepartment(response);
            }else{
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
            });
        }

    /**
     * Load dữ liệu phòng ban
     */
        loadDataDepartment(data){
            let me = this;
            if(data)
            {
                // Render dữ liệu phòng ban
                me.renderGridDepartment(data);
            }
        }

    /**
     * Render dữ liệu cho grid phòng ban
     */
        renderGridDepartment(data){
            let me = this,
            listDepartment = me.renderOptionDepartment(data);
        }

    /**
     * Render danh sách phòng ban
     */
        renderOptionDepartment(data){
            let me = this,
            listDepartment = $("select[FieldName='departmentID']"),
            optionDefault = $('<option value="" disabled selected>Chọn phòng ban</option>');  
            listDepartment.append(optionDefault);
            if(data && data.length > 0){
                data.filter(function(item){
                    const depID = item.departmentID,
                    depName = item.departmentName;
                    let optionDepartment = $(`<option value="${depID}">${depName}</option>`);
                    listDepartment.append(optionDepartment);
                });
            }
            return listDepartment;           
        }

    /**
     * Hàm dùng để lấy dữ liệu danh sách chức vụ
     */
        getDataPosition(){
            let me = this,
            url = "https://localhost:7256/api/v1/Positions";
            CommonFn.Ajax(url, Resource.Method.Get, {}, function(response){
            if(response){
                me.loadDataPosition(response);
            }else{
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
            });
        }

    /**
     * Load dữ liệu vị trí chức vụ
     */
    loadDataPosition(data){
            let me = this;
            if(data)
            {
                // Render dữ liệu pvị trí chức vụ
                me.renderGridPosition(data);
            }
        }

    /**
     * Render dữ liệu cho grid vị trí chức vụ
     */
        renderGridPosition(data){
            let me = this,
            listPosition = me.renderOptionPosition(data);
        }

    /**
     * Render danh sách phòng ban
     */
        renderOptionPosition(data){
            let me = this,
            listPosition = $("select[FieldName='positionID']"),
            optionDefault = $('<option value="" disabled selected>Chọn vị trí chức vụ</option>');  
            listPosition.append(optionDefault);
            if(data && data.length > 0){
                data.filter(function(item){
                    const posID = item.positionID,
                    posName = item.positionName;
                    let optionPosition = $(`<option value="${posID}">${posName}</option>`);
                    listPosition.append(optionPosition);
                });
            }
            return listPosition;           
        }

    /**
     * Upload ảnh đại diện
     */
        upLoadImage() {
            let me = this;
            $("#upload-img").click(function () {
                $("#fileupload").click();
            });
            $("#fileupload").change(function(event) {
                let url = URL.createObjectURL(event.target.files[0]);
                $("#upload-img").attr("src",url);
            });
        }

    /**
     * Đặt ảnh mặc định trong trường hợp bị lỗi file ảnh
     */    
    fixErrorNotFoundImage() {
        let me = this,
        notFoundImage = "../assets/images/default-avatar.jpg";	
            $(".safelyLoadImage").on("error", function() {
            $(this).attr("src", notFoundImage);
            $(this).removeClass("safelyLoadImage");
        });
    }

    // Mở form
        show(){
            let me = this,
            formatSalary = $("input[FieldName='salary']"),
            autoFocus = $("#auto-focus");

            // Lắng nghe sự kiện khi nhập input
            formatSalary.on('input', function() {  
                // Lấy giá trị hiện tại                
                let text=$(this).val(); 
                // Xóa tất cả các ký tự không hợp lệ                           
                text=text.replace(/\D/g,'');                    
                if(text.length>3) {
                    // Định dạng tiền tệ
                    text=text.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.");
                }
                // Set lại giá trị mới                   
                $(this).val(text);  
                                               
            });

            me.form.show();
            me.upLoadImage();
            me.fixErrorNotFoundImage();
            autoFocus.focus();
            // reset dữ liệu
            me.resetForm();
        }

    // reset form
        resetForm(){
            let me = this;

            // Gán giá trị rỗng
            me.form.find("[FieldName]").val("");
            // Hủy bỏ validate
            me.form.find(".base-input.error").removeClass("error");
            me.form.find("label.error").remove();
        }

    /**
     * Đóng form
     */
    close(){
        let me = this;

        me.form.hide();
    }

    // Đóng form detail khi click vào icon close
    initEventsCloseFormByIcon() {
        let me = this,
        iconClose = $(".modal-title i");
        iconClose.click(function() {
            me.close();
        });
    }

    // Đóng form detail khi ấn phím esc
    initEventsCloseFormByESC() {
        let me = this;
        $(document).keydown(function(e) {
            let code = e.keyCode || e.which;
            if (code == 27) me.form.hide();
        });
    }

    // Đóng form detail khi click button Hủy
    initEventsCloseFormByCancelButton() {
        let me = this,
        btnCancel = $(".modal-footer .btn-cancel");
        btnCancel.click(function() {
            me.form.hide();
        });
    }

    // Save form khi nhấn button save
    saveDataForm() {
        let me = this,
        btnSave = $(".btn-save");
        btnSave.click(function() {
            me.save();
        });
    }

    /**
     * Lưu dữ liệu
     */
    save(){
        let me = this,
            isValid = me.validateForm();

            // Kiểm tra validate form
            if(isValid){
            // Lưu data
            let data = me.getFormData();
            if ($('#FormEmployee').valid()) {
                me.saveData(data);
            }}
        }

    validateForm() {
        let me = this,
        isValid = $("#FormEmployee").validate({
            rules: {
                employeeCode: {
                    required: true,
                    validEmployeeCode: true
                },
                employeeName: {
                    required: true
                },
                identityNumber: {
                    required: true,
                    validIdentityNumber: true,
                    minlength: 9,
                    maxlength: 12
                },
                taxCode: {
                    validTaxCode: true,
                    maxlength: 10,
                    minlength: 10
                },
                email: {
                    required: true,
                    gmail: true
                },
                phoneNumber: {
                    required: true,
                    validPhoneNumber: true,
                    maxlength: 11,
                    minlength: 10
                },
                dateOfBirth: {
                    validDate: true
                },
                identityIssuedDate: {
                    validDate: true
                },
                joiningDate: {
                    validDate: true
                }         
            },
            messages: {
                identityNumber: {
                    minlength: jQuery.validator.format("Vui lòng nhập tối thiểu 9 ký tự số."),
                    maxlength: jQuery.validator.format("Vượt quá giới hạn 12 ký tự số. Vui lòng nhập lại.")
                },
                taxCode: {
                    maxlength: "Vui lòng nhập đúng định dạng mã số thuế cá nhân (10 chữ số từ 0 - 9).",
                    minlength: "Vui lòng nhập đúng định dạng mã số thuế cá nhân (10 chữ số từ 0 - 9)."
                },
                phoneNumber: {
                    maxlength: jQuery.validator.format("Vượt quá giới hạn 11 ký tự số. Vui lòng nhập lại."),
                    minlength: jQuery.validator.format("Vui lòng nhập tối thiểu 10 ký tự số.")
                }
            }
        });

        if(isValid){
            // Kiểm tra trùng mã nhân viên
            isValid = me.checkDuplicateEmployeeCode(); 
        }
        return isValid;
    }

    /**
     * Kiểm tra trùng mã nhân viên
     */
        checkDuplicateEmployeeCode() {
            let me = this,  
            isValid = true,      
            empCode = $("input[FieldName='employeeCode']"),
            toastWarning = $(".toast-warning"),
            currentEmpCode = empCode.attr("empCode");
            // checkCode = empCode.attr("checkCode"),
            // url = "https://localhost:7256/api/v1/Employees/check-duplicate-Employee-Code?code=" + empCode.val()
            

            // CommonFn.Ajax(url, Resource.Method.Get, {}, function(response){
            //     if(response){ 
            //         empCode.attr("checkCode", response.checkEmployeeCode);
            //     } else{
            //         alert("Có lỗi xảy ra. Vui lòng thử lại!");
            //     } 
            // });

            if(currentEmpCode === empCode.val() && me.formMode == Enumeration.FormMode.Edit) {
                isValid = true;         
            } else {  
                let result = me.parent.cacheData[0].data.filter(function(item) {
                    return item.employeeCode === empCode.val();
                });
   
                if(result.length != 0) {
                    isValid = false;
                    toastWarning.show();
                    setTimeout(function(){
                        toastWarning.hide();
                    }, 2000);
                } else {
                    isValid = true;
                }
        }
            return isValid;
        }

    /**
     * Lấy dữ liệu form
     */
    getFormData(){
        let me = this,
        data = me.record || {};

        me.form.find("[FieldName]").each(function(){
        let control = $(this),
            dataType = control.attr("DataType"),
            fieldName = control.attr("FieldName"),
            value = me.getValueControl(control, dataType);
        data[fieldName] = value;
        });
        return data;
    }

    // Lấy dữ liệu form dựa vào dataType
    getValueControl(control, dataType){
        let me = this,
        formatValue = "",
        urlImage = control.attr("src"),
        value = control.val();
    
        switch(dataType){
            case Resource.DataTypeColumn.Date:
                value = new Date(value);
                break;
            case Resource.DataTypeColumn.Number:
                formatValue = value.replace(/\./g, '');
                value = parseInt(formatValue);
                break;
            case Resource.DataTypeColumn.Enum:
                value = parseInt(value);
                break;
            case Resource.DataTypeColumn.Image:
                value = urlImage;
                break;
            }
    
        return value;
    }

    /**
     * xử lý lưu dữ liẹu
     */
    saveData(data){
        let me = this,
        toastSuccess = $(".toast-success"),
        toastError = $(".toast-error"),
        gridEmp = $("#gridEmployee"),
        btnDup = $("button[CommandType='duplicate']"),
        method = Resource.Method.Post,
        urlFull = "https://localhost:7256/api/v1/Employees";
        
    // Nếu edit thì sửa lại
    if(me.formMode == Enumeration.FormMode.Edit){
        method = Resource.Method.Put;
        urlFull = "https://localhost:7256/api/v1/Employees/" + me.itemId;
    }

    // Gọi lên server cất dữ liệu
        CommonFn.Ajax(urlFull, method, data, function(response){
            if(response){  
                me.close();
                me.getNewCodeToServer();
                gridEmp.attr("ItemId","");
                me.parent.getData();
                btnDup.attr("disabled",true);
                toastSuccess.show();
                setTimeout(function(){
                    toastSuccess.hide();
                }, 2000);
            }else{
                me.close();
                gridEmp.attr("ItemId","");
                me.parent.getData();
                toastError.show();
                setTimeout(function(){
                    toastError.hide();
                }, 2000);
            }
        });
    }

    /**
     * Hàm mở form
     */
    open(param){
        let me = this,
        newCode = me.saveNewCode,
        gridEmp = $("#gridEmployee");

        Object.assign(me, param);

        // Mở form
        me.show();

        // Kiểm tra xem có phải mode thêm không
        if(me.formMode == Enumeration.FormMode.Add){
            gridEmp.attr("ItemId","");
        }

        // Kiểm tra xem có phải mode sửa không
        if(me.formMode == Enumeration.FormMode.Edit){
            me.bindingData(me.record);
        }

        // Kiểm tra xem có phải mode nhân bản không
        if(me.formMode == Enumeration.FormMode.Duplicate){
            me.record["employeeCode"] = newCode;
            me.bindingData(me.record);
        }
    }

    /**
     * Lấy mã nhân viên mới nhất từ server
     */
    getNewCodeToServer() {
        let me = this,
        url = "https://localhost:7256/api/v1/Employees/new-code";

        CommonFn.Ajax(url, Resource.Method.Get, {}, function(response){
            if(response){
                me.getNewCode(response);
            }else{
                alert("Có lỗi xảy ra vui lòng thử lại sau !");
            }
        })
    }

    /**
     * Lấy mã nhân viên mới nhất
     */
    getNewCode(data) {
        let me = this;
        if(data) {
            me.saveNewCode = data.employeeCode;
        }
        else {
            alert("Không có dữ liệu");
        }
    }

    // Binding dữ liệu form
    bindingData(data){
        let me = this;   

            // Duyệt từng control để binding dữ liệu
        me.form.find("[FieldName]").each(function(){
            let fieldName = $(this).attr("FieldName"),
                dataType = $(this).attr("DataType"),
                value = data[fieldName],
                control = $(this);    
            me.setValueControl(control, value , dataType);
        });
    }

    // Set giá trị cho control
    setValueControl(control, value , dataType){
        let me = this;
        switch(dataType){
            case Resource.DataTypeColumn.Date:
                value = CommonFn.convertDate(value);
                break;
            case Resource.DataTypeColumn.Number:
                value = CommonFn.formatMoney(value);
                break;
        }

        if(dataType === Resource.DataTypeColumn.Image) {
            control.attr("src",value);
        }
    
        control.val(value);
    }
}
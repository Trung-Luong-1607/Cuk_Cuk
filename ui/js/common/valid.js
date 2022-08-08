$.extend($.validator.messages, {
    required: "Vui lòng nhập dữ liệu không được để trống!",
    remote: "Please fix this field.",
    email: "Please enter a valid email address.",
    url: "Please enter a valid URL.",
    date: "Please enter a valid date.",
    dateISO: "Please enter a valid date (ISO).",
    number: "Please enter a valid number.",
    digits: "Please enter only digits.",
    creditcard: "Please enter a valid credit card number.",
    equalTo: "Please enter the same value again.",
    accept: "Please enter a value with a valid extension.",
    maxlength: jQuery.validator.format("Mã số nhập quá giới hạn, vui lòng nhập lại."),
    minlength: jQuery.validator.format("Vui lòng nhập tối thiểu chữ số."),
    rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
    range: jQuery.validator.format("Please enter a value between {0} and {1}."),
    max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
    min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
});

$.validator.addMethod("gmail", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9._-]+@gmail.com$/i.test(value);
}, "Vui lòng nhập đúng định dạng email. VD: example@gmail.com.");

$.validator.addMethod("validDate", function(value, element) {
    let inputDate = new Date(value);
    let currentDate = new Date();
    if(inputDate > currentDate) {
        return false;
    } else {
        return true;
    }
}, "Vui lòng nhập dữ liệu ngày tháng năm không được lớn hơn ngày hiện tại!");

$.validator.addMethod("validIdentityNumber", function(value, element) {
    return this.optional(element) || /^[0-9]*$/i.test(value);
}, "Vui lòng nhập đúng định dạng CMTND/ Căn cước (Tối thiểu 9 và tối đa 12 chữ số từ 0 - 9).");

$.validator.addMethod("validTaxCode", function(value, element) {
    return this.optional(element) || /^[0-9]*$/i.test(value);
}, "Vui lòng nhập đúng định dạng mã số thuế cá nhân (10 chữ số từ 0 - 9).");

$.validator.addMethod("validEmployeeCode", function(value, element) {
    let valueLength = value.length;
    if(valueLength != 8) {
        return false;
    } else {
        return this.optional(element) || /^NV[0-9]*$/i.test(value);
    }

}, "Vui lòng nhập đúng định dạng mã nhân viên (NVXXXXXX với X là chữ số từ 0 - 9).");


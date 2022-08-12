    // Đóng form toast message

        let iconCloseSuccess = $(".icon-success-close"),
        toastSuccess = $(".toast-success"),
        iconCloseWarning = $(".icon-warning-close"),
        toastWarning = $(".toast-warning"),
        iconCloseError = $(".icon-error-close"),
        toastError = $(".toast-error");

        if(iconCloseSuccess) {
            iconCloseSuccess.click(function() {
                toastSuccess.hide();
            });
        }

        if(iconCloseWarning) {
            iconCloseWarning.click(function() {
                toastWarning.hide();
            });
        }

        if(iconCloseError) {
            iconCloseError.click(function() {
                toastError.hide();
            });
        }
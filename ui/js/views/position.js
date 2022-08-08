class Position{
    // Hàm khởi tạo
    constructor(gridId){
        let me = this;

        // Lưu lại grid đang thao tác
        me.grid = $(`#${gridId}`);

        // Dùng khởi tạo sự kiện
        me.initEvents();

        // Khởi tạo khung cho vị trí chức vụ
        me.renderListPosition();

        // Lấy dữ liệu vị trí chức vụ
        me.getDataPosition();

        // Lấy dữ liệu Position input 
        me.getDataPositionInput();

        // Hiển thị danh sách vị trí chức vụ
        me.showListPosition();

    }

    /**
     * Render list Position
     */
     renderListPosition() {
        let me = this,
            wrapList = $(`<div class="list-item list-position-item"></div>`),
            ul = $('<ul class="ul-position"></ul>'),
            listitem = $('<li class="noti">Không có nội dung được hiển thị</li>');
            wrapList.append(ul);
            ul.append(listitem);
            me.grid.append(wrapList);
        }

    /**
     * Show/Hide list Position
     */
    showListPosition() {
        const listitem = $('.list-position-item'),
        inputSearchPosition = $('.position-input'),
        icondirection = $('.show-list-pos');
        if(icondirection) {
            icondirection.click(function() {
                inputSearchPosition.addClass("focus-input");
                listitem.toggleClass("show");
                icondirection.toggleClass("rotate-not-trans");
            });
        }

        if(inputSearchPosition) {
            inputSearchPosition.focus(function() {
                inputSearchPosition.addClass("focus-input");
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
            (!(inputSearchPosition).is(e.target) && inputSearchPosition.has(e.target).length === 0)
            && (!(icondirection).is(e.target) && icondirection.has(e.target).length === 0)) {
                inputSearchPosition.removeClass("focus-input");
                icondirection.removeClass("rotate-not-trans");
                listitem.removeClass("show");
              }
        });
    }

    /**
     * Load dữ liệu
     */
        loadDataPosition(data){
            let me = this;
            if(data)
            {
                // Render dữ liệu cho grid
                $(".list-position-item ul").remove();
                me.renderGridPosition(data);
            }
        }

    /**
     * Dùng để khởi tạo các sự kiện cho vị trí chức vụ
     */
        initEvents(){
            let me = this;   
            // Khởi tạo sự kiện cho vị trí chức vụ
            me.initEventsPosition();
        }

    /**
     * Render dữ liệu cho grid
     */
        renderGridPosition(data){
            let me = this,
            wrapList = $('.list-position-item'),
            ulPosition = me.renderUlPosition(data);
            wrapList.append(ulPosition);
        }

    /**
     * Render danh sách vị trí chức vụ
     */
    renderUlPosition(data){
        let me = this,
        ulPosition = $(`<ul class="ul-position"></ul>`),
        notification = $('<p class="noti">Không có nội dung được hiển thị</p>');

        if(data && data.length > 0){
            data.filter(function(item){
                let listItem = $('<li></li>'),
                icon = $(`<i class="far fa-check icon-check"></i>`);
                
                me.grid.find(".col").each(function(){
                    let fieldName = $(this).attr("FieldName"),
                        posName = $('<p></p>'),
                        value = me.getValueCellPosition(item, fieldName);
                        posName.text(value);
                        listItem.append(icon);
                        listItem.append(posName);
                });

                ulPosition.append(listItem);
                // Lưu lại data để sau lấy ra dùng
                listItem.data("data", item);
            });
        }
        else {
            ulPosition.append(notification);
        }

        return ulPosition;           
    }

    /**
     * Xử lý một số thứ sau khi binding xong
     */
        afterBinding(){
            let me = this,
            data = me.grid.find(".list-position-item ul li.active").eq(0).data("data"),
            positionID = data["positionID"];
            // Lấy Id để phân biệt các bản ghi  
            me.grid.attr("ItemId",positionID);
            me.ItemId = me.grid.attr("ItemId");
            return data;
        }

    /**
     * Lấy giá trị ô
     * @param {} item 
     * @param {*} fieldName 
     */
        getValueCellPosition(item, fieldName){
            let me = this,
                value = item[fieldName];
            return value;
        }

    /**
     * Hàm dùng để lấy dữ liệu danh sách chức vụ
     */
        getDataPosition(){
            let input = $('#position').val();
            let params = "positionName=" + input ;
            let 
            me = this,
            url = "https://localhost:7256/api/v1/Positions?" + params;
            CommonFn.Ajax(url, Resource.Method.Get, {}, function(response){
            if(response){
                me.loadDataPosition(response);
            }else{
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
            });
        }

    /**
     * Hàm dùng để lấy dữ liệu từ Position input
     */
         getDataPositionInput() {
            let me = this,
            listitem = $('.list-position-item');
            $('#position').on('keyup', function() {
                listitem.addClass("show");
                me.getDataPosition();
                if($('#position').val().length === 0)
                {
                    me.grid.attr("ItemId","");
                }
            });
        }

    /**
     * Khởi tạo sự kiện cho vị trí chức vụ
     */
        initEventsPosition(){
            let me = this,
            textInput = $('#position'),
            selectPosItem = '';   
            // Khởi tạo sự kiện khi click vào dòng
            me.grid.off("click", ".list-position-item ul li");
            me.grid.on("click",".list-position-item ul li", function(){
                me.grid.find(".active").removeClass("active");
                $(this).addClass("active");
                selectPosItem = $(this).text();
                textInput.val(selectPosItem);
                // Làm một số thứ sau khi binding xong
                me.afterBinding();
            });
        }

}

// Khởi tạo một biến cho Position
var position = new Position("position-input");
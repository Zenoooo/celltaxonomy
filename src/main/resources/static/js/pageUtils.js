/**
 *
 *
 * 调用：$(".nav.page").initPage(10,1,10); 或 $(".nav.page").initPage(10,1,10,targetForm);
 *
 * 备注：第一个参数是总页数，第二个参数是当前页数,第三个参数是每页条数,第四个参数是提交的目标form
 *
 */
$.fn.extend({
    targetForm:null,
    totalPage : 0,
    _totalPage:0,
    _callback:null,
    _objPage:null,
    initPage : function(totalPage,currentPage,pageSize,targetForm) {
        var limitSize = 10;//最多展示10个分页的按钮显示
        var tips_html = $(this).html();
        if (totalPage == null || totalPage == undefined || totalPage == "" || totalPage=="null" || totalPage == 0) {
            $(this).html("暂无分页记录 // No record");
            if(tips_html!=""){
                $(this).html(tips_html).css({'float':'none','text-align':'center','height':'auto'});
            }
            return;
        }

        $.fn.totalPage = parseInt(totalPage);
        $.fn.targetForm = $("#"+targetForm);

        if (currentPage == null || currentPage == undefined || currentPage == "" || currentPage == "null" || currentPage == 0) {
            $(this).html("暂无分页记录 // No record");
            if(tips_html!=""){
                $(this).html(tips_html).css({'float':'none','text-align':'center','height':'auto'});
            }
            return;
        }
        currentPage = parseInt(currentPage);

        if (pageSize == null || pageSize == undefined || pageSize == "" || pageSize == "null" || pageSize == 0){
            $(this).html("暂无分页记录 // No record");
            if(tips_html!=""){
                $(this).html(tips_html).css({'float':'none','text-align':'center','height':'auto'});
            }
            return;
        }
        pageSize = parseInt(pageSize);

        var pageHtml = "每页"+pageSize+"条  ，共"+totalPage+"页  ";
        /**
         * 当前是第一页，上一页则是灰的
         */
        if (currentPage <= 1) {
            pageHtml += '<a class="no" href="javascript:;">上一页</a>';
        } else {
            pageHtml += '<a href="javascript:$.fn.goPage('+(currentPage-1)+');">上一页</a>';
        }
        if (totalPage <= limitSize) {
            for (var i = 1; i <= totalPage; i++) {
                pageHtml += '<a ';
                /** *选中当前页** */
                if (currentPage == i) {
                    pageHtml += ' class="active" ';
                }
                pageHtml += '  href="javascript:$.fn.goPage('+i+');">' + i + '</a>';
            }
        }else if(currentPage <= limitSize / 2 + 1){
            for (var i = 1; i <= limitSize; i++) {
                pageHtml += '<a ';
                /** *选中当前页** */
                if (currentPage == i) {
                    pageHtml += ' class="active" ';
                }
                pageHtml += '  href="javascript:$.fn.goPage('+i+');">' + i + '</a>';
            }
        }else if(currentPage+limitSize / 2 >totalPage){
            for (var i = totalPage-9; i <= totalPage; i++) {
                pageHtml += '<a ';
                /** *选中当前页** */
                if (currentPage == i) {
                    pageHtml += ' class="active" ';
                }
                pageHtml += '  href="javascript:$.fn.goPage('+i+');">' + i + '</a>';
            }
        }else if (currentPage > limitSize / 2 + 1) {
            for (var i = currentPage - limitSize / 2; i <= currentPage
            + (limitSize / 2 - 1); i++) {
                pageHtml += '<a ';
                /** *选中当前页** */
                if (currentPage == i) {
                    pageHtml += ' class="active" ';
                }
                pageHtml += '  href="javascript:$.fn.goPage('+i+');">' + i + '</a>';
            }
        }
        /**
         * 当前是最后一页，下一页则是灰的
         */
        if (currentPage == totalPage) {
            pageHtml += '<a class="no" href="javascript:;">下一页</a>';
        } else {
            pageHtml += '<a href="javascript:$.fn.goPage('+(currentPage+1)+');">下一页</a>';
        }
        pageHtml += ' 转到：<cite class="wsc-form-cite a text"><input type="text" id="page" name="page" value="" inited="true" ></cite> 页';
        pageHtml += '<a href="javascript:;" class="_jump_page_link">确定</a>';

        $(this).html(pageHtml);

        $("._jump_page_link").on("click",function(){
            //var _page = $(this).prev().val();
            var _page = $("#page").val();
            $.fn.goPage(_page);
        });
    },
    /**
     * 跳转到第几页
     */
    goPage:function(nextPage){
        if(!(/^\d+$/.test(nextPage)) || parseInt(nextPage)<=0 || parseInt(nextPage)>$.fn.totalPage){
            alert("非法的跳转页数");
            return;
        }
        if($.fn.targetForm.length){
            if($('[name="pageNum"]').length==0){
                $("<input type='hidden' name='pageNum' value='"+nextPage+"' />").appendTo($.fn.targetForm);
            }else{
                $('[name="pageNum"]').eq(0).attr("value",nextPage);
            }
            $.fn.targetForm.submit();
        }else{
            var _pageUrl = window.location.href;
            var params = _pageUrl.split("?");
            window.location.href = params[0]+"?pageNum="+nextPage;
        }
    },
    /**
     * ajax分页回调
     */
    initAjaxPage : function(callback) {
        $.fn._callback = callback;
        $.fn._objPage = $(this);
        callback(1,$(this));
    },
    /**
     * 渲染分页
     */
    buildPage:function(pageNum,pageSize,total){
        var limitSize = 10;//最多展示10个分页的按钮显示
        var tips_html = $(this).html();
        if (total == null || total == undefined || total == "" || total=="null" || total == 0) {
            $(this).html("暂无分页记录");
            if(tips_html!=""){
                $(this).html(tips_html).css({'float':'none','text-align':'center','height':'auto'});
            }
            return;
        }

        $.fn._totalPage = parseInt(total);
        var totalPage = parseInt(total);

        if (pageNum == null || pageNum == undefined || pageNum == "" || pageNum == "null" || pageNum == 0) {
            $(this).html("暂无分页记录");
            if(tips_html!=""){
                $(this).html(tips_html).css({'float':'none','text-align':'center','height':'auto'});
            }
            return;
        }
        var currentPage = parseInt(pageNum);

        if (pageSize == null || pageSize == undefined || pageSize == "" || pageSize == "null" || pageSize == 0){
            $(this).html("暂无分页记录");
            if(tips_html!=""){
                $(this).html(tips_html).css({'float':'none','text-align':'center','height':'auto'});
            }
            return;
        }
        var pageSize = parseInt(pageSize);

        var pageHtml = "每页"+pageSize+"条  ，共"+total+"页  ";
        /**
         * 当前是第一页，上一页则是灰的
         */
        if (currentPage <= 1) {
            pageHtml += '<a class="no" href="javascript:;">上一页</a>';
        } else {
            pageHtml += '<a href="javascript:$.fn.goAjaxPage('+(currentPage-1)+');">上一页</a>';
        }
        if (totalPage <= limitSize) {
            for (var i = 1; i <= totalPage; i++) {
                pageHtml += '<a ';
                /** *选中当前页** */
                if (currentPage == i) {
                    pageHtml += ' class="active" ';
                }
                pageHtml += '  href="javascript:$.fn.goAjaxPage('+i+');">' + i + '</a>';
            }
        }else if(currentPage <= limitSize / 2 + 1){
            for (var i = 1; i <= limitSize; i++) {
                pageHtml += '<a ';
                /** *选中当前页** */
                if (currentPage == i) {
                    pageHtml += ' class="active" ';
                }
                pageHtml += '  href="javascript:$.fn.goAjaxPage('+i+');">' + i + '</a>';
            }
        }else if(currentPage+limitSize / 2 >totalPage){
            for (var i = totalPage-9; i <= totalPage; i++) {
                pageHtml += '<a ';
                /** *选中当前页** */
                if (currentPage == i) {
                    pageHtml += ' class="active" ';
                }
                pageHtml += '  href="javascript:$.fn.goAjaxPage('+i+');">' + i + '</a>';
            }
        }else if (currentPage > limitSize / 2 + 1) {
            for (var i = currentPage - limitSize / 2; i <= currentPage
            + (limitSize / 2 - 1); i++) {
                pageHtml += '<a ';
                /** *选中当前页** */
                if (currentPage == i) {
                    pageHtml += ' class="active" ';
                }
                pageHtml += '  href="javascript:$.fn.goAjaxPage('+i+');">' + i + '</a>';
            }
        }
        /**
         * 当前是最后一页，下一页则是灰的
         */
        if (currentPage == totalPage) {
            pageHtml += '<a class="no" href="javascript:;">下一页</a>';
        } else {
            pageHtml += '<a href="javascript:$.fn.goAjaxPage('+(currentPage+1)+');">下一页</a>';
        }
        pageHtml += ' 转到：<input type="text" name="page" value="" inited="true"> 页';
        pageHtml += '<a href="javascript:;" class="_jump_page_link">确定</a>';

        $(this).html(pageHtml);
        $("._jump_page_link").on("click",function(){
            var _page = $(this).prev().val();
            $.fn.goAjaxPage(_page);
        });

    },
    /**
     * 以ajax的方式跳转到第几页
     */
    goAjaxPage:function(nextPage){
        if(!(/^\d+$/.test(nextPage)) || parseInt(nextPage)<=0 || parseInt(nextPage)>$.fn._totalPage){
            alert("非法的跳转页数");
            return;
        }
        $.fn._callback(parseInt(nextPage),$.fn._objPage);
    }

});
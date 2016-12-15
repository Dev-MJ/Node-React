(function($){
    $.fn.changeColor = function(){
        this.each(function(){       //this : jQuery 객체. 셀렉터 전체 적용하기 위해 each 사용
            var $dom = $(this);     //this : 각 dom
            $dom.click(function(){
                $dom.css("color","red");
            });
        });
    };
})(jQuery);

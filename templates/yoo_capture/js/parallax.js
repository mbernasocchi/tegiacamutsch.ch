/* Copyright (C) YOOtheme GmbH, YOOtheme Proprietary Use License (http://www.yootheme.com/license) */

(function($){

    $.fn.parallax = function(options){

        options = $.extend({}, {
            ratio: 8,
            maxdiff: false,
            start: 0,
            mode: "inview",
            childanimation: true,
            childdir: 1,
            childratio: 3,
            childopacity: true,
            sizeratio: 0.38,
            mintriggerwidth: false
        }, options);

        return this.each(function(){
            var ele      = $(this).css("overflow", "hidden"),
                o        = $.extend({}, options, ele.data()),
                child    = ele.children().length ? ele.children().eq(0) : ele.children(),
                winwidth = $(window).width(),
                istouch  = (String(window["orientation"]) !== "undefined"),
                height;


            $(window).on("scroll", (function(){
                
                var fn = function() {

                    if(istouch) return;

                    if(o.mintriggerwidth && winwidth < parseInt(o.mintriggerwidth, 10)) {
                        ele.css("background-position", "");
                        if(o.childanimation && child.length) child.css({"transform": "", "opacity": ""});
                        return;
                    }

                    var scrolltop = $(window).scrollTop(),
                        offsettop = ele.offset().top,
                        winheight = $(window).height(),
                        run       = false,
                        diff;

                    switch(o.mode) {
                        case "dock":

                            run   = offsettop < scrolltop;
                            diff  = o.maxdiff && (scrolltop-offsettop)>o.maxdiff ? o.maxdiff:scrolltop-offsettop;

                            break;
                            
                        case "inview":
                        default:

                            run   = winheight + scrolltop>=offsettop;
                            diff  = o.maxdiff && Math.abs(scrolltop-offsettop)>o.maxdiff ? o.maxdiff:scrolltop-offsettop;
                    }

                    if(run){

                        var ratio = diff/o.ratio;

                        ele.css({
                            "background-position": "50% "+(o.start + ratio)+"px"
                        });

                        if(o.childanimation && child.length) {
                            
                            if((o.mode=='dock' && offsettop < scrolltop)){

                                diff  = o.maxdiff && (scrolltop-offsettop)>o.maxdiff ? o.maxdiff:scrolltop-offsettop;

                                ratio = diff/o.childratio; 

                                child.css({
                                    "transform": "translateY("+(Math.abs(ratio) * (o.childdir))+"px)",
                                    "opacity": o.childopacity ? 1 - Math.abs(diff/height) : 1
                                });

                            }else if(o.mode=='inview') {
                                
                                var childoffset = child.offset().top;

                                if(winheight + scrolltop>=childoffset) {  // child is in view

                                    diff  = o.maxdiff && (scrolltop-childoffset)>o.maxdiff ? o.maxdiff:scrolltop-childoffset;

                                    ratio = diff/o.childratio;

                                    child.css({
                                        "transform": "translateY("+(Math.abs(ratio) * (o.childdir))+"px)",
                                        "opacity": o.childopacity ? 1 - Math.abs(diff/height) : 1
                                    });
                                }

                            } else {
                                child.css({ "transform": "",  "opacity": "" });
                            }
                        }
                    }else{
                        
                        ele.css("background-position", "100% "+o.start+"px");
                        if(o.childanimation && child.length) child.css("transform", "").css("opacity", "");
                    }
                };

                fn();

                $(window).on("load", fn);

                return fn;

            })()).on("resize orientationchange", (function(){
            
                var fn = function(){
                    
                    winwidth = $(window).width();

                    if(o.sizeratio && o.sizeratio!=="false" && o.sizeratio!=="0") {
                        height = ele.width() * o.sizeratio;
                        ele.css("height", height);
                    }

                    if(child.length){

                        height = ele.height();
                        child  = ele.children().length ? ele.children().eq(0) : ele.children();
                        
                    }
                };

                fn();

                return fn;
            })());

        });
    };

})(jQuery)




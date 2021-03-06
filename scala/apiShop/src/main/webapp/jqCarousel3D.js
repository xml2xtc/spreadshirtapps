$.fn.carousel3D = function(options) {
    
    var parentContainer = this;
    var settings = $.extend({
        autorotate: true,
        autorotatespeed: 3000,
        stop: false,
        direction : true,
        speed: 350,
        perspectiveZoom : 80,
        sideOffset: 70,
        topOffset:0,
        emClass: "tdc-element",
        secondaryOpacity:0.8,
        states : []
    }, options);

    var selected = null;

    var emClass = settings.emClass;
    var initSpeed = settings.speed;
    var elements = this.find("."+emClass);
    var mutex = false;
    this.find("."+emClass).css("position","absolute");
    this.find("."+emClass).css("overflow","hidden");
    $(this).css("position","relative");
    var lastEm = elements.length - 1;

    var initW = $(elements[1]).width();
    var initH = $(elements[1]).height();
    var initWS = initW * settings.perspectiveZoom/100;
    var initHS = initH * settings.perspectiveZoom/100;


    settings.states = [
        {height:initHS, width:initWS, top:(initH-initHS)/2+settings.topOffset, left:0, opacity:settings.secondaryOpacity},
        {height:initH, width:initW, top:0, left:settings.sideOffset, opacity:100},
        {height:initHS,width:initWS, top:(initH-initHS)/2+settings.topOffset, left:2*settings.sideOffset+initW - initWS, opacity:settings.secondaryOpacity}
    ];

    for(var j=3;j<=lastEm;j++){
        settings.states[j] = {height:0, width:0, top:(initH)/2, left:settings.sideOffset+initW/2, opacity:0};
    }

    function transit(direction) {
        if (elements[1] === selected) {
            settings.stop = true;
        }
        if (settings.stop) return;
        mutex = true;

        $(elements).each(function(i){
            $(elements[i]).animate(settings.states[direction ? (i == 0 ? lastEm : i - 1) : (i == lastEm ? 0 : i + 1)], settings.speed, 'swing', function(){
                if (i==lastEm){
                    var prevState = elements;
                    elements = [];
                    elements[0] = prevState[direction ? 1 : lastEm];
                    elements[lastEm] = prevState[direction ? 0 : lastEm-1];
                    for(var j=1;j<lastEm;j++)
                        elements[j] = prevState[direction ? j+1 : j-1];
    
                    $(elements).each(function(){
                       $(elements[1]).css({zIndex: 200});
                       $(elements[2]).css({zIndex: 100});
                       $(elements[0]).css({zIndex: 100});
                       for(var j = 3; j<=lastEm;j++)
                           $(elements[j]).css({zIndex: 1});
                    });
                    mutex = false;
                }
            });
        });

        if ((direction && elements[2] === selected) || (!direction && elements[0] === selected)) {
            settings.stop = true;
        }
    
        setTimeout(function(){
            $(elements[0]).css({zIndex: direction ? 100 : 200});
            $(elements[1]).css({zIndex: 100});
            $(elements[2]).css({zIndex: direction ? 200 : 100});
            for (var j = 3; j<=lastEm;j++)
                $(elements[j]).css({zIndex: 1});
        }, settings.speed / 2);

    }

    if(settings.autorotate) {
        setInterval(function(){
            if(mutex) {
                return;
            }
            if (!settings.stop) {
                transit(settings.direction);
            }
        }, settings.autorotatespeed);

   }


    $(elements).each(function(){
        $(this).mouseover(function(e){
            settings.speed = initSpeed;
            if(this === elements[0] || (this === elements[1] && settings.direction && mutex) || (this === elements[lastEm] && !settings.direction && mutex)) {
                settings.direction = false;
            }
            else if(this === elements[2] || (this === elements[1] && !settings.direction && mutex)) {
                settings.direction = true;
            }
    });

    $(this).mouseout(function(e){
            settings.speed = initSpeed
    });
        
    var func = $(this).click;
        $(this).click(function(e){
            if (selected !== this) {
                selected = this;
            } else {
                if (settings.stop && !mutex) {
                    selected = null
                }
            }
            settings.stop = false;
            settings.speed = initSpeed
            func(e)
        });
    });

    $(elements).each(function(i){
        $(elements[i]).animate(settings.states[i], settings.speed, 'swing')
        $(elements[1]).css({zIndex: 200});
        $(elements[2]).css({zIndex: 100}); $(elements[0]).css({zIndex:100});
        for (var j = 3; j<=lastEm;j++)
            $(elements[lastEm]).css({zIndex: 1});
    });

    return this;
};
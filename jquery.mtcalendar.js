/**
 * Created by Administrator on 2017/7/4.
 */


(function(win, $){
    "use strict";

    var _DEFAULTS = {
        date: (new Date()).getFullYear() + "-" + pad((new Date()).getMonth() + 1, 2) + "-" + pad((new Date()).getDate(), 2),
        onDaySelected: null,
        onMonthChanged: null,
        onCreated: null,
        selectable: true
    };

    var Plugin = function(el, opts){
        this.$container = $(el);
        this.$prevBtn = null;
        this.$nextBtn = null;
        this.$monthLabel = null;
        this.$cldrPanel = null;
        this.currentYear = 0;
        this.currentMonth = 0;
        this.currentDay = 0;
        this.options = {};

        init.call(this, opts);
    };

    function init(opts){
        $.extend(this.options, _DEFAULTS, opts);
        var tempdate = new Date(this.options.date);
        this.currentYear = tempdate.getFullYear();
        this.currentMonth = tempdate.getMonth() + 1;
        this.currentDay = tempdate.getDate();

        createCalendar.call(this);
        initCalendar.call(this);
    };

    function createCalendar(){
        var that = this;
        var _template = '<div class="cldr">' +
                        '<div class="cldr-month">' +
                        '<a href="#" class="month-prev">&lt;</a>' +
                        '<span class="month-current"></span>' +
                        '<a href="#" class="month-next">&gt;</a>' +
                        '</div>' +
                        '<div class="cldr-wraper">' +
                        '<ul class="cldr-thead">' +
                        '<li>一</li>' +
                        '<li>二</li>' +
                        '<li>三</li>' +
                        '<li>四</li>' +
                        '<li>五</li>' +
                        '<li>六</li>' +
                        '<li>日</li>' +
                        '</ul>' +
                        '<ul class="cldr-tbody"></ul>' +
                        '</div>' +
                        '</div>';

        this.$container.append(_template);
        this.$prevBtn = this.$container.find(".month-prev");
        this.$nextBtn = this.$container.find(".month-next");
        this.$monthLabel = this.$container.find(".month-current");
        this.$cldrPanel = this.$container.find(".cldr-tbody");

        this.$prevBtn.click(function(){
            prevMonth.call(that);
        });

        this.$nextBtn.click(function(e){
            nextMonth.call(that);
        });

        showCurrentMonth.call(this);

    };

     function initCalendar(){
        var _DayNum = new Date( this.currentYear, this.currentMonth, 0).getDate();
        var _lastMonthDayNum = new Date( this.currentYear, this.currentMonth - 1, 0).getDate();
        var _firstDayWeekNum = new Date( this.currentYear, this.currentMonth - 1, 1).getDay();
        var _lastDayWeekNum  = new Date( this.currentYear, this.currentMonth, 0).getDay();
        var _restNum = ((_firstDayWeekNum-1) + _DayNum) % 7 == 0 ? 0 : 7 - ((_firstDayWeekNum-1) + _DayNum) % 7;

        if(_firstDayWeekNum == 0) {
            _firstDayWeekNum = 7;
        }

        if(_lastDayWeekNum == 0) {
            _lastDayWeekNum = 7;
        }

        //创建日历表格
        for(var i = 1; i < _firstDayWeekNum; i++){
            this.$cldrPanel.append("<li class='disabled'><span class='day'>" + (_lastMonthDayNum - (_firstDayWeekNum - 1 - i)) + "</span></li>");
        }

        for(var i = 0; i < _DayNum; i++){
            if(this.options.selectable){
                this.$cldrPanel.append("<li date='" + pad((i+1), 2) + "'><span class='day'>" + (i+1) + "</span></li>");
            }else{
                this.$cldrPanel.append("<li class='disabled' date='" + pad((i+1), 2) + "'><span class='day'>" + (i+1) + "</span></li>");
            }
        }

        for(var i = 0; i < _restNum ; i++){
            this.$cldrPanel.append("<li class='disabled'><span class='day'>" + (i+1) + "</span></li>");
        }

        //初始化日历表格内部事件
        bindEvent.call(this);

        //分发创建完成事件
        this.$container.trigger("mt.cldr.created", [this.currentYear, this.currentMonth]);


        var tempdate = new Date(this.options.date);
        if(this.currentYear == tempdate.getFullYear() && this.currentMonth == tempdate.getMonth() + 1){
            this.$cldrPanel.find("li[date='" + pad(tempdate.getDate(), 2) + "']").trigger("click");
        }
    };

    function bindEvent(){
        var that = this;
        var selectedCbk = this.options.onDaySelected;
        var changedCbk = this.options.onMonthChanged;
        var createdCbk = this.options.onCreated;

        this.$cldrPanel.on("click", 'li[date]', function(){
            if($(this).hasClass("selected") || $(this).hasClass("disabled")) return;

            that.$cldrPanel.find("li").removeClass("selected");
            $(this).addClass("selected");
            that.currentDay = parseInt($(this).attr("date"));

            that.$container.trigger("mt.cldr.dayselected", [that.currentYear, that.currentMonth, that.currentDay]);
        });

        this.$container.on("mt.cldr.created", function(e, y, m){
            createdCbk && createdCbk.call(that, y, m);
        });

        this.$container.on("mt.cldr.dayselected", function(e, y, m, d){
            selectedCbk && selectedCbk.call(that, y, m, d);
        });

        this.$container.on("mt.cldr.monthchanged", function(e, y, m){
            changedCbk && changedCbk.call(that, y, m);
        });
    };

    function clearCalendar(){
        this.$cldrPanel.children().remove();
        this.$container.off("click");
        this.$container.off("mt.cldr.dayselected");
        this.$container.off("mt.cldr.monthchanged");
        this.$container.off("mt.cldr.created");
    };


    function prevMonth()
    {
        var _prev = new Date(this.currentYear, this.currentMonth - 1, 0);
        this.currentMonth = _prev.getMonth() + 1;
        this.currentYear = _prev.getFullYear();
        showCurrentMonth.call(this);
        clearCalendar.call(this);
        initCalendar.call(this);

        this.$container.trigger("mt.cldr.monthchanged", [this.currentYear, this.currentMonth]);
    };

    function nextMonth()
    {
        var _next = new Date(this.currentYear, this.currentMonth, 1);
        this.currentMonth = _next.getMonth() + 1;
        this.currentYear = _next.getFullYear();
        showCurrentMonth.call(this);
        clearCalendar.call(this);
        initCalendar.call(this);

        this.$container.trigger("mt.cldr.monthchanged", [this.currentYear, this.currentMonth]);
    };

    function showCurrentMonth(){
        this.$monthLabel.text(this.currentYear+ "年" + pad(this.currentMonth, 2) + "月");
    };

    //数字补0
    function pad(num, n) {
        var len = num.toString().length;
        while(len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    }

    Plugin.prototype.selectDay = function(day){
        this.$cldrPanel.find("li[date='" + pad(day, 2) + "']").trigger("click");
    };

    Plugin.prototype.getCurrentYear = function(){
        return this.currentYear;
    };

    Plugin.prototype.getCurrentMonth = function(){
        return this.currentMonth;
    };

    Plugin.prototype.getCurrentDay = function(){
        return this.currentDay;
    };

    Plugin.prototype.getCurrentDate = function(){
        return this.currentYear + "-" + pad(this.currentMonth, 2) + "-" + pad(this.currentDay, 2);
    };

    $.fn.mtcalendar = function(options){
        return this.each(function(){
            var data    = $(this).data('mt.calendar');
            if(!data) {
                $(this).data("mt.calendar", new Plugin(this, options));
            }
        });
    };

})(window, jQuery);



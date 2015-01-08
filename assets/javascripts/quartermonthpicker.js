!function ($) {

    var QuarterMonthPicker = function (element, options, cb) {
        var hasOptions = typeof options == 'object';
        var localeObject;

        //option defaults

        this.startDate = '' //moment().startOf('month');
        this.endDate = '' //moment().endOf('month').startOf('day');
        this.year = moment().year();

        this.format = 'DD.MM.YYYY';
        this.separator = ' \u2014 '; // &mdash;
        this.selectCount = 2;
        this.hideDelay = 200;
        this.closeAfter2Click = false;
        this.yearsBeforeAfter = 1;


        if (typeof RMPlus.Utils.locale != 'undefined') {
            this.locale = RMPlus.Utils.locale;
        } else {
            this.locale = {
                clearButton: 'Очистить',
                closeButton: 'Закрыть',
                // monthNames: moment()._lang._monthsShort.slice(),
                monthNames: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
                quarterNames: ['I кв.','II кв.','III кв.','IV кв.']
            };
        }
        this.cb = function () { };

        // by default, the daterangepicker element is placed at the bottom of HTML body
        this.parentEl = document.body;
        this.container = $('<div class="qmpicker"></div>').appendTo(this.parentEl);

        //element that triggered the date range picker
        this.element = $(element);

        if (this.element.is('input')) {
            this.element.on({
                click: $.proxy(this.show, this)
            });
        } else {
            this.element.on('click', $.proxy(this.show, this));
        }

        localeObject = this.locale;

        if (hasOptions) {
            if (typeof options.format == 'string')
                this.format = options.format;

            if (typeof options.separator == 'string')
                this.separator = options.separator;

            if (typeof options.startDate == 'string' && options.startDate != '')
                this.startDate = moment(options.startDate);
                // this.startDate = moment(options.startDate, this.format);

            if (typeof options.endDate == 'string' && options.endDate != '')
                this.endDate = moment(options.endDate);
                // this.endDate = moment(options.endDate, this.format);

            if (typeof options.yearsBeforeAfter == 'integer')
                this.yearsBeforeAfter = options.yearsBeforeAfter;

            if (typeof options.locale == 'object') {
                $.each(localeObject, function (property, value) {
                    localeObject[property] = options.locale[property] || value;
                });
            }
        }

        // assign callback
        if (typeof cb == 'function')
            this.cb = cb;

        //try parse date if in text input
        // if (!hasOptions || (typeof options.startDate == 'undefined' && typeof options.endDate == 'undefined')) {
        //     if ($(this.element).is('input[type=text]')) {
        //         var val = $(this.element).val();
        //         var split = val.split(this.separator);
        //         var start, end;
        //         if (split.length == 2) {
        //             start = moment(split[0], this.format);
        //             end = moment(split[1], this.format);
        //         }
        //         if (start != null && end != null) {
        //             this.startDate = start;
        //             this.endDate = end;
        //         }
        //     }
        // }

        //event listeners
        this.container.on('mousedown', $.proxy(this.mousedown, this));

        this.container
            .on('click', '.prev-year', $.proxy(this.clickPrevYear, this))
            .on('click', '.next-year', $.proxy(this.clickNextYear, this))
            .on('click', '.qmp-daterange', $.proxy(this.clickDateRange, this))
            .on('click', '.qmp-clear', $.proxy(this.clearRange, this))
            .on('click', '.qmp-close', $.proxy(this.hide, this));

        this.element.prop('readonly', 'readonly');
        this.updateView();

    };

    QuarterMonthPicker.prototype = {

        constructor: QuarterMonthPicker,

        mousedown: function (e) {
            e.stopPropagation();
        },

        updateView: function () {
            this.container.html(this.renderCalendar(this.year));
            this.updateInputText();
            this.updateSelection();
        },

        updateSelection: function () {
            var date_start = moment(this.startDate).format('YYYY-MM-DD');
            var date_end = moment(this.endDate).format('YYYY-MM-DD');
            $(this.container).find('.qmp-daterange').each(function(index){
                if ( $(this).attr('data-start-date') >= date_start && $(this).attr('data-end-date') <= date_end ) {
                    $(this).addClass('qmp-selected');

                    if ($(this).hasClass('qmp-month') && ($(this).attr('data-start-date') == date_start || $(this).attr('data-end-date') == date_end) )
                        $(this).addClass('qmp-range-edge');
                    else
                        $(this).removeClass('qmp-range-edge');
                }
                else
                    $(this).removeClass('qmp-selected qmp-range-edge');
            });
        },

        clearSelection: function () {
            $(this.container).find('.qmp-daterange').removeClass('qmp-selected qmp-range-edge');
        },

        notify: function () {
            this.cb(this.startDate, this.endDate);
            // this.cb(moment(this.startDate).format(this.format), moment(this.endDate).format(this.format));
        },

        move: function () {
            var padding = { top: 2, left: 0 };
            this.container.css({
                top: this.element.offset().top + this.element.outerHeight() + padding.top,
                left: this.element.offset().left,
                right: 'auto'
            });
            if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
                this.container.css({
                    left: 'auto',
                    right: 0
                });
            }
        },

        show: function (e) {
            console.log('click!!!!')
            this.container.show();
            this.move();

            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }

            $(document).on('mousedown', $.proxy(this.hide, this));
            this.element.trigger('shown', {target: e.target, picker: this});
        },

        hide: function (e) {
            this.selectCount = 2;
            this.container.hide();

            $(document).off('mousedown', this.hide);
            this.element.trigger('hidden', { picker: this });
            this.notify();
        },

        updateInputText: function () {
            if (this.element.is('input') && this.startDate != '' && this.endDate != '')
                this.element.val(this.startDate.format(this.format) + this.separator + this.endDate.format(this.format));
            else
                this.clearRange
        },

        clearRange: function () {
            this.startDate = '';
            this.endDate = '';
            this.clearSelection();
            if (this.element.is('input'))
                this.element.val('');
        },

        clickDateRange: function (e) {
            var el = $(e.target);
            if (el.is('span'))
                el = el.parent();
            if (!el.is('div.qmp-daterange'))
                return false;

            // get clicked dates
            // set new startDate and endDate
            var newStart = moment(el.attr('data-start-date'));
            var newEnd = moment(el.attr('data-end-date'));

            // EXPAND ALGORYTHM
            // if( newStart > this.startDate && newEnd < this.endDate) {
            //    // new selection begans
            //    this.startDate = newStart;
            //    this.endDate = newEnd;
            // } else if( newStart > this.endDate) {
            //    // extend selection at the end
            //    this.endDate = newEnd;
            // } else if( newEnd < this.startDate) {
            //    // extend selection at the beginig
            //    this.startDate = newStart;
            // } else if( newEnd == this.endDate) {
            //    // shrink selection at the end
            //    this.endDate = moment(newStart).subtract('day',1);
            // } else if( newStart == this.startDate) {
            //    // shrink selection at the begining
            //    this.startDate = moment(newEnd).add('day',1);
            // } else {
            //    // new selection begans
            //    this.startDate = newStart;
            //    this.endDate = newEnd;
            // }

            // DOUBLE SELECT ALGORYTHM
            if (this.selectCount > 1 || (newStart >= this.startDate && newEnd < this.endDate) || (newStart > this.startDate && newEnd <= this.endDate)) {
                this.selectCount = 1;
                this.startDate = newStart;
                this.endDate = newEnd;
            } else {
                this.selectCount++;
                if( newStart > this.endDate) {
                    // extend selection at the end
                    this.endDate = newEnd;
                } else if( newEnd < this.startDate) {
                    // extend selection at the beginig
                    this.startDate = newStart;
                } else {
                    this.startDate = newStart;
                    this.endDate = newEnd;
                }
            }

            this.updateInputText();
            this.updateSelection();
            if (this.selectCount > 1 && this.closeAfter2Click){
                setTimeout($.proxy(this.hide, this), this.hideDelay);
            }
        },

        clickPrevYear: function (e) {
            this.year--;
            this.updateView();
            if(e){
                e.stopPropagation();
            }
        },

        clickNextYear: function (e) {
            this.year++;
            this.updateView();
            if(e){
                e.stopPropagation();
            }
        },

        renderQuarter: function (year, quarter) {
            var firstDay = moment([year, 0, 1]).add('month', (quarter-1)*3);

            var html = '<table class="qmp-quarter">'+
                         '<tr>'+
                           '<td rowspan="3" class="qmp-quarter-cell">'+
                            '<div class="qmp-quarter-label qmp-daterange" data-start-date="'+firstDay.format('YYYY-MM-DD')+'" data-end-date="'+moment(firstDay).add('month', 2).endOf('month').format('YYYY-MM-DD')+'">'+
                              '<span>'+this.locale.quarterNames[firstDay.quarter()-1]+'</span>'+
                            '</div>'+
                           '</td>'+
                           '<td class="qmp-first-mon">'+
                             '<div class="qmp-month qmp-daterange" data-start-date="'+firstDay.format('YYYY-MM-DD')+'" data-end-date="'+moment(firstDay).endOf('month').format('YYYY-MM-DD')+'">'+
                               '<span>'+this.locale.monthNames[firstDay.month()]+'</span>'+
                             '</div>'+
                           '</td>'+
                         '</tr>';
            firstDay.add(1,'month');
            html += '<tr>'+
                      '<td class="qmp-mid-mon">'+
                        '<div class="qmp-month qmp-daterange" data-start-date="'+firstDay.format('YYYY-MM-DD')+'" data-end-date="'+moment(firstDay).endOf('month').format('YYYY-MM-DD')+'">'+
                          '<span>'+this.locale.monthNames[firstDay.month()]+'</span>'+
                        '</div>'+
                      '</td>'+
                    '</tr>';
            firstDay.add(1,'month');
            html += '<tr>'+
                      '<td class="qmp-last-mon">'+
                        '<div class="qmp-month qmp-daterange" data-start-date="'+firstDay.format('YYYY-MM-DD')+'" data-end-date="'+moment(firstDay).endOf('month').format('YYYY-MM-DD')+'">'+
                          '<span>'+this.locale.monthNames[firstDay.month()]+'</span>'+
                        '</div>'+
                      '</td>'+
                    '</tr>';
            html += '</table>';

            return html;
        },

        renderYear: function (year, pos) {
            var year_scroll_html = '';
            if(pos == 'last') {
                year_scroll_html = '<div class="next-year"><span>&rarr;</span></div>'
            } else if (pos == 'first') {
                year_scroll_html = '<div class="prev-year"><span>&larr;</span></div>'
            }
            var html = '<div class="qmp-year">'+
                        '<div class="qmp-year-head">'+
                          year_scroll_html+
                         '<div class="qmp-year-label qmp-daterange" data-start-date="'+moment([year,0,1]).format('YYYY-MM-DD')+'" data-end-date="'+moment([year,11,1]).endOf('month').format('YYYY-MM-DD')+'">'+
                           '<span>'+year.toString()+'</span>'+
                         '</div>'+
                        '</div>'
            for(var i=1; i<=4; i++)
                html += this.renderQuarter(year, i);

            html += '</div>';
            return html;
        },

        renderCalendar: function (year) {
            var html = '<div class="qmp-calendar">';
            for(var i=-this.yearsBeforeAfter; i<=this.yearsBeforeAfter; i++) {
                var pos = (i == this.yearsBeforeAfter) ? 'last' : ''
                pos = (i == -this.yearsBeforeAfter) ? 'first' : pos
                html += this.renderYear(year+i,pos);
            }
            html += '<div class="qmp-bottom">'+
                       '<input class="R qmp-close" type=button value="'+this.locale.closeButton+'" />'+
                       '<input class="R qmp-clear" type=button value="'+this.locale.clearButton+'" />'+
                    '</div>';
            html += '</div>';
            return html;
        }

    };

    $.fn.qmpicker = function (options, cb) {
        this.each(function () {
            var el = $(this);
            if (!el.data('qmpicker'))
                el.data('qmpicker', new QuarterMonthPicker(el, options, cb));
        });
        return this;
    };

}(window.jQuery);
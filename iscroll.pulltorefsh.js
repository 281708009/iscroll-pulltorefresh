/**
 * Created by yzh on 3/23/16.
 *
 * Usage:
 *
 * Create IScrollPullToRefresh instance with new.
 * Pass the do refresh function to `refresh_handler`,
 * after refresh complete, remember call `IScrollPullToRefresh.notifyRefreshDone`.
 * `scrollComponentJQObj` is the component to be scrolled, a **JQuery object**.
 *
 * JQuery and iscroll is required to use this script.
 *
 * options's keys:
 *      top
 *      bottom
 *      pullText
 *      releaseText
 *      refreshingText
 */

var IScrollPullToRefresh = function(scrollComponentJQObj, refreshHandler_, options_){
    const kRefreshIndicatorStatusIdle = "idle";
    const kRefreshIndicatorStatusActive = "active";
    const kRefreshIndicatorStatusRefreshing = "refreshing";

    var refreshHandler = refreshHandler_;
    var options = options_;

    var isRefreshing = false;
    var hasTriggeredPull = false;

    var scrollWrapper = null;
    var scrollContainer = null;
    var refreshIndicator = null;
    var refreshIndicatorHeight = 100; // the value must match with the height defined in CSS

    var pullText = "Pull to refresh";
    var releaseText = "Release to refresh";
    var refreshingText = "Refreshing ...."

    var me = this;

    me.theIScroll = null;

    var init = function(){
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

        if(options){
            var optionTop = parseInt(options["top"]);
            if(! isNaN(optionTop)){
                scrollWrapper.css("top", optionTop + "px");
            }
            var optionBottom = parseInt(options["bottom"]);
            if(! isNaN(optionTop)){
                scrollWrapper.css("bottom", optionBottom + "px");
            }
            if(options["pullText"]){
                pullText = options["pullText"];
            }
            if(options["releaseText"]){
                releaseText = options["releaseText"];
            }
            if(options["refreshingText"]){
                refreshingText = options["refreshingText"];
            }
        }

        isRefreshing = false;
        hasTriggeredPull = false;

        scrollWrapper = $('<div class="scrollWrapper"></div>');
        scrollContainer = $('<div class="scrollContainer"></div>');
        scrollWrapper.append(scrollContainer);
        scrollComponentJQObj.parent().prepend(scrollWrapper);
        scrollContainer.append(scrollComponentJQObj);

        refreshIndicator = $('<div class="pullIndicator"></div>')
        setRefreshIndicatorStatus(kRefreshIndicatorStatusIdle, false);
        scrollContainer.prepend(refreshIndicator);

        var iscrollOptions = {
            mouseWheel: true,
            scrollbars: true,
            fadeScrollbars: true,
            probeType: 3
        };

        me.theIScroll = new IScroll(scrollWrapper[0], iscrollOptions);

        me.theIScroll.on("scrollStart", function(){
            if(! isRefreshing){
                this.hasVerticalScroll = true;
                hasTriggeredPull = false;
            }
        });

        me.theIScroll.on("scroll", function(){
            if(! isRefreshing) {
                if (this.y > refreshIndicatorHeight) {
                    if (! hasTriggeredPull) {
                        hasTriggeredPull = true;
                        setRefreshIndicatorStatus(kRefreshIndicatorStatusActive, false);
                        this.scrollBy(0, -refreshIndicatorHeight, 0);
                    }
                } else if (this.y < 0) {
                    if (hasTriggeredPull) {
                        hasTriggeredPull = false;
                        setRefreshIndicatorStatus(kRefreshIndicatorStatusIdle, false);
                        this.scrollBy(0, refreshIndicatorHeight, 0);
                    }
                }
            }
        });

        me.theIScroll.on("scrollEnd", function(){
            if(! isRefreshing) {
                if (hasTriggeredPull) {
                    triggerRefresh();
                }
            }
        });
    }

    function setRefreshIndicatorStatus(st, animated){
        var mtVal = 0;
        if(st == kRefreshIndicatorStatusIdle){
            refreshIndicator.html(pullText);
            mtVal = -refreshIndicatorHeight;
        }else if(st == kRefreshIndicatorStatusActive){
            refreshIndicator.html(releaseText);
            mtVal = 0;
        }else if(st == kRefreshIndicatorStatusRefreshing){
            refreshIndicator.html(refreshingText);
            mtVal = 0;
        }

        if(animated){
            refreshIndicator.animate({
                marginTop: mtVal
            }, 250);
        }else{
            refreshIndicator.css("margin-top", mtVal + "px");
        }
    }

    function triggerRefresh(){
        isRefreshing = true;
        setRefreshIndicatorStatus(kRefreshIndicatorStatusRefreshing, false);
        refreshHandler();
    }

    me.notifyRefreshDone = function(){
        isRefreshing = false;
        setRefreshIndicatorStatus(kRefreshIndicatorStatusIdle, true);
    }

    me.refreshIScroll = function(){
        me.theIScroll.refresh();
    }

    me.updateScrollContainerHeight = function(){
        var hScreen = scrollWrapper.height();
        var hContainer = scrollContainer.height();
        if(hContainer <= hScreen){
            scrollContainer.css("height", "100%");
        }
    }

    $(document).ready(function(){
        init();
        setTimeout(function(){
            me.updateScrollContainerHeight();
        }, 10);
    });

};

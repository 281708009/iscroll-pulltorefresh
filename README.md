# pull-to-refresh based on iscroll 5

As simple as:

	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="iscroll.js"></script>
	<script type="text/javascript" src="iscroll-probe.js"></script>
	<script type="text/javascript" src="iscroll.pulltorefsh.js"></script>
	<script type="text/javascript">
	
	    $(document).ready(function(){
	        var obj = null;
	
	        var onRefresh = function() {
	            alert("bingo!");
	
	            setTimeout(function(){
	                obj.notifyRefreshDone();
	            }, 618)
	        };
	
	        obj = new IScrollPullToRefresh($("#toscroll"), onRefresh, {});
	    });
	
	</script>

![image](https://raw.githubusercontent.com/albert-zhang/iscroll-pulltorefresh/master/screenshot.jpg)

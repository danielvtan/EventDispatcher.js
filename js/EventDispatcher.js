function EventDispatcher() {
	var thisClass = this;
	this.isIE = (navigator.appName == 'Microsoft Internet Explorer') ? true: false;
	this.defaultTarget = window;
	this.listeners = {};
	this.liveListener = [];
	this.mouse = function(e){
		var mouse = new Object();
		
		if(e){
			if(e.custom){
				mouse.x = e.x;
				mouse.y = e.y;
				return mouse;
			}else if (e.changedTouches) { 	// iPhone
				mouse.x = e.changedTouches[0].clientX;
				mouse.y = e.changedTouches[0].clientY;
				//e.preventDefault();
				return mouse;
			}else if (e.clientX) { 	// all others
				mouse.x = e.clientX;
				mouse.y = e.clientY;
				//e.preventDefault();
				return mouse;
			}
		}
		if (!thisClass.isIE) {
			mouse.x = e.pageX;
			mouse.y = e.pageY;
			//e.preventDefault();
		}else{
			mouse.x = event.x;
			mouse.y = event.y;
			//event.returnValue = false;
		}
		return mouse;
	}
	this.addLiveListener = function(id, func) {
        var eventInterval;
        var live = {id:id, func:func eventInterval:eventInterval };
		thisClass.liveListener.push(live);
		if(thisClass.liveListener.length > 0)
			eventInterval = setInterval(function(){ checkLive() }, 50);
        return live;
	}
	function checkLive() {
		for(var i = 0; i < thisClass.liveListener.length; ++i) {
			var live = thisClass.liveListener[i];
			if(document.getElementById(live.id)) {
				live.func();
				thisClass.removeLiveListener(live);
			}
		}
	}
	this.removeLiveListener = function(live) {
        var eventInterval = live.eventInterval;
		var index = thisClass.liveListener.indexOf(live);
		thisClass.liveListener.splice(index, 1);
		if(thisClass.liveListener.length <= 0)
			clearInterval(eventInterval);
	}
	this.keyCode = function(e) {
		return (e != undefined) ? e.keyCode : window.event.keyCode;
	}
	this.dispatchEvent = function(type, e){
		if(thisClass.listeners[type] == undefined)
			return;
		for(var i = 0; i < thisClass.listeners[type].length; ++i) {
			thisClass.listeners[type][i](e);
		}
	}
	this.addListener = function(type, listener, target){
		if(thisClass.listeners[type] == undefined) 
			thisClass.listeners[type] = [];
		thisClass.listeners[type].push(listener);
		
		var t = (target != null) ? target : thisClass.defaultTarget;
		if(t[type] == undefined)
			return;
		t[type] = function(e){
			if(t != thisClass.defaultTarget)
				t.dispatchEvent(type, e);
			else
				thisClass.dispatchEvent(type, e);
		};
	}
	this.removeListener = function(type, listener, target){
		var index = thisClass.listeners[type].indexOf(listener);
		thisClass.listeners[type].splice(index, 1);
    }
	
}
/** Event: NuEvent
	LOAD - triggers when browser is loaded completely
*/
var NuEvent = {
			LOAD:"onload"

			};
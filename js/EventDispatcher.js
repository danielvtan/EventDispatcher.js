/** Class: EventDispatcher
    an extendable event dispatcher class
	
    (start code)
    // to extend add this in inside your class
	YourClass.prototype = EventDispatcher;
	YourClass.prototype.constructor = YourClass;
	EventDispatcher.apply(this, arguments);
    
    // returns an instance of EventDispatcher class
	var eventD = new YourClass();
	// adds an event
	eventD.addEventListener("ON_USER_SCROLL", callBackFunction);
	// dispatches the event to the listeners triggers the callBackFunction
	dispatchEvent("ON_USER_SCROLL", addDataToPass);
	
    (end)
*/
function EventDispatcher() {
    /** this reference */
	var thisClass = this;
    /** check if the browser is IE
		@type {Boolean}
	*/
	this.isIE = (navigator.appName == 'Microsoft Internet Explorer') ? true: false;
    /** set defaultTarget
		@type {dom}	
	*/
	this.defaultTarget;
    /** list of event listeners
		@type {Object}
		@protected
	*/
	this.listeners = {};
    /** list of liveListeners
		@type {Array}
		@protected
	*/
	this.liveListener = [];
    /** use to get cross browser mouse x and y position
		@param {Object} e - event object from mouse events
		@returns Object x and y
	*/
	this.mouse = function(e){
		var mouse = {};
		
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
    /** add a live listener
		@param {String} id - any unique string
		@param {Function} func - callback function
	*/
	this.addLiveListener = function(id, func) {
        var eventInterval;
        var live = {id:id, func:func, eventInterval:eventInterval };
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
    /** remove a live listener
		@param {Object} live - object that was added
	*/
	this.removeLiveListener = function(live) {
        var eventInterval = live.eventInterval;
		var index = thisClass.liveListener.indexOf(live);
		thisClass.liveListener.splice(index, 1);
		if(thisClass.liveListener.length <= 0)
			clearInterval(eventInterval);
	}
    /** use to get crossbrowser keyCode
		@param {Object} e - event object from keyboard events
		@returns keyCode
	*/
	this.keyCode = function(e) {
		return (e != undefined) ? e.keyCode : window.event.keyCode;
	}
    /** use to dispatch events
		@param {String} type - string that was used when adding the event listener
		@param {Object} e - data to pass
		@protected
	*/
	this.dispatchEvent = function(type, e){
		if(thisClass.listeners[type] == undefined)
			return;
		for(var i = 0; i < thisClass.listeners[type].length; ++i) {
			thisClass.listeners[type][i](e);
		}
	}
    /** use to add event listener
		@param {String} type - any unique string
		@param {Function} listener - callback function
		@param {dom} target - dom element
	*/
	this.addListener = function(type, listener, target){
		if(thisClass.listeners[type] == undefined) 
			thisClass.listeners[type] = [];
		thisClass.listeners[type].push(listener);
        
		var t = target ? target : thisClass.defaultTarget;
        
		if(!t || t[type] === undefined)
            return;
        if(t == window)
            console.log("Caution: adding " + type + " event on ->" + window);
		t[type] = function(e){
            thisClass.dispatchEvent(type, e);
		};
	}
    /** use to remove event listener
		@param {String} type - string that was used when adding the event listener
		@param {Function} listener - callback function
		@param {dom} - null
	*/
	this.removeListener = function(type, listener, target){
		var index = thisClass.listeners[type].indexOf(listener);
		thisClass.listeners[type].splice(index, 1);
    }
	
}

#EventDispatcher.js
an extendable event dispatcher class

##How to use
```javascript
// to extend add this in inside your class
YourClass.prototype = EventDispatcher;
YourClass.prototype.constructor = YourClass;
function YourClass() {
    EventDispatcher.apply(this, arguments);
    
    
    // sample event dispatch call
    // reference
    var thisClass = this;
    this.onEvent = function() {
        // dispatches the event to the listeners triggers the callBackFunction
        thisClass.dispatchEvent("ON_CUSTOM_EVENT", addDataToPass);
    }
    
}
// instantiating
// returns an instance of Your class that extends EventDispatcher class
var eventD = new YourClass();
// adds an event
eventD.addListener("ON_CUSTOM_EVENT", callBackFunction);
```

##Methods/Functions
* `addLiveListener(id, onLiveFunc)` - add a live listener on an element returns live object
* `removeLiveListener(liveObject)` - remmoves the live listener
* `dispatchEvent(eventName, additionalDataObject)` - (protected function) dispatches/calls all listener with the specified event name
* `addListener(eventName, callbackFunction)` - listens to a specific event
* `removeListener(eventName, callBackFunction)` - remove the listener




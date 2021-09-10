(function(){

    var widgetContainer = document.createElement('div');
    widgetContainer.id = "calendar-widget";
    // widgetContainer.className = 'messages-widget'
    widgetContainer.innerHTML = '<iframe src="/tasks/calendar/widget" frameborder="0" style="width: 100%; height: 100%; border: 0px;"></iframe>';

    // messages-widget
    
    var body = document.getElementsByTagName('body')[0]; 
    body.appendChild(widgetContainer);

    var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('link');

    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = '/tasks/assets/calendar-widget/widget.css';
   
    body.appendChild(widgetContainer);
    head.appendChild(style);

    window.addEventListener("calendar", receiveMessage, false);

    function receiveMessage(event){
        
        if (!event.data){
            return;
        }
        var message = event.data;
        try {
            message = JSON.parse(event.data);
        } catch (error) {}

        // console.log(message);

        if (message.type === 'action'){
            switch (message.value) {
                case 'expand':
                    expand();
                    break;
                case 'maximize':
                    maximize();
                    break;
                case 'minimize':
                    minimize();
                    break;
            }
        }
    }

    function getContainer(){
        return document.getElementById('calendar-widget');
    }

    /**
     * Normal side right size
     */
    function expand(){
        var widgetContainer = getContainer();
        widgetContainer.className = 'expand';
        if (body.classList){
            body.classList.remove('calendar-widget__overlay--opened');
        }
        remove('calendar-widget__overlay');
    }

    /**
     * Maximize to full 
     */
    function maximize(){
        var widgetContainer = getContainer();
        widgetContainer.className = 'maximize';
        
        var widgetOverlayContainer = document.createElement('div');
        widgetOverlayContainer.id = 'calendar-widget__overlay';
        var body = document.getElementsByTagName('body')[0]; 
        body.className += 'calendar-widget__overlay--opened';
        body.appendChild(widgetOverlayContainer);
    }

     /**
     * Maximize to full 
     */
    function minimize(){
        var widgetContainer = getContainer();
        widgetContainer.className = '';
        if (body.classList){
            body.classList.remove('calendar-widget__overlay--opened');
        }
        remove('calendar-widget__overlay');
    }

    function remove(id) {
        var elem = document.getElementById(id);
        if (elem && elem.parentNode){
            return elem.parentNode.removeChild(elem);
        }
    }


})();

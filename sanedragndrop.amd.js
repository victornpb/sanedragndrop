define('sanedragndrop', [], function() {

    /**
     * This is an attempt to abstract the clumsiness of the drag and drop api.
     * @example https://jsfiddle.net/Victornpb/98poay9w/
     * @author Victor N. wwww.vitim.us https://gist.github.com/victornpb/7a4deabe0c9d23324253533d24a86f37
     * @date   2017-03-10
     *
     * Some usefull links that brought me here to get this working
     * @see https://www.sitepoint.com/html5-native-drag-and-drop-api/
     * @see http://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html
     * @see http://ln.hixie.ch/?start=1115899732&count=1
     * @see https://msdn.microsoft.com/en-us/library/ms537658(VS.85).aspx
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
     * 
     */
    return new function SaneDragNDrop() {

        /**
         * Make an element draggable
         * @param  {Element}            elm                 A element
         * @param  {Object}             options             Object with paramenters
         * @param  {String}             options.operation   Kind of drag operation (copy, move ,link ,copyLink, copyMove, linkMove, all, none, or uninitialized)
         * @param  {String,function}    options.data        String or a function that returns a string
         * @param  {String}             options.dataType    Type of the data carried by the drag operation
         * @param  {function}           [options.onLift]    Event called when the element is lifted
         * @param  {function}           [options.onHolding] Event called continuously when the element is being held
         * @param  {function}           [options.onDrop]    Event called when the element has been dropped anywhere
         * @author Victor N. wwww.vitim.us
         * @date   2017-03-10
         */
        this.makeDraggable = function makeDraggable(elm, options) {
            elm.setAttribute('draggable', true);
            elm.setAttribute('tabindex', 0);

            //picked the element
            elm.ondragstart = function(e) {
                e.dataTransfer.effectAllowed = options.type; //set the draggedObject operation
                e.dataTransfer.setData(options.dataType, typeof options.data === 'function' ? options.data.apply(elm, e, options) : options.data);

                if (options.onLift) options.onLift.apply(elm, [e]);
            };

            //holding the element
            elm.ondrag = function(e) {
                //elm.focus();
                if (options.onHolding) options.onHolding.apply(elm, [e]);
            };

            //released the element (anywhere)
            elm.ondragend = function(e) {
                elm.focus();
                if (options.onDrop) options.onDrop.apply(elm, [e]);
            };
        }




        /**
         * Make an element a droparea
         * @param  {Element}            elm                             A element
         * @param  {Object}             options                         Object with paramenters
         * @param  {String}             options.acceptOperation         Kind of drag operation (none, copy, link or move)
         * @param  {String}             options.acceptDataType          Type of the data carried by the drag operation
         * @param  {function}           [options.onDraggableEntered]    Event called when a draggable enters this droparea
         * @param  {function}           [options.onDraggableLeft]       Event called when a draggable leaves this droparea
         * @param  {function}           [options.onDraggableHovering]   Event called continuously when this a draggable the element is being held above this droparea
         * @param  {function}           [options.onDraggableDropped]    Event called when this droparea receives a draggable the element
         * @author Victor N. wwww.vitim.us
         * @date   2017-03-10
         */
        this.makeDroparea = function makeDroparea(elm, options) {
            elm.setAttribute('tabindex', 0);

            function allowDrop(e) {
                e.preventDefault();
            }

            //something entered the droparea
            elm.ondragenter = function(e) {
                //test the type of the thing above the droparea
                if (e.dataTransfer.types.indexOf(options.acceptDataType) > -1) { //contains the dataType
                    elm.focus();
                    if (options.onDraggableEntered) options.onDraggableEntered.apply(elm, [e]);
                }
            };

            //something left the droparea
            elm.ondragleave = function(e) {
                elm.blur();
                if (options.onDraggableLeft) options.onDraggableLeft.apply(elm, [e]);
            };

            //something is hovering the droparea
            elm.ondragover = function(e) {
                e.dataTransfer.dropEffect = options.acceptOperation;

                //test the type of the thing above the droparea
                if (e.dataTransfer.types.indexOf(options.acceptDataType) > -1) { //contains the dataType
                    elm.focus();
                    if (options.onDraggableHovering) options.onDraggableHovering.apply(elm, [e]);
                    allowDrop(e);
                }
            };

            //something landed on the droparea
            elm.ondrop = function(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = options.acceptOperation;

                var data = e.dataTransfer.getData(options.acceptDataType);
                if (options.onDraggableDropped) options.onDraggableDropped.apply(elm, [elm, data, options, e]);
            };

        }


    };
});

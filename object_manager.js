//Create a map object on the site
ymaps.ready(init);
    function init () {
//Map properties
        var myMap = new ymaps.Map('map', {
            	center: [00,00],
            	zoom: 7,
		behaviors: ['disable.scrollZoom', 'drag'],
		controls: ['searchControl','zoomControl','rulerControl'],},
		{maxZoom:11,minZoom:6});
//Add objects to the map that appear.Set their properties. The blue placemarks.		
    $.getJSON( "data.json", function(data){
	    var obj = ymaps.geoQuery(data)
	    .setOptions('preset', 'islands#darkBlueCircleIcon')
	    .addToMap(myMap)});
//If we don't want the outline was visible, ask the appropriate option
// Describe the options of the geoobject.Fill color, opacity, stroke color, width, style. Add an object to the map.	    
    function onPolygonLoad (json) {
        regionPolygon = new ymaps.Polygon(json.coordinates);
        regionPolygon.options.set({
        fillColor: '#0099FF',
        strokeColor: '#0066CC',
        fillOpacity: 0.3,
        strokeWidth: 2,
        strokeStyle: 'solid'
    });
        myMap.geoObjects.add(regionPolygon);	    
//Add objects to the map that appear on the condition.Set their properties. The red placemarks.
    $.getJSON( "data.json", function(data){
		var objects = ymaps.geoQuery(data)
		.addToMap(myMap)
		var objectsInsidepolygon = objects.searchInside(regionPolygon);
		objectsInsidepolygon.setOptions('preset', 'islands#redIcon');
		objects.remove(objectsInsidepolygon).setOptions('preset', 'islands#darkBlueCircleDotIcon')
        	});
        }	    
//Clustering objects. Disabled by default.	    
        objectManager = new ymaps.ObjectManager({
		clusterize: false,
		gridSize: 512,
		minClusterSize : 5,
            });	    
//Set clustering objects properties. 
        objectManager.objects.options.set({iconLayout: 'default#image', iconImageHref: 'icon_1.png',iconImageOffset: [-12, -50],iconImageSize: [25, 50],hasHint: true});
        objectManager.clusters.options.set('preset', 'islands#invertedDarkBlueClusterIcons');
        myMap.geoObjects.add(objectManager);	    
// Add polygons to the map asynchronously
        $.ajax({
            url: "data.json"
        }).done(function(data) {
            objectManager.add(data);
        });	    
// This item will serve as a container for the list items.
// Depending on whether the list is collapsed or expanded, this container will hide or appear together with their children. API Yandex.maps    
       	ListBoxLayout = ymaps.templateLayoutFactory.createClass(
		"<button id='my-listbox-header' class='btn btn-success dropdown-toggle' data-toggle='dropdown'>" +
		"{{data.title}} <span class='caret'></span>" +
		"</button>" +
		"<ul id='my-listbox'" +
		" class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu'" +
		" style='display: {% if state.expanded %}block{% else %}none{% endif %};'></ul>", {
			build: function() {
				ListBoxLayout.superclass.build.call(this);
				this.childContainerElement = $('#my-listbox').get(0);
				this.events.fire('childcontainerchange', {
					newChildContainerElement: this.childContainerElement,
					oldChildContainerElement: null
					});
		},			
// Override the interface method that returns a reference to the child container.
	getChildContainerElement: function () {
		return this.childContainerElement;
	}, clear: function () {		
// Let's force the control to detach the child elements from the parent before clearing the layout. Yandex.API Recommendation
	this.events.fire('childcontainerchange', {
		newChildContainerElement: null,
		oldChildContainerElement: this.childContainerElement
	});
		this.childContainerElement = null;
		ListBoxLayout.superclass.clear.call(this);
		}
	}),		
// Also create a layout for an individual list item.
	ListBoxItemLayout = ymaps.templateLayoutFactory.createClass(
	"<li id='my-dropbox'><a>{{data.content}}</a></li>"
	),		
// Create drop-down list items and links to objects
            listBoxItems = [
                new ymaps.control.ListBoxItem({
                    data: {
                        content: '***',
                        center: [00, 00],
                        zoom: 9
                    }
                }),
                new ymaps.control.ListBoxItem({
                    data: {
                        content: '***',
                        center: [00, 00],
                        zoom: 9
                    }
                }),
                new ymaps.control.ListBoxItem({
                    data: {
                        content: '***',
                        center: [00, 00],
                        zoom: 9
                    }
                })
            ],	
// Set list properties.		
            listBox = new ymaps.control.ListBox({
                    items: listBoxItems,
                    data: {
                        title: '***'
                    },
                    options: {
                        layout: ListBoxLayout,
                        itemLayout: ListBoxItemLayout
                    }
                });	    
// Builds geometric shapes on the map by coordinates by reference to the object	    
    function regbuild (item) {
        switch(item.data.get('id')){
           case 1:
                $.ajax({
                url: 'region/region1.json',
                dataType: 'json',
                success: onPolygonLoad
            });
            myMap.geoObjects.removeAll();
           break;
           case 2:
                $.ajax({
                url: 'region/region2.json',
                dataType: 'json',
                success: onPolygonLoad
            });
            myMap.geoObjects.removeAll();
           break;
           default:
              alert('!!!');
        }}	    
// Get a link to the object you clicked on.
// List item events prepariruetsya and they can listen to the parent element.	    	    
     listBox.events.add('click', function (e) {
         var item = e.get('target');
         if (item != listBox) {
             myMap.setCenter(
                 item.data.get('center'),
                 item.data.get('zoom'),
                 regbuild(item)
                );
            }
        });	    
// Adds a list to the map
    myMap.controls.add(listBox, {float: 'right'});	
}

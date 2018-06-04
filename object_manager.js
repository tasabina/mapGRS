ymaps.ready(init);

    function init () {
        var myMap = new ymaps.Map('map', {
            center: [00,00],
            zoom: 7,
			behaviors: ['disable.scrollZoom', 'drag'],
			controls: ['searchControl','zoomControl','rulerControl'],},
			{maxZoom:11,minZoom:6});
		
    $.getJSON( "data.json", function(data){
  
	    var obj = ymaps.geoQuery(data)
	    .setOptions('preset', 'islands#darkBlueCircleIcon')
	    .addToMap(myMap)});

    function onPolygonLoad (json) {
        regionPolygon = new ymaps.Polygon(json.coordinates);
        // Если мы не хотим, чтобы контур был виден, зададим соответствующую опцию.
        regionPolygon.options.set({
        // Описываем опции геообъекта.
        // Цвет заливки.
        fillColor: '#0099FF',
        // Цвет обводки.
        strokeColor: '#0066CC',
        // Общая прозрачность (как для заливки, так и для обводки).
        fillOpacity: 0.3,
        // Ширина обводки.
        strokeWidth: 2,
        // Стиль обводки.
        strokeStyle: 'solid'
    });
        // Чтобы корректно осуществлялись геометрические операции
        // над спроецированным многоугольником, его нужно добавить на карту.
        myMap.geoObjects.add(regionPolygon);

    $.getJSON( "data.json", function(data){

        var objects = ymaps.geoQuery(data)
        .addToMap(myMap)
        var objectsInsidepolygon = objects.searchInside(regionPolygon);
            objectsInsidepolygon.setOptions('preset', 'islands#redIcon');
            // Оставшиеся объекты - синими.
            objects.remove(objectsInsidepolygon).setOptions('preset', 'islands#darkBlueCircleDotIcon')

        });

        }
        objectManager = new ymaps.ObjectManager({
                // Чтобы метки начали кластеризоваться, выставляем опцию.
        clusterize: false,
                // ObjectManager принимает те же опции, что и кластеризатор.
        gridSize: 512,
        minClusterSize : 5,
            });

        // Чтобы задать опции одиночным объектам и кластерам,
        // обратимся к дочерним коллекциям ObjectManager.
        objectManager.objects.options.set({iconLayout: 'default#image', iconImageHref: 'icon_1.png',iconImageOffset: [-12, -50],iconImageSize: [25, 50],hasHint: true});
        objectManager.clusters.options.set('preset', 'islands#invertedDarkBlueClusterIcons');
        myMap.geoObjects.add(objectManager);	 */

        $.ajax({
            url: "data.json"
        }).done(function(data) {
            objectManager.add(data);
        });		 */


                ListBoxLayout = ymaps.templateLayoutFactory.createClass(
                "<button id='my-listbox-header' class='btn btn-success dropdown-toggle' data-toggle='dropdown'>" +
                    "{{data.title}} <span class='caret'></span>" +
                "</button>" +
                // Этот элемент будет служить контейнером для элементов списка.
                // В зависимости от того, свернут или развернут список, этот контейнер будет
                // скрываться или показываться вместе с дочерними элементами.
                "<ul id='my-listbox'" +
                    " class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu'" +
                    " style='display: {% if state.expanded %}block{% else %}none{% endif %};'></ul>", {

                build: function() {
                    // Вызываем метод build родительского класса перед выполнением
                    // дополнительных действий.
                    ListBoxLayout.superclass.build.call(this);

                    this.childContainerElement = $('#my-listbox').get(0);
                    // Генерируем специальное событие, оповещающее элемент управления
                    // о смене контейнера дочерних элементов.
                    this.events.fire('childcontainerchange', {
                        newChildContainerElement: this.childContainerElement,
                        oldChildContainerElement: null
                    });
                },

                // Переопределяем интерфейсный метод, возвращающий ссылку на
                // контейнер дочерних элементов.
                getChildContainerElement: function () {
                    return this.childContainerElement;
                },

                clear: function () {
                    // Заставим элемент управления перед очисткой макета
                    // откреплять дочерние элементы от родительского.
                    // Это защитит нас от неожиданных ошибок,
                    // связанных с уничтожением dom-элементов в ранних версиях ie.
                    this.events.fire('childcontainerchange', {
                        newChildContainerElement: null,
                        oldChildContainerElement: this.childContainerElement
                    });
                    this.childContainerElement = null;
                    // Вызываем метод clear родительского класса после выполнения
                    // дополнительных действий.
                    ListBoxLayout.superclass.clear.call(this);
                }
            }),

            // Также создадим макет для отдельного элемента списка.
            ListBoxItemLayout = ymaps.templateLayoutFactory.createClass(
                "<li id='my-dropbox'><a>{{data.content}}</a></li>"
            ),

            // Создадим пункты выпадающего списка
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

            // Теперь создадим список, содержащий 2 пунтка.
            listBox = new ymaps.control.ListBox({
                    items: listBoxItems,
                    data: {
                        title: '***'
                    },
                    options: {
                        // С помощью опций можно задать как макет непосредственно для списка,
                        layout: ListBoxLayout,
                        // так и макет для дочерних элементов списка. Для задания опций дочерних
                        // элементов через родительский элемент необходимо добавлять префикс
                        // 'item' к названиям опций.
                        itemLayout: ListBoxItemLayout
                    }
                });
    function lp (item) {
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
     listBox.events.add('click', function (e) {
         // Получаем ссылку на объект, по которому кликнули.
         // События элементов списка пропагируются
         // и их можно слушать на родительском элементе.
         var item = e.get('target');
         // Клик на заголовке выпадающего списка обрабатывать не надо.
         if (item != listBox) {
             myMap.setCenter(
                 item.data.get('center'),
                 item.data.get('zoom'),
                 lp(item)
                );
            }
        });

    myMap.controls.add(listBox, {float: 'right'});	
}

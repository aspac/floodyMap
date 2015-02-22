//--------------------------------------------------
// Function returning the coordinate
// of the cities, act as the main caller in html
// @param :     idx ...... 
//              type ..... Type of the enquires 
//                         Longitude or Latitude
// @return                
//--------------------------------------------------

function Main() {

   var pos = [];
   var addresses  = getfoodaddress();


   if (addresses == undefined || addresses.length == 0) {
      alert("No address defined!");
      return;
   }

    for (var i = 0; i < addresses.length; i++) {
        
        currAddress = addresses[i];
        var geocoder = new google.maps.Geocoder();
  
        geocoder.geocode({'address':currAddress}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    //debug: 
                    //alert(results[0].geometry.location.lat());
                    //var longitude = results[0].geometry.location.lng();

                    pos.push(results[0].geometry.location);
                    if (pos.length == addresses.length) {
                       displayMarkers(pos);
                    }
                }
            });
    }
        
} 

//--------------------------------------------------
// Function that shows the markers on the map
// @param :     coords ...... array type with 
//                            lon, lat element              
// @return                
//--------------------------------------------------

function displayMarkers(coords) {

  alert("HLLO MARKERS");
  
    var zoom=11;

    var grapHeight = 25
    var graphWidth = 21
    var graphXoffset = -12
    var graphYoffset = -12
    var restaurant_num = coords.length;

    map = new OpenLayers.Map("mapdiv");
    map.addLayer(new OpenLayers.Layer.OSM());
    
    epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)
   

    //set center of the map
    SbyLatitude= -7.2491700  
    SbyLongitude=  112.7508300

    //-7.614529

    var centerlonlat = new OpenLayers.LonLat(SbyLongitude, SbyLatitude).transform(epsg4326, projectTo);
    map.setCenter (centerlonlat, zoom);

    var vectorLayer = new OpenLayers.Layer.Vector("Overlay");

    for (var i = 0; i < restaurant_num; i++) {

      var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(coords[i].lng(), coords[i].lat() ).transform(epsg4326, projectTo),
            {description:'elementdisplay'} ,
            {externalGraphic: 'img/marker.png', graphicHeight: grapHeight, graphicWidth: graphWidth, graphicXOffset: graphXoffset, graphicYOffset: graphYoffset  }
        );    

    vectorLayer.addFeatures(feature);
  }
       
    map.addLayer(vectorLayer);

    
    /*---------------------------------
    // Selector block
    *----------------------------------*/

    var controls = {
      selector: new OpenLayers.Control.SelectFeature(vectorLayer, { onSelect: createPopup, onUnselect: destroyPopup })
    };

    function createPopup(feature) {
      feature.popup = new OpenLayers.Popup.FramedCloud("pop",
          feature.geometry.getBounds().getCenterLonLat(),
          null,
          '<div class="markerContent">'+feature.attributes.description+'</div>',
          null,
          true,
          function() { controls['selector'].unselectAll(); }
      );
      //feature.popup.closeOnMove = true;
      map.addPopup(feature.popup);
    }

    function destroyPopup(feature) {
      feature.popup.destroy();
      feature.popup = null;
    }
    
    map.addControl(controls['selector']);
    controls['selector'].activate();

}

//--------------------------------------------------
// Function listing the address of restaurant
// as is defined by the user input
// TODO : hook with user triggered input
// @param :     void ...... 
// @return                
//--------------------------------------------------
function getfoodaddress(){

// restaurants in surabaya.. !
var addresses  = ["Kertajaya 210", "Kusuma Bangsa 85", 
"Tidar 3", "Kapas Krampung 238", "Jemursari 84", "Embong Malang I No. 78"];
return addresses;

}

//--------------------------------------------------
// Function mapping the address with the element 
// @param :     void ...... 
// @return                
//--------------------------------------------------
function getelementaddress(){

// restaurants in surabaya.. !
var addresses  = ["Kertajaya 210", "Kusuma Bangsa 85", 
"Tidar 3", "Kapas Krampung 238", "Jemursari 84", "Embong Malang I No. 78"];
return addresses;
}

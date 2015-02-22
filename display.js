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

  var element_count = 0;
  for (e in addresses) { element_count++; }     
   
   
   if (addresses == undefined || element_count == 0) {
      alert("No address defined!");
      return;
   }

    for (var i = 0; i < element_count; i++) {
        
        currAddress = getAddressName(addresses, [i], 0);
        var geocoder = new google.maps.Geocoder();
  
        geocoder.geocode({'address':currAddress}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    //debug: 
                    //alert(results[0].geometry.location.lat());
                    //var longitude = results[0].geometry.location.lng();

                    pos.push(results[0].geometry.location);
                    if (pos.length == element_count) {
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

var addresses = new Object();

addresses["Kertajaya No.210 Gubeng, Kota SBY, Jawa Tim. 60282"] = "Ayam goreng Jakarta 01";
addresses["Kusuma Bangsa No.85 Genteng, Kota SBY, Jawa Tim. 60273"] = "Ayam goreng Jakarta 02";
addresses["Pemuda No.38 Genteng, Kota SBY, Jawa Tim. 60271"] = "Ayam goreng Pemuda";
addresses["Mayjen Sungkono No.32 Dukuh Pakis, Kota SBY, Jawa Tim. 60225"] = "Ayam Goreng Pemuda Sungkono";
addresses["Sriwijaya No.30 Tegalsari, Kota SBY, Jawa Tim. 60265"] = "Ayam Goreng Sriwijaya"

return addresses;
}


/*===========================================================
// 
//                        UTILS 
//
*===========================================================*/

//--------------------------------------------------
// Function that returns address or name of place
//          depending on the caller
// @param :     o       ...... address object
//              idx     ...... iteration index
//              type    ...... 0 for address, 1 for name             
// @return                
//--------------------------------------------------

function getAddressName(o, idx, type){
  var out = '';
  var ctr = 0;
 
  var is_address = 0;


   for (var p in o) {
    
    //out += p + '\n';
    if (idx == ctr) {
       if (is_address == type) {
        out += p;
        } else {
        out += o[p];
        }
       break;
    }

    ctr++;
  }

  return out;

}


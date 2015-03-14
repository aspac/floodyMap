//--------------------------------------------------
// Function returning the coordinate
// of the cities, act as the main caller in html
// @param :     idx ...... 
//              type ..... Type of the enquires 
//                         Longitude or Latitude
// @return                
//--------------------------------------------------

function Main() {
  //utilsreadTextFile("http://localhost:8000/result.csv");
  displayPopup()
} 

//--------------------------------------------------
// Function that shows the markers on the map
// @param :     coords ...... array type with 
//                            lon, lat element              
// @return                
//--------------------------------------------------
//--------------------------------------------------
// Function that shows the markers on the map
// @param :     coords ...... array type with 
//                            lon, lat element              
// @return                
//--------------------------------------------------

function displayPopup(){

  alert("display pop up")
 map = new OpenLayers.Map("mapdiv");
    map.addLayer(new OpenLayers.Layer.OSM());
    
    epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)
   
    var lonLat = new OpenLayers.LonLat( -0.1279688 ,51.5077286 ).transform(epsg4326, projectTo);
          
    
    var zoom=14;
    map.setCenter (lonLat, zoom);

    var vectorLayer = new OpenLayers.Layer.Vector("Overlay");
    
    // Define markers as "features" of the vector layer:
    var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point( -0.1279688, 51.5077286 ).transform(epsg4326, projectTo),
            {description:'This is the value of<br>the description attribute'} ,
            {externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
        );    
    vectorLayer.addFeatures(feature);
    
    var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point( -0.1244324, 51.5006728  ).transform(epsg4326, projectTo),
            {description:'Big Ben'} ,
            {externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
        );    
    vectorLayer.addFeatures(feature);

    var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point( -0.119623, 51.503308  ).transform(epsg4326, projectTo),
            {description:'London Eye'} ,
            {externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
        );    
    vectorLayer.addFeatures(feature);

   
    map.addLayer(vectorLayer);
 
    
    //Add a selector control to the vectorLayer with popup functions
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

function displayMarkers(coords) {
  
    var zoom=11;

    var grapHeight = 25
    var graphWidth = 21
    var graphXoffset = -12
    var graphYoffset = -12
    var restaurant_num = coords.length;

    var addresses  = utilsgetfoodaddress();

    map = new OpenLayers.Map("mapdiv");
    map.addLayer(new OpenLayers.Layer.OSM());
    
    epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)
   

    //set center of the map
    SbyLatitude= -7.2491700  
    SbyLongitude=  112.7508300

    //-7.614529

    //var centerlonlat = new OpenLayers.LonLat(SbyLongitude, SbyLatitude).transform(epsg4326, projectTo);
    //map.setCenter (centerlonlat, zoom);
  map = new OpenLayers.Map("mapdiv");
    map.addLayer(new OpenLayers.Layer.OSM());
    
    epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)
   
    var lonLat = new OpenLayers.LonLat( -0.1279688 ,51.5077286 ).transform(epsg4326, projectTo);
          
    
    var zoom=14;
    map.setCenter (lonLat, zoom);

    var vectorLayer = new OpenLayers.Layer.Vector("Overlay");
    
    // Define markers as "features" of the vector layer:
    var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point( -0.1279688, 51.5077286 ).transform(epsg4326, projectTo),
            {description:'This is the value of<br>the description attribute'} ,
            {externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
        );    
    vectorLayer.addFeatures(feature);
    
    var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point( -0.1244324, 51.5006728  ).transform(epsg4326, projectTo),
            {description:'Big Ben'} ,
            {externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
        );    
    vectorLayer.addFeatures(feature);

    var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point( -0.119623, 51.503308  ).transform(epsg4326, projectTo),
            {description:'London Eye'} ,
            {externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
        );    
    vectorLayer.addFeatures(feature);

   
    map.addLayer(vectorLayer);
 
    
    //Add a selector control to the vectorLayer with popup functions
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



/*===========================================================
// 
//                        UTILS 
//
*===========================================================*/

function utilsreadTextFile(csvparse)
{
  $.ajax({
    type: "GET",
    url: csvparse,
    dataType: "text",

    success: function(data) {processData(data);},
    error: function (request, status, error) {
      alert(request.responseText);
    }
  });
}


/*
Credit CSV parser:
http://jsfiddle.net/vHKYH/
*/
function processData(str){

  alert("PROC>ESS DAFTA")
  var arr = [];
    var quote = false;  // true means we're inside a quoted field

    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  
        if (cc == '"') { quote = !quote; continue; }
        if (cc == ',' && !quote) { ++col; continue; }
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }

        arr[row][col] += cc;
      }


   //var addresses  = utilsgetfoodaddress();

   if (arr.length == 0) {
    alert("No address defined!");
    return;
  }

  var last_arr = arr.length;
  last_arr -=1;
  var pos = [];

  for (var i = 1; i < 3; i++) {

    var currAddress = arr[i];
    var currAddress = currAddress[1]
    
    sleep(1000);  
    var geocoder = new google.maps.Geocoder();
    //alert("got currAddress of " +currAddress)

    geocoder.geocode({'address':currAddress}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        //debug: 
        //alert("debug!")
        //alert(results[0].geometry.location.lat());
        //var longitude = results[0].geometry.location.lng();
        pos.push(results[0].geometry.location);
        if (pos.length == 2) {
          alert("display!!!!!!")
          //displayMarkers(pos);
          displayPopup()
        } 
      } 
      else {
        alert("hickup status from GOOGLE " + status)
      }
    });
  }
}

//--------------------------------------------------
// Function that returns address or name of place
//          depending on the caller
// @param :     o       ...... address object
//              idx     ...... iteration index
//              type    ...... 0 for address, 1 for name             
// @return                
//--------------------------------------------------

function utilsgetAddressName(o, idx, type){
  var out = '';
  var ctr = 0;

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

//--------------------------------------------------
// Sleep
//          
// @param :     milliseconds       ...... address object
// @return                
//--------------------------------------------------
function sleep(milliseconds) {
  var start = ""
  start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

//--------------------------------------------------
// Function listing the address of restaurant
// as is defined by the user input
// TODO : hook with user triggered input
// @param :     void ...... 
// @return                
//--------------------------------------------------
function utilsgetfoodaddress(){

var addresses = new Object();

addresses["Kertajaya No.210 Gubeng, Kota SBY, Jawa Tim. 60282"] = "Ayam goreng Jakarta 01";
addresses["Kusuma Bangsa No.85 Genteng, Kota SBY, Jawa Tim. 60273"] = "Ayam goreng Jakarta 02";
addresses["Pemuda No.38 Genteng, Kota SBY, Jawa Tim. 60271"] = "Ayam goreng Pemuda";
addresses["Mayjen Sungkono No.32 Dukuh Pakis, Kota SBY, Jawa Tim. 60225"] = "Ayam Goreng Pemuda Sungkono";
addresses["Sriwijaya No.30 Tegalsari, Kota SBY, Jawa Tim. 60265"] = "Ayam Goreng Sriwijaya 01";
addresses["Raya Jemursari No.84 Tenggilis Mejoyo, Kota SBY, Jawa Tim. 60239"] = "Ayam Goreng Sriwijaya 01";
addresses["Raya Nginden No.48 Gubeng, Kota SBY, Jawa Tim. 60284, Indonesia"] = "Family Cafe"

return addresses;
}
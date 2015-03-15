//--------------------------------------------------
// Function returning the coordinate
// of the cities, act as the main caller in html
// @param :     idx ...... 
//              type ..... Type of the enquires 
//                         Longitude or Latitude
// @return                
//--------------------------------------------------
function Main() {
   utilsreadTextFile("http://localhost:8000/result.csv");
} 


function displayPopupDummy(coords){

  map = new OpenLayers.Map("mapdiv");
  map.addLayer(new OpenLayers.Layer.OSM());

  var zoom=11;

  var grapHeight = 25
  var graphWidth = 21
  var graphXoffset = -12
  var graphYoffset = -12
  var restaurant_num = coords.length;

  epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
  projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)


  //set center of the map
  SbyLatitude= -7.2491700  
  SbyLongitude=  112.7508300

  var centerlonlat = new OpenLayers.LonLat(SbyLongitude, SbyLatitude).transform(epsg4326, projectTo);
  map.setCenter (centerlonlat, zoom);

  var vectorLayer = new OpenLayers.Layer.Vector("Overlay");


  for (var i = 0; i < restaurant_num; i++) {

    var feature = new OpenLayers.Feature.Vector(
      new OpenLayers.Geometry.Point(coords[i].lng(), coords[i].lat() ).transform(epsg4326, projectTo),
      {description: 'This is the value of<br>the description attribute'} ,
      {externalGraphic: 'img/marker.png', graphicHeight: grapHeight, graphicWidth: graphWidth, graphicXOffset: graphXoffset, graphicYOffset: graphYoffset  }
      );    

    vectorLayer.addFeatures(feature);
  }

    
    map.addLayer(vectorLayer);

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

  alert("..sPROCESSING DATA..")

  var arr = [];
  var quote = false; 

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

   if (arr.length == 0) {
    alert("No address defined!");
    return;
  }

  var last_arr = arr.length;
  last_arr -=1;
  var pos = [];
  
  var back = 0;
  alert("START..")
  while (back != 1) {
    back = utilsrequestcoord(arr, last_arr, pos);
  }
  alert("DONE ..")
  
  /*
  for (var i = 1; i < last_arr; i++) {

    var currAddress = arr[i];
    var currAddress = currAddress[1]
    
    sleep(200);  
    var geocoder = new google.maps.Geocoder();
    //alert("got currAddress of " +currAddress)

    geocoder.geocode({'address':currAddress}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //debug: 
        //alert("debug!")
        //alert(results[0].geometry.location.lat());
        //var longitude = results[0].geometry.location.lng();
        pos.push(results[0].geometry.location);
        if (pos.length == 5) {
          alert("display Dummy!!!!!!")
          //displayMarkers(pos);
          displayPopupDummy(pos);
        } 
      } 
      else {
        alert("hickup status from GOOGLE " + status + "where request is " + i)
        return;
      }
    });
  }
  */
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


function utilsrequestcoord(arr, last_arr, pos){

   var back = 0;
   for (var i = 1; i < last_arr; i++) {

    var currAddress = arr[i];
    var currAddress = currAddress[1]
    
    var geocoder = new google.maps.Geocoder();
    //alert("got currAddress of " +currAddress)
    sleep(1500);
    geocoder.geocode({'address':currAddress}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //debug: 
        //alert("debug!")
        //alert(results[0].geometry.location.lat());
        //var longitude = results[0].geometry.location.lng();
        pos.push(results[0].geometry.location);
        if (pos.length == 6) {
          //displayMarkers(pos);
          displayPopupDummy(pos);
        } 
      } 
      else {
        //alert("hickup status from GOOGLE " + status + "where request is " + i)
        sleep(2000);
      }
    });
  }
   
  back = 1;
  return back;
}

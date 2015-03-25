//--------------------------------------------------
// Function returning the coordinate
// of the cities, act as the main caller in html
// @param :     idx ...... 
//              type ..... Type of the enquires 
//                         Longitude or Latitude
// @return                
//--------------------------------------------------
function Main() {
 utilsreadTextFile("http://localhost:8000/result.txt");
} 


function displayMap(coords){

  map = new OpenLayers.Map("mapdiv");
  map.addLayer(new OpenLayers.Layer.OSM());

  var zoom=12;

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


  for (var i = 1; i < restaurant_num; i++) {

    var feature = new OpenLayers.Feature.Vector(
      new OpenLayers.Geometry.Point(utilsgetComponent(coords,i,2), utilsgetComponent(coords,i,3)).transform(epsg4326, projectTo),
      {description: utilsgetComponent(coords,i,0)} ,
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

    
  //probe :   var component_displayed = utilsgetComponent(arr,1,0)

  displayMap(arr);


}


//--------------------------------------------------
// Function that returns component of the array taken from text file, 
// that is separated by (,)
// @param :     arrayvalue       ...... array value to be split
//                               ...... this consist of name,address,lon,lat
//              arrayidx         ...... index of array to be fetched
//              type             ...... 0 for name,
//                                      1 for address,
//                                      2 for lon,
//                                      3 for lat             
// @return                
//--------------------------------------------------

function utilsgetComponent(arrayvalue, arrayidx, type){

 var processedtxt = arrayvalue[arrayidx].toString().split(",");

 return processedtxt[type];

}


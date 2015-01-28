
function displayothermap(){
     
    var surabayacity = new Object();
    surabayacity['lon'] = 106.8167;
    surabayacity['lat'] = -6.2000;
	 
    return surabayacity;
}

/*
Main function to display locations
*/
function displayMap() {
	 
	 var zoom=5;
	 var epsg="EPSG:4326"
	    
	 map = new OpenLayers.Map("mapdiv");
	 map.addLayer(new OpenLayers.Layer.OSM());
	 
	 var lonLat = new OpenLayers.LonLat(112.745579,-7.26424)
	          .transform(
	            new OpenLayers.Projection(epsg), 
	            map.getProjectionObject() 
	         );

	 
	 
	var markers = new OpenLayers.Layer.Markers( "Markers" );
	map.addLayer(markers);

    
	markers.addMarker(new OpenLayers.Marker(lonLat));
	var sby = displayothermap()

	var lonLat2 = new OpenLayers.LonLat(sby.lon,sby.lat)
	          .transform(
	            new OpenLayers.Projection(epsg), 
	            map.getProjectionObject() 
	         );          

	markers.addMarker(new OpenLayers.Marker(lonLat2));

	map.setCenter (lonLat, zoom);
}


displayMap()

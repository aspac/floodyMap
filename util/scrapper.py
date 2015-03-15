#!/usr/bin/python

# scrapper

from bs4 import BeautifulSoup
from geopy.geocoders import Nominatim

import requests
import time
import re
import csv

#---------------------------------------------------------
# Simple csv writer
# @param : data ... data to be written
#        : path ... path to write
# @return : void
#---------------------------------------------------------
def csv_writer(path):
    
  try:
      c = csv.writer(open(path, "wb"))
  except:
      print "creating writer on path %s fails", path
      exit(1)
      
  return c

def csv_rewrite(path, lon, lat):
     
  with open(path,'r') as csvinput:
    with open('result_latlon.csv','w') as csvoutput:
        writer = csv.writer(csvoutput, lineterminator='\n')
        reader = csv.reader(csvinput)

        all = []
        row = next(reader)
        
        row.append(lon)
        row.append(lat)
        
        all.append(row)

        for row in reader:
            row.append(row[0])
            all.append(row)

        writer.writerows(all)

     

#---------------------------------------------------------
# Function to read csv file
#  @param  : path ....    CSV file to be parsed
#  @return 
#---------------------------------------------------------
def csv_reader(path):
    
    
  try:
      c = csv.reader(open(path))
  except:
      print "open path [%s] fails" %path
      exit(1)

  return c  


#---------------------------------------------------------
# Function to read csv file
#  @param  : path ....    CSV file to be parsed
#  @return 
#---------------------------------------------------------
def csv_geocode(csvobj, path):
    
  try:
      geolocator = Nominatim()
  except:
       print "can not create geolocator"
       exit(1)
       
  i = 0  
  
  print "start geocoding"
  
  for row in csvobj:
      #print "check for i of %d where address is %s.." %(i,row[1])
    
      location = ""
      e=""
      address = "Jl." +row[1] +",Jawa Timur,Indonesia"
     
      try:
          location = geolocator.geocode(address)
      except Exception, e:
         print 'My exception occurred, value:', e
         
      time.sleep(2)
      #once again..
      if e and e== "Service timed out":
          time.sleep(1)
          location = geolocator.geocode(address)
      
      if location:
          print "OK for i of ", i
          csv_rewrite(path, location.latitude, location.longitude)
      else:
          csv_rewrite(path, 0, 0)
          
      i+=1
      
  print "geocoding done.."
 
  return
  
#---------------------------------------------------------
# Function to get the Name of element and Address of the element 
#  @param  : element .. list of element got from web
#          : is_type ... TEL or Address
#---------------------------------------------------------
def get_Address(element, is_type):
    
    
    is_name = "Jl"
    is_tel = "Telp"
    name = ""
    i = False
    
    if is_type == 0:
        for p in element:
            if p == is_name:
                break
            name += p+ " "
    else:
        for p in element:
            if p == is_name : 
                i=True
            elif p == is_tel : 
                break
            elif i: 
                name += p + " "
            else: pass
                
    return name
 
#---------------------------------------------------------
# Function to get the element based on URL 
#  @param  : url ....    URL of the address
#  @return 
#---------------------------------------------------------

def print_URL(url, path):
    
    print "Fetching Content"
    
    try:
        r  = requests.get("http://" +url)
    except:
        exit(1)
        
    i = 0
    #last data to be fetched to csvdata_vin
    data_str = ""
    #type of element to be fetched
    is_elmtname = 0
    is_addrname = 1
    
    
   
    c = csv_writer(path)
    if c:
      c.writerow(["ElementName","ElementAddress"])      
            
    data = r.text
    friedrice = BeautifulSoup(data)
    for node in friedrice.findAll('li'):
        i+=1
        element = ''.join(node.findAll(text=True))
        element = element.encode("ascii")        
        #get first name in the line
        firstname = element.split('\n', 1)[0]
        # if \r returned, replace with empty
        if len(firstname) == 2: firstname = ""
        
        #get last chunk of name
        second = element.split('\n', 1)[1]
        third = re.findall(r'\w+', second)
        
        #postprocess last chunk of name
        secondname = get_Address(third,is_elmtname)
      
        #get name, to be used as element entity in map    
        real_name = firstname
        if secondname:
            real_name += secondname
       
        real_name = ''.join(real_name.splitlines())
        
        address = get_Address(third, is_addrname)
        #address = address+ "Surabaya"
        #print "address is", address
        
        data_str = data_str+real_name+","+address+"\n"
        c.writerow([real_name,address])
        
    return     



if __name__ == "__main__":
    
    url = "www.surabaya.go.id/eng/tourism.php?page=restoran"
    path = "/opt/gitrepo/repo1/floodyMap/util/result.csv"

        
    #print_URL(url, path)
    c = csv_reader(path)
    csv_geocode(c, path)
    
    
       
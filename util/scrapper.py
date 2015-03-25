#!/usr/bin/python

# scrapper

from bs4 import BeautifulSoup
from geopy.geocoders import GoogleV3

import requests
import time
import re
import os
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
        print(("creating writer on path %s fails", path))
        exit(1)

    return c


#---------------------------------------------------------
# Function to read csv file
#  @param  : path ....    CSV file to be parsed
#  @return
#---------------------------------------------------------
def csv_reader(path):

    try:
        c = csv.reader(open(path))
    except:
        print(("open path [%s] fails" % path))
        exit(1)

    return c


#---------------------------------------------------------
# Function to write csv file
#  @param  : path ....    CSV file to be parsed
#  @return
#---------------------------------------------------------
def csv_geocode(reader, writer):

    try:
        geolocator = GoogleV3()
    except:
        print(("can not create geolocator"))
        exit(1)

    next(reader)    # skip input csv header
    writer.writerow(["ElementName", "ElementAddress",
                "Latitude", "Longitude"])

    print(("start geocoding..."))
    
    i = 0
    for row in reader:
        print(("check for i of %d where address is %s.." % (i, row[1])))
        location = ""
        e = ""
        address = "Jl. " + row[1] + ", Surabaya, Jawa Timur, Indonesia"
        print((address))

        try:
            time.sleep(0.25)    # google restricts max. 5 queries per second
            location = geolocator.geocode(address)
        except Exception as e:
            print(('My exception occurred, value: ', e))

        time.sleep(2)
        #once again..
        if e and e == "Service timed out":
            time.sleep(1)
            location = geolocator.geocode(address)

        completeLine = []
        completeLine.append(row[0])
        completeLine.append(row[1])

        if location is not None:
            print(("OK for i of ", i))
            completeLine.append(location.longitude)
            completeLine.append(location.latitude)
            writer.writerow(completeLine)
        else:
            completeLine.append("0")
            completeLine.append("0")
            writer.writerow(completeLine)

        i += 1

    print(("geocoding done.."))

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
            name += p + " "
    else:
        for p in element:
            if p == is_name:
                i = True
            elif p == is_tel:
                break
            elif i:
                name += p + " "
            else:
                pass

    return name


#---------------------------------------------------------
# Function to get the element based on URL
#  @param  : url ....    URL of the address
#  @return
#---------------------------------------------------------
def print_URL(url, path):

    print(("Fetching Content"))

    try:
        r = requests.get("http://" + url)
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
        c.writerow(["ElementName", "ElementAddress", "Latitude", "Longitude"])

    data = r.text
    friedrice = BeautifulSoup(data)
    for node in friedrice.findAll('li'):
        i += 1
        element = ''.join(node.findAll(text=True))
        element = element.encode("ascii")
        #get first name in the line
        firstname = element.split('\n', 1)[0]
        # if \r returned, replace with empty
        if len(firstname) == 2:
            firstname = ""

        #get last chunk of name
        second = element.split('\n', 1)[1]
        third = re.findall(r'\w+', second)

        #postprocess last chunk of name
        secondname = get_Address(third, is_elmtname)

        #get name, to be used as element entity in map
        real_name = firstname
        if secondname:
            real_name += secondname

        real_name = ''.join(real_name.splitlines())

        address = get_Address(third, is_addrname)
        #address = address+ "Surabaya"
        #print "address is", address
        data_str = data_str + real_name + "," + address + "\n"
        c.writerow([real_name, address])

    return

if __name__ == "__main__":

    url = "www.surabaya.go.id/eng/tourism.php?page=restoran"
    current_pw = os.getcwd()

    path = current_pw + "/result.csv"
    path2 = current_pw + "/result_latlon.csv"
    
    print_URL(url, path)
    reader = csv_reader(path)
    if not reader:
        exit(1)

    writer = csv_writer(path2)
    if not writer:
        exit(1)

    csv_geocode(reader, writer)

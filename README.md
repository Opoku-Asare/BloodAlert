
# The Database
The Blood Alert Database API uses
 [SQLite](www.sqlite.org) hence no installation is needed

## Setting up the database
There are two options to setup ( create and populate) the databse. We recommend option 1 if you are not familiar with SQL

###  Option 1

* Ensure that you have python 2.7.x installed , and python path added to your environment variables
* open the command prompt at the root application (codes) folder
* run the command **python -m setupdb**

###  Option 2

* Esure you have sqlite3.exe in the root of the project folder
* open command promt from the root folder of the project
* run the command sqlite3 db/bloodAlert.db   
* The previous step will take you to a prompt sqlite>
* run the command **.read db/bloodAlert_schema_dump.sql**
* rum the command **.read db/bloodAlert_data_dump.sql**

## Running Test Cases

* Ensure that you have python 2.7.x installed and python path added to your environment variables
* open the command prompt at the root application (codes) folder
* run the command **python -m test.<name_of_test_file_without_.py_extension>**
    * example 1 **python -m test.db_api_tests_blood_types**
    * example 2 **python -m test.db_api_tests_blood_banks**
    * example 3 **python -m test.db_api_tests_blood_donors**



* * *

# RESTFul API

The API is a follows the REST achitecture. 
The [full documentation](http://docs.bloodalert.apiary.io/#) of the API can be referenced here(http://docs.bloodalert.apiary.io/#)

The API was implemented using **FLASK microframework**(http://flask.pocoo.org/) which is a python framework.  
Other dependencies the API uses is the **Flask-RESTful** library

To setup and run the API, please follow the following steps

* Ensure that you have python 2.7.x installed , and python path added to your environment variables
* Install FlASK microframework with the command **pip install Flask**
* Install Flask-RESTful with the command **pip install flask-restful**
* Follows steps in setting up the database descbribed above to setup the database
* open the command prompt at the root application (codes) folder
* run the command **python -m src.resources**
    > This will start the FLASK built in web server on the address **http://localhost:5000**
    > You can now send request to the api using a web browser or a restclient like **postman**, **Restlet Client**

* * *

# Change logs

### Feb 20, 2017
* Added CRUD for Blood Banks, Blood Types
* Adapted Engine and Connection class from Exercise to work for our project
* Create the sql schema for the bloodAlert database
* Created the database

### Feb 21, 2017
* Added Test Cases for Blood Type Database API
* Added setupdb.py , a script to create and populate the database
* Added Instructions to setup database
* Added Instructions to run test Cases
* Created sql script to populate database
* Populated the **Blood_Donors**, **Blood_Banks** and **History** tables
* Added Test Cases for Blood_Banks Database API

### Feb 22, 2017
* Added CRUD for Blood_Donors Table
### Feb 23, 2017
* Added test Cases for Blood Donors
### Feb 24, 2017
* Added CRUD for History
### Feb 25, 2017
* Added Test cases for History
### Mar 24, 2017
* Added FLASK-RESTFul implementation






/**
 * @fileOverview Some general functions for the Blood alert web client 
 *               It utilises the Blood Alert API and heavily dependent on JQuery
 * @author <a href="mailto:opokuasarekennedy@gmail.com">Asare</a>
 * @version 1.0
 */

/**
 * Default data type for response in jquery ajax requests
 * @constant {string}
 * @default
 */
const DEFUALT_DATA_TYPE = "json"
/**
 * Default request data type for jquery ajax requests.
 * This is a plain javascript format
 * @constant {string}
 * @default
 */
APPLICATION_JSON_FORMAT = "application/json"

var mapData = null;
/**
 * This functions Loads all blood types 
 * Send an ajax request to retrieve a list of all blood types, 
 * ONSUCCESS=> Construct an HTML select options, and append to 
 *            the dropdown list identified as #bloodTypeId
 * ONERROR=>  Nothing happens
 */
function loadBloodTypes(event) {
    return $.ajax({
        url: "/bloodalert/bloodtypes",
        dataType: DEFUALT_DATA_TYPE
    }).done(function (data, textStatus, jqXHR) {
        bloodTypes = data.items;
        if (data.items.length > 0) {
            $dropdown = $("#bloodTypeId");
            $dropdown.append(
                $('<option></option>').val("").html("Select Blood Type")
            );
            $.each(data.items, function (index, item) {
                $dropdown.append(
                    $('<option></option>').val(item.bloodTypeId).html(item.name)
                );
            });
        }

    });
}
/**
 * Save a cookie on the browsers
 * @param {string} cname - the name of the cookie
 * @param {string} cvalue - the value of the cookie
 * @param {number} exdays - the number of days for cookie to expire
 */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Returns the value of an existing cookie with expecified name
 * or empty string of cookie was not found
 * @param {string} cname - the name of the cooke
 * @returns {string}
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {

            return c.substring(name.length, c.length);
        }
    }
    return "";
}
/**
 * Handles the click of Login button
 * Sends a ajax get call to Blood Alert API and returns a list of all donors
 * NOTE: This is implementation is not the best practise of authentication. 
 *       The Blood Alert API has no authentication implemented yet, so this implementation
 *        is just a away around.
 * ONSUCCESS=> look for the donor whose email matches the provided email in the form
 *             If a match is found, then redirect the page to the donor profile page,
 *             else do nothing.
 * ONERROR=>   Do nothing 
 */
function handleLoginDonorButton(event) {
    var $form = $(this).closest("form");

    $data = serializeFormTemplate($form)

    return $.ajax({
        url: "/bloodalert/donors/",
        dataType: DEFUALT_DATA_TYPE
    }).done(function (data, textStatus, jqXHR) {

        for (var i = 0; i < data.items.length; i++) {
            item = data.items[i];
            if (item.email.toLowerCase() == $data.email.toLowerCase()) {
                setCookie("BloodAlertLoggedInDonor", JSON.stringify(item), 1)
                window.open("http://" + window.location.host + "/web/profile", "_self")
                window.loggedInUser = item;
            }
        }


    });
}
/**
 * Handles Register donor button click
 * sends ajax post request to the API and saves donor information to database
 * 
 * ONSUCCESS=> show alert message
 * 
 * ONERROR=> Process application/vnd.mason+json response and show an alert with
 *           error messages
 */
function handleDonorRegistration(event) {
    var $form = $(this).closest("form");

    $data = serializeFormTemplate($form)
    var requiredMessage = "";
    for (var key in $data) {

        if ($data.hasOwnProperty(key)) {
            if ($data[key] == "") {
                requiredMessage += key + " is required \n"
            }
        }
    }
    if (requiredMessage != "") {
        alert(requiredMessage);
        return;
    }
    var donorData = JSON.stringify($data);

    return $.ajax({
        url: "/bloodalert/donors/",
        type: "POST",
        processData: false,
        contentType: APPLICATION_JSON_FORMAT,
        data: donorData,
    }).done(function (data, textStatus, jqXHR) {

        alert("Donor Created Sucessfully");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Failure");
        var responseText = "";
        console.log(jqXHR);
        if (jqXHR.responseText != null) {
            var response = $.parseJSON(jqXHR.responseText);
            var responseText = response["@error"]["@message"] + "\n";
            responseText += response["@error"]["@messages"].join("\n");

        } else {
            responseText = errorThrown | " " + textStatus | " ";
        }
        alert(responseText);
        $("#donorRegisterbtn").closest("form")[0].reset();
    });

}

/**
 * Gets the data provided on a form
 * 
 * NOTE: the idea serializeFormTemplate method was borrowed from the pwp exercies , 
 *       and adopted to our purpose
 * 
 * @param {Object} $form - The jquery form object
 * @returns {Object} a javascript object with form field id and value pairs
 */

function serializeFormTemplate($form) {
    var envelope = {};
    // get all the inputs into an array.
    var $inputs = $form.find(".form-group .form-control");
    $inputs.each(function () {
        envelope[this.id] = $(this).val();
    });

    var subforms = $form.find(".form_content .subform");
    subforms.each(function () {

        var data = {}

        $(this).children("input").each(function () {
            data[this.id] = $(this).val();
        });

        envelope[this.id] = data
    });
    return envelope;
}
/**
 * Returns a list of public pages
 * @returns {Array} 
 */
function getNoAuthPages() {
    noAuthPages = []
    noAuthPages.push("http://" + window.location.host + "/web/contact")
    noAuthPages.push("http://" + window.location.host + "/web/register")
    noAuthPages.push("http://" + window.location.host + "/web/about")
    return noAuthPages;
}
/**
 * Check whether current user is logged in
 * Checks a existing cookie (BloodAlertLoggedInDonor)
 * if cookie is not found, redirect to login page
 */
function checkLoggedinDonor() {
    currentpage = window.location.href;


    var cookie = getCookie("BloodAlertLoggedInDonor");

    if (cookie != "") {
        hideLoginForm();
        redressMenuAfterLogin();
        window.loggedInUser = $.parseJSON(cookie);
    } else {

        loginPage = "http://" + window.location.host + "/web/" || "http://" + window.location.host + "/web";

        if (currentpage != loginPage) {
            noAuthPages = getNoAuthPages()
            if (noAuthPages.indexOf(currentpage) == -1)
                window.open(loginPage, "_self")
        }

    }
}
/**
 * Log out the current user
 * This essentially deletes the cookie with name BloodAlertLoggedInDonor
 * and redirects to login page
 */
function logOutDonor() {

    Cookies.remove('BloodAlertLoggedInDonor', { path: '/' })
    window.loggedInUser = undefined
    delete window.loggedInUser

    loginPage = "http://" + window.location.host + "/web/" || "http://" + window.location.host + "/web";
    window.open(loginPage, "_self")
}
/**
 * Hides Login form 
 */
function hideLoginForm() {
    $("#DonorLoginFormDiv").remove();
    $("#indexBloodLevels").removeClass("col-md-8").addClass("col-md-12");
}
/**
 * Shows the profile, and logout menu and hides the Donor Registration menu
 */
function redressMenuAfterLogin() {
    profileUrl = "http://" + window.location.host + "/web/profile";
    $(".navbar-nav").append('<li><a  href="' + profileUrl + '">Profile</a></li>');
    $(".navbar-nav").append('<li><a id="LogOutLink" href="#">Log Out</a></li>');
    $(".navbar-nav > #DonorRegistrationMenu").remove();
}



var map, pointarray, heatmap;

// a shortened version of the data for Google's taxi example


/**
 * Shows a heat map of blood levels 
 * Load all blood banks and plot them on map with their latitude and longitude data
 *      for each blood bank, load its blood levels and sum in a head map,
 */
function loadBloodLevels(mapData) {
    var locations = []

    $.ajax({
        url: "/bloodalert/bloodbanks/",
        dataType: DEFUALT_DATA_TYPE
    }).done(function (data, textStatus, jqXHR) {
        console.log(data);
        for (var i = 0; i < data.items.length; i++) {
            item = data.items[i];
            console.log(item);
            location = new google.maps.LatLng(item.latitude, item.longitude);
            mapData.push(location);

            bloodLevelsUrl = "/bloodalert/bloodbanks/" + item.bloodBankId + "/bloodlevels/";
            itemLocation = i;
            console.log(location);
            /**
             * $.ajax({
                url: bloodLevelsUrl,
                dataType: DEFUALT_DATA_TYPE
            }).done(function (data, textStatus, jqXHR, itemLocation) {
                var weight = 0;
                for (var i = 0; i < data.items.length; i++) {
                    var item = data.items[i];
                    weight += item.amount;
                }
                pointArray.get(itemLocation)["weight"] = Math.pow(2,weight);
            });
             */

        }



    });

}
/**
 * Displays heat map based on geo-spatial information
 */



function showHeatMap() {
    return $.ajax({
        url: "/bloodalert/bloodbanks/",
        dataType: DEFUALT_DATA_TYPE
    }).done(function (data, textStatus, jqXHR) {
        var weightedLocations = [];
        var bloodBanks = [];
        var locations = [];
        for (var i = 0; i < data.items.length; i++) {
            item = data.items[i];
            var latLongLoc = new google.maps.LatLng(item.latitude, item.longitude);
            locations.push(latLongLoc);
            bloodLevelsUrl = "/bloodalert/bloodbanks/" + item.bloodBankId + "/bloodlevels/";

            var bloodbank = { info: item, bloodLevel: bloodLevelsUrl };

            bloodBanks.push(bloodbank);
            weightedLocations.push({ location: latLongLoc, weight: Math.pow(bloodbank.totalBlood, 2) })
        }

        var pointArray = new google.maps.MVCArray(weightedLocations);
        // the map's options
        var mapOptions = {
            zoom: 5,
            fullscreenControl: true,
            center: new google.maps.LatLng(65.6529276, 22.3868431),
            mapTypeId: "terrain"
        };

        // the map and where to place it
        var map = new google.maps.Map(document.getElementById('bloodLevelsMap'), mapOptions);

        var markers = locations.map(function (location, i) {
            return new google.maps.Marker({
                position: location,
                label: bloodBanks[i].info.name
            });
        });

        var markerCluster = new MarkerClusterer(map, markers,
            { imagePath: window.location.href + 'static/images/m' });

        map.data.setStyle(function (feature) {
            var magnitude = feature.getProperty('mag');
            return {
                icon: getCircle(magnitude)
            };
        });
        // what data for the heatmap and how to display it
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: pointArray,
            dissipating: false
        });

        heatmap.setMap(map);

        for (var i = 0; i < bloodBanks.length; i++) {
            $.ajax({
                url: bloodBanks[i].bloodLevelsUrl,
                dataType: DEFUALT_DATA_TYPE
            }).done(function (data, textStatus, jqXHR) {
                var totalBlood = 0;
                for (var i = 0; i < data.items.length; i++) {
                    totalBlood += data.items[i].amount;
                }
                bloodbank[i]["totalBlood"] = totalBlood;
                pointArray[i].weight = totalBlood;
            });
        }

    });
}



/**
* This method loads when page loads
*/

$(function () {
    //check whether current user is logged in
    checkLoggedinDonor();
    // attach click handler to #loginDonorButton
    $("#loginDonorButton").click(handleLoginDonorButton);
    // attach click handler to #donorRegisterbtn
    $("#donorRegisterbtn").click(handleDonorRegistration);
    // attach click handler to #LogOutLink
    $("#LogOutLink").click(logOutDonor);
    // load blood types
    loadBloodTypes();
    showHeatMap();
});


﻿// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511

var authenticationData;

(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/tests/ImageDetails/ImageDetails.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            authenticationData = options;
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();


function imageDetails(){
    var uidParam = document.getElementById("uidParam").value;

    if (uidParam == null)
        return;

    var client = new PhotosServiceClient(
        authenticationData.username, authenticationData.password, authenticationData.accessKey);

    client.asyncImageDetails(uidParam).then(function (resultText) {
        var resultDiv = document.getElementById("imageDetailsResult");

        resultDiv.innerHTML = resultText;
    });


}

// ==UserScript==
// @name         WME Mouse Coordinate Grabber
// @namespace    https://github.com/DeviateFromThePlan
// @version      2024.01.10.01
// @description  Press 'Ctrl+.' and click on a spot to grab mouse coordinates on the Waze Map Editor
// @author       ChatGPT & DeviateFromThePlan
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @grant        GM_setClipboard
// @downloadURL  https://github.com/DeviateFromThePlan/WME-Mouse-Coordinate-Grabber/releases/latest/download/WME-MCG.user.js
// @updateURL    https://github.com/DeviateFromThePlan/WME-Mouse-Coordinate-Grabber/releases/latest/download/WME-MCG.user.js
// ==/UserScript==

(function() {
    'use strict';

    let isCoordinateGrabberEnabled = false;

    function enableCoordinateGrabber() {
        isCoordinateGrabberEnabled = true;
    }

    function disableCoordinateGrabber() {
        isCoordinateGrabberEnabled = false;
    }

    function copyCoordinatesToClipboard(coordinates) {
        GM_setClipboard(coordinates, 'text');
        console.log(`Coordinates copied to clipboard: ${coordinates}`);
    }

    // Event listener for Ctrl + .
    window.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === '.') {
            e.preventDefault();

            if (!isCoordinateGrabberEnabled) {
                enableCoordinateGrabber();
            } else {
                disableCoordinateGrabber();
            }
        }
    });

    // Event listener for mouse click on the map
    document.addEventListener('click', function(event) {
        if (isCoordinateGrabberEnabled) {
            // Get the mouse coordinates relative to the document
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // Convert document coordinates to map coordinates
            const mapCoordinates = Waze.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(mouseX, mouseY)).transform(
                Waze.map.getProjectionObject(),
                new OpenLayers.Projection('EPSG:4326')
            );

            // Format and copy coordinates to clipboard
            const formattedCoordinates = `${mapCoordinates.lat.toFixed(6)}, ${mapCoordinates.lon.toFixed(6)}`;
            copyCoordinatesToClipboard(formattedCoordinates);

            // Inform the user
            alert(`Coordinates copied to clipboard: ${formattedCoordinates}`);

            // Disable the coordinate grabber
            disableCoordinateGrabber();
        }
    });
})();

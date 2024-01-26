// ==UserScript==
// @name         WME Mouse Coordinate Grabber
// @namespace    https://github.com/DeviateFromThePlan
// @version      2024.01.26.01
// @description  Press 'Ctrl+.' to grab mouse coordinates on the Waze Map Editor without additional clicks
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
        document.addEventListener('click', trackMouse);
        document.addEventListener('mousemove', trackMouse);
    }
 
    function disableCoordinateGrabber() {
        isCoordinateGrabberEnabled = false;
        document.removeEventListener('click', trackMouse);
        document.removeEventListener('mousemove', trackMouse);
    }
 
    function copyCoordinatesToClipboard(coordinates) {
        GM_setClipboard(coordinates, 'text');
        console.log(`Coordinates copied to clipboard: ${coordinates}`);
    }
 
    function showToast(message) {
        const toastContainer = document.createElement('div');
        toastContainer.style.position = 'fixed';
 
        const totalTopOffset = 20 + document.getElementById('app-head').offsetHeight;
        toastContainer.style.top = `${totalTopOffset}px`;
 
        toastContainer.style.left = '50%';
        toastContainer.style.transform = 'translateX(-50%)';
        toastContainer.style.backgroundColor = '#fff';
        toastContainer.style.color = '#333';
        toastContainer.style.padding = '10px';
        toastContainer.style.borderRadius = '5px';
        toastContainer.style.opacity = '0';
        toastContainer.style.transition = 'opacity 0.5s ease-in-out';
 
        toastContainer.textContent = message;
 
        document.body.appendChild(toastContainer);
 
        // Trigger a reflow to apply styles and initiate the fade-in animation
        toastContainer.offsetHeight;
 
        // Show the toast
        toastContainer.style.opacity = '1';
 
        // Automatically hide after 5 seconds
        setTimeout(() => {
            // Initiate the fade-out animation
            toastContainer.style.opacity = '0';
 
            // Remove the element from the DOM after the animation completes
            setTimeout(() => {
                document.body.removeChild(toastContainer);
            }, 500);
        }, 5000);
    }
 
    function trackMouse(event) {
        // Get the mouse coordinates relative to the document
        const mouseX = event.clientX;
        const mouseY = event.clientY;
 
        // Convert document coordinates to map coordinates
        const mapCoordinates = W.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(mouseX, mouseY));
        console.log("Map Coordinates are: " + mapCoordinates);
 
        // Format and copy coordinates to clipboard
        const formattedCoordinates = `${mapCoordinates.lat.toFixed(6)}, ${mapCoordinates.lon.toFixed(6)}`;
        copyCoordinatesToClipboard(formattedCoordinates);
 
        // Display toast notification
        showToast(`Coordinates copied to clipboard: ${formattedCoordinates}`);
 
        // Disable the coordinate grabber after capturing coordinates
        disableCoordinateGrabber();
    }
 
    // Event listener for Ctrl + .
    window.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === '.') {
            e.preventDefault();
 
            if (!isCoordinateGrabberEnabled) {
                enableCoordinateGrabber();
            }
        }
    });
})();
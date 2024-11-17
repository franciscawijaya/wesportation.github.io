// Include Leaflet.js and Geocoding API (e.g., OpenCage or Google Maps API)

const map = L.map('map').setView([41.5568, -72.6568], 16); // Default center

// Add OpenStreetMap Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to load events from Google Calendar API
async function loadEventsFromGoogle() {
    const API_KEY = 'YOUR_GOOGLE_CALENDAR_API_KEY'; // Your API Key
    const CALENDAR_ID = 'YOUR_PUBLIC_CALENDAR_ID'; // Your Google Calendar ID
    const eventsUrl = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`;

    try {
        const response = await fetch(eventsUrl);
        const data = await response.json();
        const events = data.items;
        
        // Process each event
        events.forEach(event => {
            const eventLocation = event.location;

            // If a location is provided, geocode it to get coordinates
            if (eventLocation) {
                geocodeLocation(eventLocation).then(coords => {
                    if (coords) {
                        // Add marker to the map
                        const marker = L.marker([coords.lat, coords.lng]).addTo(map);
                        marker.bindPopup(`<b>${event.summary}</b><br>${eventLocation}`);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error fetching Google Calendar events:', error);
    }
}

// Function to geocode location (using OpenCage Geocoding API)
async function geocodeLocation(location) {
    const apiKey = '0cdb5c3c091440bb8dbcd41eca30c63a'; // Replace with your OpenCage API key
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;

    try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.results.length > 0) {
            const coordinates = data.results[0].geometry;
            return { lat: coordinates.lat, lng: coordinates.lng };
        } else {
            console.log('No coordinates found for location:', location);
            return null;
        }
    } catch (error) {
        console.error('Error geocoding location:', error);
        return null;
    }
}

// Load events when the page loads
window.onload = loadEventsFromGoogle;

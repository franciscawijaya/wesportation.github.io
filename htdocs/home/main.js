import './style.css';

// HTML element references
const eventContainer = document.querySelector('#events-container');
const eventAmtToFetch = document.querySelector('#eventAmt');
const loadingContainer = document.querySelector('#loading-container');

// Your Google Calendar API Key and Public Calendar ID
const API_KEY = 'AIzaSyDwz0aveLafbgDWgTu3Lp62aUuwxEa4nyI';
const PUBLIC_CALENDAR_ID = 'c_316c4a74143091cb754c41171c7cc71542ab8b66699f18f65942bc524f3e31df@group.calendar.google.com';

let gapiInited = false;
let gisInited = false;
let currentUser = null;

// Leaflet map initialization (center on default location)
const map = L.map('map').setView([51.505, -0.09], 13); // Default center for the map

// OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Google Calendar events fetching
async function loadEvents(max = 8) {
    try {
        loadingContainer.classList.remove('hide');
        const endpoint = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${PUBLIC_CALENDAR_ID}/events?maxResults=${max}&key=${API_KEY}`);
        const data = await endpoint.json();

        const processedEvents = await Promise.all(data.items.map(async (event) => {
            const eventObj = mapEventObject(event);
            if (eventObj.location) {
                const coordinates = await geocodeLocation(eventObj.location);
                if (coordinates) {
                    L.marker([coordinates.lat, coordinates.lng])
                        .addTo(map)
                        .bindPopup(`<b>${eventObj.name}</b><br>${eventObj.location}<br>${eventObj.dateRange}`)
                        .openPopup();
                }
            }
            return eventObj;
        }));

        loadingContainer.classList.add('hide');
        eventContainer.innerHTML = processedEvents.length > 0
            ? processedEvents.map((event, i) => createEvent(event, i)).join('')
            : `<p class="text-center text-3xl">No events available</p>`;
    } catch (e) {
        console.error('Error fetching events:', e);
        loadingContainer.classList.add('hide');
        eventContainer.innerHTML = `<p class="text-center text-3xl">🙀 Something went wrong!</p>`;
    }
}

// Geocode event locations (using OpenCage API)
async function geocodeLocation(location) {
    const apiKey = '0cdb5c3c091440bb8dbcd41eca30c63a'; // OpenCage API key
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

// Map event object to required format for display
function mapEventObject(event) {
    return {
        name: event.summary,
        location: event.location,
        dateRange: `${new Date(event.start.dateTime).toLocaleString()} - ${new Date(event.end.dateTime).toLocaleString()}`,
        startDate: event.start.dateTime,
        endDate: event.end.dateTime,
    };
}

// Create event HTML markup
function createEvent(event, index) {
    return `
        <div class="event" id="event-${index}">
            <h4>${event.name}</h4>
            <p>${event.location}</p>
            <p><strong>Date & Time:</strong> ${event.dateRange}</p>
        </div>
    `;
}

// Event details toggle
eventContainer.addEventListener('click', (e) => {
    if (e.target.hasAttribute('aria-expanded')) {
        e.target.setAttribute('aria-expanded', e.target.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
        e.target.querySelector('svg').classList.toggle('rotate-180');
        e.target.nextElementSibling.classList.toggle('hidden');
    }
});

// Update the number of events to fetch
eventAmtToFetch.addEventListener('change', (e) => loadEvents(eventAmtToFetch.value));

// Load the events when the page is loaded
loadEvents();

// import './style.css';

// const eventContainer = document.querySelector('#events-container');
// const eventAmtToFetch = document.querySelector('#eventAmt');
// const loadingContainer = document.querySelector('#loading-container');

// // Your Google Calendar API Key and Public Calendar ID
// const API_KEY = 'AIzaSyDwz0aveLafbgDWgTu3Lp62aUuwxEa4nyI';
// const PUBLIC_CALENDAR_ID = 'c_316c4a74143091cb754c41171c7cc71542ab8b66699f18f65942bc524f3e31df@group.calendar.google.com';

// // Leaflet map initialization (center on default location)
// const map = L.map('map').setView([51.505, -0.09], 13); // Default center for the map

// // OpenStreetMap tiles
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// async function geocodeLocation(location) {
//   const apiKey = '0cdb5c3c091440bb8dbcd41eca30c63a';
//   const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;

//   try {
//     const response = await fetch(geocodeUrl);
//     const data = await response.json();

//     if (data.results.length > 0) {
//       const coordinates = data.results[0].geometry;
//       return { lat: coordinates.lat, lng: coordinates.lng };
//     } else {
//       console.log('No coordinates found for location:', location);
//       return null;
//     }
//   } catch (error) {
//     console.error('Error geocoding location:', error);
//     return null;
//   }
// }

// async function loadEvents(max = 8) {
//   try {
//     loadingContainer.classList.remove('hide');
//     const endpoint = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${PUBLIC_CALENDAR_ID}/events?maxResults=${max}&key=${API_KEY}`);
//     const data = await endpoint.json();

//     const processedEvents = await Promise.all(data.items.map(async (event) => {
//       const eventObj = mapEventObject(event);
//       if (eventObj.location) {
//         const coordinates = await geocodeLocation(eventObj.location);
//         if (coordinates) {
//           L.marker([coordinates.lat, coordinates.lng])
//             .addTo(map)
//             .bindPopup(`<b>${eventObj.name}</b><br>${eventObj.location}<br>${eventObj.dateRange}`)
//             .openPopup();
//         }
//       }
//       return eventObj;
//     }));

//     loadingContainer.classList.add('hide');
//     eventContainer.innerHTML = processedEvents.length > 0
//       ? processedEvents.map((event, i) => createEvent(event, i)).join('')
//       : `<p class="text-center text-3xl">No events available</p>`;
//   } catch (e) {
//     console.error('Error fetching events:', e);
//     loadingContainer.classList.add('hide');
//     eventContainer.innerHTML = `<p class="text-center text-3xl">🙀 Something went wrong!</p>`;
//   }
// }

// loadEvents();

// // Event details toggle
// eventContainer.addEventListener('click', (e) => {
//   if (e.target.hasAttribute('aria-expanded')) {
//     e.target.setAttribute('aria-expanded', e.target.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
//     e.target.querySelector('svg').classList.toggle('rotate-180');
//     e.target.nextElementSibling.classList.toggle('hidden');
//   }
// });

// // Update the number of events to fetch
// eventAmtToFetch.addEventListener('change', (e) => loadEvents(eventAmtToFetch.value));
// import './style.css';

// // HTML element references
// const eventContainer = document.querySelector('#events-container');
// const eventAmtToFetch = document.querySelector('#eventAmt');
// const loadingContainer = document.querySelector('#loading-container');

// // Your Google Calendar API Key and Public Calendar ID
// const API_KEY = 'AIzaSyDwz0aveLafbgDWgTu3Lp62aUuwxEa4nyI';
// const PUBLIC_CALENDAR_ID = 'c_316c4a74143091cb754c41171c7cc71542ab8b66699f18f65942bc524f3e31df@group.calendar.google.com';
// const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com'; // Add your Google Client ID
// const SCOPES = 'https://www.googleapis.com/auth/calendar';

// let gapiInited = false;
// let gisInited = false;
// let currentUser = null;

// // Leaflet map initialization (center on default location)
// const map = L.map('map').setView([51.505, -0.09], 13); // Default center for the map

// // OpenStreetMap tiles
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// // Google Calendar events fetching
// async function loadEvents(max = 8) {
//     try {
//         loadingContainer.classList.remove('hide');
//         const endpoint = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${PUBLIC_CALENDAR_ID}/events?maxResults=${max}&key=${API_KEY}`);
//         const data = await endpoint.json();

//         const processedEvents = await Promise.all(data.items.map(async (event) => {
//             const eventObj = mapEventObject(event);
//             if (eventObj.location) {
//                 const coordinates = await geocodeLocation(eventObj.location);
//                 if (coordinates) {
//                     L.marker([coordinates.lat, coordinates.lng])
//                         .addTo(map)
//                         .bindPopup(`<b>${eventObj.name}</b><br>${eventObj.location}<br>${eventObj.dateRange}`)
//                         .openPopup();
//                 }
//             }
//             return eventObj;
//         }));

//         loadingContainer.classList.add('hide');
//         eventContainer.innerHTML = processedEvents.length > 0
//             ? processedEvents.map((event, i) => createEvent(event, i)).join('')
//             : `<p class="text-center text-3xl">No events available</p>`;
//     } catch (e) {
//         console.error('Error fetching events:', e);
//         loadingContainer.classList.add('hide');
//         eventContainer.innerHTML = `<p class="text-center text-3xl">🙀 Something went wrong!</p>`;
//     }
// }

// // Geocode event locations (using OpenCage API)
// async function geocodeLocation(location) {
//     const apiKey = '0cdb5c3c091440bb8dbcd41eca30c63a'; // OpenCage API key
//     const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;

//     try {
//         const response = await fetch(geocodeUrl);
//         const data = await response.json();

//         if (data.results.length > 0) {
//             const coordinates = data.results[0].geometry;
//             return { lat: coordinates.lat, lng: coordinates.lng };
//         } else {
//             console.log('No coordinates found for location:', location);
//             return null;
//         }
//     } catch (error) {
//         console.error('Error geocoding location:', error);
//         return null;
//     }
// }

// // Map event object to required format for display
// function mapEventObject(event) {
//     return {
//         name: event.summary,
//         location: event.location,
//         dateRange: `${new Date(event.start.dateTime).toLocaleString()} - ${new Date(event.end.dateTime).toLocaleString()}`,
//         startDate: event.start.dateTime,
//         endDate: event.end.dateTime,
//     };
// }

// // Create event HTML markup
// function createEvent(event, index) {
//     return `
//         <div class="event" id="event-${index}">
//             <h4>${event.name}</h4>
//             <p>${event.location}</p>
//             <p><strong>Date & Time:</strong> ${event.dateRange}</p>
//         </div>
//     `;
// }

// // Event details toggle
// eventContainer.addEventListener('click', (e) => {
//     if (e.target.hasAttribute('aria-expanded')) {
//         e.target.setAttribute('aria-expanded', e.target.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
//         e.target.querySelector('svg').classList.toggle('rotate-180');
//         e.target.nextElementSibling.classList.toggle('hidden');
//     }
// });

// // Update the number of events to fetch
// eventAmtToFetch.addEventListener('change', (e) => loadEvents(eventAmtToFetch.value));

// // Google API Client Initialization and Authentication
// function gapiInit() {
//     gapi.client.init({
//         apiKey: API_KEY,
//         clientId: CLIENT_ID,
//         scope: SCOPES,
//         discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
//     }).then(function () {
//         gapiInited = true;
//         checkAuth();
//     });
// }

// function gisInit() {
//     gapi.load('client:auth2', gapiInit);
// }

// function checkAuth() {
//     currentUser = gapi.auth2.getAuthInstance().currentUser.get();
//     if (currentUser && currentUser.isSignedIn()) {
//         // User is authenticated
//         const accessToken = currentUser.getAuthResponse().access_token;
//         console.log("Access Token:", accessToken);
//         // Hide the login button
//         document.getElementById('login-button').style.display = 'none';
//     } else {
//         // User is not authenticated, so show login button
//         document.getElementById('login-button').style.display = 'block';
//     }
// }

// // Sign in the user and get the access token
// function handleAuthClick() {
//     gapi.auth2.getAuthInstance().signIn().then(function () {
//         checkAuth();
//     });
// }

// // Create an event using Google Calendar API
// async function createEvent(eventData) {
//     const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

//     const eventPayload = {
//         summary: eventData.name,
//         description: eventData.description,
//         start: {
//             dateTime: eventData.start,
//             timeZone: 'America/New_York'
//         },
//         end: {
//             dateTime: eventData.end,
//             timeZone: 'America/New_York'
//         }
//     };

//     try {
//         const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//             },
//             body: JSON.stringify(eventPayload)
//         });
//         const data = await response.json();
//         if (response.ok) {
//             alert('Event created successfully!');
//             console.log('Created Event:', data);
//         } else {
//             alert('Error creating event');
//             console.error(data);
//         }
//     } catch (error) {
//         alert('Error creating event');
//         console.error(error);
//     }
// }

// // Load Google APIs
// gisInit();

// // Event form submission handling
// document.querySelector('#create-event-form').addEventListener('submit', function (e) {
//     e.preventDefault();
//     const eventName = document.querySelector('#event-name').value;
//     const eventDescription = document.querySelector('#event-description').value;
//     const eventStart = document.querySelector('#event-start').value;
//     const eventEnd = document.querySelector('#event-end').value;

//     if (!eventName || !eventStart || !eventEnd) {
//         alert('Please fill out all required fields');
//         return;
//     }

//     const eventData = {
//         name: eventName,
//         description: eventDescription,
//         start: eventStart,
//         end: eventEnd
//     };

//     // Call function to create event
//     createEvent(eventData);
// });

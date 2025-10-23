# MD Health Connexions - Event Management System

## Overview
This is a fully functional event management system with an admin panel that syncs in real-time with the public events page.

## Files Created
1. **api.js** - Backend API using localStorage for data persistence
2. **admin.html** - Admin panel for event management
3. **admin.js** - Admin panel JavaScript functionality
4. **upcoming-events.html** - Updated to use dynamic data from API

## Features

### Admin Panel (admin.html)
- **Login System**: Username: `admin`, Password: `admin123`
- **Dashboard**: Real-time statistics and overview
- **Event Management**:
  - Create new events
  - Edit existing events
  - Delete events with confirmation
  - Search and filter events
  - Export events (CSV/JSON)
- **Dynamic Fields**:
  - Title, Date, Time, Location
  - Description, Max Attendees, CPD Points
  - Tags system (dynamic tag input)
  - Status (Draft/Published/Cancelled)

### Public Events Page (upcoming-events.html)
- **Real-time Sync**: Auto-updates every 5 seconds
- **Three View Modes**:
  - List View - Detailed event cards
  - Calendar View - Monthly calendar with events
  - Day View - Events for specific days
- **Event Registration**: Registration form for attendees
- **Only Shows Published Events**: Draft and cancelled events are hidden

## How It Works

### Data Flow
```
Admin Panel (admin.html)
    ↓
Creates/Edits/Deletes Event
    ↓
Saves to localStorage (via api.js)
    ↓
Public Page (upcoming-events.html)
    ↓
Auto-refreshes every 5 seconds
    ↓
Displays Updated Events
```

### Real-time Synchronization
1. Open **admin.html** in one browser tab/window
2. Open **upcoming-events.html** in another tab/window
3. In admin panel:
   - Add a new event
   - Edit an existing event
   - Delete an event
4. Within 5 seconds, the changes appear on the public page!

## Usage Instructions

### For Administrators
1. Open `admin.html`
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`
3. Dashboard shows statistics
4. Navigate to "All Events" to manage events
5. Click "Add New Event" to create an event
6. Click edit icon to modify events
7. Click delete icon to remove events
8. Use search and filters to find events
9. Export events using the Export button

### For Public Users
1. Open `upcoming-events.html`
2. Browse events in three different views
3. Register for events using the "Register Now" button
4. Events automatically update when admins make changes

## Event Status

- **Published**: Visible on public page
- **Draft**: Only visible in admin panel
- **Cancelled**: Hidden from public page

## Data Storage
- All data is stored in browser's **localStorage**
- Data persists across browser sessions
- Data is browser-specific (not shared across different browsers)

## Features Breakdown

### Admin Panel Features
✅ User authentication
✅ Dashboard with statistics
✅ Create/Read/Update/Delete events
✅ Search functionality
✅ Status filtering
✅ Tag management
✅ Export to CSV/JSON
✅ Responsive design
✅ Modal-based forms
✅ Confirmation dialogs

### Public Page Features
✅ List view with event cards
✅ Calendar view with monthly display
✅ Day view with schedule
✅ Event registration form
✅ Real-time data synchronization
✅ Responsive design
✅ Only shows published events
✅ Auto-refresh every 5 seconds

## Technical Details

### Technologies Used
- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript
- localStorage API
- Font Awesome Icons
- Google Fonts

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

### No Server Required
This system runs entirely in the browser with no backend server needed. Perfect for:
- Quick deployments
- Testing and development
- Small-scale event management
- Offline usage

## Customization

### Change Default Login Credentials
Edit `api.js`, find the `initializeData()` function, and modify:
```javascript
const defaultUsers = [
    {
        username: 'your-username',
        password: 'your-password',
        ...
    }
];
```

### Adjust Auto-refresh Interval
Edit `upcoming-events.html`, find:
```javascript
setInterval(() => {
    loadEventsFromAPI();
}, 5000); // Change 5000 to your preferred milliseconds
```

### Add More Event Fields
1. Update the event schema in `api.js`
2. Add form fields in `admin.html`
3. Update the rendering in `upcoming-events.html`

## Future Enhancements
- Email notifications
- Image uploads for events
- Multi-user support with roles
- Event categories
- Advanced search filters
- Registration management dashboard
- Export registrations
- Calendar integration (iCal/Google Calendar)
- Backend database integration

## Support
For issues or questions, please refer to the code comments or contact the development team.

---

**MD Health Connexions** - We Connect Healthcare Professionals

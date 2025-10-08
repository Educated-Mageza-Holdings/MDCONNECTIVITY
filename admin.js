// MD Health Connexions - Admin Panel JavaScript
// Main functionality for the admin panel

// Initialize API
const api = new EventsAPI();

// State management
let currentEventId = null;
let eventTags = [];

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginAlert = document.getElementById('loginAlert');
const logoutBtn = document.getElementById('logoutBtn');

// Pages
const pages = {
    overview: document.getElementById('overviewPage'),
    events: document.getElementById('eventsPage'),
    gallery: document.getElementById('galleryPage'),
    content: document.getElementById('contentPage'),
    registrations: document.getElementById('registrationsPage'),
    settings: document.getElementById('settingsPage')
};

// Menu links
const menuLinks = document.querySelectorAll('.menu-link');

// Event modal
const eventModal = document.getElementById('eventModal');
const eventForm = document.getElementById('eventForm');
const closeEventModal = document.getElementById('closeEventModal');
const cancelEventBtn = document.getElementById('cancelEventBtn');
const addEventBtn = document.getElementById('addEventBtn');

// Delete modal
const deleteModal = document.getElementById('deleteModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Tags input
const tagsInput = document.getElementById('tagsInput');
const tagsContainer = document.getElementById('tagsContainer');

// Initialize app
function initializeApp() {
    // Check if user is logged in
    if (api.isAuthenticated()) {
        showDashboard();
        loadDashboardData();
    } else {
        showLogin();
    }

    setupEventListeners();
}

// Show login page
function showLogin() {
    loginPage.style.display = 'flex';
    dashboard.classList.remove('active');
}

// Show dashboard
function showDashboard() {
    loginPage.style.display = 'none';
    dashboard.classList.add('active');

    // Load user info
    const session = api.getSession();
    if (session) {
        document.getElementById('userDisplayName').textContent = session.username;
        document.getElementById('userDisplayRole').textContent = session.role.charAt(0).toUpperCase() + session.role.slice(1);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Menu navigation
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.dataset.page;
            navigateToPage(pageName);
        });
    });

    // Add event button
    addEventBtn.addEventListener('click', () => openEventModal());

    // Event form
    eventForm.addEventListener('submit', handleEventFormSubmit);

    // Modal close buttons
    closeEventModal.addEventListener('click', closeEventModalFn);
    cancelEventBtn.addEventListener('click', closeEventModalFn);

    closeDeleteModal.addEventListener('click', closeDeleteModalFn);
    cancelDeleteBtn.addEventListener('click', closeDeleteModalFn);

    // Confirm delete
    confirmDeleteBtn.addEventListener('click', handleDeleteEvent);

    // Search and filters
    const eventSearch = document.getElementById('eventSearch');
    const statusFilter = document.getElementById('statusFilter');

    if (eventSearch) {
        eventSearch.addEventListener('input', loadEvents);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', loadEvents);
    }

    // Tags input
    tagsInput.addEventListener('keydown', handleTagInput);

    // Export button
    const exportBtn = document.getElementById('exportEventsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportEvents);
    }

    // Export registrations button
    const exportRegistrationsBtn = document.getElementById('exportRegistrationsBtn');
    if (exportRegistrationsBtn) {
        exportRegistrationsBtn.addEventListener('click', exportRegistrations);
    }

    // View all events button
    const viewAllEventsBtn = document.getElementById('viewAllEventsBtn');
    if (viewAllEventsBtn) {
        viewAllEventsBtn.addEventListener('click', () => navigateToPage('events'));
    }

    // Registration search and filter
    const registrationSearch = document.getElementById('registrationSearch');
    const registrationEventFilter = document.getElementById('registrationEventFilter');

    if (registrationSearch) {
        registrationSearch.addEventListener('input', loadRegistrations);
    }

    if (registrationEventFilter) {
        registrationEventFilter.addEventListener('change', loadRegistrations);
    }

    // Close modals on overlay click
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) closeEventModalFn();
    });

    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModalFn();
    });
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');

    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="spinner"></span> Logging in...';

    // Simulate API call delay
    setTimeout(() => {
        const result = api.login(username, password);

        if (result.success) {
            showAlert('Login successful!', 'success');
            setTimeout(() => {
                showDashboard();
                loadDashboardData();
            }, 500);
        } else {
            showAlert(result.message, 'error');
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt" style="margin-right: 0.5rem;"></i> Login';
        }
    }, 1000);
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        api.logout();
        showLogin();
        loginForm.reset();
        showAlert('Logged out successfully', 'success');
    }
}

// Show alert
function showAlert(message, type) {
    loginAlert.textContent = message;
    loginAlert.className = `alert alert-${type} show`;

    setTimeout(() => {
        loginAlert.classList.remove('show');
    }, 3000);
}

// Navigate to page
function navigateToPage(pageName) {
    // Update active menu link
    menuLinks.forEach(link => {
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Show selected page
    Object.keys(pages).forEach(key => {
        if (key === pageName) {
            pages[key].style.display = 'block';
        } else {
            pages[key].style.display = 'none';
        }
    });

    // Load page data
    switch (pageName) {
        case 'overview':
            loadDashboardData();
            break;
        case 'events':
            loadEvents();
            break;
        case 'gallery':
            if (typeof loadGallery === 'function') loadGallery();
            break;
        case 'content':
            if (typeof loadContentEditor === 'function') loadContentEditor();
            break;
        case 'registrations':
            loadRegistrations();
            break;
        case 'settings':
            // Settings page
            break;
    }
}

// Load dashboard data
function loadDashboardData() {
    const stats = api.getStatistics();
    renderStatistics(stats);
    renderRecentEvents();
}

// Render statistics
function renderStatistics(stats) {
    const statsGrid = document.getElementById('statsGrid');

    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-value">${stats.totalEvents}</div>
                    <div class="stat-label">Total Events</div>
                </div>
                <div class="stat-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
            </div>
        </div>

        <div class="stat-card success">
            <div class="stat-header">
                <div>
                    <div class="stat-value">${stats.upcomingEvents}</div>
                    <div class="stat-label">Upcoming Events</div>
                </div>
                <div class="stat-icon">
                    <i class="fas fa-calendar-check"></i>
                </div>
            </div>
        </div>

        <div class="stat-card warning">
            <div class="stat-header">
                <div>
                    <div class="stat-value">${stats.draftEvents}</div>
                    <div class="stat-label">Draft Events</div>
                </div>
                <div class="stat-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
            </div>
        </div>

        <div class="stat-card danger">
            <div class="stat-header">
                <div>
                    <div class="stat-value">${stats.totalAttendees}</div>
                    <div class="stat-label">Total Registrations</div>
                </div>
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
            </div>
        </div>
    `;
}

// Render recent events
function renderRecentEvents() {
    const events = api.getAllEvents({ status: 'published' }).slice(0, 5);
    const tableContainer = document.getElementById('recentEventsTable');

    if (events.length === 0) {
        tableContainer.innerHTML = '<div class="empty-state"><p>No events found</p></div>';
        return;
    }

    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Attendees</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${events.map(event => `
                    <tr>
                        <td><strong>${event.title}</strong></td>
                        <td>${formatDate(event.date)}</td>
                        <td>${event.location}</td>
                        <td>${event.attendees || 0} / ${event.maxAttendees || 'N/A'}</td>
                        <td><span class="badge badge-${event.status}">${event.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Load events
function loadEvents() {
    const search = document.getElementById('eventSearch')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';

    const filters = {
        search: search,
        status: status
    };

    const events = api.getAllEvents(filters);
    renderEventsTable(events);
}

// Render events table
function renderEventsTable(events) {
    const tableContainer = document.getElementById('eventsTable');

    if (events.length === 0) {
        tableContainer.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-times"></i><h3>No events found</h3><p>Try adjusting your search or filters</p></div>';
        return;
    }

    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Attendees</th>
                    <th>CPD Points</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${events.map(event => `
                    <tr>
                        <td>
                            <strong>${event.title}</strong>
                            <div style="font-size: 0.85rem; color: var(--text-light); margin-top: 0.3rem;">
                                ${event.description.substring(0, 60)}...
                            </div>
                        </td>
                        <td>${formatDate(event.date)}<br><small>${event.time}</small></td>
                        <td>${event.location}</td>
                        <td>${event.attendees || 0} / ${event.maxAttendees || 'N/A'}</td>
                        <td>${event.cpdPoints || 0}</td>
                        <td><span class="badge badge-${event.status}">${event.status}</span></td>
                        <td>
                            <div class="actions-cell">
                                <button class="btn btn-icon btn-outline" onclick="editEvent(${event.id})" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-icon btn-danger" onclick="openDeleteModal(${event.id})" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Open event modal
function openEventModal(eventId = null) {
    currentEventId = eventId;
    eventTags = [];

    if (eventId) {
        // Edit mode
        const event = api.getEventById(eventId);
        document.getElementById('eventModalTitle').textContent = 'Edit Event';
        populateEventForm(event);
    } else {
        // Add mode
        document.getElementById('eventModalTitle').textContent = 'Add New Event';
        eventForm.reset();
        document.getElementById('eventId').value = '';
        renderTags();
    }

    eventModal.classList.add('active');
}

// Populate event form
function populateEventForm(event) {
    document.getElementById('eventId').value = event.id;
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventEndTime').value = event.endTime || '';
    document.getElementById('eventDuration').value = event.duration || '';
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('eventMaxAttendees').value = event.maxAttendees || '';
    document.getElementById('eventCPD').value = event.cpdPoints || '';
    document.getElementById('eventStatus').value = event.status;

    eventTags = event.tags || [];
    renderTags();
}

// Handle tag input
function handleTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const tag = tagsInput.value.trim();

        if (tag && !eventTags.includes(tag)) {
            eventTags.push(tag);
            renderTags();
            tagsInput.value = '';
        }
    }
}

// Render tags
function renderTags() {
    const existingInput = tagsInput;
    const inputValue = existingInput.value;

    tagsContainer.innerHTML = eventTags.map(tag => `
        <span class="tag-item">
            ${tag}
            <button type="button" class="tag-remove" onclick="removeTag('${tag}')">
                <i class="fas fa-times"></i>
            </button>
        </span>
    `).join('');

    // Re-add input
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.id = 'tagsInput';
    newInput.placeholder = 'Type and press Enter';
    newInput.value = inputValue;
    newInput.addEventListener('keydown', handleTagInput);

    tagsContainer.appendChild(newInput);
}

// Remove tag
function removeTag(tag) {
    eventTags = eventTags.filter(t => t !== tag);
    renderTags();
}

// Handle event form submit
function handleEventFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(eventForm);
    const eventData = {
        title: formData.get('title'),
        date: formData.get('date'),
        time: formData.get('time'),
        endTime: formData.get('endTime'),
        duration: formData.get('duration'),
        location: formData.get('location'),
        description: formData.get('description'),
        maxAttendees: parseInt(formData.get('maxAttendees')) || null,
        cpdPoints: parseFloat(formData.get('cpdPoints')) || 0,
        status: formData.get('status'),
        tags: eventTags
    };

    try {
        if (currentEventId) {
            // Update existing event
            api.updateEvent(currentEventId, eventData);
            alert('Event updated successfully!');
        } else {
            // Create new event
            api.createEvent(eventData);
            alert('Event created successfully!');
        }

        closeEventModalFn();
        loadEvents();
        loadDashboardData();
    } catch (error) {
        alert('Error saving event: ' + error.message);
    }
}

// Close event modal
function closeEventModalFn() {
    eventModal.classList.remove('active');
    eventForm.reset();
    currentEventId = null;
    eventTags = [];
}

// Edit event
function editEvent(eventId) {
    openEventModal(eventId);
}

// Open delete modal
function openDeleteModal(eventId) {
    currentEventId = eventId;
    const event = api.getEventById(eventId);

    document.getElementById('deleteEventName').textContent = event.title;
    deleteModal.classList.add('active');
}

// Close delete modal
function closeDeleteModalFn() {
    deleteModal.classList.remove('active');
    currentEventId = null;
}

// Handle delete event
function handleDeleteEvent() {
    if (!currentEventId) return;

    try {
        api.deleteEvent(currentEventId);
        alert('Event deleted successfully!');
        closeDeleteModalFn();
        loadEvents();
        loadDashboardData();
    } catch (error) {
        alert('Error deleting event: ' + error.message);
    }
}

// Export events
function exportEvents() {
    const format = confirm('Export as CSV? Click OK for CSV, Cancel for JSON') ? 'csv' : 'json';
    const data = api.exportEvents(format);
    const filename = `events_export_${new Date().toISOString().split('T')[0]}.${format}`;

    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Load registrations
function loadRegistrations() {
    const search = document.getElementById('registrationSearch')?.value || '';
    const eventFilter = document.getElementById('registrationEventFilter')?.value || '';

    // Get all registrations
    let registrations = JSON.parse(localStorage.getItem('mdhc_registrations')) || [];

    // Apply filters
    if (eventFilter) {
        registrations = registrations.filter(r => r.eventId === parseInt(eventFilter));
    }

    if (search) {
        const searchLower = search.toLowerCase();
        registrations = registrations.filter(r =>
            r.firstName?.toLowerCase().includes(searchLower) ||
            r.lastName?.toLowerCase().includes(searchLower) ||
            r.email?.toLowerCase().includes(searchLower) ||
            r.phone?.toLowerCase().includes(searchLower) ||
            r.refNumber?.toLowerCase().includes(searchLower)
        );
    }

    // Populate event filter dropdown
    populateEventFilterDropdown();

    // Render stats and table
    renderRegistrationStats();
    renderRegistrationsTable(registrations);
}

// Populate event filter dropdown
function populateEventFilterDropdown() {
    const eventFilter = document.getElementById('registrationEventFilter');
    if (!eventFilter) return;

    const events = api.getAllEvents();
    const currentValue = eventFilter.value;

    eventFilter.innerHTML = '<option value="">All Events</option>';

    events.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = event.title;
        eventFilter.appendChild(option);
    });

    eventFilter.value = currentValue;
}

// Render registration stats
function renderRegistrationStats() {
    const statsGrid = document.getElementById('registrationStatsGrid');
    if (!statsGrid) return;

    const registrations = JSON.parse(localStorage.getItem('mdhc_registrations')) || [];
    const events = api.getAllEvents({ status: 'published' });

    // Calculate stats
    const totalRegistrations = registrations.length;
    const uniqueEmails = new Set(registrations.map(r => r.email)).size;
    const eventsWithRegistrations = new Set(registrations.map(r => r.eventId)).size;

    // Get registrations from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = registrations.filter(r => new Date(r.createdAt) >= sevenDaysAgo).length;

    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-value">${totalRegistrations}</div>
                    <div class="stat-label">Total Registrations</div>
                </div>
                <div class="stat-icon">
                    <i class="fas fa-user-check"></i>
                </div>
            </div>
        </div>

        <div class="stat-card success">
            <div class="stat-header">
                <div>
                    <div class="stat-value">${uniqueEmails}</div>
                    <div class="stat-label">Unique Participants</div>
                </div>
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
            </div>
        </div>

        <div class="stat-card warning">
            <div class="stat-header">
                <div>
                    <div class="stat-value">${eventsWithRegistrations}</div>
                    <div class="stat-label">Events with Registrations</div>
                </div>
                <div class="stat-icon">
                    <i class="fas fa-calendar-check"></i>
                </div>
            </div>
        </div>

        <div class="stat-card danger">
            <div class="stat-header">
                <div>
                    <div class="stat-value">${recentRegistrations}</div>
                    <div class="stat-label">Last 7 Days</div>
                </div>
                <div class="stat-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
            </div>
        </div>
    `;
}

// Render registrations table
function renderRegistrationsTable(registrations) {
    const tableContainer = document.getElementById('registrationsTable');
    if (!tableContainer) return;

    if (registrations.length === 0) {
        tableContainer.innerHTML = '<div class="empty-state"><i class="fas fa-user-times"></i><h3>No registrations found</h3><p>No participants have registered yet or no matches found.</p></div>';
        return;
    }

    // Sort by date (newest first)
    registrations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Ref Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Event</th>
                    <th>Profession</th>
                    <th>Date Registered</th>
                    <th>Dietary</th>
                </tr>
            </thead>
            <tbody>
                ${registrations.map(reg => {
                    const event = api.getEventById(reg.eventId);
                    const eventTitle = event ? event.title : 'Unknown Event';

                    return `
                        <tr>
                            <td><strong>${reg.refNumber || 'N/A'}</strong></td>
                            <td>${reg.firstName || ''} ${reg.lastName || ''}</td>
                            <td>${reg.email || 'N/A'}</td>
                            <td>${reg.phone || 'N/A'}</td>
                            <td><small>${eventTitle}</small></td>
                            <td>${reg.profession || 'N/A'}</td>
                            <td>${formatDateTime(reg.createdAt)}</td>
                            <td>${reg.dietaryRestrictions || '-'}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Export registrations
function exportRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('mdhc_registrations')) || [];

    if (registrations.length === 0) {
        alert('No registrations to export');
        return;
    }

    const format = confirm('Export as CSV? Click OK for CSV, Cancel for JSON') ? 'csv' : 'json';

    if (format === 'csv') {
        const headers = ['Ref Number', 'First Name', 'Last Name', 'Email', 'Phone', 'Event', 'Profession', 'Practice Number', 'Organization', 'Dietary Restrictions', 'Special Requirements', 'Date Registered'];
        const rows = registrations.map(reg => {
            const event = api.getEventById(reg.eventId);
            return [
                reg.refNumber || '',
                reg.firstName || '',
                reg.lastName || '',
                reg.email || '',
                reg.phone || '',
                event ? event.title : 'Unknown',
                reg.profession || '',
                reg.practiceNumber || '',
                reg.organization || '',
                reg.dietaryRestrictions || '',
                reg.specialRequirements || '',
                formatDateTime(reg.createdAt)
            ];
        });

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        downloadFile(csvContent, `registrations_export_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    } else {
        const jsonContent = JSON.stringify(registrations, null, 2);
        downloadFile(jsonContent, `registrations_export_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    }
}

// Format date time
function formatDateTime(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Download file helper
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Make functions global for onclick handlers
window.editEvent = editEvent;
window.openDeleteModal = openDeleteModal;
window.removeTag = removeTag;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

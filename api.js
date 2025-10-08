// MD Health Connexions - Events API
// Backend API for event management

class EventsAPI {
    constructor() {
        this.storageKey = 'mdhc_events';
        this.usersKey = 'mdhc_admin_users';
        this.registrationsKey = 'mdhc_registrations';
        this.galleryKey = 'mdhc_gallery';
        this.contentKey = 'mdhc_content';
        this.initializeData();
    }

    // Initialize default data
    initializeData() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultEvents = [
                {
                    id: 1,
                    title: "Klerksdorp CPD Seminar: Advances in Cardiology",
                    date: "2025-09-25",
                    time: "09:00",
                    endTime: "17:00",
                    duration: "8 hours",
                    location: "Klerksdorp Convention Centre",
                    description: "Join leading cardiologists for a comprehensive day covering the latest advances in interventional cardiology, heart failure management, and preventive cardiac care. This accredited seminar includes case studies and hands-on workshops.",
                    attendees: 120,
                    maxAttendees: 150,
                    cpdPoints: 8,
                    tags: ["Cardiology", "CPD Accredited", "Hands-on", "Case Studies"],
                    status: "published",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "Piet Retief Medical Workshop: Primary Healthcare Excellence",
                    date: "2025-09-28",
                    time: "08:30",
                    endTime: "16:30",
                    duration: "8 hours",
                    location: "Piet Retief Hospital Conference Hall",
                    description: "A focused workshop series for primary healthcare practitioners covering patient management, diagnostic procedures, and healthcare delivery optimization in rural settings. Featuring expert speakers and interactive sessions.",
                    attendees: 80,
                    maxAttendees: 100,
                    cpdPoints: 6,
                    tags: ["Primary Care", "Rural Health", "Interactive", "Workshop"],
                    status: "published",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: "Kimberley CPD Symposium: Modern Medical Practice",
                    date: "2025-10-15",
                    time: "08:00",
                    endTime: "18:00",
                    duration: "10 hours",
                    location: "Kimberley Medical Centre",
                    description: "A comprehensive 2-day symposium covering telemedicine, digital health records, patient communication, and modern medical technologies. Network with healthcare professionals from across the Northern Cape province.",
                    attendees: 200,
                    maxAttendees: 250,
                    cpdPoints: 10,
                    tags: ["Telemedicine", "Digital Health", "2-Day Event", "Networking"],
                    status: "published",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 4,
                    title: "Cape Town Healthcare Innovation Summit",
                    date: "2025-10-22",
                    time: "09:00",
                    endTime: "17:30",
                    duration: "8.5 hours",
                    location: "Cape Town International Convention Centre",
                    description: "Join the largest healthcare innovation summit in South Africa. Explore cutting-edge medical technologies, AI in healthcare, research collaborations, and the future of medical practice. International and local speakers.",
                    attendees: 500,
                    maxAttendees: 600,
                    cpdPoints: 12,
                    tags: ["Innovation", "AI & Technology", "Research", "International Speakers"],
                    status: "published",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(defaultEvents));
        }

        // Initialize admin user if not exists
        if (!localStorage.getItem(this.usersKey)) {
            const defaultUsers = [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123', // In production, this should be hashed
                    email: 'admin@mdhealthconnexions.co.za',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
        }

        // Initialize registrations storage
        if (!localStorage.getItem(this.registrationsKey)) {
            localStorage.setItem(this.registrationsKey, JSON.stringify([]));
        }

        // Initialize gallery storage
        if (!localStorage.getItem(this.galleryKey)) {
            const defaultGallery = [
                {
                    id: 1,
                    title: "Klerksdorp CPD Seminar",
                    description: "Full Day Event",
                    date: "September 2025",
                    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1153&q=80",
                    icon: "fa-map-marker-alt",
                    status: "published",
                    albumImages: [],
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "Kimberley CPD Symposium",
                    description: "2-Day Conference",
                    date: "October 2025",
                    imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1164&q=80",
                    icon: "fa-users",
                    status: "published",
                    albumImages: [],
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: "Piet Retief Seminar",
                    description: "Workshop Series",
                    date: "September 2025",
                    imageUrl: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
                    icon: "fa-graduation-cap",
                    status: "published",
                    albumImages: [],
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.galleryKey, JSON.stringify(defaultGallery));
        }

        // Initialize content storage
        if (!localStorage.getItem(this.contentKey)) {
            const defaultContent = {
                hero: {
                    title: "MD HEALTH CONNEXIONS",
                    subtitle: "Empowering Healthcare Excellence Through Education",
                    description: "Join us for accredited CPD seminars and workshops across South Africa. Connect with healthcare professionals and advance your medical career."
                },
                about: {
                    title: "About MD Health Connexions",
                    subtitle: "Your partner in continuous professional development",
                    description: "MD Health Connexions is a leading provider of continuing professional development (CPD) seminars and educational events for healthcare professionals across South Africa. We organize high-quality, accredited seminars in various locations including Klerksdorp, Kimberley, Piet Retief, and major cities nationwide."
                },
                services: {
                    title: "Our Services",
                    subtitle: "Comprehensive CPD solutions for healthcare professionals"
                },
                contact: {
                    email: "info@mdhealthconnexions.co.za",
                    phone: "+27 12 345 6789",
                    address: "123 Medical Drive, Pretoria, South Africa"
                }
            };
            localStorage.setItem(this.contentKey, JSON.stringify(defaultContent));
        }
    }

    // Get all events
    getAllEvents(filters = {}) {
        let events = JSON.parse(localStorage.getItem(this.storageKey)) || [];

        // Apply filters
        if (filters.status) {
            events = events.filter(event => event.status === filters.status);
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            events = events.filter(event =>
                event.title.toLowerCase().includes(searchLower) ||
                event.description.toLowerCase().includes(searchLower) ||
                event.location.toLowerCase().includes(searchLower)
            );
        }

        if (filters.dateFrom) {
            events = events.filter(event => event.date >= filters.dateFrom);
        }

        if (filters.dateTo) {
            events = events.filter(event => event.date <= filters.dateTo);
        }

        if (filters.tags && filters.tags.length > 0) {
            events = events.filter(event =>
                filters.tags.some(tag => event.tags.includes(tag))
            );
        }

        // Sort by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        return events;
    }

    // Get single event by ID
    getEventById(id) {
        const events = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        return events.find(event => event.id === parseInt(id));
    }

    // Create new event
    createEvent(eventData) {
        const events = JSON.parse(localStorage.getItem(this.storageKey)) || [];

        const newEvent = {
            id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
            ...eventData,
            attendees: 0,
            status: eventData.status || 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        events.push(newEvent);
        localStorage.setItem(this.storageKey, JSON.stringify(events));

        return newEvent;
    }

    // Update event
    updateEvent(id, eventData) {
        const events = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        const index = events.findIndex(event => event.id === parseInt(id));

        if (index === -1) {
            throw new Error('Event not found');
        }

        events[index] = {
            ...events[index],
            ...eventData,
            id: parseInt(id), // Ensure ID doesn't change
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(this.storageKey, JSON.stringify(events));

        return events[index];
    }

    // Delete event
    deleteEvent(id) {
        let events = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        const initialLength = events.length;

        events = events.filter(event => event.id !== parseInt(id));

        if (events.length === initialLength) {
            throw new Error('Event not found');
        }

        localStorage.setItem(this.storageKey, JSON.stringify(events));

        return { success: true, message: 'Event deleted successfully' };
    }

    // Bulk delete events
    bulkDeleteEvents(ids) {
        let events = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        events = events.filter(event => !ids.includes(event.id));
        localStorage.setItem(this.storageKey, JSON.stringify(events));

        return { success: true, message: `${ids.length} events deleted successfully` };
    }

    // Get event statistics
    getStatistics() {
        const events = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        const registrations = JSON.parse(localStorage.getItem(this.registrationsKey)) || [];

        const now = new Date();
        const upcomingEvents = events.filter(e => new Date(e.date) >= now && e.status === 'published');
        const pastEvents = events.filter(e => new Date(e.date) < now);
        const draftEvents = events.filter(e => e.status === 'draft');

        return {
            totalEvents: events.length,
            upcomingEvents: upcomingEvents.length,
            pastEvents: pastEvents.length,
            draftEvents: draftEvents.length,
            totalRegistrations: registrations.length,
            totalAttendees: events.reduce((sum, event) => sum + (event.attendees || 0), 0),
            averageAttendance: events.length > 0
                ? Math.round(events.reduce((sum, event) => sum + (event.attendees || 0), 0) / events.length)
                : 0
        };
    }

    // User authentication
    login(username, password) {
        const users = JSON.parse(localStorage.getItem(this.usersKey)) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            const session = {
                userId: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('mdhc_session', JSON.stringify(session));
            return { success: true, user: session };
        }

        return { success: false, message: 'Invalid username or password' };
    }

    // Check if user is logged in
    isAuthenticated() {
        const session = localStorage.getItem('mdhc_session');
        return session !== null;
    }

    // Get current session
    getSession() {
        const session = localStorage.getItem('mdhc_session');
        return session ? JSON.parse(session) : null;
    }

    // Logout
    logout() {
        localStorage.removeItem('mdhc_session');
        return { success: true, message: 'Logged out successfully' };
    }

    // Registration management
    createRegistration(registrationData) {
        const registrations = JSON.parse(localStorage.getItem(this.registrationsKey)) || [];

        const newRegistration = {
            id: registrations.length > 0 ? Math.max(...registrations.map(r => r.id)) + 1 : 1,
            ...registrationData,
            createdAt: new Date().toISOString()
        };

        registrations.push(newRegistration);
        localStorage.setItem(this.registrationsKey, JSON.stringify(registrations));

        // Update event attendee count
        const event = this.getEventById(registrationData.eventId);
        if (event) {
            this.updateEvent(event.id, { attendees: (event.attendees || 0) + 1 });
        }

        return newRegistration;
    }

    // Get registrations for an event
    getEventRegistrations(eventId) {
        const registrations = JSON.parse(localStorage.getItem(this.registrationsKey)) || [];
        return registrations.filter(r => r.eventId === parseInt(eventId));
    }

    // Export events data
    exportEvents(format = 'json') {
        const events = this.getAllEvents();

        if (format === 'csv') {
            const headers = ['ID', 'Title', 'Date', 'Time', 'Location', 'Attendees', 'CPD Points', 'Status'];
            const rows = events.map(event => [
                event.id,
                event.title,
                event.date,
                event.time,
                event.location,
                event.attendees,
                event.cpdPoints,
                event.status
            ]);

            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }

        return JSON.stringify(events, null, 2);
    }

    // Gallery Management
    getAllGalleryItems(filters = {}) {
        let items = JSON.parse(localStorage.getItem(this.galleryKey)) || [];

        if (filters.status) {
            items = items.filter(item => item.status === filters.status);
        }

        return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getGalleryItemById(id) {
        const items = JSON.parse(localStorage.getItem(this.galleryKey)) || [];
        return items.find(item => item.id === parseInt(id));
    }

    createGalleryItem(itemData) {
        const items = JSON.parse(localStorage.getItem(this.galleryKey)) || [];

        const newItem = {
            id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
            ...itemData,
            status: itemData.status || 'published',
            createdAt: new Date().toISOString()
        };

        items.push(newItem);
        localStorage.setItem(this.galleryKey, JSON.stringify(items));

        return newItem;
    }

    updateGalleryItem(id, itemData) {
        const items = JSON.parse(localStorage.getItem(this.galleryKey)) || [];
        const index = items.findIndex(item => item.id === parseInt(id));

        if (index === -1) {
            throw new Error('Gallery item not found');
        }

        items[index] = {
            ...items[index],
            ...itemData,
            id: parseInt(id)
        };

        localStorage.setItem(this.galleryKey, JSON.stringify(items));

        return items[index];
    }

    deleteGalleryItem(id) {
        let items = JSON.parse(localStorage.getItem(this.galleryKey)) || [];
        const initialLength = items.length;

        items = items.filter(item => item.id !== parseInt(id));

        if (items.length === initialLength) {
            throw new Error('Gallery item not found');
        }

        localStorage.setItem(this.galleryKey, JSON.stringify(items));

        return { success: true, message: 'Gallery item deleted successfully' };
    }

    // Content Management
    getContent() {
        return JSON.parse(localStorage.getItem(this.contentKey)) || {};
    }

    updateContent(section, data) {
        const content = this.getContent();
        content[section] = {
            ...content[section],
            ...data
        };
        localStorage.setItem(this.contentKey, JSON.stringify(content));
        return content[section];
    }

    updateAllContent(data) {
        localStorage.setItem(this.contentKey, JSON.stringify(data));
        return data;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventsAPI;
}

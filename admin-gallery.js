// Gallery and Content Management for Admin Panel

let currentGalleryId = null;
let albumImages = [];
let coverImageData = null; // Store cover image (URL or base64)

// Pages object update (add to existing pages in admin.js)
const galleryPage = document.getElementById('galleryPage');
const contentPage = document.getElementById('contentPage');

// Gallery elements
const addGalleryBtn = document.getElementById('addGalleryBtn');
const galleryModal = document.getElementById('galleryModal');
const galleryForm = document.getElementById('galleryForm');
const closeGalleryModal = document.getElementById('closeGalleryModal');
const cancelGalleryBtn = document.getElementById('cancelGalleryBtn');

// Delete gallery modal
const deleteGalleryModal = document.getElementById('deleteGalleryModal');
const closeDeleteGalleryModal = document.getElementById('closeDeleteGalleryModal');
const cancelDeleteGalleryBtn = document.getElementById('cancelDeleteGalleryBtn');
const confirmDeleteGalleryBtn = document.getElementById('confirmDeleteGalleryBtn');

// Content forms
const heroContentForm = document.getElementById('heroContentForm');
const aboutContentForm = document.getElementById('aboutContentForm');
const contactContentForm = document.getElementById('contactContentForm');

// Setup gallery event listeners
function setupGalleryListeners() {
    // Add gallery button
    if (addGalleryBtn) {
        addGalleryBtn.addEventListener('click', () => openGalleryModal());
    }

    // Gallery form
    if (galleryForm) {
        galleryForm.addEventListener('submit', handleGalleryFormSubmit);
    }

    // Gallery modal close
    if (closeGalleryModal) {
        closeGalleryModal.addEventListener('click', closeGalleryModalFn);
    }
    if (cancelGalleryBtn) {
        cancelGalleryBtn.addEventListener('click', closeGalleryModalFn);
    }

    // Add album image button
    const addAlbumImageBtn = document.getElementById('addAlbumImageBtn');
    if (addAlbumImageBtn) {
        addAlbumImageBtn.addEventListener('click', addAlbumImageField);
    }

    // Cover image upload/URL buttons
    const useUrlBtn = document.getElementById('useUrlBtn');
    const uploadFileBtn = document.getElementById('uploadFileBtn');
    const galleryImageUrl = document.getElementById('galleryImageUrl');
    const galleryImageFile = document.getElementById('galleryImageFile');

    if (useUrlBtn) {
        useUrlBtn.addEventListener('click', () => {
            galleryImageUrl.style.display = 'block';
            galleryImageFile.style.display = 'none';
            galleryImageUrl.required = true;
            galleryImageFile.required = false;
        });
    }

    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', () => {
            galleryImageFile.click();
        });
    }

    if (galleryImageFile) {
        galleryImageFile.addEventListener('change', handleCoverImageUpload);
    }

    // Album images upload button
    const uploadAlbumImagesBtn = document.getElementById('uploadAlbumImagesBtn');
    const albumImagesFileInput = document.getElementById('albumImagesFileInput');

    if (uploadAlbumImagesBtn) {
        uploadAlbumImagesBtn.addEventListener('click', () => {
            albumImagesFileInput.click();
        });
    }

    if (albumImagesFileInput) {
        albumImagesFileInput.addEventListener('change', handleAlbumImagesUpload);
    }

    // Delete gallery modal
    if (closeDeleteGalleryModal) {
        closeDeleteGalleryModal.addEventListener('click', closeDeleteGalleryModalFn);
    }
    if (cancelDeleteGalleryBtn) {
        cancelDeleteGalleryBtn.addEventListener('click', closeDeleteGalleryModalFn);
    }
    if (confirmDeleteGalleryBtn) {
        confirmDeleteGalleryBtn.addEventListener('click', handleDeleteGallery);
    }

    // Content forms
    if (heroContentForm) {
        heroContentForm.addEventListener('submit', (e) => handleContentFormSubmit(e, 'hero'));
    }
    if (aboutContentForm) {
        aboutContentForm.addEventListener('submit', (e) => handleContentFormSubmit(e, 'about'));
    }
    if (contactContentForm) {
        contactContentForm.addEventListener('submit', (e) => handleContentFormSubmit(e, 'contact'));
    }

    // Close modals on overlay click
    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) closeGalleryModalFn();
        });
    }

    if (deleteGalleryModal) {
        deleteGalleryModal.addEventListener('click', (e) => {
            if (e.target === deleteGalleryModal) closeDeleteGalleryModalFn();
        });
    }
}

// Load gallery items
function loadGallery() {
    const items = api.getAllGalleryItems();
    renderGalleryTable(items);
}

// Render gallery table
function renderGalleryTable(items) {
    const tableContainer = document.getElementById('galleryTable');

    if (items.length === 0) {
        tableContainer.innerHTML = '<div class="empty-state"><i class="fas fa-images"></i><h3>No gallery items found</h3><p>Add your first gallery item to get started</p></div>';
        return;
    }

    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Linked Event</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => {
                    let linkedEvent = '-';
                    if (item.eventId) {
                        const event = api.getEventById(item.eventId);
                        if (event) {
                            linkedEvent = `<small>${event.title}</small>`;
                        }
                    }
                    return `
                        <tr>
                            <td>
                                <img src="${item.imageUrl}" alt="${item.title}"
                                    style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px;">
                            </td>
                            <td>
                                <strong>${item.title}</strong>
                                ${item.albumImages && item.albumImages.length > 0 ? `<br><small style="color: var(--primary);">📸 ${item.albumImages.length} photos</small>` : ''}
                            </td>
                            <td>${item.description || '-'}</td>
                            <td>${linkedEvent}</td>
                            <td>${item.date || '-'}</td>
                            <td><span class="badge badge-${item.status}">${item.status}</span></td>
                            <td>
                                <div class="actions-cell">
                                    <button class="btn btn-icon btn-outline" onclick="editGalleryItem(${item.id})" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-icon btn-danger" onclick="openDeleteGalleryModal(${item.id})" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Open gallery modal
function openGalleryModal(itemId = null) {
    currentGalleryId = itemId;

    // Populate event dropdown
    populateEventDropdown();

    if (itemId) {
        // Edit mode
        const item = api.getGalleryItemById(itemId);
        document.getElementById('galleryModalTitle').textContent = 'Edit Gallery Item';
        populateGalleryForm(item);
    } else {
        // Add mode
        document.getElementById('galleryModalTitle').textContent = 'Add Gallery Item';
        galleryForm.reset();
        document.getElementById('galleryItemId').value = '';
    }

    galleryModal.classList.add('active');
}

// Populate event dropdown
function populateEventDropdown() {
    const eventSelect = document.getElementById('galleryEventId');
    if (!eventSelect) return;

    const events = api.getAllEvents();

    eventSelect.innerHTML = '<option value="">-- No Event Link --</option>';

    events.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = `${event.title} (${event.date})`;
        eventSelect.appendChild(option);
    });
}

// Populate gallery form
function populateGalleryForm(item) {
    document.getElementById('galleryItemId').value = item.id;
    document.getElementById('galleryTitle').value = item.title;
    document.getElementById('galleryDescription').value = item.description || '';
    document.getElementById('galleryDate').value = item.date || '';
    document.getElementById('galleryImageUrl').value = item.imageUrl;
    document.getElementById('galleryIcon').value = item.icon || '';
    document.getElementById('galleryEventId').value = item.eventId || '';
    document.getElementById('galleryStatus').value = item.status;

    // Show preview if it's a base64 image
    if (item.imageUrl && item.imageUrl.startsWith('data:image')) {
        const preview = document.getElementById('coverImagePreview');
        const previewImg = document.getElementById('coverPreviewImg');
        previewImg.src = item.imageUrl;
        preview.style.display = 'block';
    }

    // Populate album images
    albumImages = item.albumImages || [];
    renderAlbumImages();
}

// Add album image field
function addAlbumImageField() {
    albumImages.push('');
    renderAlbumImages();
}

// Remove album image
function removeAlbumImage(index) {
    albumImages.splice(index, 1);
    renderAlbumImages();
}

// Render album images
function renderAlbumImages() {
    const container = document.getElementById('albumImagesContainer');
    if (!container) return;

    container.innerHTML = albumImages.map((imageData, index) => {
        const isBase64 = imageData.startsWith('data:image');
        const displayValue = isBase64 ? 'Uploaded image' : imageData;

        return `
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                ${isBase64 ? `
                    <img src="${imageData}" alt="Thumbnail" style="width: 60px; height: 45px; object-fit: cover; border-radius: 6px; border: 2px solid var(--border);">
                    <input type="text"
                           class="album-image-input"
                           value="${displayValue}"
                           readonly
                           data-index="${index}"
                           style="flex: 1; padding: 0.8rem; border: 2px solid var(--border); border-radius: var(--border-radius); background: #f5f5f5;">
                ` : `
                    <input type="url"
                           class="album-image-input"
                           value="${imageData}"
                           placeholder="https://example.com/image.jpg"
                           data-index="${index}"
                           style="flex: 1; padding: 0.8rem; border: 2px solid var(--border); border-radius: var(--border-radius);">
                `}
                <button type="button"
                        class="btn btn-icon btn-danger"
                        onclick="removeAlbumImage(${index})"
                        style="padding: 0.8rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    // Add event listeners to update albumImages array (only for URL inputs)
    container.querySelectorAll('.album-image-input:not([readonly])').forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.dataset.index);
            albumImages[index] = this.value;
        });
    });
}

// Handle cover image upload
function handleCoverImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        coverImageData = e.target.result;

        // Update the URL input with base64 data
        document.getElementById('galleryImageUrl').value = coverImageData;

        // Show preview
        const preview = document.getElementById('coverImagePreview');
        const previewImg = document.getElementById('coverPreviewImg');
        previewImg.src = coverImageData;
        preview.style.display = 'block';

        // Hide file input, show URL input (with base64)
        document.getElementById('galleryImageFile').style.display = 'none';
        document.getElementById('galleryImageUrl').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Handle album images upload
function handleAlbumImagesUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    let processedCount = 0;
    const totalFiles = files.length;

    // Check total size
    let totalSize = 0;
    for (let file of files) {
        totalSize += file.size;
    }

    if (totalSize > 20 * 1024 * 1024) {
        alert('Total size of all images must be less than 20MB');
        return;
    }

    Array.from(files).forEach(file => {
        // Check file size (max 5MB per file)
        if (file.size > 5 * 1024 * 1024) {
            alert(`${file.name} is too large. Max size is 5MB per image.`);
            processedCount++;
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            albumImages.push(e.target.result);
            processedCount++;

            // Render when all files are processed
            if (processedCount === totalFiles) {
                renderAlbumImages();
            }
        };
        reader.readAsDataURL(file);
    });

    // Reset file input
    event.target.value = '';
}

// Close gallery modal
function closeGalleryModalFn() {
    galleryModal.classList.remove('active');
    galleryForm.reset();
    currentGalleryId = null;
    albumImages = [];
    coverImageData = null;
    renderAlbumImages();

    // Hide preview
    document.getElementById('coverImagePreview').style.display = 'none';

    // Reset to URL input
    document.getElementById('galleryImageUrl').style.display = 'block';
    document.getElementById('galleryImageFile').style.display = 'none';
}

// Handle gallery form submit
function handleGalleryFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(galleryForm);
    const eventIdValue = formData.get('eventId');

    // Filter out empty album images
    const validAlbumImages = albumImages.filter(url => url && url.trim() !== '');

    const itemData = {
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        imageUrl: formData.get('imageUrl'),
        icon: formData.get('icon'),
        eventId: eventIdValue && eventIdValue !== '' ? parseInt(eventIdValue) : null,
        albumImages: validAlbumImages,
        status: formData.get('status')
    };

    try {
        if (currentGalleryId) {
            // Update existing item
            api.updateGalleryItem(currentGalleryId, itemData);
            alert('Gallery item updated successfully!');
        } else {
            // Create new item
            api.createGalleryItem(itemData);
            alert('Gallery item created successfully!');
        }

        closeGalleryModalFn();
        loadGallery();
    } catch (error) {
        alert('Error saving gallery item: ' + error.message);
    }
}

// Edit gallery item
function editGalleryItem(itemId) {
    openGalleryModal(itemId);
}

// Open delete gallery modal
function openDeleteGalleryModal(itemId) {
    currentGalleryId = itemId;
    const item = api.getGalleryItemById(itemId);

    document.getElementById('deleteGalleryName').textContent = item.title;
    deleteGalleryModal.classList.add('active');
}

// Close delete gallery modal
function closeDeleteGalleryModalFn() {
    deleteGalleryModal.classList.remove('active');
    currentGalleryId = null;
}

// Handle delete gallery
function handleDeleteGallery() {
    if (!currentGalleryId) return;

    try {
        api.deleteGalleryItem(currentGalleryId);
        alert('Gallery item deleted successfully!');
        closeDeleteGalleryModalFn();
        loadGallery();
    } catch (error) {
        alert('Error deleting gallery item: ' + error.message);
    }
}

// Load content editor
function loadContentEditor() {
    const content = api.getContent();

    // Hero section
    if (content.hero) {
        document.getElementById('heroTitle').value = content.hero.title || '';
        document.getElementById('heroSubtitle').value = content.hero.subtitle || '';
        document.getElementById('heroDescription').value = content.hero.description || '';
    }

    // About section
    if (content.about) {
        document.getElementById('aboutTitle').value = content.about.title || '';
        document.getElementById('aboutSubtitle').value = content.about.subtitle || '';
        document.getElementById('aboutDescription').value = content.about.description || '';
    }

    // Contact section
    if (content.contact) {
        document.getElementById('contactEmail').value = content.contact.email || '';
        document.getElementById('contactPhone').value = content.contact.phone || '';
        document.getElementById('contactAddress').value = content.contact.address || '';
    }
}

// Handle content form submit
function handleContentFormSubmit(e, section) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        api.updateContent(section, data);
        alert(`${section.charAt(0).toUpperCase() + section.slice(1)} section updated successfully!`);
    } catch (error) {
        alert('Error updating content: ' + error.message);
    }
}

// Make functions global for onclick handlers
window.editGalleryItem = editGalleryItem;
window.openDeleteGalleryModal = openDeleteGalleryModal;
window.removeAlbumImage = removeAlbumImage;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setupGalleryListeners();
});

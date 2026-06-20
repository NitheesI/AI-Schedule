const closeModal1 = document.getElementById('closeModal1');
const signupModal = document.getElementById('signupModal');
const authMsg = document.getElementById('authMsg');
const authArea = document.getElementById('authArea');

const nameInput = document.getElementById('signupName');
const dobInput = document.getElementById('signupDob');
const locationInput = document.getElementById('signupLocation');
const categoryInput = document.getElementById('signupCategory');
const phoneInput = document.getElementById('signupPhone');
const authForm = document.getElementById('authForm');

// --- View elements ---
const landingView = document.getElementById('landingView');
const dashboardView = document.getElementById('dashboardView');

// --- Helper: show status message ---
function showMsg(text, isError = false) {
    authMsg.textContent = text;
    authMsg.style.color = isError ? '#7f1d1d' : '#14532d';
}

// --- Helper: switch to dashboard view and populate fields ---
function showDashboard(profile) {
    if (landingView) landingView.classList.add('hidden');
    if (dashboardView) dashboardView.classList.remove('hidden');

    // Populate dashboard user info
    const dashUserName = document.getElementById('dashUserName');
    const dashUserCategory = document.getElementById('dashUserCategory');
    const dashUserPhone = document.getElementById('dashUserPhone');
    const dashUserLocation = document.getElementById('dashUserLocation');
    const logsPhoneNumber = document.getElementById('logsPhoneNumber');

    if (dashUserName) dashUserName.textContent = profile.name || 'User';
    if (dashUserCategory) dashUserCategory.textContent = profile.category || '-';
    if (dashUserPhone) dashUserPhone.textContent = profile.phone || '-';
    if (dashUserLocation) dashUserLocation.textContent = profile.location || '-';
    if (logsPhoneNumber) logsPhoneNumber.textContent = `MONITORING CONTACT: ${profile.phone || 'None'}`;
}

// --- Helper: switch back to landing view ---
function showLanding() {
    if (dashboardView) dashboardView.classList.add('hidden');
    if (landingView) landingView.classList.remove('hidden');
}

// --- Helper: update header based on login state ---
function updateAuthArea() {
    const currentUser = localStorage.getItem('clockwork_currentUser');
    if (currentUser) {
        authArea.innerHTML = `
            <span class="text-white font-bold whitespace-nowrap">Welcome, ${currentUser}!</span>
            <button id="signOutBtn"
            class="bg-orange-500 text-black font-bold px-4 py-2 rounded-full border border-black border-4 hover:bg-orange-950 hover:font-bold hover:text-white hover:shadow-2xl transition-all">
            Sign Out</button>`;
        document.getElementById('signOutBtn').addEventListener('click', () => {
            localStorage.removeItem('clockwork_currentUser');
            localStorage.removeItem('clockwork_userProfile');
            showLanding();
            updateAuthArea();
        });

        // Show dashboard for logged-in user
        const userProfileStr = localStorage.getItem('clockwork_userProfile');
        if (userProfileStr) {
            try {
                const profile = JSON.parse(userProfileStr);
                showDashboard(profile);

                // Update location badge
                if (profile.location) {
                    const locationBadge = document.getElementById('locationBadge');
                    const locationText = document.getElementById('locationText');
                    if (locationBadge && locationText) {
                        locationText.textContent = `Schedule optimized for ${profile.location}`;
                        locationBadge.classList.remove('hidden');
                    }
                }
            } catch (e) {
                console.error("Error parsing user profile:", e);
            }
        }
    } else {
        // Not logged in — show landing
        showLanding();

        authArea.innerHTML = `
            <button id="startBtn"
            class="bg-orange-500 text-black font-bold px-4 py-2 rounded-full border border-black border-4 hover:bg-orange-950 hover:font-bold hover:text-white hover:shadow-2xl transition-all">
            Get Started</button>`;
        document.getElementById('startBtn').addEventListener('click', () => {
            authMsg.textContent = '';
            if (nameInput) nameInput.value = '';
            if (dobInput) dobInput.value = '';
            if (locationInput) locationInput.value = '';
            if (categoryInput) categoryInput.value = '';
            if (phoneInput) phoneInput.value = '';
            signupModal.showModal();
        });
    }
}

// --- Submit form handler ---
if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const dob = dobInput.value;
        const location = locationInput.value.trim();
        const category = categoryInput.value;
        const phone = phoneInput.value.trim();

        if (!name || !dob || !location || !category || !phone) {
            showMsg('Please fill in all fields.', true);
            return;
        }

        // Store profile object in local storage
        const userProfile = {
            name: name,
            dob: dob,
            location: location,
            category: category,
            phone: phone,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('clockwork_userProfile', JSON.stringify(userProfile));
        localStorage.setItem('clockwork_currentUser', name);

        showMsg('Profile created! Welcome, ' + name + '!');

        setTimeout(() => {
            signupModal.close();
            showDashboard(userProfile);
            updateAuthArea();
        }, 1000);
    });
}

// --- Modal controls ---
if (closeModal1) {
    closeModal1.addEventListener('click', () => {
        signupModal.close();
    });
}
if (signupModal) {
    signupModal.addEventListener('click', (e) => {
        if (e.target === signupModal) {
            signupModal.close();
        }
    });
}

updateAuthArea();
// Minimal script for potential interactions
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Ingredient Explorer Loaded');

    // Dashboard Elements
    const standardNav = document.getElementById('standardNav');
    const headerActions = document.getElementById('headerActions');
    const dashboardNav = document.getElementById('dashboard-nav');
    const dashboardLogout = document.getElementById('dashboardLogout');

    // Helper to toggle Dashboard
    function showDashboard() {
        if (standardNav) standardNav.style.display = 'none';
        if (headerActions) headerActions.style.display = 'none';
        if (dashboardNav) {
            dashboardNav.style.display = 'flex'; // Force display first (Desktop logic)
            setTimeout(() => dashboardNav.classList.add('active'), 10);
        }
    }

    // --- VIEW SWITCHING LOGIC (SPA Feel) ---
    const navHome = document.getElementById('nav-home');
    const navTrending = document.getElementById('nav-trending');
    const navFavorites = document.getElementById('nav-favorites'); // Added
    const navHistory = document.getElementById('nav-history');
    const navContact = document.getElementById('nav-contact'); // Added

    const heroSection = document.getElementById('hero-section');
    const favoritesSection = document.getElementById('favorites-section');
    const historySection = document.getElementById('history-section');
    const trendingSection = document.getElementById('trending');

    const recipesSection = document.getElementById('recipes'); // Easy Recipes
    const aboutSection = document.getElementById('about'); // About Section

    const contactSection = document.getElementById('contact-section'); // Contact Section

    // --- STANDARD NAV LOGIC (Pre-Login) ---
    const stdNavContact = document.getElementById('std-nav-contact');
    const stdNavRecipes = document.getElementById('std-nav-recipes');
    const stdNavAbout = document.getElementById('std-nav-about');

    if (stdNavContact) {
        stdNavContact.addEventListener('click', (e) => {
            e.preventDefault();
            // Show Contact, Hide others
            if (heroSection) heroSection.style.display = 'none';
            if (recipesSection) recipesSection.style.display = 'none';
            if (aboutSection) aboutSection.style.display = 'none';
            if (contactSection) contactSection.style.display = 'block';
            window.scrollTo(0, 0);
        });
    }

    if (stdNavRecipes) {
        stdNavRecipes.addEventListener('click', (e) => {
            // Don't prevent default, allow anchor jump
            // But ensure sections are visible
            if (heroSection) heroSection.style.display = 'flex';
            if (recipesSection) recipesSection.style.display = 'block';
            if (aboutSection) aboutSection.style.display = 'block';
            if (contactSection) contactSection.style.display = 'none';
        });
    }

    if (stdNavAbout) {
        stdNavAbout.addEventListener('click', (e) => {
            // Don't prevent default, allow anchor jump
            if (heroSection) heroSection.style.display = 'flex';
            if (recipesSection) recipesSection.style.display = 'block';
            if (aboutSection) aboutSection.style.display = 'block';
            if (contactSection) contactSection.style.display = 'none';
        });
    }

    if (navHome && navTrending) {
        navHome.addEventListener('click', (e) => {
            e.preventDefault();
            // Update Active Link
            document.querySelectorAll('.dash-link').forEach(l => l.classList.remove('active'));
            navHome.classList.add('active');

            // Show Home View
            if (heroSection) heroSection.style.display = 'flex';
            if (recipesSection) recipesSection.style.display = 'block'; // Show Easy Recipes on Home
            if (aboutSection) aboutSection.style.display = 'block'; // Show About on Home
            if (favoritesSection) favoritesSection.style.display = 'none'; // Hide Favorites on Home
            if (trendingSection) trendingSection.style.display = 'none';
            if (historySection) historySection.style.display = 'none';
            if (contactSection) contactSection.style.display = 'none';
            window.scrollTo(0, 0);
        });

        navTrending.addEventListener('click', (e) => {
            e.preventDefault();
            // Update Active Link
            document.querySelectorAll('.dash-link').forEach(l => l.classList.remove('active'));
            navTrending.classList.add('active');

            // Show Trending View
            if (heroSection) heroSection.style.display = 'none';
            if (recipesSection) recipesSection.style.display = 'none'; // Hide Easy Recipes
            if (aboutSection) aboutSection.style.display = 'none'; // Hide About
            if (favoritesSection) favoritesSection.style.display = 'none';
            if (trendingSection) trendingSection.style.display = 'block';
            if (historySection) historySection.style.display = 'none';
            if (contactSection) contactSection.style.display = 'none';

            loadTrendingFood(); // Load data
            window.scrollTo(0, 0);
        });

        if (navHistory) {
            navHistory.addEventListener('click', (e) => {
                e.preventDefault();
                // Update Active Link
                document.querySelectorAll('.dash-link').forEach(l => l.classList.remove('active'));
                navHistory.classList.add('active');

                // Show History View
                if (heroSection) heroSection.style.display = 'none';
                if (recipesSection) recipesSection.style.display = 'none';
                if (aboutSection) aboutSection.style.display = 'none'; // Hide About
                if (favoritesSection) favoritesSection.style.display = 'none';
                if (trendingSection) trendingSection.style.display = 'none';
                if (historySection) historySection.style.display = 'block';
                if (contactSection) contactSection.style.display = 'none';

                loadHistory();
                window.scrollTo(0, 0);
            });
        }
    }

    if (navFavorites) {
        navFavorites.addEventListener('click', (e) => {
            e.preventDefault();
            // Update Active Link
            document.querySelectorAll('.dash-link').forEach(l => l.classList.remove('active'));
            navFavorites.classList.add('active');

            // Show Favorites View
            if (heroSection) heroSection.style.display = 'none';
            if (recipesSection) recipesSection.style.display = 'none'; // Hide Easy Recipes
            if (aboutSection) aboutSection.style.display = 'none'; // Hide About
            if (favoritesSection) favoritesSection.style.display = 'block';
            if (trendingSection) trendingSection.style.display = 'none';
            if (historySection) historySection.style.display = 'none';
            if (contactSection) contactSection.style.display = 'none';

            loadFavorites();
            window.scrollTo(0, 0);
        });
    }

    if (navContact) {
        navContact.addEventListener('click', (e) => {
            e.preventDefault();
            // Update Active Link
            document.querySelectorAll('.dash-link').forEach(l => l.classList.remove('active'));
            navContact.classList.add('active');

            // Show Contact View
            if (heroSection) heroSection.style.display = 'none';
            if (recipesSection) recipesSection.style.display = 'none';
            if (aboutSection) aboutSection.style.display = 'none';
            if (favoritesSection) favoritesSection.style.display = 'none';
            if (trendingSection) trendingSection.style.display = 'none';
            if (historySection) historySection.style.display = 'none';
            if (contactSection) contactSection.style.display = 'block';

            window.scrollTo(0, 0);
        });
    }


    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Check if we are in "Dashboard" mode (logged in view)
            // dashboardNav is usually shown if logged in.
            // But strict check: is dashboardNav displayed? 
            const isDashboardMode = dashboardNav && (dashboardNav.style.display === 'flex' || dashboardNav.classList.contains('active'));

            if (isDashboardMode) {
                if (dashboardNav) dashboardNav.classList.toggle('mobile-visible');
            } else {
                // Not logged in -> Toggle Standard Nav
                if (standardNav) standardNav.classList.toggle('mobile-visible');
                // Toggle header actions 
                if (headerActions) headerActions.classList.toggle('mobile-visible');
            }
        });

        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== mobileMenuBtn) {
                if (dashboardNav) dashboardNav.classList.remove('mobile-visible');
                if (standardNav) standardNav.classList.remove('mobile-visible');
            }
        });

        // Close when clicking a link inside standardNav
        if (standardNav) {
            standardNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    standardNav.classList.remove('mobile-visible');
                });
            });
        }
    }


    // Check LocalStorage & Backend Status on Load
    const localLoggedIn = localStorage.getItem('isLoggedIn');
    console.log('Initial Login status (localStorage):', localLoggedIn);

    if (localLoggedIn === 'true') {
        console.log('Conditions met. Showing Dashboard.');
        showDashboard(); // Immediate UI update
    }

    try {
        const response = await fetch('http://127.0.0.1:5001/status', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.logged_in) {
                console.log('Backend confirmed login:', data.username);
                localStorage.setItem('isLoggedIn', 'true'); // Sync state
                showDashboard();

            }
        }
    } catch (err) {
        console.log('Backend unreachable', err);
    }

    // Logout Logic (Global)
    if (dashboardLogout) {
        dashboardLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Logging out?')) {
                try {
                    await fetch('http://127.0.0.1:5001/logout', {
                        method: 'POST',
                        credentials: 'include' // Essential for cookie-based auth
                    });
                } catch (err) {
                    console.error('Logout request failed', err);
                }
                localStorage.removeItem('isLoggedIn');
                window.location.reload();
            }
        });
    }

    // Login Modal Logic
    const loginBtn = document.getElementById('loginBtn');
    const modal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');

    if (loginBtn && modal && closeModal) {
        loginBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Switch to Signup Modal
        const switchToSignup = document.getElementById('switchToSignup');
        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.remove('active');
                const signupModal = document.getElementById('signupModal');
                if (signupModal) signupModal.classList.add('active');
            });
        }
    }

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login Form Submitted. Processing...');
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');

            try {
                const response = await fetch('http://127.0.0.1:5001/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // Essential for saving the session cookie
                    body: JSON.stringify({
                        username: emailInput.value,
                        password: passwordInput.value
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('Login response OK. Username:', data.username);
                    alert('Login successful! Welcome ' + data.username);
                    console.log('Setting localStorage isLoggedIn to true');
                    localStorage.setItem('isLoggedIn', 'true'); // Set persistence flag
                    console.log('localStorage value:', localStorage.getItem('isLoggedIn'));
                    modal.classList.remove('active');
                    window.location.reload(); // Reload to trigger Dashboard logic
                } else {
                    alert('Login failed: ' + data.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Login failed. Is the backend running? Error: ' + error.message);
            }
        });
    }

    // Signup Modal Logic
    const signupBtn = document.querySelector('.btn-cta');
    const signupModal = document.getElementById('signupModal');
    const closeSignupModal = document.getElementById('closeSignupModal');

    if (signupBtn && signupModal && closeSignupModal) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.classList.add('active');
        });

        closeSignupModal.addEventListener('click', () => {
            signupModal.classList.remove('active');
        });

        signupModal.addEventListener('click', (e) => {
            if (e.target === signupModal) {
                signupModal.classList.remove('active');
            }
        });
    }

    // Signup Form Logic
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        // Password Visibility Toggle
        const toggleBtn = document.getElementById('toggleSignupPassword');
        const passInput = document.getElementById('signupPassword');
        if (toggleBtn && passInput) {
            toggleBtn.addEventListener('click', () => {
                const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passInput.setAttribute('type', type);
                toggleBtn.classList.toggle('fa-eye');
                toggleBtn.classList.toggle('fa-eye-slash');
            });
        }

        // Switch to Login Link
        const switchToLoginCtx = document.getElementById('switchToLogin');
        if (switchToLoginCtx) {
            switchToLoginCtx.addEventListener('click', (e) => {
                e.preventDefault();
                const signupModal = document.getElementById('signupModal');
                const loginModal = document.getElementById('loginModal');
                if (signupModal) signupModal.classList.remove('active');
                if (loginModal) loginModal.classList.add('active');
            });
        }

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('signupName');
            const emailInput = document.getElementById('signupEmail');
            const passwordInput = document.getElementById('signupPassword');
            const confirmPassInput = document.getElementById('signupConfirmPassword');
            const termsCheck = document.getElementById('termsCheck');

            if (!termsCheck.checked) {
                alert("Please agree to the Terms & Conditions.");
                return;
            }

            if (passwordInput.value !== confirmPassInput.value) {
                alert("Passwords do not match!");
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5001/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: emailInput.value,
                        password: passwordInput.value
                        // Name is not sent to backend as per current MVP API, but UI is consistent
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Account created! Please log in.');
                    const signupModal = document.getElementById('signupModal');
                    if (signupModal) signupModal.classList.remove('active');
                    // Automatically open login modal
                    const loginModal = document.getElementById('loginModal');
                    if (loginModal) loginModal.classList.add('active');
                } else {
                    alert('Signup failed: ' + data.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during signup.');
            }
        });
    }


    // Image Upload Logic (Hero Section)
    const cookBtn = document.getElementById('cookBtn');
    if (cookBtn) {
        // ADD 'e' here to capture the click event
        cookBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // <--- CRITICAL: Prevents page reload if inside a form

            // Login Check
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                alert("Please log in fast to continue cooking!");
                const loginModal = document.getElementById('loginModal');
                if (loginModal) loginModal.classList.add('active');
                return;
            }

            const fileInput = document.getElementById("foodImage");
            const resultDiv = document.getElementById("result");

            if (!fileInput || !fileInput.files[0]) {
                alert("Please select an image first!");
                return;
            }

            const file = fileInput.files[0];
            const btn = cookBtn;

            // Loading State
            const originalText = btn.innerText;
            btn.innerText = "Analyzing... 🤖";
            btn.disabled = true;

            if (resultDiv) {
                resultDiv.style.display = "block";
                resultDiv.innerHTML = "Scanning your ingredients...";
            }

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('http://127.0.0.1:5001/suggest', {
                    method: 'POST',
                    credentials: 'include', // vital for @login_required
                    body: formData
                });

                // SPECIFIC ERROR HANDLING
                if (response.status === 401) {
                    throw new Error("Session Expired. Please Log out and Log in again.");
                }
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Server error: ${response.status}`);
                }

                const data = await response.json();

                // Read file as Base64 for saving
                const reader = new FileReader();
                reader.onloadend = function () {
                    // Store logic here so we have the image data
                    window.currentGeneratedRecipe = {
                        title: data.recipe, // This is actually the full text
                        image: reader.result // Base64 string
                    };
                }
                if (file) {
                    reader.readAsDataURL(file);
                } else {
                    window.currentGeneratedRecipe = {
                        title: data.recipe,
                        image: "assets/logo.jpeg"
                    };
                }

                if (resultDiv) {
                    resultDiv.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                            <h3 style="color: #2c3e50; margin: 0; font-size: 1.5rem;">${data.recipe}</h3>
                            <button onclick="saveCurrentGeneratedRecipe()" title="Save to Favorites" style="background: none; border: none; cursor: pointer; color: #ff6b6b; font-size: 1.5rem; padding: 5px; transition: transform 0.2s;">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                        <p style="white-space: pre-line; line-height: 1.6;">${data.steps}</p>
                     `;
                }
            } catch (error) {
                console.error("Upload Error:", error);
                if (resultDiv) {
                    resultDiv.innerHTML = `<span style="color:red">Error: ${error.message}</span>`;
                }
                // If session expired, force logout UI
                if (error.message.includes("Session Expired")) {
                    localStorage.removeItem('isLoggedIn');
                    alert("Session expired. Please log in again.");
                    const loginModal = document.getElementById('loginModal');
                    if (loginModal) loginModal.classList.add('active');
                }
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

});

// Helper to save the currently displayed AI recipe
function saveCurrentGeneratedRecipe() {
    const recipe = window.currentGeneratedRecipe;
    if (!recipe) return;

    let favorites = JSON.parse(localStorage.getItem('myAppFavorites')) || [];

    // Check for duplicates based on content
    // Use a substring for title check or just unique ID
    const shortTitle = recipe.title.split('\n')[0].substring(0, 30); // simplistic duplicate check

    if (!favorites.some(fav => fav.text === recipe.title)) {
        favorites.push({
            id: 'gen_' + Date.now(),
            img: recipe.image,
            text: recipe.title // Full text
        });
        localStorage.setItem('myAppFavorites', JSON.stringify(favorites));

        // Update icon to solid to indicate saved
        const btnIcon = document.querySelector('#result button i');
        if (btnIcon) {
            btnIcon.classList.remove('far');
            btnIcon.classList.add('fas');
        }
        alert('Recipe saved to favorites!');
    } else {
        alert('You already saved this one!');
    }
}




// Helper to load History
async function loadHistory() {
    const container = document.getElementById('history-grid');
    if (!container) return;

    container.innerHTML = '<p style="color: #888; text-align: center; grid-column: 1/-1;">Loading history...</p>';

    try {
        const response = await fetch('http://127.0.0.1:5001/history', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.status === 401) {
            container.innerHTML = '<p style="color: #888; text-align: center; grid-column: 1/-1;">Please log in to view history.</p>';
            return;
        }

        if (!response.ok) throw new Error("Failed to fetch history");

        const historyData = await response.json();

        container.innerHTML = '';
        if (historyData.length === 0) {
            container.innerHTML = '<p style="color: #888; text-align: center; grid-column: 1/-1;">No history found.</p>';
            return;
        }

        // Use premium styling for History
        historyData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'premium-card history-card';

            // Placeholder image for History items since we don't store the image URL on backend yet
            // In a real app, you would save the image URL to the DB.
            const randomImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

            card.innerHTML = `
                <div class="premium-card-image" style="background-image: url('${randomImage}')">
                    <span class="history-badge"><i class="far fa-clock"></i> ${item.timestamp}</span>
                </div>
                <div class="premium-card-content">
                    <h3>${item.recipe}</h3>
                     <div style="font-size: 0.9rem; color: #ccc; margin-bottom: 20px; height: 60px; overflow: hidden;">
                       ${item.steps.substring(0, 100)}...
                    </div>
                    <div class="premium-card-actions">
                         <button class="btn-text" style="color: var(--color-gold); font-size: 0.9rem;" onclick="viewHistoryItem(${item.id})">
                            View Full Recipe <i class="fas fa-arrow-right"></i>
                         </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // Add grid class to container
        container.classList.add('premium-grid');

    } catch (error) {
        console.error("History Error:", error);
        container.innerHTML = '<p style="color: red; text-align: center; grid-column: 1/-1;">Error loading history.</p>';
    }
}

function viewHistoryItem(id) {
    alert("Full view coming in next update! Check your database for full details.");
}

// --- GOOGLE SIGN-IN HANDLER ---
// Must be in global scope for the data-callback
window.handleCredentialResponse = async function (response) {
    try {
        const responsePayload = decodeJwtResponse(response.credential);
        console.log("ID: " + responsePayload.sub);
        console.log('Full Name: ' + responsePayload.name);
        console.log("Email: " + responsePayload.email);

        // Send token to backend for verification and session
        const backendResp = await fetch('http://127.0.0.1:5001/google_login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ token: response.credential })
        });

        const data = await backendResp.json();

        if (backendResp.ok) {
            alert('Google Login successful! Welcome ' + responsePayload.name);
            localStorage.setItem('isLoggedIn', 'true');

            // Close Modals
            const loginModal = document.getElementById('loginModal');
            const signupModal = document.getElementById('signupModal');
            if (signupModal) signupModal.classList.remove('active');

            // Trigger Dashboard Logic
            window.location.reload();
        } else {
            console.error('Backend Google verification failed', data);
            alert('Google Login failed on server: ' + data.error);
        }
    } catch (err) {
        console.error('Google Logic Error', err);
    }
}

// Function to decode the JWT token 
function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// --- RECIPE FEED FEATURE ---

// Database of 6 Common & Easy Recipes
const commonRecipes = [
    {
        id: "r1",
        title: "5-Minute Avocado Toast",
        image: "https://images.unsplash.com/photo-1588137372308-15f75323a4dd?w=500",
        time: "5 Mins",
        desc: "Toasted sourdough topped with smashed avocado, chili flakes, and a drizzle of olive oil."
    },
    {
        id: "r2",
        title: "One-Pot Tomato Basil Pasta",
        image: "https://images.unsplash.com/photo-1626844131082-256783844137?w=500",
        time: "15 Mins",
        desc: "Fresh basil, cherry tomatoes, and parmesan tossed with al dente pasta. One pot, less mess."
    },
    {
        id: "r3",
        title: "Garlic Butter Shrimp",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500",
        time: "10 Mins",
        desc: "Juicy shrimp seared in garlic butter and herbs. Perfect with rice or crusty bread."
    },
    {
        id: "r4",
        title: "Cheesy Chicken Quesadilla",
        image: "https://images.unsplash.com/photo-1564759220241-624963fa1293?w=500",
        time: "12 Mins",
        desc: "Crispy tortilla stuffed with melted cheddar, shredded chicken, and peppers."
    },
    {
        id: "r5",
        title: "Classic Grilled Cheese",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500",
        time: "10 Mins",
        desc: "Golden brown bread with a gooey melted cheese center. The ultimate comfort food."
    },
    {
        id: "r6",
        title: "3-Ingredient Mug Cake",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        time: "3 Mins",
        desc: "A rich chocolate cake made in the microwave. Dangerous, but delicious."
    }
];

// Load recipes on page load
document.addEventListener('DOMContentLoaded', () => {
    const feedGrid = document.getElementById('feed-grid');
    if (feedGrid) {
        feedGrid.innerHTML = '';
        commonRecipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';

            card.innerHTML = `
                <div class="card-image" style="background-image: url('${recipe.image}')"></div>
                <div class="card-info">
                    <h3>${recipe.title}</h3>
                    <span class="time-tag"><i class="fas fa-clock"></i> ${recipe.time}</span>
                    <p>${recipe.desc}</p>
                    <button class="save-btn" onclick="saveCommonRecipe('${recipe.id}')">
                        <i class="fas fa-heart"></i> Save to Favorites
                    </button>
                </div>
            `;

            feedGrid.appendChild(card);
        });
    }
});

function saveCommonRecipe(id) {
    const recipe = commonRecipes.find(r => r.id === id);
    if (!recipe) return;

    let favorites = JSON.parse(localStorage.getItem('myAppFavorites')) || [];

    if (!favorites.some(fav => fav.id === recipe.id)) {
        favorites.push({
            id: recipe.id,
            img: recipe.image,
            text: `Recipe: ${recipe.title}`
        });
        localStorage.setItem('myAppFavorites', JSON.stringify(favorites));
        alert('Recipe saved to favorites!');
    } else {
        alert('You already saved this one!');
    }
}


function removeFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem('myAppFavorites')) || [];
    favorites = favorites.filter(f => f.id !== id);
    localStorage.setItem('myAppFavorites', JSON.stringify(favorites));
    localStorage.setItem('myAppFavorites', JSON.stringify(favorites));
    loadFavorites(); // Refresh view
}

// Helper to Format Recipe Text
function formatRecipeText(text) {
    if (!text) return '';
    // Bold specific keywords
    return text.replace(/(Ingredients:|Instructions:|Step \d+:)/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

// Helper to Load Favorites
function loadFavorites() {
    const container = document.getElementById('favorites-grid');
    if (!container) return;

    let favorites = JSON.parse(localStorage.getItem('myAppFavorites')) || [];
    container.innerHTML = '';

    if (favorites.length === 0) {
        container.innerHTML = '<p style="color: #888; text-align: center; grid-column: 1/-1; padding-top: 50px;">No favorites yet. Go cook something!</p>';
        return;
    }

    favorites.forEach(fav => {
        const card = document.createElement('div');
        card.className = 'premium-card'; // Use new class

        // Handle image: Use stored DataURL or default fallback
        const imageSrc = fav.img || 'assets/logo.jpeg';

        card.innerHTML = `
            <div class="premium-card-image" style="background-image: url('${imageSrc}')"></div>
            <div class="premium-card-content">
                <h3>Favorite Dish</h3> 
                <p style="margin-bottom: 5px; color: #fff; font-weight: bold;">${fav.text.split('\n')[0]}</p>
                <div style="max-height: 60px; overflow: hidden; margin-bottom: 20px; font-size: 0.9rem; color: #aaa;">
                   ${formatRecipeText(fav.text).substring(0, 100)}...
                </div>
                <div class="premium-card-actions">
                    <button class="btn-text" style="color: var(--color-gold); font-size: 0.9rem;" onclick="alert('Full view coming soon!')">
                        Cook Again
                    </button>
                    <button class="btn-icon" style="color: #ff6b6b;" onclick="removeFavorite('${fav.id}')" title="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

async function loadTrendingFood() {
    const container = document.getElementById('trending-container');
    const loadingMsg = document.getElementById('trending-loading');

    if (!container) return;

    try {
        // Fetch from our Python backend
        const response = await fetch('http://127.0.0.1:5001/trending');
        if (!response.ok) throw new Error("Failed to fetch trends");

        const trends = await response.json();

        // Clear loading message
        if (loadingMsg) loadingMsg.style.display = 'none';
        container.innerHTML = ''; // Clear container

        // Generate Cards
        trends.forEach(item => {
            const card = document.createElement('div');
            card.className = 'trend-card';
            card.style.cssText = `
                background: #222;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                transition: transform 0.3s ease;
                cursor: pointer;
            `;

            card.innerHTML = `
                <div style="height: 150px; overflow: hidden;">
                    <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 15px;">
                    <h3 style="color: #fff; margin: 0 0 10px 0; font-size: 1.2rem;">${item.title}</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #FFD700; font-weight: bold;">★ ${item.score} Search Score</span>
                        <small style="color: #aaa;">Google Trends</small>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Trending Error:", error);
        if (loadingMsg) loadingMsg.innerText = "Could not load trends. Try again later.";
    }
}

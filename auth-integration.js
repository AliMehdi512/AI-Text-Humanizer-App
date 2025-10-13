// =====================================================
// Authentication & Usage Tracking Integration
// =====================================================

// Initialize Supabase client
let supabaseClient = null;
let currentUser = null;
let userMode = null; // 'guest', 'authenticated'
let userTier = null;
let usageData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Load configuration
    if (typeof CONFIG === 'undefined') {
        console.error('Configuration not loaded! Make sure config.js is included before auth-integration.js');
        return;
    }
    
    // Initialize Supabase
    supabaseClient = window.supabase.createClient(CONFIG.SUPABASE.URL, CONFIG.SUPABASE.ANON_KEY);
    
    // Check authentication status
    await checkAuthStatus();
    
    // Update UI based on auth status
    updateAuthUI();
    
    // Load usage data
    await loadUsageData();
});

// Check if user is authenticated
async function checkAuthStatus() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (session) {
        // User is authenticated
        currentUser = session.user;
        userMode = 'authenticated';
        
        // Get user profile and tier
        const { data: profile, error } = await supabaseClient
            .from('user_profiles')
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle();
        
        if (error) {
            console.error('Error fetching user profile:', error);
            userTier = 'free'; // Default to free tier on error
        } else if (profile) {
            userTier = profile.subscription_tier;
        } else {
            userTier = 'free';
        }
    } else {
        // Check if guest mode
        const guestMode = localStorage.getItem('userMode');
        if (guestMode === 'guest') {
            userMode = 'guest';
            userTier = 'guest';
        } else {
            // Not authenticated - redirect to auth page
            window.location.href = 'auth.html';
        }
    }
}

// Load user usage data
async function loadUsageData() {
    if (userMode === 'guest') {
        // Guest mode - use localStorage
        const triesUsed = parseInt(localStorage.getItem('guestTriesUsed') || '0');
        usageData = {
            tries_used: triesUsed,
            tries_limit: 1,
            month_year: getCurrentMonth()
        };
    } else if (userMode === 'authenticated') {
        // Authenticated user - get from database
        const currentMonth = getCurrentMonth();
        
        const { data, error } = await supabaseClient
            .from('usage_limits')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('month_year', currentMonth)
            .maybeSingle();
        
        if (error) {
            console.error('Error fetching usage data:', error);
            // Fallback to default usage data
            usageData = {
                user_id: currentUser.id,
                month_year: currentMonth,
                usage_count: 0,
                limit: CONFIG.SUBSCRIPTION_TIERS[userTier].limit
            };
        } else if (data) {
            usageData = data;
        } else {
            // Create new usage record for this month
            const tierLimit = CONFIG.SUBSCRIPTION_TIERS[userTier].limit;
            const { data: newData, error: insertError } = await supabaseClient
                .from('usage_limits')
                .insert([{
                    user_id: currentUser.id,
                    month_year: currentMonth,
                    tries_used: 0,
                    tries_limit: tierLimit
                }])
                .select()
                .single();
            
            usageData = newData || { tries_used: 0, tries_limit: tierLimit };
        }
    }
    
    // Update usage display
    updateUsageDisplay();
}

// Check if user can make a request
function canUserTransform() {
    if (!usageData) return false;
    return usageData.tries_used < usageData.tries_limit;
}

// Increment usage count
async function incrementUsage() {
    if (userMode === 'guest') {
        // Guest mode - update localStorage
        const currentUsage = parseInt(localStorage.getItem('guestTriesUsed') || '0');
        localStorage.setItem('guestTriesUsed', (currentUsage + 1).toString());
        usageData.tries_used = currentUsage + 1;
    } else if (userMode === 'authenticated') {
        // Authenticated user - update database
        const { data, error } = await supabaseClient
            .from('usage_limits')
            .update({ 
                tries_used: usageData.tries_used + 1,
                updated_at: new Date().toISOString()
            })
            .eq('id', usageData.id)
            .select()
            .single();
        
        if (data) {
            usageData = data;
        }
    }
    
    // Update usage display
    updateUsageDisplay();
}

// Save transaction to history (authenticated users only)
async function saveTransaction(inputText, outputText, transformations, processingTime) {
    if (userMode !== 'authenticated') return;
    
    const { error } = await supabaseClient
        .from('transaction_history')
        .insert([{
            user_id: currentUser.id,
            input_text: inputText,
            output_text: outputText,
            transformations_applied: transformations,
            processing_time: processingTime
        }]);
    
    if (error) {
        console.error('Error saving transaction:', error);
    }
}

// Update auth UI
function updateAuthUI() {
    // Add user menu to navbar
    const navbar = document.querySelector('nav');
    if (!navbar) return;
    
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.style.cssText = 'position: absolute; right: 16px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 8px; z-index: 100; flex-wrap: wrap; max-width: 400px;';
    
    if (userMode === 'authenticated') {
        const email = currentUser.email;
        const tierBadge = CONFIG.SUBSCRIPTION_TIERS[userTier].name;
        
        userMenu.innerHTML = `
            <div class="usage-badge" style="
                background: rgba(255, 255, 255, 0.1);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <i class="fas fa-bolt"></i>
                <span id="usage-display">-/-</span>
            </div>
            <div class="tier-badge" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            ">
                ${tierBadge}
            </div>
            <div class="user-dropdown" style="position: relative;">
                <button class="user-btn" style="
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                " onclick="toggleUserDropdown()">
                    <i class="fas fa-user"></i>
                    <span>${email.split('@')[0]}</span>
                    <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
                </button>
                <div class="dropdown-menu" id="userDropdownMenu" style="
                    display: none;
                    position: absolute;
                    right: 0;
                    top: 100%;
                    margin-top: 8px;
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 8px;
                    min-width: 200px;
                    z-index: 1000;
                ">
                    <a href="#" onclick="showDashboard()" style="
                        display: block;
                        padding: 12px 16px;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-chart-line"></i> Dashboard
                    </a>
                    <a href="#" onclick="showUpgrade()" style="
                        display: block;
                        padding: 12px 16px;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-crown"></i> Upgrade Plan
                    </a>
                    <a href="#" onclick="showHistory()" style="
                        display: block;
                        padding: 12px 16px;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-history"></i> History
                    </a>
                    <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 8px 0;"></div>
                    <a href="#" onclick="handleSignOut()" style="
                        display: block;
                        padding: 12px 16px;
                        color: #ef4444;
                        text-decoration: none;
                        border-radius: 8px;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='rgba(239,68,68,0.1)'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-sign-out-alt"></i> Sign Out
                    </a>
                </div>
            </div>
        `;
    } else if (userMode === 'guest') {
        userMenu.innerHTML = `
            <div class="usage-badge" style="
                background: rgba(255, 255, 255, 0.1);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <i class="fas fa-gift"></i>
                <span id="usage-display">-/-</span>
            </div>
            <button onclick="window.location.href='auth.html'" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                padding: 10px 24px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                Sign Up for More
            </button>
        `;
    }
    
    navbar.appendChild(userMenu);
}

// Update usage display
function updateUsageDisplay() {
    const usageDisplay = document.getElementById('usage-display');
    if (usageDisplay && usageData) {
        usageDisplay.textContent = `${usageData.tries_used}/${usageData.tries_limit}`;
        
        // Change color based on usage
        const percentage = (usageData.tries_used / usageData.tries_limit) * 100;
        if (percentage >= 100) {
            usageDisplay.style.color = '#ef4444';
        } else if (percentage >= 80) {
            usageDisplay.style.color = '#f59e0b';
        } else {
            usageDisplay.style.color = '#10b981';
        }
    }
}

// Toggle user dropdown
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdownMenu');
    const userBtn = document.querySelector('.user-btn');
    if (dropdown && userBtn && !userBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Show dashboard
function showDashboard() {
    alert('Dashboard feature coming soon!');
}

// Show upgrade modal
function showUpgrade() {
    // Create upgrade modal
    const modal = document.createElement('div');
    modal.className = 'upgrade-modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    const tiers = CONFIG.SUBSCRIPTION_TIERS;
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 24px;
            padding: 48px;
            max-width: 1000px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        ">
            <button onclick="this.closest('.upgrade-modal').remove()" style="
                position: absolute;
                top: 24px;
                right: 24px;
                background: transparent;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            ">&times;</button>
            
            <h2 style="text-align: center; font-size: 32px; margin-bottom: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                Upgrade Your Plan
            </h2>
            <p style="text-align: center; color: #94a3b8; margin-bottom: 48px;">Choose the plan that fits your needs</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
                ${Object.entries(tiers).filter(([key]) => key !== 'guest').map(([key, tier]) => `
                    <div style="
                        background: rgba(255, 255, 255, 0.05);
                        border: 2px solid ${userTier === key ? '#667eea' : 'rgba(255, 255, 255, 0.1)'};
                        border-radius: 16px;
                        padding: 32px;
                        text-align: center;
                        position: relative;
                    ">
                        ${userTier === key ? '<div style="position: absolute; top: 16px; right: 16px; background: #667eea; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">Current</div>' : ''}
                        <h3 style="font-size: 24px; margin-bottom: 8px;">${tier.name}</h3>
                        <div style="font-size: 36px; font-weight: 700; margin: 16px 0;">
                            $${tier.price}<span style="font-size: 16px; color: #94a3b8;">/mo</span>
                        </div>
                        <div style="color: #94a3b8; margin-bottom: 24px;">${tier.limit} transforms/month</div>
                        <ul style="list-style: none; padding: 0; margin-bottom: 24px; text-align: left;">
                            ${tier.features.map(f => `<li style="margin: 8px 0; color: #94a3b8;"><i class="fas fa-check" style="color: #10b981; margin-right: 8px;"></i>${f}</li>`).join('')}
                        </ul>
                        ${key !== 'free' && userTier !== key ? `
                            <button onclick="handleUpgrade('${key}')" style="
                                width: 100%;
                                padding: 14px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                border: none;
                                border-radius: 12px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.3s;
                            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                                Upgrade Now
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.className = 'upgrade-modal';
    document.body.appendChild(modal);
}

// Show history
function showHistory() {
    alert('History feature coming soon!');
}

// Handle upgrade
function handleUpgrade(tier) {
    const tierInfo = CONFIG.SUBSCRIPTION_TIERS[tier];
    alert(`🚀 Payment Integration Setup Required!\n\nYou selected: ${tierInfo.name} ($${tierInfo.price}/month)\n\nTo enable payments, you need to:\n1. Create a Stripe account\n2. Add your Stripe keys to config.js\n3. Set up webhook endpoints\n\nFor now, this is a demo. Contact admin to set up payments.`);
    // TODO: Integrate Stripe Checkout
}

// Handle sign out
async function handleSignOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
        localStorage.removeItem('userMode');
        localStorage.removeItem('guestTriesUsed');
        window.location.href = 'auth.html';
    }
}

// Get current month in YYYY-MM format
function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Export functions for use in main app
window.authIntegration = {
    canUserTransform,
    incrementUsage,
    saveTransaction,
    showUpgrade,
    userMode,
    userTier,
    usageData
};


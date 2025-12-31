// js/preregister.js
// Xử lý đăng ký trước với Supabase + Real-time Updates

// === ĐIỀN THÔNG TIN SUPABASE CỦA BẠN Ở ĐÂY ===
const SUPABASE_URL = 'https://eyogwyullsrbefsciyyl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5b2d3eXVsbHNyYmVmc2NpeXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDE1OTYsImV4cCI6MjA2ODM3NzU5Nn0.FOFVei4uWplT6zSqNB48O3jSDxWT_Brfwgd1iZRFssg';
const TABLE = 'preregister';

console.log('🚀 Preregister script loading...');
console.log('📊 Supabase URL:', SUPABASE_URL);

// Cache DOM elements
let preregCountElement = null;
let progressBarElement = null;
let milestonePoints = null;
let form = null;
let realtimeSubscription = null;
let currentCount = 0;
let pollingInterval = null;

// Initialize cached DOM elements
function cacheDOMElements() {
    preregCountElement = document.getElementById('prereg-count');
    progressBarElement = document.getElementById('milestone-progress');
    milestonePoints = document.querySelectorAll('.milestone-point');
    form = document.getElementById('preregister-form');
    
    if (preregCountElement) {
        preregCountElement.textContent = '0';
        console.log('✅ DOM elements cached successfully');
    } else {
        console.error('❌ Required elements not found');
    }
}

// Cập nhật số lượng đăng ký
async function updatePreregisterCount() {
    try {
        console.log('📡 Fetching preregister count from database...');

        if (!preregCountElement) {
            console.error('❌ Cached element not available');
            return;
        }

        // Thử cả 2 cách: function và direct query
        const functionUrl = `${SUPABASE_URL}/rest/v1/rpc/count_preregister`;
        const directUrl = `${SUPABASE_URL}/rest/v1/${TABLE}?select=count`;

        console.log('🔗 Function URL:', functionUrl);

        const res = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('📊 Response status:', res.status);

        if (!res.ok) {
            console.error('❌ Failed to fetch count:', res.status, res.statusText);

            // Thử cách khác: direct query
            console.log('🔄 Trying direct query...');
            const directRes = await fetch(directUrl, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (directRes.ok) {
                const directData = await directRes.json();
                console.log('📊 Direct query data:', directData);
                const count = directData.length || 0;
                updateCountDisplay(count);
                return;
            }

            // Fallback: hiển thị 0 nếu API lỗi
            updateCountDisplay(0);
            return;
        }

        const data = await res.json();
        console.log('📊 Response data:', data);
        console.log('📊 Data type:', typeof data);
        console.log('📊 Is array:', Array.isArray(data));
        console.log('📊 Data length:', data.length);

        // Xử lý response data - có thể là array hoặc object
        let count = 0;
        if (Array.isArray(data) && data.length > 0) {
            console.log('📊 First item:', data[0]);
            count = data[0].count || 0;
            console.log('📊 Count from array:', count);
        } else if (data && typeof data === 'object') {
            count = data.count || 0;
            console.log('📊 Count from object:', count);
        }

        console.log('✅ Final Database count:', count);
        updateCountDisplay(count);
    } catch (e) {
        console.error('❌ Error updating count:', e);
        // Fallback: hiển thị 0 nếu có lỗi
        updateCountDisplay(0);
    }
}

// Cập nhật hiển thị số lượng với animation
function updateCountDisplay(count) {
    if (!preregCountElement) {
        console.error('❌ Cached element not available');
        return;
    }

    const oldCount = currentCount;
    currentCount = count;

    console.log(`🔄 Updating count from ${oldCount} to ${count}`);

    // Animation đếm số và update milestone cùng lúc
    animateCount(oldCount, count, preregCountElement);
    updateMilestoneProgress(count);
}

function updateMilestoneProgress(count) {
    if (!progressBarElement || !milestonePoints) return;

    // Max target is 100 (assuming data-target values are 10, 50, 100)
    const maxTarget = 100;
    const percentage = Math.min((count / maxTarget) * 100, 100);

    progressBarElement.style.width = `${percentage}%`;

    // Update active state for points
    milestonePoints.forEach(point => {
        const target = parseInt(point.getAttribute('data-target'));
        point.classList.toggle('reached', count >= target);
    });
}

// Animation đếm số từ giá trị cũ đến giá trị mới
function animateCount(from, to, element) {
    if (from === to) return;

    const duration = 1000; // 1 giây
    const startTime = performance.now();

    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(from + (to - from) * easeOut);

        element.textContent = currentValue.toLocaleString('en-US');

        if (progress < 1) {
            requestAnimationFrame(updateCount);
        }
    }

    requestAnimationFrame(updateCount);
}

// Setup real-time subscription với polling tối ưu
function setupRealtimeSubscription() {
    console.log('⚙️ Setting up real-time subscription...');

    // Cập nhật ngay lập tức khi load trang
    updatePreregisterCount();

    // Polling mỗi 5 giây (giảm tần suất để tối ưu performance)
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(() => {
        console.log('🔄 Polling for updates...');
        updatePreregisterCount();
    }, 5000);
}

// Cleanup function khi trang unload
function cleanup() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        console.log('🧹 Cleaned up polling interval');
    }
}

// Khởi tạo duy nhất khi trang load
function initPreregister() {
    console.log('📄 Initializing preregister system...');
    
    // Cache all DOM elements
    cacheDOMElements();
    
    // Setup realtime updates
    if (preregCountElement) {
        setupRealtimeSubscription();
    }
    
    // Setup form handler
    setupFormHandler();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
}

// Single event listener
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreregister);
} else {
    initPreregister();
}

// Form handling function
function setupFormHandler() {
    if (!form) {
        console.log('⚠️ Form not found');
        return;
    }
    
    console.log('📝 Form found, setting up event listener');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log('📝 Form submitted');

        const name = document.getElementById('name-prereg').value.trim();
        const email = document.getElementById('email-prereg').value.trim().toLowerCase();

        console.log('📝 Form data:', { name, email });

        if (!name || !email) {
            console.log('❌ Form validation failed');
            return;
        }

        // Kiểm tra email đã tồn tại chưa
        const { exists, error: checkError } = await checkEmailExists(email);
        if (checkError) {
            console.log('❌ Email check error');
            showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau!', false);
            return;
        }
        if (exists) {
            console.log('❌ Email already exists');
            showMessage('Email này đã được đăng ký trước!', false);
            return;
        }

        // Gửi dữ liệu lên Supabase
        console.log('📤 Sending data to Supabase...');
        const { error } = await insertPreregister(name, email);
        if (error) {
            console.log('❌ Insert failed');
            showMessage('Đăng ký thất bại, vui lòng thử lại!', false);
        } else {
            console.log('✅ Insert successful');
            showMessage('Đăng ký thành công! Cảm ơn bạn.', true);
            form.reset();
            updatePreregisterCount();
        }
    });
}

// Helper functions
async function checkEmailExists(email) {
    try {
        console.log('🔍 Checking email exists:', email);
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?email=eq.${encodeURIComponent(email)}`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('🔍 Email check response:', res.status);

        if (!res.ok) return { exists: false, error: true };
        const data = await res.json();
        console.log('🔍 Email check data:', data);
        return { exists: data.length > 0, error: false };
    } catch (e) {
        console.error('❌ Email check error:', e);
        return { exists: false, error: true };
    }
}

async function insertPreregister(name, email) {
    try {
        console.log('📤 Inserting preregister:', { name, email });
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ name, email })
        });

        console.log('📤 Insert response:', res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Insert error:', errorText);
            return { error: true };
        }

        const data = await res.json();
        console.log('✅ Insert successful:', data);
        return { error: false };
    } catch (e) {
        console.error('❌ Insert error:', e);
        return { error: true };
    }
}

function showMessage(msg, success) {
    const div = document.createElement('div');
    div.className = 'install-success';
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${success ? 'rgba(76, 175, 80, 0.95)' : 'rgba(220, 38, 38, 0.95)'};
    `;
    div.innerHTML = success ? `✓ ${msg}` : `✕ ${msg}`;
    document.body.appendChild(div);
    setTimeout(() => {
        div.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

console.log('✅ Preregister script loaded successfully');
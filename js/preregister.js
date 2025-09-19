// js/preregister.js
// Xử lý đăng ký trước với Supabase + Real-time Updates

// === ĐIỀN THÔNG TIN SUPABASE CỦA BẠN Ở ĐÂY ===
const SUPABASE_URL = 'https://eyogwyullsrbefsciyyl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5b2d3eXVsbHNyYmVmc2NpeXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDE1OTYsImV4cCI6MjA2ODM3NzU5Nn0.FOFVei4uWplT6zSqNB48O3jSDxWT_Brfwgd1iZRFssg';
const TABLE = 'preregister';

console.log('🚀 Preregister script loading...');
console.log('📊 Supabase URL:', SUPABASE_URL);

// Override animation cố định ngay lập tức
(function() {
    'use strict';
    
    function overrideCount() {
        const preregCountElement = document.getElementById('prereg-count');
        if (preregCountElement) {
            preregCountElement.textContent = '0';
            console.log('✅ Overrode fixed animation, set count to 0');
        } else {
            console.log('❌ Element prereg-count not found');
        }
    }
    
    // Chỉ override khi DOM ready
    document.addEventListener('DOMContentLoaded', overrideCount);
    
    // Override sau khi DOM load xong
    setTimeout(overrideCount, 100);
    setTimeout(overrideCount, 500);
})();

const form = document.getElementById('preregister-form');
let realtimeSubscription = null;
let currentCount = 0;

// Cập nhật số lượng đăng ký
async function updatePreregisterCount() {
    try {
        console.log('📡 Fetching preregister count from database...');
        
        // Kiểm tra element có tồn tại không
        const preregCountElement = document.getElementById('prereg-count');
        if (!preregCountElement) {
            console.error('❌ Element prereg-count not found in updatePreregisterCount');
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
    const el = document.getElementById('prereg-count');
    if (!el) {
        console.error('❌ Element prereg-count not found');
        return;
    }
    
    const oldCount = currentCount;
    currentCount = count;
    
    console.log(`🔄 Updating count from ${oldCount} to ${count}`);
    
    // Animation đếm số
    animateCount(oldCount, count, el);
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

// Setup real-time subscription với polling
function setupRealtimeSubscription() {
    console.log('⚙️ Setting up real-time subscription...');
    
    // Test element trước khi fetch data
    const preregCountElement = document.getElementById('prereg-count');
    if (preregCountElement) {
        console.log('✅ Element found, current value:', preregCountElement.textContent);
        // Set về 0 trước khi fetch
        preregCountElement.textContent = '0';
    } else {
        console.error('❌ Element prereg-count not found in setupRealtimeSubscription');
    }
    
    // Cập nhật ngay lập tức khi load trang
    updatePreregisterCount();
    
    // Polling mỗi 3 giây để cập nhật real-time
    setInterval(() => {
        console.log('🔄 Polling for updates...');
        updatePreregisterCount();
    }, 3000);
}

// Khởi tạo khi trang load
window.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded - starting preregister setup');
    
    // Override count trước khi setup
    const preregCountElement = document.getElementById('prereg-count');
    if (preregCountElement) {
        preregCountElement.textContent = '0';
        console.log('✅ Set initial count to 0');
    }
    
    // Setup real-time subscription
    setupRealtimeSubscription();
});

// Fallback nếu DOM đã load xong
if (document.readyState === 'loading') {
    // DOM đang loading, đã có event listener ở trên
} else {
    // DOM đã load xong
    console.log('📄 DOM already loaded - starting preregister setup');
    const preregCountElement = document.getElementById('prereg-count');
    if (preregCountElement) {
        preregCountElement.textContent = '0';
        console.log('✅ Set initial count to 0');
    }
    setupRealtimeSubscription();
}

// Form handling
if (form) {
    console.log('📝 Form found, setting up event listener');
form.addEventListener('submit', async function(e) {
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
} else {
    console.error('❌ Form not found');
}

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
    div.style.background = success ? 'rgba(76, 175, 80, 0.95)' : 'rgba(220, 38, 38, 0.95)';
    div.innerHTML = success ? `✓ ${msg}` : `✕ ${msg}`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// Cleanup khi trang bị đóng
window.addEventListener('beforeunload', () => {
    if (realtimeSubscription) {
        realtimeSubscription.unsubscribe();
    }
});

console.log('✅ Preregister script loaded successfully');
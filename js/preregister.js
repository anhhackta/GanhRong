// js/preregister.js
// Xử lý đăng ký trước với Supabase

// === ĐIỀN THÔNG TIN SUPABASE CỦA BẠN Ở ĐÂY ===
const SUPABASE_URL = 'https://mhaoqxryktfxkgxpsvic.supabase.co'; // <-- Thay bằng URL của bạn
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oYW9xeHJ5a3RmeGtneHBzdmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMjE2NjYsImV4cCI6MjA2Njc5NzY2Nn0.7xvGQc8liQ0-OoT656_F_AFm0p_s2-Y5BLSpsYWVpa4'; // <-- Thay bằng ANON KEY của bạn
const TABLE = 'preregister'; // Tên bảng

const form = document.getElementById('preregister-form');

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name-prereg').value.trim();
    const email = document.getElementById('email-prereg').value.trim().toLowerCase();
    if (!name || !email) return;

    // Kiểm tra email đã tồn tại chưa
    const { exists, error: checkError } = await checkEmailExists(email);
    if (checkError) {
        showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau!', false);
        return;
    }
    if (exists) {
        showMessage('Email này đã được đăng ký trước!', false);
        return;
    }

    // Gửi dữ liệu lên Supabase
    const { error } = await insertPreregister(name, email);
    if (error) {
        showMessage('Đăng ký thất bại, vui lòng thử lại!', false);
    } else {
        showMessage('Đăng ký thành công! Cảm ơn bạn.', true);
        form.reset();
        updatePreregisterCount();
    }
});

async function checkEmailExists(email) {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?email=eq.${encodeURIComponent(email)}`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (!res.ok) return { exists: false, error: true };
        const data = await res.json();
        return { exists: data.length > 0, error: false };
    } catch (e) {
        return { exists: false, error: true };
    }
}

async function insertPreregister(name, email) {
    try {
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
        if (!res.ok) return { error: true };
        return { error: false };
    } catch (e) {
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

window.addEventListener('DOMContentLoaded', () => {
    updatePreregisterCount();
});

async function updatePreregisterCount() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/count_preregister`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) return;
        const data = await res.json();
        const count = data.count || 0;
        const el = document.getElementById('prereg-count');
        if (el) el.textContent = count.toLocaleString('en-US');
    } catch (e) {}
} 
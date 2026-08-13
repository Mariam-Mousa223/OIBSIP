document.addEventListener('DOMContentLoaded', () => {
    // العناصر الأساسية
    const tabRegister = document.getElementById('tabRegister');
    const tabLogin = document.getElementById('tabLogin');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const dashboard = document.getElementById('dashboard');
    const alertBox = document.getElementById('alertBox');
    const dashUser = document.getElementById('dashUser');
    const btnLogout = document.getElementById('btnLogout');

    // التبديل بين التبويبات
    tabRegister.addEventListener('click', () => switchTab('register'));
    tabLogin.addEventListener('click', () => switchTab('login'));

    function switchTab(tab) {
        hideAlert();
        if (tab === 'register') {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        } else {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        }
    }

    // دالة تشفير كلمة المرور عبر SHA-256 (عدم تخزين كـ النص العادي)
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // --- 1. إنشاء حساب جديد (Register) ---
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();

        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;

        // التحقق الأساسي من صحة النموذج (عدم إرسال نماذج فارغة)
        if (!username || !email || !password) {
            showAlert('Please fill in all required fields.', 'danger');
            return;
        }

        // التحقق من صحة كلمة المرور: 8 أحرف ورقم واحد على الأقل
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z\u0600-\u06FF]).{8,}$/;
        if (!password.match(passwordRegex)) {
            showAlert('Password must be at least 8 characters long and contain at least one number.', 'danger');
            return;
        }

        let users = JSON.parse(localStorage.getItem('registered_users')) || [];

        // التحقق من اسم المستخدم/البريد المكرر
        const isUserExists = users.some(user => user.username === username || user.email === email);
        if (isUserExists) {
            showAlert('Username or email is already registered!.', 'danger');
            return;
        }

        // تشفير كلمة المرور قبل الحفظ
        const hashedPassword = await hashPassword(password);

        users.push({
            username: username,
            email: email,
            password: hashedPassword
        });

        localStorage.setItem('registered_users', JSON.stringify(users));
        showAlert('Account created successfully! You can login now.', 'success');
        
        registerForm.reset();
        setTimeout(() => switchTab('login'), 1200);
    });

    // --- 2. تسجيل الدخول (Login) ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();

        const identifier = document.getElementById('loginIdentifier').value.trim();
        const password = document.getElementById('loginPassword').value;

        // التحقق من النماذج الفارغة
        if (!identifier || !password) {
            showAlert('Please enter your login credentials.', 'danger');
            return;
        }

        let users = JSON.parse(localStorage.getItem('registered_users')) || [];
        const hashedPassword = await hashPassword(password);

        // البحث عن المستخدم
        const validUser = users.find(u => 
            (u.username === identifier || u.email === identifier) && u.password === hashedPassword
        );

        // معالجة بيانات الاعتماد غير الصحيحة دون الكشف عن الحقل الخاطئ تحديداً
        if (!validUser) {
            showAlert('Invalid username/email or password.', 'danger');
            return;
        }

        // حفظ الجلسة في التخزين المحلي
        localStorage.setItem('logged_in_user', JSON.stringify({ username: validUser.username }));
        loginForm.reset();
        checkAuthStatus();
    });

    // --- 3. تسجيل الخروج وحماية الصفحة المحمية ---
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('logged_in_user');
        checkAuthStatus();
        showAlert('Logged out successfully.', 'success');
    });

    function checkAuthStatus() {
        const loggedUser = JSON.parse(localStorage.getItem('logged_in_user'));

        if (loggedUser) {
            // إخفاء النماذج وعرض لوحة التحكم المحمية
            document.querySelector('.tabs').style.display = 'none';
            registerForm.classList.remove('active');
            loginForm.classList.remove('active');
            
            dashUser.textContent = loggedUser.username;
            dashboard.classList.add('active');
        } else {
            // إعادة التوجيه لصفحة الدخول إذا لم توجد جلسة
            document.querySelector('.tabs').style.display = 'flex';
            dashboard.classList.remove('active');
            switchTab('login');
        }
    }

    function showAlert(msg, type) {
        alertBox.textContent = msg;
        alertBox.className = `alert alert-${type}`;
        alertBox.style.display = 'block';
    }

    function hideAlert() {
        alertBox.style.display = 'none';
    }

    // التحقق من الجلسة عند تحميل الصفحة
    checkAuthStatus();
});

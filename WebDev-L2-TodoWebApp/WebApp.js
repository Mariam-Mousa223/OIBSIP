document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');
    const pendingCount = document.getElementById('pendingCount');
    const completedCount = document.getElementById('completedCount');
    const pendingEmpty = document.getElementById('pendingEmpty');
    const completedEmpty = document.getElementById('completedEmpty');

    // تحميل المهام المخزنة من LocalStorage عند فتح الصفحة
    let tasks = JSON.parse(localStorage.getItem('my_tasks')) || [];

    // إضافة مهمة جديدة
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
            completedAt: null
        };

        tasks.push(newTask);
        saveAndRender();
        taskInput.value = '';
    });

    // حفظ البيانات في التخزين المحلي وإعادة الرسم
    function saveAndRender() {
        localStorage.setItem('my_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        let pendingNum = 0;
        let completedNum = 0;

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';

            if (!task.completed) {
                pendingNum++;
                li.innerHTML = `
                    <div class="task-main">
                        <span class="task-text">${escapeHtml(task.text)}</span>
                        <div class="task-actions">
                            <button class="btn-sm btn-complete" onclick="toggleTask(${task.id})">Complete ✓</button>
                            <button class="btn-sm btn-edit" onclick="editTask(${task.id})">Edit ✏️</button>
                            <button class="btn-sm btn-delete" onclick="deleteTask(${task.id})">Delete 🗑️</button>
                        </div>
                    </div>
                    <div class="task-time">Added: ${task.createdAt}</div>
                `;
                pendingList.appendChild(li);
            } else {
                completedNum++;
                li.innerHTML = `
                    <div class="task-main">
                        <span class="task-text completed-text">${escapeHtml(task.text)}</span>
                        <div class="task-actions">
                            <button class="btn-sm btn-undo" onclick="toggleTask(${task.id})">Undo ↩️</button>
                            <button class="btn-sm btn-edit" onclick="editTask(${task.id})">Edit ✏️</button>
                            <button class="btn-sm btn-delete" onclick="deleteTask(${task.id})">Delete 🗑️</button>
                        </div>
                    </div>
                    <div class="task-time">Added: ${task.createdAt} | Completed: ${task.completedAt}</div>
                `;
                completedList.appendChild(li);
            }
        });

        // تحديث المؤشرات بالأرقام "X معلقة" و "Y مكتملة"
        pendingCount.textContent = `${pendingNum} Pending`;
        completedCount.textContent = `${completedNum} Completed`;

        // إظهار وإخفاء رسائل الحالة الفارغة
        pendingEmpty.style.display = pendingNum === 0 ? 'block' : 'none';
        completedEmpty.style.display = completedNum === 0 ? 'block' : 'none';
    }

    // تبديل حالة المهمة (مكتملة / معلقة)
    window.toggleTask = function(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                const nextStatus = !task.completed;
                return {
                    ...task,
                    completed: nextStatus,
                    completedAt: nextStatus ? new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) : null
                };
            }
            return task;
        });
        saveAndRender();
    };

    // تعديل نص المهمة مباشرة
    window.editTask = function(id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const newText = prompt('Edit task text:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveAndRender();
        }
    };

    // حذف المهمة نهائياً من القائمتين
    window.deleteTask = function(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveAndRender();
    };

    // تجنب الثغرات وإدخال نصوص HTML غير أمنة
    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // الرسم الأولي عند تشغيل التطبيق
    renderTasks();
});





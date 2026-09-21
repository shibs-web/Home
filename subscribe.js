(function () {
    'use strict';

    const initSubscribeForm = () => {
        const form = document.getElementById('subscribeForm');
        if (!form) return;

        const projectSelect = document.getElementById('projectSelect');
        const planSelect = document.getElementById('planSelect');
        const usersInput = document.getElementById('usersInput');
        const devicesInput = document.getElementById('devicesInput');
        const estimatePriceEl = document.getElementById('estimatePrice');
        const estimateNoteEl = document.getElementById('estimateNote');
        const featuresList = document.getElementById('planFeatures');

        const projects = (typeof SHIBS_PROJECTS !== 'undefined' && Array.isArray(SHIBS_PROJECTS)) ? SHIBS_PROJECTS : [];

        const checkIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

        const findProject = (id) => projects.find((p) => p.id === id) || null;
        const findPlan = (project, planId) => (project ? project.plans.find((pl) => pl.id === planId) : null) || null;

        const resetSelect = (select, placeholder) => {
            select.innerHTML = '';
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = placeholder;
            opt.disabled = true;
            opt.selected = true;
            select.appendChild(opt);
        };

        const populateProjects = () => {
            resetSelect(projectSelect, 'اختر مشروعاً');

            if (!projects.length) {
                projectSelect.disabled = true;
                projectSelect.querySelector('option').textContent = 'تعذر تحميل بيانات المشاريع';
                return;
            }

            projects.forEach((project) => {
                const opt = document.createElement('option');
                opt.value = project.id;
                opt.textContent = project.name;
                projectSelect.appendChild(opt);
            });
        };

        const populatePlans = (project) => {
            resetSelect(planSelect, 'اختر نوع الاشتراك');

            if (!project) {
                planSelect.disabled = true;
                usersInput.disabled = true;
                devicesInput.disabled = true;
                return;
            }

            project.plans.forEach((plan) => {
                const opt = document.createElement('option');
                opt.value = plan.id;
                opt.textContent = plan.name;
                planSelect.appendChild(opt);
            });

            planSelect.disabled = false;
        };

        const renderEmptyEstimate = () => {
            estimatePriceEl.textContent = '—';
            estimateNoteEl.textContent = 'اختر مشروعاً ونوع اشتراك لعرض السعر التقديري.';
            featuresList.innerHTML = '';
        };

        const updateEstimate = () => {
            const project = findProject(projectSelect.value);
            const plan = findPlan(project, planSelect.value);
            plan.currency = project ? project.currency : '';

            if (!project || !plan) {
                renderEmptyEstimate();
                return;
            }

            const users = Math.max(parseInt(usersInput.value, 10) || plan.includedUsers, 1);
            const devices = Math.max(parseInt(devicesInput.value, 10) || plan.includedDevices, 1);

            const extraUsers = Math.max(0, users - plan.includedUsers);
            const extraDevices = Math.max(0, devices - plan.includedDevices);

            const total = plan.basePrice + (extraUsers * plan.pricePerUser) + (extraDevices * plan.pricePerDevice);

            estimatePriceEl.innerHTML = ` ${total} <small class="currency">${plan.currency}</small> <span> / شهرياً (تقديري)</span>`;
            estimateNoteEl.textContent = `تشمل الخطة الأساسية ${plan.includedUsers} مستخدم و${plan.includedDevices} جهاز — وأي عدد إضافي يُحتسب فوق ذلك.`;

            featuresList.innerHTML = '';
            plan.features.forEach((feature) => {
                const li = document.createElement('li');
                li.innerHTML = `${checkIcon}<span>${feature}</span>`;
                featuresList.appendChild(li);
            });
        };

        projectSelect.addEventListener('change', () => {
            const project = findProject(projectSelect.value);
            populatePlans(project);
            renderEmptyEstimate();
        });

        planSelect.addEventListener('change', () => {
            const project = findProject(projectSelect.value);
            const plan = findPlan(project, planSelect.value);

            if (plan) {
                usersInput.disabled = false;
                devicesInput.disabled = false;
                usersInput.value = plan.includedUsers;
                devicesInput.value = plan.includedDevices;
            }

            updateEstimate();
        });

        usersInput.addEventListener('input', updateEstimate);
        devicesInput.addEventListener('input', updateEstimate);

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const project = findProject(projectSelect.value);
            const plan = findPlan(project, planSelect.value);
            plan.currency = project.currency;

            if (!project || !plan) {
                projectSelect.focus();
                return;
            }

            const name = form.elements.name.value.trim();
            const email = form.elements.email.value.trim();
            const notes = form.elements.notes.value.trim();
            const users = usersInput.value;
            const devices = devicesInput.value;

            const extraUsers = Math.max(0, parseInt(users, 10) - plan.includedUsers);
            const extraDevices = Math.max(0, parseInt(devices, 10) - plan.includedDevices);
            const total = plan.basePrice + (extraUsers * plan.pricePerUser) + (extraDevices * plan.pricePerDevice);

            // const bodyLines = [
            //     `الاسم: ${name}`,
            //     `البريد الإلكتروني: ${email}`,
            //     '',
            //     `المشروع: ${project.name}`,
            //     `نوع الاشتراك: ${plan.name}`,
            //     `عدد المستخدمين: ${users}`,
            //     `عدد الأجهزة: ${devices}`,
            //     `السعر التقديري الشهري: ${plan.currency}${total}`,
            //     '',
            //     notes ? `ملاحظات إضافية: ${notes}` : null
            // ].filter((line) => line !== null);

            // const subject = encodeURIComponent(`طلب اشتراك جديد — ${project.name}`);
            // const body = encodeURIComponent(bodyLines.join('\n'));

            // window.location.href = `mailto:info@shibs.de?subject=${subject}&body=${body}`;

            const bodyLines = [
                `الاسم: ${name}`,
                `البريد الإلكتروني: ${email}`,
                '',
                `المشروع: ${project.name}`,
                `نوع الاشتراك: ${plan.name}`,
                `عدد المستخدمين: ${users}`,
                `عدد الأجهزة: ${devices}`,
                `السعر التقديري الشهري: ${plan.currency}${total}`,
                '',
                notes ? `ملاحظات إضافية: ${notes}` : null
            ].filter((line) => line !== null);

            const whatsappNumber = '963988592846';
            const whatsappMessage = encodeURIComponent(bodyLines.join('\n'));

            window.location.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        });

        populateProjects();
        populatePlans(null);
        renderEmptyEstimate();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSubscribeForm);
    } else {
        initSubscribeForm();
    }
})();

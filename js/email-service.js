/**
 * خدمة إرسال البريد الإلكتروني باستخدام EmailJS
 * يجب إنشاء حساب على https://www.emailjs.com
 * واستبدال المعرفات أدناه بالمعرفات الخاصة بك
 */

// معرفات EmailJS - يجب استبدالها بالمعرفات الخاصة بك
const EMAILJS_USER_ID = "YOUR_USER_ID"; // معرف المستخدم من EmailJS
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // معرف خدمة البريد من EmailJS
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // معرف قالب البريد من EmailJS

// متغيرات للتحكم في الحماية
const COOLDOWN_PERIOD = 60000; // فترة الانتظار بين الرسائل (بالمللي ثانية) - 60 ثانية
let lastSubmissionTime = 0; // وقت آخر إرسال للنموذج

/**
 * التحقق من صحة البريد الإلكتروني
 * @param {string} email - البريد الإلكتروني للتحقق منه
 * @returns {boolean} - صحيح إذا كان البريد صالحًا
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * التحقق من وجود نصوص مشبوهة في الرسالة
 * @param {string} text - النص للتحقق منه
 * @returns {boolean} - صحيح إذا كان النص آمنًا
 */
function isSafeText(text) {
    // قائمة بالكلمات المشبوهة التي قد تشير إلى بريد مزعج
    const suspiciousPatterns = [
        /viagra/i, /casino/i, /lottery/i, /win money/i, /\$\$\$/,
        /bitcoin/i, /crypto/i, /investment opportunity/i,
        /[^\w\s\u0600-\u06FF]/g // تحقق من وجود رموز غير عادية بكثرة
    ];
    
    // التحقق من عدد الروابط - الرسائل المزعجة غالبًا ما تحتوي على روابط كثيرة
    const urlCount = (text.match(/https?:\/\//g) || []).length;
    if (urlCount > 3) return false;
    
    // التحقق من الكلمات المشبوهة
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(text)) return false;
    }
    
    return true;
}

/**
 * التحقق من صحة النموذج بالكامل
 * @param {Object} formData - بيانات النموذج
 * @returns {Object} - نتيجة التحقق {isValid, message}
 */
function validateForm(formData) {
    // التحقق من وجود جميع الحقول المطلوبة
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        return { isValid: false, message: "جميع الحقول مطلوبة" };
    }
    
    // التحقق من طول الاسم
    if (formData.name.length < 3 || formData.name.length > 50) {
        return { isValid: false, message: "يجب أن يكون الاسم بين 3 و 50 حرفًا" };
    }
    
    // التحقق من صحة البريد الإلكتروني
    if (!validateEmail(formData.email)) {
        return { isValid: false, message: "البريد الإلكتروني غير صالح" };
    }
    
    // التحقق من طول الموضوع
    if (formData.subject.length < 5 || formData.subject.length > 100) {
        return { isValid: false, message: "يجب أن يكون الموضوع بين 5 و 100 حرف" };
    }
    
    // التحقق من طول الرسالة
    if (formData.message.length < 10 || formData.message.length > 1000) {
        return { isValid: false, message: "يجب أن تكون الرسالة بين 10 و 1000 حرف" };
    }
    
    // التحقق من أمان النص
    if (!isSafeText(formData.message) || !isSafeText(formData.subject)) {
        return { isValid: false, message: "يحتوي النص على محتوى غير مسموح به" };
    }
    
    // التحقق من فترة الانتظار بين الرسائل
    const now = Date.now();
    if (now - lastSubmissionTime < COOLDOWN_PERIOD) {
        const remainingSeconds = Math.ceil((COOLDOWN_PERIOD - (now - lastSubmissionTime)) / 1000);
        return { 
            isValid: false, 
            message: `الرجاء الانتظار ${remainingSeconds} ثانية قبل إرسال نموذج آخر` 
        };
    }
    
    return { isValid: true, message: "النموذج صالح" };
}

/**
 * إرسال البريد الإلكتروني باستخدام EmailJS
 * @param {Object} formData - بيانات النموذج
 * @returns {Promise} - وعد بنتيجة الإرسال
 */
function sendEmail(formData) {
    // التحقق من صحة النموذج
    const validation = validateForm(formData);
    if (!validation.isValid) {
        return Promise.reject(validation.message);
    }
    
    // تحديث وقت آخر إرسال
    lastSubmissionTime = Date.now();
    
    // إضافة معلومات إضافية للأمان والتتبع
    const enhancedData = {
        ...formData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };
    
    // إرسال البريد الإلكتروني باستخدام EmailJS
    return emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        enhancedData,
        EMAILJS_USER_ID
    );
}

/**
 * معالجة إرسال النموذج
 * @param {Event} event - حدث إرسال النموذج
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // عرض مؤشر التحميل
    const submitButton = document.getElementById('submitButton');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    
    // جمع بيانات النموذج
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // إرسال البريد الإلكتروني
    sendEmail(formData)
        .then(response => {
            // إظهار رسالة نجاح
            showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.', 'success');
            
            // إعادة تعيين النموذج
            document.getElementById('contactForm').reset();
        })
        .catch(error => {
            // إظهار رسالة خطأ
            showNotification(
                typeof error === 'string' ? error : 'حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى لاحقًا.',
                'error'
            );
        })
        .finally(() => {
            // إعادة تفعيل زر الإرسال
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
}

/**
 * عرض إشعار للمستخدم
 * @param {string} message - نص الإشعار
 * @param {string} type - نوع الإشعار (success/error)
 */
function showNotification(message, type) {
    // التحقق من وجود عنصر الإشعارات
    let notificationContainer = document.getElementById('notificationContainer');
    
    // إنشاء عنصر الإشعارات إذا لم يكن موجودًا
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.padding = '15px 20px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    notification.style.fontSize = '14px';
    notification.style.fontWeight = 'bold';
    notification.style.transition = 'all 0.3s ease';
    notification.style.opacity = '0';
    
    // تعيين لون الإشعار حسب النوع
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#F44336';
        notification.style.color = 'white';
    }
    
    // إضافة نص الإشعار
    notification.textContent = message;
    
    // إضافة الإشعار إلى الحاوية
    notificationContainer.appendChild(notification);
    
    // إظهار الإشعار بتأثير متدرج
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // إخفاء الإشعار بعد 5 ثوانٍ
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 5000);
}

// تهيئة EmailJS عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من وجود EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_USER_ID);
        
        // ربط النموذج بمعالج الإرسال
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }
    } else {
        console.error('EmailJS غير متوفر. تأكد من إضافة مكتبة EmailJS إلى الصفحة.');
    }
});

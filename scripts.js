// تحميل الصفحة
/**
 * التحقق من صحة النموذج قبل الإرسال
 * @returns {boolean} - صحيح إذا كان النموذج صالحًا
 */
function validateFormBeforeSubmit() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    const emailError = document.getElementById('emailError');
    
    // التحقق من وجود الحقول
    if (!nameInput || !emailInput || !subjectInput || !messageTextarea) {
        alert('حدث خطأ في النموذج. الرجاء المحاولة مرة أخرى.');
        return false;
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        if (emailError) {
            emailError.textContent = 'الرجاء إدخال بريد إلكتروني صحيح';
        } else {
            alert('الرجاء إدخال بريد إلكتروني صحيح');
        }
        return false;
    }
    
    // التحقق من طول الرسالة
    if (messageTextarea.value.length < 10) {
        alert('الرجاء إدخال رسالة لا تقل عن 10 أحرف');
        return false;
    }
    
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    // التحقق من نموذج الاتصال
    const messageTextarea = document.getElementById('message');
    const charCountSpan = document.getElementById('charCount');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    
    if (messageTextarea && charCountSpan) {
        // تحديث عدد الأحرف عند الكتابة
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCountSpan.textContent = currentLength;
            
            // تغيير لون العداد إذا اقترب من الحد الأقصى
            if (currentLength > 1800) {
                charCountSpan.style.color = '#e74c3c';
            } else if (currentLength > 1500) {
                charCountSpan.style.color = '#f39c12';
            } else {
                charCountSpan.style.color = '';
            }
        });
    }
    
    if (emailInput && emailError) {
        // التحقق من صحة البريد الإلكتروني عند الخروج من الحقل
        emailInput.addEventListener('blur', function() {
            validateEmail(this.value);
        });
    }
    
    // تحريك العداد
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const duration = 2000; // مدة التحريك بالميلي ثانية
        const step = target / (duration / 20); // حساب الخطوة
        
        let current = 0;
        counter.textContent = '0';
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // بدء التحريك عند ظهور العنصر في الشاشة
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter.parentElement);
    });
    
    // تأثير التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // تحريك العناصر عند التمرير
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    // إضافة فئة للعناصر التي سيتم تحريكها
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.querySelectorAll('h2, h3, p, .feature-item, .service-item, .stat-item, .reason-item').forEach(element => {
            element.classList.add('animate-on-scroll');
        });
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // تشغيل التحريك عند تحميل الصفحة
    
    // تغيير لون الرأس عند التمرير
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // زر العودة للأعلى
    const createBackToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.classList.add('back-to-top');
        document.body.appendChild(button);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
            }
        });
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    
    createBackToTopButton();
    
    // إضافة تأثيرات CSS للعناصر المتحركة
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .main-header.scrolled {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.5s ease;
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-100%);
            }
            to {
                transform: translateY(0);
            }
        }
        
        .back-to-top {
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #543ee8;
            color: #fff;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .back-to-top.show {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            background-color: #3069b1;
            transform: translateY(-5px);
        }
    `;
    
    document.head.appendChild(style);
    
    // تحميل Font Awesome
    const loadFontAwesome = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(link);
    };
    
    loadFontAwesome();
    
    // تحميل خط Cairo
    const loadCairoFont = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap';
        document.head.appendChild(link);
    };
    
    loadCairoFont();
});

// التحقق من صحة البريد الإلكتروني
function validateEmail(email) {
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        emailError.textContent = 'الرجاء إدخال بريد إلكتروني صحيح';
        return false;
    } else {
        emailError.textContent = '';
        return true;
    }
}

// التحقق من النموذج وإرساله
function validateAndSubmit() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // التحقق من صحة البريد الإلكتروني
    if (!validateEmail(email)) {
        return false;
    }
    
    // التحقق من طول الرسالة
    if (message.length > 2000) {
        document.getElementById('charCount').style.color = '#e74c3c';
        return false;
    }
    
    // إرسال النموذج عبر البريد الإلكتروني
    const mailtoLink = `mailto:eisra.seifeldin@tallysolutions.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`من: ${name}\nالبريد الإلكتروني: ${email}\n\n${message}`)}`;    
    window.location.href = mailtoLink;
    
    // إظهار رسالة نجاح
    alert('تم إرسال رسالتك بنجاح!');
    
    // منع إرسال النموذج بالطريقة التقليدية
    return false;
}

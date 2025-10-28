let storedPassword = '';
let storedUsername = '';
let attempts = 0;

const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const createBtn = document.getElementById('createBtn');
const createPasswordForm = document.getElementById('createPasswordForm');
const loginForm = document.getElementById('loginForm');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const subtitle = document.getElementById('subtitle');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');

// Toggle mostrar/ocultar contraseña (Paso 1)
togglePassword.addEventListener('click', function() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    eyeIcon.classList.toggle('fa-eye');
    eyeIcon.classList.toggle('fa-eye-slash');
});

// Toggle mostrar/ocultar contraseña (Paso 2)
document.getElementById('togglePasswordLogin').addEventListener('click', function() {
    const passwordLogin = document.getElementById('passwordLogin');
    const eyeIconLogin = document.getElementById('eyeIconLogin');
    const type = passwordLogin.type === 'password' ? 'text' : 'password';
    passwordLogin.type = type;
    eyeIconLogin.classList.toggle('fa-eye');
    eyeIconLogin.classList.toggle('fa-eye-slash');
});

// Validar contraseña en tiempo real
passwordInput.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Actualizar requisitos visuales
    updateRequirement('req-length', requirements.length);
    updateRequirement('req-uppercase', requirements.uppercase);
    updateRequirement('req-lowercase', requirements.lowercase);
    updateRequirement('req-number', requirements.number);
    updateRequirement('req-special', requirements.special);

    // Calcular fortaleza
    Object.values(requirements).forEach(met => {
        if (met) strength++;
    });

    // Actualizar barra de fortaleza
    strengthBar.className = 'password-strength';
    if (strength <= 2) {
        strengthBar.classList.add('strength-weak');
        strengthText.textContent = 'Débil';
        strengthText.style.color = '#dc3545';
    } else if (strength <= 4) {
        strengthBar.classList.add('strength-medium');
        strengthText.textContent = 'Media';
        strengthText.style.color = '#ffc107';
    } else {
        strengthBar.classList.add('strength-strong');
        strengthText.textContent = 'Fuerte';
        strengthText.style.color = '#28a745';
    }

    // Habilitar botón solo si cumple todos los requisitos
    const allMet = Object.values(requirements).every(met => met);
    createBtn.disabled = !allMet;
});

function updateRequirement(id, met) {
    const element = document.getElementById(id);
    const icon = element.querySelector('i');

    if (met) {
        element.classList.remove('unmet');
        element.classList.add('met');
        icon.classList.remove('fa-times-circle');
        icon.classList.add('fa-check-circle');
    } else {
        element.classList.remove('met');
        element.classList.add('unmet');
        icon.classList.remove('fa-check-circle');
        icon.classList.add('fa-times-circle');
    }
}

// PASO 1: Crear contraseña
createPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    storedPassword = passwordInput.value;
    storedUsername = document.getElementById('username').value;
    attempts = 0;

    // Cambiar a paso 2
    createPasswordForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    loginForm.classList.add('fade-in');

    document.getElementById('usernameLogin').value = storedUsername;
    subtitle.textContent = 'Paso 2: Verifica tu contraseña';

    step1.classList.remove('active');
    step1.classList.add('completed');
    step2.classList.add('active');

    // Limpiar alertas
    successAlert.classList.add('d-none');
    errorAlert.classList.add('d-none');
});

// PASO 2: Verificar contraseña
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const enteredPassword = document.getElementById('passwordLogin').value;
    attempts++;

    if (enteredPassword === storedPassword) {
        // Contraseña correcta
        successAlert.classList.remove('d-none');
        errorAlert.classList.add('d-none');

        setTimeout(() => {
            resetAll();
        }, 3000);
    } else {
        // Contraseña incorrecta
        errorAlert.classList.remove('d-none');
        successAlert.classList.add('d-none');

        if (attempts >= 3) {
            errorMessage.textContent = `Contraseña incorrecta (${attempts} intentos). ¿Necesitas crear una nueva?`;
        } else {
            errorMessage.textContent = `Contraseña incorrecta. Intento ${attempts} de 3.`;
        }

        document.getElementById('passwordLogin').value = '';
        document.getElementById('passwordLogin').focus();
    }
});

// Botón reset
document.getElementById('resetBtn').addEventListener('click', function() {
    resetAll();
});

function resetAll() {
    // Volver al paso 1
    loginForm.classList.add('hidden');
    createPasswordForm.classList.remove('hidden');
    createPasswordForm.classList.add('fade-in');

    // Resetear formularios
    createPasswordForm.reset();
    loginForm.reset();

    // Resetear variables
    storedPassword = '';
    storedUsername = '';
    attempts = 0;

    // Resetear UI
    subtitle.textContent = 'Paso 1: Crea una contraseña fuerte';
    step1.classList.add('active');
    step1.classList.remove('completed');
    step2.classList.remove('active');

    strengthBar.className = 'password-strength';
    strengthText.textContent = '';
    createBtn.disabled = true;

    // Resetear requisitos
    ['req-length', 'req-uppercase', 'req-lowercase', 'req-number', 'req-special'].forEach(id => {
        updateRequirement(id, false);
    });

    // Ocultar alertas
    successAlert.classList.add('d-none');
    errorAlert.classList.add('d-none');
}
// Wait for Firebase to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen after a delay
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1500);

    // Initialize UI
    initNavigation();
    initAuth();
    initAdminPanel();
    loadData();
});

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Authentication
function initAuth() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminBtn = document.getElementById('admin-btn');

    loginBtn.addEventListener('click', async () => {
        try {
            const result = await window.firebaseSignInWithPopup(window.firebaseAuth, window.firebaseProvider);
            console.log('User signed in:', result.user);
        } catch (error) {
            console.error('Sign in error:', error);
            alert('Erro ao fazer login: ' + error.message);
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await window.firebaseSignOut(window.firebaseAuth);
            console.log('User signed out');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    });

    adminBtn.addEventListener('click', () => {
        document.getElementById('admin-panel').classList.remove('hidden');
    });

    document.getElementById('close-admin').addEventListener('click', () => {
        document.getElementById('admin-panel').classList.add('hidden');
    });

    // Listen for auth state changes
    window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
        if (user) {
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            
            // Check if user is admin (you can customize this logic)
            checkAdminAccess(user.email);
        } else {
            loginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
            adminBtn.classList.add('hidden');
        }
    });
}

async function checkAdminAccess(email) {
    // For demo purposes, allow specific email as admin
    // In production, you should check this in Firebase Database or Custom Claims
    const adminEmails = ['pelegrinelileal@gmail.com', email]; // Add your admin emails here
    
    if (adminEmails.includes(email)) {
        document.getElementById('admin-btn').classList.remove('hidden');
    }
}

// Admin Panel
function initAdminPanel() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding section
            const section = item.dataset.section;
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`admin-${section}`).classList.add('active');
            
            // Update title
            document.getElementById('admin-title').textContent = item.textContent.trim();
        });
    });

    // Form submissions
    document.getElementById('bot-form').addEventListener('submit', handleBotSubmit);
    document.getElementById('plan-form').addEventListener('submit', handlePlanSubmit);
}

// Load data from Firebase
async function loadData() {
    try {
        // Load bots
        const botsRef = window.firebaseRef(window.firebaseDb, 'bots');
        window.firebaseOnValue(botsRef, (snapshot) => {
            const bots = snapshot.val();
            if (bots) {
                displayBots(bots);
                updateBotsTable(bots);
                updateDashboardStats();
            }
        });

        // Load plans
        const plansRef = window.firebaseRef(window.firebaseDb, 'plans');
        window.firebaseOnValue(plansRef, (snapshot) => {
            const plans = snapshot.val();
            if (plans) {
                displayPlans(plans);
                updatePlansTable(plans);
                updateDashboardStats();
            }
        });

        // Load terms
        const termsRef = window.firebaseRef(window.firebaseDb, 'terms');
        window.firebaseOnValue(termsRef, (snapshot) => {
            const terms = snapshot.val();
            if (terms) {
                document.getElementById('terms-content').value = terms;
            }
        });

        // Load users
        const usersRef = window.firebaseRef(window.firebaseDb, 'users');
        window.firebaseOnValue(usersRef, (snapshot) => {
            const users = snapshot.val();
            if (users) {
                updateUsersTable(users);
                updateDashboardStats();
            }
        });

        // Initialize default data if empty
        initializeDefaultData();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function initializeDefaultData() {
    try {
        // Check if bots exist
        const botsSnapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDb, 'bots'));
        if (!botsSnapshot.exists()) {
            const defaultBots = {
                'bot1': {
                    name: 'ModBot',
                    description: 'Bot de moderação avançado com sistema de automoderation, logs e comandos personalizados.',
                    icon: '🤖',
                    status: 'active',
                    servers: 150
                },
                'bot2': {
                    name: 'MusicBot',
                    description: 'Bot de música com suporte a Spotify, YouTube, SoundCloud e playlists personalizadas.',
                    icon: '🎵',
                    status: 'active',
                    servers: 200
                },
                'bot3': {
                    name: 'EcoBot',
                    description: 'Sistema de economia completo com loja, apostas, jogos e ranking global.',
                    icon: '💰',
                    status: 'active',
                    servers: 180
                }
            };
            await window.firebaseSet(window.firebaseRef(window.firebaseDb, 'bots'), defaultBots);
        }

        // Check if plans exist
        const plansSnapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDb, 'plans'));
        if (!plansSnapshot.exists()) {
            const defaultPlans = {
                'plan1': {
                    name: 'Grátis',
                    price: 0,
                    features: ['Acesso a bots básicos', 'Suporte por email', 'Até 3 servidores'],
                    popular: false
                },
                'plan2': {
                    name: 'Premium',
                    price: 19.99,
                    features: ['Acesso a todos os bots', 'Suporte prioritário', 'Servidores ilimitados', 'Recursos exclusivos', 'API access'],
                    popular: true
                },
                'plan3': {
                    name: 'Enterprise',
                    price: 49.99,
                    features: ['Tudo do Premium', 'Bot personalizado', 'Suporte 24/7', 'SLA garantido', 'Dedicated server'],
                    popular: false
                }
            };
            await window.firebaseSet(window.firebaseRef(window.firebaseDb, 'plans'), defaultPlans);
        }

        // Check if terms exist
        const termsSnapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDb, 'terms'));
        if (!termsSnapshot.exists()) {
            const defaultTerms = `TERMOS DE USO - !P | PRODUCTIONS

1. Aceitação dos Termos
Ao usar nossos serviços, você concorda com estes termos de uso.

2. Descrição do Serviço
Oferecemos bots de Discord para moderação, música, economia e outras funcionalidades.

3. Uso Permitido
Você concorda em usar nossos bots apenas para fins legais e de acordo com os Termos de Serviço do Discord.

4. Pagamentos e Reembolsos
Os pagamentos são processados mensalmente. Reembolsos podem ser solicitados dentro de 7 dias.

5. Limitação de Responsabilidade
Não somos responsáveis por danos causados pelo uso indevido de nossos bots.

6. Modificações
Reservamo-nos o direito de modificar estes termos a qualquer momento.

7. Contato
Para dúvidas, entre em contato: contato@pproductions.com`;
            await window.firebaseSet(window.firebaseRef(window.firebaseDb, 'terms'), defaultTerms);
        }
    } catch (error) {
        console.error('Error initializing default data:', error);
    }
}

// Display functions
function displayBots(bots) {
    const grid = document.getElementById('bots-grid');
    grid.innerHTML = '';
    
    Object.values(bots).forEach(bot => {
        const card = document.createElement('div');
        card.className = 'bot-card-grid';
        card.innerHTML = `
            <div class="bot-icon">${bot.icon || '🤖'}</div>
            <h3>${bot.name}</h3>
            <p>${bot.description}</p>
            <span class="bot-status ${bot.status}">${bot.status === 'active' ? 'Ativo' : 'Inativo'}</span>
        `;
        grid.appendChild(card);
    });
}

function displayPlans(plans) {
    const grid = document.getElementById('plans-grid');
    grid.innerHTML = '';
    
    Object.values(plans).forEach(plan => {
        const card = document.createElement('div');
        card.className = `plan-card ${plan.popular ? 'popular' : ''}`;
        card.innerHTML = `
            <h3>${plan.name}</h3>
            <div class="plan-price">R$ ${plan.price}<span>/mês</span></div>
            <ul class="plan-features">
                ${plan.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <button class="btn btn-primary">Assinar</button>
        `;
        grid.appendChild(card);
    });
}

function updateBotsTable(bots) {
    const table = document.getElementById('bots-table');
    table.innerHTML = '';
    
    Object.entries(bots).forEach(([id, bot]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bot.name}</td>
            <td><span class="bot-status ${bot.status}">${bot.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
            <td>${bot.servers || 0}</td>
            <td>
                <button class="btn btn-secondary" onclick="editBot('${id}')">Editar</button>
                <button class="btn btn-outline" onclick="deleteBot('${id}')">Excluir</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function updatePlansTable(plans) {
    const table = document.getElementById('plans-table');
    table.innerHTML = '';
    
    Object.entries(plans).forEach(([id, plan]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plan.name}</td>
            <td>R$ ${plan.price}</td>
            <td>${plan.features.length} recursos</td>
            <td>
                <button class="btn btn-secondary" onclick="editPlan('${id}')">Editar</button>
                <button class="btn btn-outline" onclick="deletePlan('${id}')">Excluir</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function updateUsersTable(users) {
    const table = document.getElementById('users-table');
    table.innerHTML = '';
    
    Object.entries(users).forEach(([id, user]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.email}</td>
            <td>${user.plan || 'Grátis'}</td>
            <td>${new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
            <td>
                <button class="btn btn-secondary" onclick="editUser('${id}')">Editar</button>
            </td>
        `;
        table.appendChild(row);
    });
}

async function updateDashboardStats() {
    try {
        const botsSnapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDb, 'bots'));
        const plansSnapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDb, 'plans'));
        const usersSnapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDb, 'users'));
        
        const bots = botsSnapshot.val();
        const plans = plansSnapshot.val();
        const users = usersSnapshot.val();
        
        const activeBots = bots ? Object.values(bots).filter(b => b.status === 'active').length : 0;
        const totalServers = bots ? Object.values(bots).reduce((sum, b) => sum + (b.servers || 0), 0) : 0;
        
        document.getElementById('stat-bots').textContent = activeBots;
        document.getElementById('stat-users').textContent = users ? Object.keys(users).length : 0;
        document.getElementById('stat-plans').textContent = plans ? Object.keys(plans).length : 0;
        document.getElementById('stat-servers').textContent = totalServers;
    } catch (error) {
        console.error('Error updating dashboard stats:', error);
    }
}

// Modal functions
function openBotModal() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById('bot-modal').classList.remove('hidden');
}

function openPlanModal() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById('plan-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('bot-modal').classList.add('hidden');
    document.getElementById('plan-modal').classList.add('hidden');
}

// Form handlers
async function handleBotSubmit(e) {
    e.preventDefault();
    
    const botData = {
        name: document.getElementById('bot-name').value,
        description: document.getElementById('bot-description').value,
        icon: document.getElementById('bot-icon').value || '🤖',
        status: document.getElementById('bot-status').value,
        servers: 0
    };
    
    try {
        const newBotRef = window.firebaseRef(window.firebaseDb, 'bots/' + Date.now());
        await window.firebaseSet(newBotRef, botData);
        closeModal();
        e.target.reset();
        alert('Bot adicionado com sucesso!');
    } catch (error) {
        console.error('Error adding bot:', error);
        alert('Erro ao adicionar bot: ' + error.message);
    }
}

async function handlePlanSubmit(e) {
    e.preventDefault();
    
    const planData = {
        name: document.getElementById('plan-name').value,
        price: parseFloat(document.getElementById('plan-price').value),
        features: document.getElementById('plan-features').value.split('\n').filter(f => f.trim()),
        popular: document.getElementById('plan-popular').checked
    };
    
    try {
        const newPlanRef = window.firebaseRef(window.firebaseDb, 'plans/' + Date.now());
        await window.firebaseSet(newPlanRef, planData);
        closeModal();
        e.target.reset();
        alert('Plano adicionado com sucesso!');
    } catch (error) {
        console.error('Error adding plan:', error);
        alert('Erro ao adicionar plano: ' + error.message);
    }
}

async function saveTerms() {
    const terms = document.getElementById('terms-content').value;
    
    try {
        await window.firebaseSet(window.firebaseRef(window.firebaseDb, 'terms'), terms);
        alert('Termos salvos com sucesso!');
    } catch (error) {
        console.error('Error saving terms:', error);
        alert('Erro ao salvar termos: ' + error.message);
    }
}

// Delete functions
async function deleteBot(id) {
    if (confirm('Tem certeza que deseja excluir este bot?')) {
        try {
            await window.firebaseRemove(window.firebaseRef(window.firebaseDb, 'bots/' + id));
            alert('Bot excluído com sucesso!');
        } catch (error) {
            console.error('Error deleting bot:', error);
            alert('Erro ao excluir bot: ' + error.message);
        }
    }
}

async function deletePlan(id) {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
        try {
            await window.firebaseRemove(window.firebaseRef(window.firebaseDb, 'plans/' + id));
            alert('Plano excluído com sucesso!');
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Erro ao excluir plano: ' + error.message);
        }
    }
}

// Edit functions (simplified - you can expand these)
function editBot(id) {
    alert('Funcionalidade de edição em desenvolvimento. ID: ' + id);
}

function editPlan(id) {
    alert('Funcionalidade de edição em desenvolvimento. ID: ' + id);
}

function editUser(id) {
    alert('Funcionalidade de edição em desenvolvimento. ID: ' + id);
}

// Animate stats on scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Initialize stats animation
setTimeout(animateStats, 2000);

// Close modal on overlay click
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
        closeModal();
    }
});

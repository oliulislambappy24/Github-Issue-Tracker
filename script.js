const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const SEARCH_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";

let allIssues = [];

const loginPage = document.getElementById('login-page');
const mainPage = document.getElementById('main-page');
const loginForm = document.getElementById('login-form');
const issuesGrid = document.getElementById('issues-grid');
const loader = document.getElementById('loader');
const issueCount = document.getElementById('issue-count');
const tabBtns = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('issue-modal');
const modalBody = document.getElementById('modal-body');




// Login 
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (document.getElementById('username').value === 'admin' && document.getElementById('password').value === 'admin123') {
        loginPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        fetchIssues();
    } else { alert("Invalid Credentials!"); }
});





// Fetch Data
async function fetchIssues() {
    showLoader(true);
    try {
        const res = await fetch(API_URL);
        const json = await res.json();
        allIssues = json.data;
        renderIssues(allIssues);
    } catch (err) { console.error(err); } finally { showLoader(false); }
}




// Render Cards
function renderIssues(issues) {
    issuesGrid.innerHTML = "";
    issueCount.innerText = `${issues.length} Issues`;

    issues.forEach(issue => {
        const borderClass = issue.status === 'open' ? 'border-open' : 'border-closed';
        const priorityClass = `priority-${issue.priority.toLowerCase()}`;
        const statusImg = issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png';

        const labelsHTML = issue.labels.map((label, index) => {
            let icon = label.toLowerCase().includes('bug') ? '<i class="fas fa-bug"></i>' : '<i class="fas fa-life-ring"></i>';
            const extraClass = index === 1 ? 'label-medium-style' : '';
            return `<span class="label-badge ${extraClass}">${icon} ${label.toUpperCase()}</span>`;
        }).join('');

        const card = document.createElement('div');
        card.className = `issue-card ${borderClass}`;
        card.innerHTML = `
            <div class="card-body" onclick="showModal(${issue.id})">
                <div class="card-header-top">
                    <img src="${statusImg}" class="status-img-icon">
                    <span class="priority-badge ${priorityClass}">${issue.priority}</span>
                </div>
                <h4>${issue.title}</h4>
                <p>${issue.description.substring(0, 80)}...</p>
                <div class="labels-container">${labelsHTML}</div>
            </div>
            <div class="card-footer">#${issue.id} by ${issue.author} <br> ${new Date(issue.createdAt).toLocaleDateString()}</div>
        `;
        issuesGrid.appendChild(card);
    });
}




// Modal  
async function showModal(id) {
    showLoader(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const json = await res.json();
        const issue = json.data;
        
        const date = new Date(issue.createdAt).toLocaleDateString('en-GB');

        const labelsHTML = issue.labels.map((label, index) => {
            let icon = label.toLowerCase().includes('bug') ? 'fa-bug' : 'fa-hand-holding-heart';
            const styleClass = index === 1 ? 'label-medium-style' : '';
            return `<span class="label-badge ${styleClass}"><i class="fas ${icon}"></i> ${label.toUpperCase()}</span>`;
        }).join('');

        modalBody.innerHTML = `
            <h2 class="modal-title">${issue.title}</h2>
            
            <div class="modal-meta-info">
                <span class="status-pill">${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}</span>
                <span> • Opened by ${issue.author} • ${date}</span>
            </div>

            <div class="modal-labels-row">
                ${labelsHTML}
            </div>

            <p class="modal-description">${issue.description}</p>

            <div class="modal-info-grid">
                <div class="info-item">
                    <label>Assignee:</label>
                    <span>${issue.author}</span>
                </div>
                <div class="info-item">
                    <label>Priority:</label>
                    <span class="priority-pill-high">${issue.priority.toUpperCase()}</span>
                </div>
            </div>

            <div class="modal-action-row">
                <button class="btn-close-large" onclick="closeModalWindow()">Close</button>
            </div>
        `;
        modal.classList.remove('hidden');
    } finally { showLoader(false); }
}

function closeModalWindow() { modal.classList.add('hidden'); }
function showLoader(s) { s ? loader.classList.remove('hidden') : loader.classList.add('hidden'); }




// Search 
searchInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (!query) return fetchIssues();
        showLoader(true);
        try {
            const res = await fetch(`${SEARCH_URL}${query}`);
            const json = await res.json();
            renderIssues(json.data);
        } finally { showLoader(false); }
    }
});



tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        renderIssues(filter === 'all' ? allIssues : allIssues.filter(i => i.status === filter));
    });
});


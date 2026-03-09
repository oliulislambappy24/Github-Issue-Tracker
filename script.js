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

















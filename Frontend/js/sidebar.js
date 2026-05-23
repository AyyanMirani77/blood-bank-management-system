/* sidebar.js — BloodCare premium sidebar renderer */

function renderSidebar(activePage) {
  const name = localStorage.getItem('adminName') || 'Admin';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const links = [
    { href: 'dashboard.html',    icon: '📊', label: 'Dashboard'    },
    { href: 'donors.html',       icon: '👤', label: 'Donors'       },
    { href: 'blood-stock.html',  icon: '🩸', label: 'Blood Stock'  },
    { href: 'donations.html',    icon: '💉', label: 'Donations'    },
    { href: 'requests.html',     icon: '📋', label: 'Requests'     },
    { href: 'distribution.html', icon: '🚚', label: 'Distribution' },
    { href: 'hospitals.html',    icon: '🏥', label: 'Hospitals'    },
    { href: 'expiry-log.html',   icon: '⚠️', label: 'Expiry Log'   },
  ];

  const navHTML = links.map(link => `
    <a class="sidebar-link ${link.href === activePage ? 'active' : ''}" href="${link.href}">
      <span class="sidebar-icon">${link.icon}</span>
      <span>${link.label}</span>
    </a>
  `).join('');

  document.getElementById('sidebar').innerHTML = `
    <a class="sidebar-brand" href="dashboard.html">
      <div class="sidebar-brand-icon">🩸</div>
      <div>
        <div class="sidebar-brand-text">Blood<span>Care</span></div>
        <div class="sidebar-brand-sub">Management System</div>
      </div>
    </a>

    <div class="sidebar-nav">
      <div class="sidebar-label">Navigation</div>
      ${navHTML}
    </div>

    <div class="sidebar-footer">
      <div class="sidebar-avatar">${initials}</div>
      <div>
        <div class="sidebar-admin-name">${name}</div>
        <div class="sidebar-admin-role">Administrator</div>
      </div>
      <button class="sidebar-logout" onclick="logout()" title="Logout">🚪</button>
    </div>
  `;
}

function logout() {
  if (confirm('Log out?')) {
    localStorage.clear();
    window.location.href = 'index.html';
  }
}

/* Global toast function used by all pages */
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = (type === 'success' ? '✓ ' : '✕ ') + msg;
  t.className = 'toast show ' + type;
  setTimeout(() => { t.className = 'toast'; }, 3500);
}

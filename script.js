document.addEventListener('DOMContentLoaded', () => {
    
    // ACCESSIBILITÉ
    document.getElementById('contrast-toggle').addEventListener('click', () => document.body.classList.toggle('high-contrast'));
    document.getElementById('dys-toggle').addEventListener('click', () => document.body.classList.toggle('dyslexia-font'));

    // BDD STOCKAGE (Vide au démarrage)
    let articles = []; 
    
    let comptes = [
        { user: "VH", pass: "12345678", role: "Super Admin" }
    ];
    let candidatures = [];

    // NAVIGATION
    const navItems = document.querySelectorAll('.nav-item');
    function naviguer() {
        const hash = window.location.hash || '#accueil';
        document.querySelectorAll('main.page-content').forEach(p => p.style.display = 'none');
        const activePage = document.querySelector(hash);
        if (activePage) activePage.style.display = 'block';
        
        navItems.forEach(item => {
            if(item.getAttribute('href') === hash) item.classList.add('active');
            else item.classList.remove('active');
        });
        window.scrollTo(0, 0);
    }
    window.addEventListener('hashchange', naviguer);
    naviguer();

    // CONNEXION
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const inputUser = document.getElementById('username').value;
        const inputPass = document.getElementById('password').value;
        const msg = document.getElementById('login-message');
        const compteTrouve = comptes.find(c => c.user === inputUser && c.pass === inputPass);
        
        if (compteTrouve) {
            msg.style.color = "green"; msg.style.display = "block"; msg.textContent = "✅ Connexion réussie !";
            setTimeout(() => { window.location.hash = "admin"; msg.style.display = "none"; this.reset(); }, 1000);
        } else {
            msg.style.color = "red"; msg.style.display = "block"; msg.textContent = "❌ Identifiants incorrects.";
        }
    });

    // CANDIDATURE RH
    document.getElementById('rh-form').addEventListener('submit', function(e) {
        e.preventDefault();
        candidatures.push({
            id: Date.now(),
            nom: document.getElementById('rh-nom').value,
            prenom: document.getElementById('rh-prenom').value,
            age: document.getElementById('rh-age').value,
            role: document.getElementById('rh-role').value,
            dispo: document.getElementById('rh-dispo').value,
            motivation: document.getElementById('rh-motivation').value,
            pourquoi: document.getElementById('rh-pourquoi').value
        });
        this.reset();
        alert("✨ Candidature transmise !");
        updateAdminView();
        window.location.hash = "accueil";
    });

    // AFFICHAGE ACCUEIL
    function renderAnnonces() {
        const container = document.getElementById('dynamic-news');
        if (!container) return;
        container.innerHTML = "";
        
        if (articles.length === 0) {
            container.innerHTML = `<p style="color:#666; font-style:italic; grid-column: 1 / -1;">Aucune actualité pour le moment.</p>`;
            return;
        }

        articles.forEach(art => {
            container.innerHTML += `
                <article style="background:white; border:1px solid #e5e5e5; border-radius:6px; padding:20px;">
                    <span style="color:#e1000f; font-size:0.8rem; font-weight:bold; text-transform:uppercase;">${art.tag}</span>
                    <h3 style="margin:10px 0;">${art.title}</h3>
                    <p style="color:#444; font-size:0.95rem;">${art.desc}</p>
                </article>
            `;
        });
    }

    // TABLEAU DE BORD ADMIN
    function updateAdminView() {
        const userTable = document.getElementById('admin-users-table');
        if (userTable) {
            userTable.innerHTML = "";
            comptes.forEach((c, index) => {
                const btn = c.user === "VH" ? "Maître" : `<button class="del-user-btn" data-index="${index}" style="background:#e1000f; color:white; border:none; padding:4px 8px; border-radius:3px; cursor:pointer;">Supprimer</button>`;
                userTable.innerHTML += `
                    <tr style="border-bottom:1px solid #e5e5e5;">
                        <td style="padding:8px; font-weight:bold;">${c.user}</td>
                        <td style="padding:8px; color:#666;">${c.pass}</td>
                        <td style="padding:8px; text-align:right;">${btn}</td>
                    </tr>
                `;
            });
        }

        if (document.getElementById('rh-count')) document.getElementById('rh-count').textContent = candidatures.length;
        const rhList = document.getElementById('admin-rh-list');
        if (rhList) {
            if(candidatures.length === 0) {
                rhList.innerHTML = `<p style="color:#777; font-style:italic;">Aucune candidature pour le moment.</p>`;
            } else {
                rhList.innerHTML = "";
                candidatures.forEach(cand => {
                    rhList.innerHTML += `
                        <div style="background:#f4f4f4; padding:15px; border-radius:5px; margin-bottom:15px; border-left:5px solid #000091;">
                            <h4>👤 ${cand.prenom} ${cand.nom} (${cand.age} ans) — ${cand.role}</h4>
                            <p><strong>Dispo :</strong> ${cand.dispo}</p>
                            <p><strong>Motivations :</strong> ${cand.motivation}</p>
                            <p><strong>Pourquoi :</strong> ${cand.pourquoi}</p>
                            <div style="margin-top:10px;">
                                <button class="status-btn" data-id="${cand.id}" data-action="accepter" style="background:#1f8d49; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Accepter</button>
                                <button class="status-btn" data-id="${cand.id}" data-action="refuser" style="background:#e1000f; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Refuser</button>
                            </div>
                        </div>
                    `;
                });
            }
        }
    }

    // NOUVELLE ANNONCE
    document.getElementById('admin-news-form').addEventListener('submit', function(e) {
        e.preventDefault();
        articles.unshift({
            id: Date.now(),
            title: document.getElementById('news-title').value,
            tag: document.getElementById('news-tag').value,
            desc: document.getElementById('news-desc').value
        });
        this.reset();
        alert("📢 Annonce publiée avec succès !");
        renderAnnonces();
        window.location.hash = "accueil";
    });

    // NOUVEAU COMPTE MODERATEUR
    document.getElementById('admin-user-form').addEventListener('submit', function(e) {
        e.preventDefault();
        comptes.push({
            user: document.getElementById('new-user-name').value,
            pass: document.getElementById('new-user-pass').value,
            role: "Modérateur"
        });
        document.getElementById('new-user-name').value = "";
        document.getElementById('new-user-pass').value = "";
        updateAdminView();
    });

    // CLICS SUPPR & RH DECISION
    document.body.addEventListener('click', function(e) {
        if(e.target.classList.contains('del-user-btn')) {
            comptes.splice(e.target.getAttribute('data-index'), 1);
            updateAdminView();
        }
        if(e.target.classList.contains('status-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            candidatures = candidatures.filter(c => c.id !== id);
            alert(e.target.getAttribute('data-action') === "accepter" ? "✅ Candidature Acceptée !" : "❌ Candidature Refusée.");
            updateAdminView();
        }
    });

    renderAnnonces();
    updateAdminView();
});

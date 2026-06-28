document.addEventListener('DOMContentLoaded', () => {
    
    // Contrôles accessibilité
    const contrastBtn = document.getElementById('contrast-toggle');
    const dysBtn = document.getElementById('dys-toggle');
    if(contrastBtn) contrastBtn.addEventListener('click', () => document.body.classList.toggle('high-contrast'));
    if(dysBtn) dysBtn.addEventListener('click', () => document.body.classList.toggle('dyslexia-font'));

    // Base de données locale
    let systemeEffectifs = [
        {
            categorie: "Direction Générale Académique",
            postes: [
                { nom: "Directeurs Généraux Académique", actuel: 2, max: 2 },
                { nom: "Directeurs Généraux Académique Adjoints", actuel: 3, max: 3 },
                { nom: "Assistant général Académique", actuel: 1, max: 1 }
            ]
        },
        {
            categorie: "Rectorat",
            postes: [
                { nom: "Recteur", actuel: 1, max: 1 },
                { nom: "Recteur Adjoint", actuel: 1, max: 1 },
                { nom: "Secrétaire Général Académique", actuel: 1, max: 1 },
                { nom: "Conseiller Juridique", actuel: 1, max: 1 }
            ]
        },
        {
            categorie: "Cabinet",
            postes: [
                { nom: "Directeur du Cabinet", actuel: 1, max: 1 },
                { nom: "Secrétaire du Cabinet", actuel: 0, max: 1 },
                { nom: "Agents du Cabinet", actuel: 0, max: 2 }
            ]
        },
        {
            categorie: "Ressources Humaines",
            postes: [
                { nom: "Directeur des Ressources Humaines", actuel: 1, max: 1 },
                { nom: "Gestionnaire des RH", actuel: 0, max: 1 },
                { nom: "Assistants RH", actuel: 0, max: 2 }
            ]
        },
        {
            categorie: "Numérique",
            postes: [
                { nom: "Directeur Service Numérique", actuel: 1, max: 1 },
                { nom: "Délégué Académique au Numérique", actuel: 0, max: 1 },
                { nom: "Techniciens", actuel: 1, max: 3 }
            ]
        },
        {
            categorie: "Inspection Académique",
            postes: [
                { nom: "Directeur des Services de l'Inspection", actuel: 0, max: 1 },
                { nom: "Inspecteurs", actuel: 1, max: 3 }
            ]
        },
        {
            categorie: "Médico-Social",
            postes: [
                { nom: "Infirmier", actuel: 1, max: 1 },
                { nom: "Psychologue", actuel: 0, max: 1 }
            ]
        }
    ];

    let articles = []; 
    let comptes = [{ user: "VH", pass: "12345678" }];
    let candidatures = [];
    let dateMiseAJour = "29/06/2026";

    // Gestion du routage des pages (#accueil, #admin, etc.)
    function router() {
        const hash = window.location.hash || '#accueil';
        const publicWrapper = document.getElementById('wrapper-public');
        const adminWrapper = document.getElementById('wrapper-admin');

        if (hash === '#admin') {
            if (publicWrapper) publicWrapper.style.display = 'none';
            if (adminWrapper) adminWrapper.style.display = 'block';
        } else {
            if (adminWrapper) adminWrapper.style.display = 'none';
            if (publicWrapper) publicWrapper.style.display = 'block';

            document.querySelectorAll('main.page-content').forEach(p => p.style.display = 'none');
            const targetPage = document.querySelector(hash);
            if (targetPage) targetPage.style.display = 'block';

            document.querySelectorAll('.nav-item').forEach(item => {
                if (item.getAttribute('href') === hash) item.classList.add('active');
                else item.classList.remove('active');
            });
        }
        window.scrollTo(0, 0);
    }
    window.addEventListener('hashchange', router);
    router();

    // Onglets internes du panel Admin
    document.querySelectorAll('.adm-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.adm-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(tab => tab.style.display = 'none');
            
            this.classList.add('active');
            const targetId = this.getAttribute('data-tab');
            document.getElementById(targetId).style.display = 'block';
        });
    });

    // Affichage des effectifs sur la partie publique (Zéro émojis)
    function renderPublicEffectifs() {
        const dateSpan = document.getElementById('public-date-update');
        if(dateSpan) dateSpan.textContent = dateMiseAJour;

        const container = document.getElementById('public-effectifs-grid');
        if (!container) return;
        container.innerHTML = "";

        systemeEffectifs.forEach(cat => {
            let innerRows = "";
            cat.postes.forEach(p => {
                let statusColor = "count-success";
                if (p.actuel === 0) statusColor = "count-danger";
                else if (p.actuel < p.max) statusColor = "count-warning";

                innerRows += `
                    <li style="display: flex; justify-content: space-between; align-items: center; border-bottom:1px solid #f1f5f9; padding:8px 0;">
                        <span style="font-size:0.95rem; color:#333;">${p.nom}</span>
                        <span class="badge-count ${statusColor}">${p.actuel}/${p.max}</span>
                    </li>
                `;
            });

            container.innerHTML += `
                <div style="border: 1px solid #e5e5e5; border-radius: 4px; padding: 20px; background: white;">
                    <h3 style="color: #000091; border-bottom: 2px solid #000091; padding-bottom: 8px; margin-bottom: 12px; font-size:1.1rem; font-weight:bold;">${cat.categorie}</h3>
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 4px; padding:0; margin:0;">
                        ${innerRows}
                    </ul>
                </div>
            `;
        });
    }

    // Affichage édition des effectifs (Panel admin)
    function renderAdminEffectifs() {
        const container = document.getElementById('admin-effectifs-container');
        if (!container) return;
        container.innerHTML = "";

        systemeEffectifs.forEach((cat, cIdx) => {
            let linesHtml = "";
            cat.postes.forEach((p, pIdx) => {
                linesHtml += `
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                        <span style="flex-grow: 1; font-size: 0.85rem; font-weight:bold; color:#444;">${p.nom}</span>
                        <input type="number" value="${p.actuel}" min="0" data-c="${cIdx}" data-p="${pIdx}" class="adm-input edit-actuel" style="width: 60px; text-align: center; margin:0; padding:5px;">
                        <span>/</span>
                        <input type="number" value="${p.max}" min="1" data-c="${cIdx}" data-p="${pIdx}" class="adm-input edit-max" style="width: 60px; text-align: center; margin:0; padding:5px;">
                    </div>
                `;
            });

            container.innerHTML += `
                <div class="adm-card" style="border-top: 3px solid #000091;">
                    <h4 style="margin: 0 0 15px 0; font-size: 0.95rem; color: #000091; font-weight: bold;">${cat.categorie}</h4>
                    ${linesHtml}
                </div>
            `;
        });

        document.querySelectorAll('.edit-actuel').forEach(input => {
            input.addEventListener('input', function() {
                const c = this.getAttribute('data-c');
                const p = this.getAttribute('data-p');
                systemeEffectifs[c].postes[p].actuel = parseInt(this.value) || 0;
                renderPublicEffectifs();
            });
        });

        document.querySelectorAll('.edit-max').forEach(input => {
            input.addEventListener('input', function() {
                const c = this.getAttribute('data-c');
                const p = this.getAttribute('data-p');
                systemeEffectifs[c].postes[p].max = parseInt(this.value) || 1;
                renderPublicEffectifs();
            });
        });
    }

    const btnDate = document.getElementById('btn-save-date');
    if(btnDate) {
        btnDate.addEventListener('click', () => {
            dateMiseAJour = document.getElementById('admin-date-input').value;
            renderPublicEffectifs();
            alert("Date mise à jour.");
        });
    }

    // Gestion formulaire Connexion
    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            const msg = document.getElementById('login-message');
            
            const match = comptes.find(c => c.user === u && c.pass === p);
            if(match) {
                msg.style.color = "green"; msg.style.display = "block"; msg.textContent = "Connexion validée...";
                setTimeout(() => {
                    window.location.hash = "admin";
                    msg.style.display = "none";
                    this.reset();
                }, 500);
            } else {
                msg.style.color = "red"; msg.style.display = "block"; msg.textContent = "Identifiants incorrects.";
            }
        });
    }

    // Gestion des actualités
    function renderAnnonces() {
        const publicArea = document.getElementById('dynamic-news');
        const adminArea = document.getElementById('admin-news-list');

        if(publicArea) {
            publicArea.innerHTML = articles.length === 0 ? `<p style="color:#666; font-style:italic; grid-column: 1/-1;">Aucune actualité diffusée actuellement.</p>` : "";
            articles.forEach(art => {
                publicArea.innerHTML += `
                    <article style="background:white; border:1px solid #e5e5e5; border-radius:4px; padding:20px;">
                        <span style="color:#e1000f; font-size:0.8rem; font-weight:bold; text-transform:uppercase;">${art.tag}</span>
                        <h3 style="margin:8px 0; color:#000091;">${art.title}</h3>
                        <p style="color:#444; font-size:0.95rem; margin:0;">${art.desc}</p>
                    </article>
                `;
            });
        }

        if(adminArea) {
            adminArea.innerHTML = articles.length === 0 ? `<p style="color:#94a3b8; font-style:italic; margin:0;">Aucun article actif.</p>` : "";
            articles.forEach((art, index) => {
                adminArea.innerHTML += `
                    <div style="border:1px solid #e2e8f0; padding:12px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
                        <div>
                            <strong style="font-size:0.9rem; color:#1e293b;">${art.title}</strong>
                            <span style="font-size:0.7rem; background:#e2e8f0; padding:2px 6px; border-radius:4px; margin-left:6px; font-weight:bold; color:#475569;">${art.tag}</span>
                        </div>
                        <button class="action-del-news adm-action-btn adm-action-btn-danger" data-idx="${index}" style="padding:4px 8px; font-size:0.8rem;">Supprimer</button>
                    </div>
                `;
            });
        }
    }

    const newsForm = document.getElementById('admin-news-form');
    if(newsForm) {
        newsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            articles.unshift({
                title: document.getElementById('news-title').value,
                tag: document.getElementById('news-tag').value,
                desc: document.getElementById('news-desc').value
            });
            this.reset();
            renderAnnonces();
            alert("Article publié.");
        });
    }

    // Formulaire d'envoi RH
    const rhForm = document.getElementById('rh-form');
    if(rhForm) {
        rhForm.addEventListener('submit', function(e) {
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
            alert("Candidature transmise.");
            updateAdminViews();
            window.location.hash = "accueil";
        });
    }

    // Mise à jour des vues Panel Admin
    function updateAdminViews() {
        const badge = document.getElementById('badge-rh-count');
        if(badge) badge.textContent = candidatures.length;

        const table = document.getElementById('admin-users-table');
        if (table) {
            table.innerHTML = "";
            comptes.forEach((c, idx) => {
                const action = c.user === "VH" ? `<span style="color:#94a3b8; font-size:0.8rem; font-style:italic;">Directeur</span>` : `<button class="action-del-user adm-action-btn adm-action-btn-danger" data-idx="${idx}" style="padding:3px 7px; font-size:0.8rem;">Retirer</button>`;
                table.innerHTML += `
                    <tr style="border-bottom:1px solid #e2e8f0;">
                        <td style="padding:10px 8px; font-weight:bold; color:#334155;">${c.user}</td>
                        <td style="padding:10px 8px; font-family:monospace; color:#64748b;">${c.pass}</td>
                        <td style="padding:10px 8px; text-align:right;">${action}</td>
                    </tr>
                `;
            });
        }

        const rhContainer = document.getElementById('admin-rh-list');
        if (rhContainer) {
            if(candidatures.length === 0) {
                rhContainer.innerHTML = `<div class="adm-card"><p style="color:#64748b; font-style:italic; margin:0;">Aucun dossier en attente.</p></div>`;
            } else {
                rhContainer.innerHTML = "";
                candidatures.forEach(cand => {
                    rhContainer.innerHTML += `
                        <div class="adm-card" style="border-left: 5px solid #000091;">
                            <h4 style="margin:0 0 10px 0; color:#1e293b; font-weight:bold;">${cand.prenom} ${cand.nom} (${cand.age} ans) — <span style="color:#000091;">${cand.role}</span></h4>
                            <p style="margin:4px 0; font-size:0.9rem;"><strong>Dispo :</strong> ${cand.dispo}</p>
                            <p style="margin:4px 0; font-size:0.9rem;"><strong>Motivations :</strong> ${cand.motivation}</p>
                            <p style="margin:4px 0; font-size:0.9rem;"><strong>Pourquoi :</strong> ${cand.pourquoi}</p>
                            <div style="margin-top:12px; display:flex; gap:8px;">
                                <button class="action-decision adm-action-btn adm-action-btn-success" data-id="${cand.id}" data-type="accept" style="padding:6px 12px;">Accepter</button>
                                <button class="action-decision adm-action-btn adm-action-btn-danger" data-id="${cand.id}" data-type="refuse" style="padding:6px 12px;">Refuser</button>
                            </div>
                        </div>
                    `;
                });
            }
        }
    }

    const userForm = document.getElementById('admin-user-form');
    if(userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            comptes.push({
                user: document.getElementById('new-user-name').value,
                pass: document.getElementById('new-user-pass').value
            });
            this.reset();
            updateAdminViews();
            alert("Opérateur ajouté.");
        });
    }

    // Gestionnaire global des boutons d'actions (Suppression / Décisions)
    document.body.addEventListener('click', (e) => {
        if(e.target.classList.contains('action-del-user')) {
            comptes.splice(e.target.getAttribute('data-idx'), 1);
            updateAdminViews();
        }
        if(e.target.classList.contains('action-del-news')) {
            articles.splice(e.target.getAttribute('data-idx'), 1);
            renderAnnonces();
        }
        if(e.target.classList.contains('action-decision')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const type = e.target.getAttribute('data-type');
            candidatures = candidatures.filter(c => c.id !== id);
            alert(type === "accept" ? "Dossier validé." : "Candidature rejetée.");
            updateAdminViews();
        }
    });

    // Initialisation
    renderPublicEffectifs();
    renderAdminEffectifs();
    renderAnnonces();
    updateAdminViews();
});

document.addEventListener('DOMContentLoaded', () => {
    
    // ACCESSIBILITÉ
    document.getElementById('contrast-toggle').addEventListener('click', () => document.body.classList.toggle('high-contrast'));
    document.getElementById('dys-toggle').addEventListener('click', () => document.body.classList.toggle('dyslexia-font'));

    // BASE DE DONNÉES DYNAMIQUE INITIALE (EFFECTIFS)
    let systemeEffectifs = [
        {
            categorie: "🏛️ Direction Générale Académique",
            postes: [
                { nom: "Directeurs Généraux Académique", actuel: 2, max: 2 },
                { nom: "Directeurs Généraux Académique Adjoints", actuel: 3, max: 3 },
                { nom: "Assistant général Académique", actuel: 1, max: 1 }
            ]
        },
        {
            categorie: "🎓 Rectorat",
            postes: [
                { nom: "Recteur", actuel: 1, max: 1 },
                { nom: "Recteur Adjoint", actuel: 1, max: 1 },
                { nom: "Secrétaire Général Académique", actuel: 1, max: 1 },
                { nom: "Conseiller Juridique", actuel: 1, max: 1 }
            ]
        },
        {
            categorie: "💼 Cabinet",
            postes: [
                { nom: "Directeur du Cabinet", actuel: 1, max: 1 },
                { nom: "Secrétaire du Cabinet", actuel: 0, max: 1 },
                { nom: "Agents du Cabinet", actuel: 0, max: 2 }
            ]
        },
        {
            categorie: "👥 Ressources Humaines",
            postes: [
                { nom: "Directeur des Ressources Humaines", actuel: 1, max: 1 },
                { nom: "Gestionnaire des RH", actuel: 0, max: 1 },
                { nom: "Assistants RH", actuel: 0, max: 2 }
            ]
        },
        {
            categorie: "💻 Numérique",
            postes: [
                { nom: "Directeur Service Numérique", actuel: 1, max: 1 },
                { nom: "Délégué Académique au Numérique", actuel: 0, max: 1 },
                { nom: "Techniciens", actuel: 1, max: 3 }
            ]
        },
        {
            categorie: "🔍 Inspection Académique",
            postes: [
                { nom: "Directeur des Services de l'Inspection", actuel: 0, max: 1 },
                { nom: "Inspecteurs", actuel: 1, max: 3 }
            ]
        },
        {
            categorie: "🩺 Médico-Social",
            postes: [
                { nom: "Infirmier", actuel: 1, max: 1 },
                { nom: "Psychologue", actuel: 0, max: 1 }
            ]
        }
    ];

    let articles = []; 
    let comptes = [{ user: "VH", pass: "12345678", role: "Super Admin" }];
    let candidatures = [];
    let dateMiseAJour = "28/06/2026";

    // GLOBAL NAVIGATION (PUBLIC VS ADMIN MODE)
    function naviguer() {
        const hash = window.location.hash || '#accueil';
        
        if (hash === '#admin') {
            // Mode Admin : Masquer header public, menu public et footer public
            document.querySelector('.main-header').style.display = 'none';
            document.getElementById('public-nav').style.display = 'none';
            document.getElementById('public-footer').style.display = 'none';
            
            document.querySelectorAll('main.page-content').forEach(p => p.style.display = 'none');
            document.getElementById('admin').style.display = 'grid';
        } else {
            // Mode Public : Tout réafficher normalement
            document.querySelector('.main-header').style.display = 'block';
            document.getElementById('public-nav').style.display = 'block';
            document.getElementById('public-footer').style.display = 'block';
            
            document.getElementById('admin').style.display = 'none';
            document.querySelectorAll('main.page-content').forEach(p => p.style.display = 'none');
            
            const activePage = document.querySelector(hash);
            if (activePage) activePage.style.display = 'block';
            
            document.querySelectorAll('.nav-item').forEach(item => {
                if(item.getAttribute('href') === hash) item.classList.add('active');
                else item.classList.remove('active');
            });
        }
        window.scrollTo(0, 0);
    }
    window.addEventListener('hashchange', naviguer);
    naviguer();

    // SIDEBAR DU PANEL ADMIN : NAVIGATION ENTRE SUB-PAGES
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-sub-page').forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(this.getAttribute('data-target')).classList.add('active');
        });
    });

    // GENERATION DE LA GRILLE D'EFFECTIFS (PUBLIC)
    function renderPublicEffectifs() {
        document.getElementById('public-date-update').textContent = dateMiseAJour;
        const grid = document.getElementById('public-effectifs-grid');
        if (!grid) return;
        grid.innerHTML = "";

        systemeEffectifs.forEach(cat => {
            let listItems = "";
            cat.postes.forEach(p => {
                let badgeClass = "count-success";
                if(p.actuel === 0) badgeClass = "count-danger";
                else if(p.actuel < p.max) badgeClass = "count-warning";

                listItems += `
                    <li style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                        <span>${p.nom}</span> 
                        <span class="badge-count ${badgeClass}">${p.actuel}/${p.max}</span>
                    </li>
                `;
            });

            grid.innerHTML += `
                <div style="border: 1px solid #e5e5e5; border-radius: 6px; padding: 20px; background: white;">
                    <h3 style="color: #000091; border-bottom: 2px solid #000091; padding-bottom: 8px; margin-bottom: 12px;">${cat.categorie}</h3>
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px;">
                        ${listItems}
                    </ul>
                </div>
            `;
        });
    }

    // GENERATION DES FORMULAIRES DE MODIFICATION D'EFFECTIFS (ADMIN)
    function renderAdminEffectifs() {
        const container = document.getElementById('admin-effectifs-container');
        if (!container) return;
        container.innerHTML = "";

        systemeEffectifs.forEach((cat, catIdx) => {
            let inputsHtml = "";
            cat.postes.forEach((p, postIdx) => {
                inputsHtml += `
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                        <span style="flex-grow: 1; font-size: 0.9rem;">${p.nom}</span>
                        <input type="number" value="${p.actuel}" min="0" data-cat="${catIdx}" data-post="${postIdx}" class="form-control effectif-actuel-input" style="width: 65px; margin: 0; text-align: center;">
                        <span>/</span>
                        <input type="number" value="${p.max}" min="1" data-cat="${catIdx}" data-post="${postIdx}" class="form-control effectif-max-input" style="width: 65px; margin: 0; text-align: center;">
                    </div>
                `;
            });

            container.innerHTML += `
                <div class="admin-card" style="border-top: 4px solid var(--primary-blue);">
                    <h4 style="margin-bottom: 15px; color: var(--primary-blue);">${cat.categorie}</h4>
                    ${inputsHtml}
                </div>
            `;
        });

        // Ecouteur pour enregistrer immédiatement chaque modification
        document.querySelectorAll('.effectif-actuel-input').forEach(input => {
            input.addEventListener('input', function() {
                const cIdx = this.getAttribute('data-cat');
                const pIdx = this.getAttribute('data-post');
                systemeEffectifs[cIdx].postes[pIdx].actuel = parseInt(this.value) || 0;
                renderPublicEffectifs();
            });
        });
        document.querySelectorAll('.effectif-max-input').forEach(input => {
            input.addEventListener('input', function() {
                const cIdx = this.getAttribute('data-cat');
                const pIdx = this.getAttribute('data-post');
                systemeEffectifs[cIdx].postes[pIdx].max = parseInt(this.value) || 1;
                renderPublicEffectifs();
            });
        });
    }

    // MODIFIER LA DATE DE MISE A JOUR DEPUIS L'ADMIN
    document.getElementById('btn-save-date').addEventListener('click', () => {
        dateMiseAJour = document.getElementById('admin-date-input').value;
        renderPublicEffectifs();
        alert("📅 Date mise à jour avec succès sur le site !");
    });

    // CONNEXION ADMIN
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const inputUser = document.getElementById('username').value;
        const inputPass = document.getElementById('password').value;
        const msg = document.getElementById('login-message');
        const compteTrouve = comptes.find(c => c.user === inputUser && c.pass === inputPass);
        
        if (compteTrouve) {
            msg.style.color = "green"; msg.style.display = "block"; msg.textContent = "✅ Connexion réussie !";
            setTimeout(() => { 
                window.location.hash = "admin"; 
                msg.style.display = "none"; 
                this.reset(); 
            }, 1000);
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
        alert("✨ Votre candidature a bien été transmise !");
        updateAdminView();
        window.location.hash = "accueil";
    });

    // ACTUALITÉS (PUBLIC + LISTE INTERNE ADMIN AVEC SUPPRESSION)
    function renderAnnonces() {
        const publicContainer = document.getElementById('dynamic-news');
        const adminContainer = document.getElementById('admin-news-list');
        
        if (publicContainer) {
            publicContainer.innerHTML = articles.length === 0 ? `<p style="color:#666; font-style:italic; grid-column: 1 / -1;">Aucune actualité pour le moment.</p>` : "";
            articles.forEach(art => {
                publicContainer.innerHTML += `
                    <article style="background:white; border:1px solid #e5e5e5; border-radius:6px; padding:20px;">
                        <span style="color:#e1000f; font-size:0.8rem; font-weight:bold; text-transform:uppercase;">${art.tag}</span>
                        <h3 style="margin:10px 0;">${art.title}</h3>
                        <p style="color:#444; font-size:0.95rem;">${art.desc}</p>
                    </article>
                `;
            });
        }

        if (adminContainer) {
            adminContainer.innerHTML = articles.length === 0 ? `<p style="color:#777; font-style:italic;">Aucune annonce créée.</p>` : "";
            articles.forEach((art, index) => {
                adminContainer.innerHTML += `
                    <div style="border:1px solid #cbd5e1; padding:12px; border-radius:5px; display:flex; justify-content:space-between; align-items:center; background:#fafafa;">
                        <div>
                            <strong style="font-size:0.9rem;">${art.title}</strong>
                            <span style="font-size:0.75rem; background:#cbd5e1; padding:2px 5px; border-radius:3px; margin-left:5px;">${art.tag}</span>
                        </div>
                        <button class="btn del-news-btn" data-index="${index}" style="background:#e1000f; color:white; padding:4px 8px; font-size:0.8rem; border-radius:3px;">Supprimer</button>
                    </div>
                `;
            });
        }
    }

    // FORMULAIRE CRÉATION ANNONCE ADMIN
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
    });

    // COMPTES & RECETTES INTERNES
    function updateAdminView() {
        const userTable = document.getElementById('admin-users-table');
        if (userTable) {
            userTable.innerHTML = "";
            comptes.forEach((c, index) => {
                const btn = c.user === "VH" ? `<span style="color:#777; font-size:0.85rem; font-style:italic;">Maître</span>` : `<button class="del-user-btn" data-index="${index}" style="background:#e1000f; color:white; border:none; padding:4px 8px; border-radius:3px; cursor:pointer;">Supprimer</button>`;
                userTable.innerHTML += `
                    <tr style="border-bottom:1px solid #e5e5e5;">
                        <td style="padding:8px; font-weight:bold;">${c.user}</td>
                        <td style="padding:8px; color:#666; font-family:monospace;">${c.pass}</td>
                        <td style="padding:8px; text-align:right;">${btn}</td>
                    </tr>
                `;
            });
        }

        document.getElementById('rh-count-badge').textContent = candidatures.length;
        const rhList = document.getElementById('admin-rh-list');
        if (rhList) {
            if(candidatures.length === 0) {
                rhList.innerHTML = `<div class="admin-card"><p style="color:#777; font-style:italic;">Aucune candidature pour le moment.</p></div>`;
            } else {
                rhList.innerHTML = "";
                candidatures.forEach(cand => {
                    rhList.innerHTML += `
                        <div class="admin-card" style="margin-bottom:15px; border-left:5px solid #000091;">
                            <h4>👤 ${cand.prenom} ${cand.nom} (${cand.age} ans) — <span style="color:#000091;">${cand.role}</span></h4>
                            <p style="margin:5px 0;"><strong>Dispo :</strong> ${cand.dispo}</p>
                            <p style="margin:5px 0;"><strong>Motivations :</strong> ${cand.motivation}</p>
                            <p style="margin:5px 0;"><strong>Pourquoi :</strong> ${cand.pourquoi}</p>
                            <div style="margin-top:10px;">
                                <button class="status-btn btn" data-id="${cand.id}" data-action="accepter" style="background:#16a34a; color:white; margin-right:5px;">Accepter</button>
                                <button class="status-btn btn" data-id="${cand.id}" data-action="refuser" style="background:#e1000f; color:white;">Refuser</button>
                            </div>
                        </div>
                    `;
                });
            }
        }
    }

    // FORMULAIRE COMPTES MODÉRATEURS
    document.getElementById('admin-user-form').addEventListener('submit', function(e) {
        e.preventDefault();
        comptes.push({
            user: document.getElementById('new-user-name').value,
            pass: document.getElementById('new-user-pass').value,
            role: "Modérateur"
        });
        document.getElementById('new-user-name').value = "";
        document.getElementById('new-user-pass').value = "";
        alert("👤 Compte modérateur créé !");
        updateAdminView();
    });

    // LISTENERS CLICKS CLASSIQUES (SUPPRESSION ACTUS & ACCÈS)
    document.body.addEventListener('click', function(e) {
        if(e.target.classList.contains('del-user-btn')) {
            comptes.splice(e.target.getAttribute('data-index'), 1);
            updateAdminView();
        }
        if(e.target.classList.contains('del-news-btn')) {
            articles.splice(e.target.getAttribute('data-index'), 1);
            renderAnnonces();
        }
        if(e.target.classList.contains('status-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            candidatures = candidatures.filter(c => c.id !== id);
            alert(e.target.getAttribute('data-action') === "accepter" ? "✅ Candidature Acceptée !" : "❌ Candidature Refusée.");
            updateAdminView();
        }
    });

    // RUN ON LOAD
    renderPublicEffectifs();
    renderAdminEffectifs();
    renderAnnonces();
    updateAdminView();
});

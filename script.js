document.addEventListener('DOMContentLoaded', () => {
    
    const contrastBtn = document.getElementById('contrast-toggle');
    const dysBtn = document.getElementById('dys-toggle');
    if(contrastBtn) contrastBtn.addEventListener('click', () => document.body.classList.toggle('high-contrast'));
    if(dysBtn) dysBtn.addEventListener('click', () => document.body.classList.toggle('dyslexia-font'));

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

    document.querySelectorAll('.adm-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.adm-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(tab => tab.style.display = 'none');
            
            this.classList.add('active');
            const targetId = this.getAttribute('data-tab');
            document.getElementById(targetId).style.display = 'block';
        });
    });

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
                    <li style="display: flex; justify-content: space-between; align

document.addEventListener('DOMContentLoaded', () => {

    // 1. LIGHT/DARK PREKIDAČ SA MEMORIJOM
    const toggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');

    if(localStorage.getItem('theme_lux') === 'light') {
        body.classList.add('light-mode');
        if(themeIcon) themeIcon.innerText = "☀️";
        if(themeText) themeText.innerText = "LIGHT MODE";
    }

    if(toggle) {
        toggle.onclick = () => {
            body.classList.toggle('light-mode');
            if(body.classList.contains('light-mode')) {
                localStorage.setItem('theme_lux', 'light');
                if(themeIcon) themeIcon.innerText = "☀️";
                if(themeText) themeText.innerText = "LIGHT MODE";
            } else {
                localStorage.setItem('theme_lux', 'dark');
                if(themeIcon) themeIcon.innerText = "🌙";
                if(themeText) themeText.innerText = "DARK MODE";
            }
        };
    }

    // 2. INTERNA BAZA PODATAKA (6 artikala sa tvojim ispravnim slikama)
    const cvijece = [
        { n: "Buket 'NSN'", k: "buketi", d: "Premium strukturirani izbor svježeg sezonskog bilja.", slika: "images/cvijet1.jpg", cijena: "45 KM" },
        { n: "Royal Ruže", k: "ruze", d: "Ekstra velike crvene ruže u staklenoj mračnoj vazi.", slika: "images/cvijet2.jpg", cijena: "120 KM" },
        { n: "Minimalist Monstera", k: "saksijsko", d: "Zelena kraljica enterijera sa glatkim staklenim izgledom.", slika: "images/cvijet3.jpg", cijena: "35 KM" },
        { n: "Spring Box", k: "buketi", d: "Kutija ispunjena proljetnim tulipanima i nježnim mirisima.", slika: "images/cvijet4.jpg", cijena: "60 KM" },
        { n: "Emerald Ficus", k: "saksijsko", d: "Fikus sjajnih tamnih listova u luksuznom pakovanju.", slika: "images/cvijet5.jpg", cijena: "40 KM" },
        { n: "Premium Set Flora", k: "ekskluzivno", d: "Kombinacija ruža, luksuzne čestitke i belgijskih pralina.", slika: "images/cvijet7.jpg", cijena: "150 KM" }
    ];

    // 3. GENERISANJE KARTICA NA POČETNOJ
    const grid = document.getElementById('cards-grid');
    function prikaziArtikle(lista) {
        if(!grid) return;
        grid.innerHTML = '';
        lista.forEach(a => {
            const card = document.createElement('div');
            card.className = `product-card-glass filter-item ${a.k}`;
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${a.slika}" alt="${a.n}" class="product-image">
                </div>
                <div class="card-body-content">
                    <div class="card-header-main">
                        <h3>${a.n}</h3>
                        <span class="card-price-tag">${a.cijena}</span>
                    </div>
                    <p class="card-description">${a.d}</p>
                    <a href="sadrzaj.html" class="card-action-link">Pregledaj Ponudu ↗</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    if (grid) {
        prikaziArtikle(cvijece);
    }

    // 4. FILTRIRANJE KARTICA NA POČETNOJ
    const filterButtons = document.querySelectorAll('.filter-group .f-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const kategorijaId = e.target.id.replace('f-', '');
            if(kategorijaId === 'all') {
                prikaziArtikle(cvijece);
            } else {
                const filtrirano = cvijece.filter(item => item.k === kategorijaId);
                prikaziArtikle(filtrirano);
            }
        });
    });

    // 5. SMOOTH SCROLL (Glatko skakanje na sekcije)
    const smoothLinks = document.querySelectorAll('.smooth-scroll');
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 6. POPRAVLJENI KALKULATOR SA SELEKCIJOM REDOVA (SADRŽAJ.HTML -> KONTAKT.HTML)
    const tabela = document.querySelector('.glass-table');
    const osnovnaCijenaIspis = document.getElementById('osnovna-cijena');
    const ukupnaCijenaIspis = document.getElementById('ukupna-cijena-ispis');
    const popustRed = document.getElementById('popust-red');
    const popustIznosIspis = document.getElementById('popust-iznos');
    const btnPromo = document.getElementById('primijeni-popust-btn');
    const unosPromo = document.getElementById('promo-kod-unos');
    const btnNaruci = document.getElementById('proslijedi-narudzbu');

    let osnovnaCijena = 0;
    let popustProcenat = 0;

    if (tabela) {
        const redovi = tabela.querySelectorAll('tbody tr');
        redovi.forEach(red => {
            red.addEventListener('click', () => {
                red.classList.toggle('selected-row');
                izracunajSve();
            });
        });
    }

    function izracunajSve() {
        if(!osnovnaCijenaIspis) return;
        osnovnaCijena = 0;
        
        // Uzimamo sve redove koji imaju klasu 'selected-row'
        const selektovani = document.querySelectorAll('.glass-table tbody tr.selected-row');
        
        selektovani.forEach(red => {
            // Čitamo tekst iz 4. kolone (indeks 3) jer je tu cijena
            const cijenaTekst = red.cells[3].innerText;
            // Čistimo tekst od " KM" i pretvaramo u broj
            const broj = parseInt(cijenaTekst.replace(' KM', '').trim());
            if(!isNaN(broj)) {
                osnovnaCijena += broj;
            }
        });

        osnovnaCijenaIspis.innerText = `${osnovnaCijena} KM`;

        let iznosPopusta = osnovnaCijena * popustProcenat;
        let konacnaCijena = osnovnaCijena - iznosPopusta;

        if (popustProcenat > 0 && osnovnaCijena > 0) {
            if (popustRed) popustRed.style.display = 'block';
            if (popustIznosIspis) popustIznosIspis.innerText = `-${iznosPopusta.toFixed(2)} KM`;
        } else {
            if (popustRed) popustRed.style.display = 'none';
        }

        if (ukupnaCijenaIspis) {
            ukupnaCijenaIspis.innerText = `${konacnaCijena.toFixed(2)} KM`;
        }
    }

    if (btnPromo) {
        btnPromo.addEventListener('click', () => {
            if (unosPromo && unosPromo.value.trim().toUpperCase() === 'NSNGARDEN15') {
                popustProcenat = 0.15;
                alert("Promo kod uspješno primijenjen! Ostvarili ste 15% popusta.");
            } else {
                popustProcenat = 0;
                alert("Netačan ili istekao promo kod!");
            }
            izracunajSve();
        });
    }

    if (btnNaruci) {
        btnNaruci.addEventListener('click', () => {
            if (osnovnaCijena === 0) {
                alert("Molimo izaberite barem jedan aranžman klikom na red u tabeli prije nastavka!");
            } else {
                if (ukupnaCijenaIspis) {
                    // Spašavamo vrijednost u localStorage kako bi je prenijeli na kontakt formu
                    localStorage.setItem('izabrana_cijena', ukupnaCijenaIspis.innerText);
                }
                // Prebacivanje na stranicu kontakt.html
                window.location.href = 'kontakt.html';
            }
        });
    }

    // Automatsko čitanje cijene na stranici kontakt.html i popunjavanje polja poruka
    const porukaPolje = document.getElementById('poruka');
    if (porukaPolje) {
        const sacuvanaCijena = localStorage.getItem('izabrana_cijena');
        if (sacuvanaCijena && sacuvanaCijena !== "0 KM" && sacuvanaCijena !== "0.00 KM") {
            porukaPolje.value = `Pozdrav, želim naručiti označene artikle iz kataloga.\nUkupna vrijednost narudžbe (sa uračunatim popustom): ${sacuvanaCijena}.\n\nMolim vas za potvrdu i upute za plaćanje.`;
            // Brišemo podatak iz memorije nakon što smo ga iskoristili
            localStorage.removeItem('izabrana_cijena');
        }
    }

    // 7. JAVASCRIPT VALIDACIJA KONTAKT FORME
    const forma = document.getElementById('kontakt-forma');
    if(forma) {
        forma.addEventListener('submit', function(e) {
            e.preventDefault();
            let validno = true;

            const ime = document.getElementById('ime');
            const prezime = document.getElementById('prezime');
            const email = document.getElementById('email');
            const telefon = document.getElementById('telefon');
            const tema = document.getElementById('tema');
            const poruka = document.getElementById('poruka');

            const errIme = document.getElementById('err-ime');
            const errPrezime = document.getElementById('err-prezime');
            const errEmail = document.getElementById('err-email');
            const errTelefon = document.getElementById('err-telefon');
            const errTema = document.getElementById('err-tema');
            const errPoruka = document.getElementById('err-poruka');

            // Reset grešaka i ivica
            [ime, prezime, email, telefon, tema, poruka].forEach(i => { if(i) i.classList.remove('input-error-field'); });
            [errIme, errPrezime, errEmail, errTelefon, errTema, errPoruka].forEach(e => { if(e) e.innerText = ''; });

            if(ime && ime.value.trim() === '') {
                if(errIme) errIme.innerText = 'Ime je obavezno.';
                ime.classList.add('input-error-field');
                validno = false;
            }
            if(prezime && prezime.value.trim() === '') {
                if(errPrezime) errPrezime.innerText = 'Prezime je obavezno.';
                prezime.classList.add('input-error-field');
                validno = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(email && !emailRegex.test(email.value.trim())) {
                if(errEmail) errEmail.innerText = 'Unesite ispravan email.';
                email.classList.add('input-error-field');
                validno = false;
            }

            const telRegex = /^[0-9\s\-]+$/;
            if(telefon && telefon.value.trim() === '') {
                if(errTelefon) errTelefon.innerText = 'Telefon je obavezan.';
                telefon.classList.add('input-error-field');
                validno = false;
            } else if(telefon && !telRegex.test(telefon.value.trim())) {
                if(errTelefon) errTelefon.innerText = 'Dozvoljene su samo cifre, razmaci i crtice.';
                telefon.classList.add('input-error-field');
                validno = false;
            }

            if(tema && tema.value === '') {
                if(errTema) errTema.innerText = 'Izaberite temu.';
                tema.classList.add('input-error-field');
                validno = false;
            }
            if(poruka && poruka.value.trim() === '') {
                if(errPoruka) errPoruka.innerText = 'Napišite poruku.';
                poruka.classList.add('input-error-field');
                validno = false;
            }

            if(validno) {
                alert(`Hvala Vam, ${ime.value.trim()}! Vaš upit je uspješno poslan.`);
                forma.reset();
            }
        });

        forma.addEventListener('reset', () => {
            const inputs = forma.querySelectorAll('input, select, textarea');
            const spans = forma.querySelectorAll('.error-text');
            inputs.forEach(i => i.classList.remove('input-error-field'));
            spans.forEach(s => s.innerText = '');
        });
    }
});

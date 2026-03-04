let allVerses = [];
let currentVerseIndex = 0;
let score = 0;
let madeMistake = false;
let currentAudio = null;

// On récupère tes favoris sauvegardés
let recitersData = []; 
let favoriteReciters = JSON.parse(localStorage.getItem('favoriteReciters')) || []; 
favoriteReciters = favoriteReciters.map(id => String(id)); 

const quranPageDiv = document.getElementById('quran-page');
const optionsContainer = document.getElementById('options-container');
const instructionEl = document.getElementById('instruction');
const feedbackEl = document.getElementById('feedback-message');
const surahSelect = document.getElementById('surah-select');
const reciterSelect = document.getElementById('reciter-select');
const favBtn = document.getElementById('fav-btn');

async function initApp() {
    try {
        // --- Chargement des Sourates ---
        const surahRes = await fetch('https://api.quran.com/api/v4/chapters?language=fr');
        const surahData = await surahRes.json();
        surahSelect.innerHTML = "";
        surahData.chapters.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter.id;
            option.innerText = `${chapter.id}. ${chapter.name_arabic} (${chapter.name_simple})`;
            surahSelect.appendChild(option);
        });

        // --- Chargement des Récitateurs ---
        const reciterRes = await fetch('https://api.quran.com/api/v4/resources/recitations?language=fr');
        const reciterData = await reciterRes.json();
        
        const motsAExclure = ['husary', 'tablawi', 'maher', 'dosari', 'dussary', 'matroud', 'basfar', 'shatree', 'shatri', 'neana', 'ajamy', 'ajami', 'alaqim', 'suesy', 'jaber', 'soaid', 'sowaid', 'abbad', 'ghamad'];
        
        recitersData = reciterData.recitations.filter(r => {
            const nom = r.reciter_name.toLowerCase();
            return !motsAExclure.some(mot => nom.includes(mot));
        });

        const customReciters = [
            { id: "ea_maher", reciter_name: "Maher Al-Muaiqly" },
            { id: "ea_dosari", reciter_name: "Yasser Al-Dosari" },
            { id: "ea_husary", reciter_name: "Mahmoud Khalil Al-Husary" },
            { id: "ea_tablawi", reciter_name: "Mohamed At-Tablawi" },
            { id: "ea_matroud", reciter_name: "Abdullah Matroud" },
            { id: "ea_basfar", reciter_name: "Abdullah Basfar" },
            { id: "ea_shatree", reciter_name: "AbuBakr Ash-Shatree" },
            { id: "ea_neana", reciter_name: "Ahmed Neana" },
            { id: "ea_ajamy", reciter_name: "Ahmed Ibn Ali Al-Ajamy" },
            { id: "ea_alaqimy", reciter_name: "Akram Alalaqimi" },
            { id: "ea_suesy", reciter_name: "Ali Hajjaj Alsuesy" },
            { id: "ea_jaber", reciter_name: "Ali Jaber" },
            { id: "ea_soaid", reciter_name: "Aymen Soaid" },
            { id: "ea_abbad", reciter_name: "Fares Abbad" },
            { id: "ea_ghamadi", reciter_name: "Saad Al-Ghamadi" },
            { id: "ea_idossari", reciter_name: "Ibrahim Al-Dossari (Warsh)" }
        ];
        
        recitersData = [...recitersData, ...customReciters];
        recitersData.sort((a, b) => a.reciter_name.localeCompare(b.reciter_name));

        renderReciterDropdown();

        // --- Événements ---
        surahSelect.addEventListener('change', () => loadSurahVerses(surahSelect.value, reciterSelect.value));
        
        reciterSelect.addEventListener('change', () => {
            updateFavButtonStatus();
            loadSurahVerses(surahSelect.value, reciterSelect.value); 
        });

        favBtn.addEventListener('click', () => {
            const selectedId = String(reciterSelect.value);
            if (favoriteReciters.includes(selectedId)) {
                favoriteReciters = favoriteReciters.filter(id => id !== selectedId);
            } else {
                favoriteReciters.push(selectedId);
            }
            localStorage.setItem('favoriteReciters', JSON.stringify(favoriteReciters));
            renderReciterDropdown();
        });

        loadSurahVerses(1, reciterSelect.value);

    } catch (error) {
        instructionEl.innerText = "Erreur de connexion.";
        console.error(error);
    }
}

function renderReciterDropdown() {
    const currentSelectedId = String(reciterSelect.value);
    
    reciterSelect.innerHTML = "";
    
    const favGroup = document.createElement('optgroup');
    favGroup.label = "⭐ Tes favoris";
    
    const otherGroup = document.createElement('optgroup');
    otherGroup.label = "Autres récitateurs (A-Z)";
    
    recitersData.forEach(reciter => {
        const option = document.createElement('option');
        option.value = reciter.id;
        option.innerText = reciter.reciter_name;
        
        if (favoriteReciters.includes(String(reciter.id))) {
            favGroup.appendChild(option);
        } else {
            otherGroup.appendChild(option);
        }
    });
    
    if (favGroup.children.length > 0) reciterSelect.appendChild(favGroup);
    reciterSelect.appendChild(otherGroup);
    
    if (currentSelectedId && Array.from(reciterSelect.options).some(opt => String(opt.value) === currentSelectedId)) {
        reciterSelect.value = currentSelectedId;
    } else if (favGroup.children.length > 0) {
        reciterSelect.value = favGroup.children[0].value;
    }
    
    updateFavButtonStatus();
}

function updateFavButtonStatus() {
    const selectedId = String(reciterSelect.value);
    if (favoriteReciters.includes(selectedId)) {
        favBtn.innerText = "⭐ Retirer favori";
        favBtn.style.borderColor = "#f1c40f";
        favBtn.style.backgroundColor = "#fff9e6";
    } else {
        favBtn.innerText = "➕ Ajouter favori";
        favBtn.style.borderColor = "#ccc";
        favBtn.style.backgroundColor = "#fff";
    }
}

async function loadSurahVerses(chapterId, reciterId) {
    instructionEl.innerText = "Chargement des versets...";
    optionsContainer.innerHTML = "";
    quranPageDiv.innerHTML = ""; 
    feedbackEl.innerText = "";
    
    if (currentAudio) currentAudio.pause();

    currentVerseIndex = 0;
    score = 0;
    madeMistake = false;

    try {
        const apiReciterId = String(reciterId).startsWith('ea_') ? 7 : reciterId; 
        const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${chapterId}?fields=text_uthmani&audio=${apiReciterId}`);
        const data = await response.json();
        allVerses = data.verses;
        
        generateQuestion();
    } catch (error) {
        console.error(error);
    }
}

function generateQuestion() {
    feedbackEl.innerText = ""; 
    optionsContainer.innerHTML = ""; 
    madeMistake = false; 

    if (currentVerseIndex >= allVerses.length) {
        const percentage = Math.round((score / allVerses.length) * 100);
        instructionEl.innerText = "✨ Félicitations ! Vous avez terminé la sourate ! ✨";
        optionsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; background-color: #f1f8e9; border-radius: 10px;">
                <h3 style="color: #2e7d32; font-size: 24px;">Votre pourcentage :</h3>
                <h1 style="color: #1b5e20; font-size: 48px; margin: 10px 0;">${percentage}%</h1>
                <p>${score} verset(s) trouvé(s) du premier coup sur ${allVerses.length}.</p>
                <button class="option-btn" onclick="loadSurahVerses(surahSelect.value, reciterSelect.value)" style="margin-top: 15px;">Recommencer</button>
            </div>
        `;
        return;
    }

    const correctVerse = allVerses[currentVerseIndex];
    
    let audioUrl = null;
    const selectedReciterId = String(reciterSelect.value);

    if (selectedReciterId.startsWith('ea_')) {
        let serverUrl = "";
        if (selectedReciterId === "ea_maher") serverUrl = "https://everyayah.com/data/MaherAlMuaiqly128kbps/";
        if (selectedReciterId === "ea_dosari") serverUrl = "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/";
        if (selectedReciterId === "ea_husary") serverUrl = "https://everyayah.com/data/Husary_128kbps/";
        if (selectedReciterId === "ea_tablawi") serverUrl = "https://everyayah.com/data/Mohammad_al_Tablaway_128kbps/";
        if (selectedReciterId === "ea_matroud") serverUrl = "https://everyayah.com/data/Abdullah_Matroud_128kbps/";
        if (selectedReciterId === "ea_basfar") serverUrl = "https://everyayah.com/data/Abdullah_Basfar_192kbps/";
        if (selectedReciterId === "ea_shatree") serverUrl = "https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps/";
        if (selectedReciterId === "ea_neana") serverUrl = "https://everyayah.com/data/Ahmed_Neana_128kbps/";
        if (selectedReciterId === "ea_ajamy") serverUrl = "https://everyayah.com/data/ahmed_ibn_ali_al_ajamy_128kbps/";
        if (selectedReciterId === "ea_alaqimy") serverUrl = "https://everyayah.com/data/Akram_AlAlaqimy_128kbps/";
        if (selectedReciterId === "ea_suesy") serverUrl = "https://everyayah.com/data/Ali_Hajjaj_AlSuesy_128kbps/";
        if (selectedReciterId === "ea_jaber") serverUrl = "https://everyayah.com/data/Ali_Jaber_64kbps/";
        if (selectedReciterId === "ea_soaid") serverUrl = "https://everyayah.com/data/Ayman_Sowaid_64kbps/";
        if (selectedReciterId === "ea_abbad") serverUrl = "https://everyayah.com/data/Fares_Abbad_64kbps/";
        if (selectedReciterId === "ea_ghamadi") serverUrl = "https://everyayah.com/data/Ghamadi_40kbps/";
        if (selectedReciterId === "ea_idossari") serverUrl = "https://everyayah.com/data/warsh/warsh_ibrahim_aldosary_128kbps/";

        const parts = correctVerse.verse_key.split(':');
        const surahStr = parts[0].padStart(3, '0');
        const ayahStr = parts[1].padStart(3, '0');
        
        audioUrl = `${serverUrl}${surahStr}${ayahStr}.mp3`;
    } else {
        const audioData = correctVerse.audio; 
        if (audioData && audioData.url) {
            audioUrl = audioData.url.startsWith('http') ? audioData.url : `https://verses.quran.com/${audioData.url}`;
        }
    }
    
    if (currentVerseIndex === 0) {
        instructionEl.innerText = "Sélectionnez le premier verset :";
    } else {
        instructionEl.innerText = "Quel est le verset suivant ?";
    }

    let options = [correctVerse];
    
    // --- NOUVEL ALGORITHME : MUTASHABIHAT ---
    const correctWords = correctVerse.text_uthmani.split(' ');
    const firstWord = correctWords[0]; 

    // 1. Chercher les versets qui commencent par le MÊME mot
    let similarVerses = allVerses.filter(v => 
        v.id !== correctVerse.id && 
        v.text_uthmani.startsWith(firstWord)
    );
    similarVerses.sort(() => Math.random() - 0.5);
    
    for (let verse of similarVerses) {
        if (options.length < 4) options.push(verse);
    }

    // 2. Chercher des versets de la MÊME LONGUEUR (+/- 2 mots)
    if (options.length < 4) {
        let lengthSimilarVerses = allVerses.filter(v => 
            !options.some(opt => opt.id === v.id) && 
            Math.abs(v.text_uthmani.split(' ').length - correctWords.length) <= 2
        );
        lengthSimilarVerses.sort(() => Math.random() - 0.5);
        
        for (let verse of lengthSimilarVerses) {
            if (options.length < 4) options.push(verse);
        }
    }

    // 3. Compléter au hasard s'il manque des choix
    while (options.length < 4) {
        const randomIndex = Math.floor(Math.random() * allVerses.length);
        const randomVerse = allVerses[randomIndex];
        if (!options.some(opt => opt.id === randomVerse.id)) {
            options.push(randomVerse);
        }
    }

    // On mélange une dernière fois les 4 options
    options.sort(() => Math.random() - 0.5);
    // --- FIN DU NOUVEL ALGORITHME ---

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = option.text_uthmani;
        
        btn.onclick = () => checkAnswer(option.id, correctVerse.id, correctVerse.text_uthmani, audioUrl);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedId, correctId, correctText, audioUrl) {
    if (selectedId === correctId) {
        feedbackEl.style.color = "green";
        feedbackEl.innerText = "✅ Bonne réponse !";
        
        if (!madeMistake) score++;

        const verseSpan = document.createElement('span');
        verseSpan.innerText = correctText + " ۝ ";
        quranPageDiv.appendChild(verseSpan);

        if (currentAudio) currentAudio.pause(); 
        if (audioUrl) {
            currentAudio = new Audio(audioUrl);
            currentAudio.play().catch(e => console.log("Audio bloqué par le navigateur :", e));
        }

        currentVerseIndex++;
        
        setTimeout(() => {
            generateQuestion();
        }, 1000);

    } else {
        feedbackEl.style.color = "red";
        feedbackEl.innerText = "❌ Mauvaise réponse, essayez encore !";
        madeMistake = true;
    }
}

initApp();
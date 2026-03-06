// ================= 🧨 DESTRUCTION DU CACHE (ANTI-BUG) =================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) { registration.unregister(); }
    });
}

// ================= GESTION DU MODE SOMBRE =================
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); themeToggle.innerText = '☀️'; }
themeToggle.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); themeToggle.innerText = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); themeToggle.innerText = '☀️';
    }
});

// ================= GESTION DES STATS, STREAK ET SRS (ERREURS) =================
let userStats = JSON.parse(localStorage.getItem('hifz_stats')) || {};
userStats.totalAnswered = userStats.totalAnswered || 0;
userStats.correctFirstTry = userStats.correctFirstTry || 0;
userStats.sessionsCompleted = userStats.sessionsCompleted || 0;
userStats.currentStreak = userStats.currentStreak || 0;
userStats.lastStudyDate = userStats.lastStudyDate || null;

let userMistakes = JSON.parse(localStorage.getItem('hifz_mistakes')) || {};

function saveStats() { 
    localStorage.setItem('hifz_stats', JSON.stringify(userStats)); 
    localStorage.setItem('hifz_mistakes', JSON.stringify(userMistakes)); 
}

function checkAndUpdateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (userStats.lastStudyDate !== today) {
        if (!userStats.lastStudyDate) { userStats.currentStreak = 1; } 
        else {
            let yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            if (userStats.lastStudyDate === yesterday.toISOString().split('T')[0]) userStats.currentStreak++;
            else userStats.currentStreak = 1;
        }
        userStats.lastStudyDate = today; saveStats();
    }
    updateHeaderStreakDisplay();
}

function updateHeaderStreakDisplay() { document.getElementById('header-streak').innerText = userStats.currentStreak + ' 🔥'; }

// ================= DICTIONNAIRE =================
const translations = {
    fr: { reviewTitle: "Révision", subtitle: "Ton partenaire pour la mémorisation", riwayaLabel: "Type de lecture (Riwaya)", tajweedLabel: "Couleurs de Tajwid", examModeLabel: "Mode Examen 📝", examFromSurah: "De la sourate", examToSurah: "À la sourate", numQuestions: "Nombre de questions", optionsCountLabel: "Nombre de propositions", continueVerse: "Quel verset vient juste après celui-ci ?", surahLabel: "Sourate à réviser", fromVerse: "Du verset", toVerse: "Au verset", reciterLabel: "Récitateur audio", startBtn: "Mémoriser 🚀", backBtn: "⬅ Retour", loadingVerses: "Chargement des versets...", selectFirst: "Sélectionnez le premier verset :", selectNext: "Quel est le verset suivant ?", goodAnswer: "✅ Bonne réponse !", badAnswer: "❌ Mauvaise réponse, essayez encore !", congrats: "✨ Félicitations ! Vous avez terminé ! ✨", yourScore: "Votre pourcentage :", foundOnFirstTry: "verset(s) trouvé(s) du premier coup sur", restart: "Recommencer", favGroup: "⭐ Tes favoris", otherGroup: "Autres récitateurs (A-Z)", addFav: "➕ Ajouter favori", removeFav: "⭐ Retirer favori", repeatContextBtn: "🔊 Écouter le verset précédent", statsTitle: "Mon Profil & Statistiques", statTotalVerses: "Versets révisés", statSuccessRate: "Précision", statSessions: "Sessions terminées", resetStats: "Réinitialiser mes statistiques", statStreak: "Série (Jours)", streakInfoTitle: "Le concept des Séries 🔥", streakWhatIsItTitle: "Qu'est-ce qu'une série ?", streakExplanation1: "Une série (ou 'streak') représente le nombre de jours consécutifs pendant lesquels vous avez révisé au moins un verset.", streakExplanation2: "Si vous révisez tous les jours, votre flamme augmente. Mais attention ! Si vous passez une journée entière sans réviser, la flamme s'éteint et votre série retombe à zéro.", streakMotivation: "C'est un excellent moyen de rester motivé et de faire de la mémorisation du Coran une habitude quotidienne !", nextQuestionBtn: "Passer à une autre question ⏭️" },
    en: { reviewTitle: "Review", subtitle: "Your memorization partner", riwayaLabel: "Recitation style", tajweedLabel: "Tajweed Colors", examModeLabel: "Exam Mode 📝", examFromSurah: "From Surah", examToSurah: "To Surah", numQuestions: "Number of questions", optionsCountLabel: "Number of options", continueVerse: "Which verse comes right after this one?", surahLabel: "Surah to review", fromVerse: "From verse", toVerse: "To verse", reciterLabel: "Audio Reciter", startBtn: "Memorize 🚀", backBtn: "⬅ Back", loadingVerses: "Loading verses...", selectFirst: "Select the first verse:", selectNext: "What is the next verse?", goodAnswer: "✅ Correct answer!", badAnswer: "❌ Wrong answer, try again!", congrats: "✨ Congratulations! You completed it! ✨", yourScore: "Your percentage:", foundOnFirstTry: "verse(s) found on first try out of", restart: "Restart", favGroup: "⭐ Your favorites", otherGroup: "Other reciters (A-Z)", addFav: "➕ Add favorite", removeFav: "⭐ Remove favorite", repeatContextBtn: "🔊 Listen to previous verse", statsTitle: "My Profile & Stats", statTotalVerses: "Verses reviewed", statSuccessRate: "Accuracy", statSessions: "Sessions completed", resetStats: "Reset my statistics", statStreak: "Day Streak", streakInfoTitle: "The Streak Concept 🔥", streakWhatIsItTitle: "What is a streak?", streakExplanation1: "A streak represents the number of consecutive days you have reviewed at least one verse.", streakExplanation2: "If you review every day, your flame grows. But beware! If you miss a full day without reviewing, the flame goes out and your streak resets to zero.", streakMotivation: "It's a great way to stay motivated and make memorizing the Quran a daily habit!", nextQuestionBtn: "Move to another question ⏭️" },
    ar: { reviewTitle: "مراجعة", subtitle: "شريكك في الحفظ", riwayaLabel: "رواية القراءة", tajweedLabel: "ألوان التجويد", examModeLabel: "وضع الاختبار 📝", examFromSurah: "من سورة", examToSurah: "إلى سورة", numQuestions: "عدد الأسئلة", optionsCountLabel: "عدد الخيارات", continueVerse: "ما هي الآية التي تلي هذه الآية مباشرة؟", surahLabel: "السورة للمراجعة", fromVerse: "من الآية", toVerse: "إلى الآية", reciterLabel: "القارئ", startBtn: "ابدأ الحفظ 🚀", backBtn: "⬅ عودة", loadingVerses: "جاري تحميل الآيات...", selectFirst: "اختر الآية الأولى:", selectNext: "ما هي الآية التالية؟", goodAnswer: "✅ إجابة صحيحة!", badAnswer: "❌ إجابة خاطئة، حاول مرة أخرى!", congrats: "✨ مبارك! لقد أتممت المراجعة! ✨", yourScore: "نسبتك المئوية:", foundOnFirstTry: "آية (آيات) وجدت من المحاولة الأولى من أصل", restart: "إعادة", favGroup: "⭐ المفضلة لديك", otherGroup: "قراء آخرون (أ-ي)", addFav: "➕ إضافة للمفضلة", removeFav: "⭐ إزالة من المفضلة", repeatContextBtn: "🔊 الاستماع للآية السابقة", statsTitle: "ملفي الشخصي والإحصائيات", statTotalVerses: "الآيات المراجعة", statSuccessRate: "الدقة", statSessions: "الجلسات المكتملة", resetStats: "إعادة ضبط الإحصائيات", statStreak: "أيام متتالية", streakInfoTitle: "مفهوم السلاسل 🔥", streakWhatIsItTitle: "ما هي السلسلة؟", streakExplanation1: "تمثل السلسلة عدد الأيام المتتالية التي قمت فيها بمراجعة آية واحدة على الأقل.", streakExplanation2: "إذا كنت تراجع كل يوم، يزداد لهبك. ولكن احذر! إذا فاتك يوم كامل دون مراجعة، ينطفئ اللهب وتعود سلسلتك إلى الصفر.", streakMotivation: "إنها طريقة رائعة للبقاء متحفزًا وجعل حفظ القرآن عادة يومية!", nextQuestionBtn: "الانتقال إلى سؤال آخر ⏭️" },
    es: { reviewTitle: "Repaso", subtitle: "Tu compañero de memorización", riwayaLabel: "Estilo de recitación", tajweedLabel: "Colores de Tajwid", examModeLabel: "Modo Examen 📝", examFromSurah: "De la sura", examToSurah: "A la sura", numQuestions: "Número de preguntas", optionsCountLabel: "Número de opciones", continueVerse: "¿Qué versículo viene justo después?", surahLabel: "Sura a repasar", fromVerse: "Del versículo", toVerse: "Al versículo", reciterLabel: "Recitador de audio", startBtn: "Memorizar 🚀", backBtn: "⬅ Volver", loadingVerses: "Cargando versículos...", selectFirst: "Selecciona el primer versículo:", selectNext: "¿Cuál es el siguiente versículo?", goodAnswer: "✅ ¡Respuesta correcta!", badAnswer: "❌ Respuesta incorrecta, ¡inténtalo de nuevo!", congrats: "✨ ¡Felicidades! ¡Has terminado! ✨", yourScore: "Tu porcentaje:", foundOnFirstTry: "versículo(s) encontrado(s) a la primera de", restart: "Reiniciar", favGroup: "⭐ Tus favoritos", otherGroup: "Otros recitadores (A-Z)", addFav: "➕ Añadir favorito", removeFav: "⭐ Quitar favorito", repeatContextBtn: "🔊 Escuchar el versículo anterior", statsTitle: "Mi Perfil y Estadísticas", statTotalVerses: "Versículos repasados", statSuccessRate: "Precisión", statSessions: "Sesiones terminadas", resetStats: "Restablecer mis estadísticas", statStreak: "Racha (Días)", streakInfoTitle: "El concepto de las Rachas 🔥", streakWhatIsItTitle: "¿Qué es una racha?", streakExplanation1: "Una racha representa el número de días consecutivos en los que has repasado al menos un versículo.", streakExplanation2: "Si repasas todos los días, tu llama aumenta. Pero ¡cuidado! Si pasas un día entero sin repasar, la llama se apaga y tu racha vuelve a cero.", streakMotivation: "¡Es una excelente manera de mantener la motivación y hacer de la memorización del Corán un hábito diario!", nextQuestionBtn: "Pasar a otra pregunta ⏭️" },
    id: { reviewTitle: "Muraja'ah", subtitle: "Mitra hafalan Anda", riwayaLabel: "Gaya bacaan", tajweedLabel: "Warna Tajwid", examModeLabel: "Mode Ujian 📝", examFromSurah: "Dari Surah", examToSurah: "Hingga Surah", numQuestions: "Jumlah pertanyaan", optionsCountLabel: "Jumlah pilihan", continueVerse: "Ayat apa yang muncul tepat setelah ini?", surahLabel: "Surah untuk diulang", fromVerse: "Dari ayat", toVerse: "Hingga ayat", reciterLabel: "Qari Audio", startBtn: "Hafalkan 🚀", backBtn: "⬅ Kembali", loadingVerses: "Memuat ayat...", selectFirst: "Pilih ayat pertama:", selectNext: "Apa ayat selanjutnya?", goodAnswer: "✅ Jawaban benar!", badAnswer: "❌ Jawaban salah, coba lagi!", congrats: "✨ Selamat! Anda menyelesaikannya! ✨", yourScore: "Persentase Anda:", foundOnFirstTry: "ayat ditemukan pada percobaan pertama dari", restart: "Mulai ulang", favGroup: "⭐ Favorit Anda", otherGroup: "Qari lainnya (A-Z)", addFav: "➕ Tambah favorit", removeFav: "⭐ Hapus favorit", repeatContextBtn: "🔊 Dengarkan ayat sebelumnya", statsTitle: "Profil & Statistik Saya", statTotalVerses: "Ayat diulang", statSuccessRate: "Akurasi", statSessions: "Sesi selesai", resetStats: "Atur ulang statistik saya", statStreak: "Runtutan (Hari)", streakInfoTitle: "Konsep Runtutan (Streak) 🔥", streakWhatIsItTitle: "Apa itu runtutan?", streakExplanation1: "Runtutan mewakili jumlah hari berturut-turut Anda mengulang setidaknya satu ayat.", streakExplanation2: "Jika Anda mengulang setiap hari, api Anda membesar. Tapi awas! Jika Anda melewatkan satu hari penuh tanpa mengulang, api padam dan runtutan Anda kembali ke nol.", streakMotivation: "Ini cara yang bagus untuk tetap termotivasi dan menjadikan hafalan Al-Qur'an kebiasaan sehari-hari!", nextQuestionBtn: "Pindah ke pertanyaan lain ⏭️" },
    ms: { reviewTitle: "Ulang Kaji", subtitle: "Rakan hafalan anda", riwayaLabel: "Gaya bacaan", tajweedLabel: "Warna Tajwid", examModeLabel: "Mod Peperiksaan 📝", examFromSurah: "Dari Surah", examToSurah: "Hingga Surah", numQuestions: "Bilangan soalan", optionsCountLabel: "Bilangan pilihan", continueVerse: "Apakah ayat yang seterusnya?", surahLabel: "Surah untuk diulang kaji", fromVerse: "Dari ayat", toVerse: "Hingga ayat", reciterLabel: "Qari Audio", startBtn: "Hafal 🚀", backBtn: "⬅ Kembali", loadingVerses: "Memuatkan ayat...", selectFirst: "Pilih ayat pertama:", selectNext: "Apakah ayat seterusnya?", goodAnswer: "✅ Jawapan betul!", badAnswer: "❌ Jawapan salah, cuba lagi!", congrats: "✨ Tahniah! Anda telah melengkapkannya! ✨", yourScore: "Peratusan anda:", foundOnFirstTry: "ayat dijumpai pada percubaan pertama daripada", restart: "Mula semula", favGroup: "⭐ Kegemaran anda", otherGroup: "Qari lain (A-Z)", addFav: "➕ Tambah kegemaran", removeFav: "⭐ Buang kegemaran", repeatContextBtn: "🔊 Dengar ayat sebelumnya", statsTitle: "Profil & Statistik Saya", statTotalVerses: "Ayat diulang kaji", statSuccessRate: "Ketepatan", statSessions: "Sesi selesai", resetStats: "Tetapkan semula statistik saya", statStreak: "Pusingan (Hari)", streakInfoTitle: "Konsep Pusingan (Streak) 🔥", streakWhatIsItTitle: "Apakah itu pusingan?", streakExplanation1: "Pusingan mewakili bilangan hari berturut-turut anda mengulang kaji sekurang-kurangnya satu ayat.", streakExplanation2: "Jika anda mengulang kaji setiap hari, api anda membesar. Tetapi awas! Jika anda terlepas satu hari tanpa mengulang kaji, api terpadam dan pusingan anda kembali ke sifar.", streakMotivation: "Ia cara yang hebat untuk kekal bermotivasi dan menjadikan hafalan Al-Quran sebagai tabiat harian!", nextQuestionBtn: "Beralih ke soalan lain ⏭️" },
    ur: { reviewTitle: "دہرائی", subtitle: "آپ کا حفظ کا ساتھی", riwayaLabel: "تلاوت کا انداز", tajweedLabel: "تجوید کے رنگ", examModeLabel: "امتحانی موڈ 📝", examFromSurah: "سورت سے", examToSurah: "سورت تک", numQuestions: "سوالات کی تعداد", optionsCountLabel: "اختیارات کی تعداد", continueVerse: "اس کے فوراً بعد کون سی آیت آتی ہے؟", surahLabel: "دہرانے کے لیے سورت", fromVerse: "آیت سے", toVerse: "آیت تک", reciterLabel: "آڈیو قاری", startBtn: "حفظ کریں 🚀", backBtn: "⬅ واپس", loadingVerses: "آیات لوڈ ہو رہی ہیں...", selectFirst: "پہلی آیت منتخب کریں:", selectNext: "اگلی آیت کون سی ہے؟", goodAnswer: "✅ درست جواب!", badAnswer: "❌ غلط جواب، دوبارہ کوشش کریں!", congrats: "✨ مبارک ہو! آپ نے مکمل کر لیا! ✨", yourScore: "آپ کا فیصد:", foundOnFirstTry: "پہلی کوشش میں ملنے والی آیات، کل میں سے", restart: "دوبارہ شروع کریں", favGroup: "⭐ آپ کے پسندیدہ", otherGroup: "دیگر قراء (A-Z)", addFav: "➕ پسندیدہ شامل کریں", removeFav: "⭐ پسندیدہ ہٹائیں", repeatContextBtn: "🔊 پچھلی آیت سنیں", statsTitle: "میری پروفائل اور شماریات", statTotalVerses: "دہرائی گئی آیات", statSuccessRate: "درستگی", statSessions: "مکمل سیشنز", resetStats: "میرے اعداد و شمار ری سیٹ کریں", statStreak: "سلسلہ (دن)", streakInfoTitle: "سلسلے کا تصور 🔥", streakWhatIsItTitle: "سلسلہ کیا ہے؟", streakExplanation1: "سلسلہ ان مسلسل دنوں کی تعداد کی نمائندگی کرتا ہے جن میں آپ نے کم از کم ایک آیت دہرائی ہو۔", streakExplanation2: "اگر آپ روزانہ دہراتے ہیں تو آپ کا شعلہ بڑھتا ہے۔ لیکن ہوشیار رہیں! اگر آپ ایک پورا دن دہرائے بغیر گزار دیتے ہیں، تو شعلہ بجھ جاتا ہے اور آپ کا سلسلہ صفر پر آجاتا ہے۔", streakMotivation: "حوصلہ افزائی رکھنے اور قرآن حفظ کرنے کو روزانہ کی عادت بنانے کا یہ ایک بہترین طریقہ ہے!", nextQuestionBtn: "دوسرے سوال پر جائیں ⏭️" },
    fa: { reviewTitle: "مرور", subtitle: "همراه حفظ شما", riwayaLabel: "سبک تلاوت", tajweedLabel: "رنگ‌های تجوید", examModeLabel: "حالت آزمون 📝", examFromSurah: "از سوره", examToSurah: "تا سوره", numQuestions: "تعداد سوالات", optionsCountLabel: "تعداد گزینه‌ها", continueVerse: "کدام آیه بلافاصله بعد از این می‌آید؟", surahLabel: "سوره برای مرور", fromVerse: "از آیه", toVerse: "تا آیه", reciterLabel: "قاری صوتی", startBtn: "حفظ کن 🚀", backBtn: "⬅ بازگشت", loadingVerses: "در حال بارگذاری آیات...", selectFirst: "آیه اول را انتخاب کنید:", selectNext: "آیه بعدی کدام است؟", goodAnswer: "✅ پاسخ صحیح!", badAnswer: "❌ پاسخ اشتباه، دوباره تلاش کنید!", congrats: "✨ تبریک! شما به پایان رساندید! ✨", yourScore: "درصد شما:", foundOnFirstTry: "آیه(های) پیدا شده در تلاش اول از", restart: "شروع مجدد", favGroup: "⭐ علاقه‌مندی‌های شما", otherGroup: "سایر قاریان (الف-ی)", addFav: "➕ افزودن به علاقه‌مندی‌ها", removeFav: "⭐ حذف از علاقه‌مندی‌ها", repeatContextBtn: "🔊 گوش دادن به آیه قبلی", statsTitle: "پروفایل و آمار من", statTotalVerses: "آیات مرور شده", statSuccessRate: "دقت", statSessions: "جلسات تکمیل شده", resetStats: "بازنشانی آمار من", statStreak: "زنجیره (روزها)", streakInfoTitle: "مفهوم زنجیره‌ها 🔥", streakWhatIsItTitle: "زنجیره چیست؟", streakExplanation1: "زنجیره نشان‌دهنده تعداد روزهای متوالی است که شما حداقل یک آیه را مرور کرده‌اید.", streakExplanation2: "اگر هر روز مرور کنید، شعله شما بزرگتر می‌شود. اما مراقب باشید! اگر یک روز کامل را بدون مرور بگذرانید، شعله خاموش می‌شود و زنجیره شما به صفر برمی‌گردد.", streakMotivation: "این یک راه عالی برای حفظ انگیزه و تبدیل حفظ قرآن به یک عادت روزانه است!", nextQuestionBtn: "رفتن به سوال دیگر ⏭️" },
    tr: { reviewTitle: "Tekrar", subtitle: "Ezber arkadaşınız", riwayaLabel: "Okuyuş stili", tajweedLabel: "Tecvid Renkleri", examModeLabel: "Sınav Modu 📝", examFromSurah: "Şu sureden", examToSurah: "Şu sureye", numQuestions: "Soru sayısı", optionsCountLabel: "Seçenek sayısı", continueVerse: "Bundan hemen sonra hangi ayet geliyor?", surahLabel: "Tekrar edilecek sure", fromVerse: "Şu ayetten", toVerse: "Şu ayete kadar", reciterLabel: "Sesli Okuyucu", startBtn: "Ezberle 🚀", backBtn: "⬅ Geri", loadingVerses: "Ayetler yükleniyor...", selectFirst: "İlk ayeti seçin:", selectNext: "Sonraki ayet hangisi?", goodAnswer: "✅ Doğru cevap!", badAnswer: "❌ Yanlış cevap, tekrar deneyin!", congrats: "✨ Tebrikler! Tamamladınız! ✨", yourScore: "Yüzdeniz:", foundOnFirstTry: "ilk denemede bulunan ayet sayısı", restart: "Yeniden başla", favGroup: "⭐ Favorileriniz", otherGroup: "Diğer okuyucular (A-Z)", addFav: "➕ Favoriye ekle", removeFav: "⭐ Favoriden çıkar", repeatContextBtn: "🔊 Önceki ayeti dinle", statsTitle: "Profilim ve İstatistikler", statTotalVerses: "Gözden geçirilen ayetler", statSuccessRate: "Doğruluk", statSessions: "Tamamlanan oturumlar", resetStats: "İstatistiklerimi sıfırla", statStreak: "Seri (Gün)", streakInfoTitle: "Seri Konsepti 🔥", streakWhatIsItTitle: "Seri nedir?", streakExplanation1: "Bir seri, en az bir ayeti gözden geçirdiğiniz ardışık günlerin sayısını temsil eder.", streakExplanation2: "Her gün tekrar yaparsanız, aleviniz büyür. Ancak dikkat! Tekrar yapmadan tam bir gün geçirirseniz alev söner ve seriniz sıfırlanır.", streakMotivation: "Motivasyonunuzu korumanın ve Kur'an ezberlemeyi günlük bir alışkanlık haline getirmenin harika bir yolu!", nextQuestionBtn: "Başka bir soruya geç ⏭️" },
    bn: { reviewTitle: "রিভিশন", subtitle: "আপনার মুখস্থ করার সঙ্গী", riwayaLabel: "তেলাওয়াতের ধরন", tajweedLabel: "তাজউইদ রং", examModeLabel: "পরীক্ষা মোড 📝", examFromSurah: "সূরা থেকে", examToSurah: "সূরা পর্যন্ত", numQuestions: "প্রশ্নের সংখ্যা", optionsCountLabel: "বিকল্পের সংখ্যা", continueVerse: "এর ঠিক পরে কোন আয়াতটি আসে?", surahLabel: "রিভিশন করার সূরা", fromVerse: "আয়াত থেকে", toVerse: "আয়াত পর্যন্ত", reciterLabel: "অডিও কারী", startBtn: "মুখস্থ করুন 🚀", backBtn: "⬅ ফিরে যান", loadingVerses: "আয়াত লোড হচ্ছে...", selectFirst: "প্রথম আয়াতটি নির্বাচন করুন:", selectNext: "পরবর্তী আয়াত কোনটি?", goodAnswer: "✅ সঠিক উত্তর!", badAnswer: "❌ ভুল উত্তর, আবার চেষ্টা করুন!", congrats: "✨ অভিনন্দন! আপনি সম্পন্ন করেছেন! ✨", yourScore: "আপনার শতকরা হার:", foundOnFirstTry: "প্রথম চেষ্টায় পাওয়া আয়াত, মোট আয়াতের মধ্যে", restart: "পুনরায় শুরু করুন", favGroup: "⭐ আপনার প্রিয়", otherGroup: "অন্যান্য কারী (A-Z)", addFav: "➕ প্রিয়তে যোগ করুন", removeFav: "⭐ প্রিয় থেকে সরান", repeatContextBtn: "🔊 পূর্ববর্তী আয়াত শুনুন", statsTitle: "আমার প্রোফাইল ও পরিসংখ্যান", statTotalVerses: "রিভিশন করা আয়াত", statSuccessRate: "নির্ভুলতা", statSessions: "সেশন সম্পন্ন", resetStats: "আমার পরিসংখ্যান রিসেট করুন", statStreak: "ধারাবাহিকতা (দিন)", streakInfoTitle: "ধারাবাহিকতার ধারণা 🔥", streakWhatIsItTitle: "ধারাবাহিকতা কি?", streakExplanation1: "ধারাবাহিকতা হল টানা কত দিন আপনি অন্তত একটি আয়াত রিভিশন করেছেন তার সংখ্যা।", streakExplanation2: "আপনি যদি প্রতিদিন রিভিশন করেন, আপনার শিখা বৃদ্ধি পাবে। তবে সাবধান! আপনি যদি রিভিশন ছাড়া পুরো এক দিন পার করেন, তবে শিখা নিভে যায় এবং ধারাবাহিকতা শূন্য হয়ে যায়।", streakMotivation: "এটি অনুপ্রাণিত থাকার এবং কোরআন মুখস্থ করাকে দৈনন্দিন অভ্যাসে পরিণত করার একটি দুর্দান্ত উপায়!", nextQuestionBtn: "অন্য প্রশ্নে যান ⏭️" },
    pa: { reviewTitle: "ਦੁਹਰਾਈ", subtitle: "ਤੁਹਾਡਾ ਹਿਫਜ਼ ਸਾਥੀ", riwayaLabel: "ਤਿਲਾਵਤ ਦਾ ਅੰਦਾਜ਼", tajweedLabel: "ਤਜਵੀਦ ਦੇ ਰੰਗ", examModeLabel: "ਪ੍ਰੀਖਿਆ ਮੋਡ 📝", examFromSurah: "ਸੂਰਤ ਤੋਂ", examToSurah: "ਸੂਰਤ ਤੱਕ", numQuestions: "ਸਵਾਲਾਂ ਦੀ ਗਿਣਤੀ", optionsCountLabel: "ਵਿਕਲਪਾਂ ਦੀ ਗਿਣਤੀ", continueVerse: "ਇਸ ਤੋਂ ਠੀਕ ਬਾਅਦ ਕਿਹੜੀ ਆਇਤ ਆਉਂਦੀ ਹੈ?", surahLabel: "ਦੁਹਰਾਉਣ ਲਈ ਸੂਰਤ", fromVerse: "ਆਇਤ ਤੋਂ", toVerse: "ਆਇਤ ਤੱਕ", reciterLabel: "ਆਡੀਓ ਕਾਰੀ", startBtn: "ਯਾਦ ਕਰੋ 🚀", backBtn: "⬅ ਵਾਪਸ", loadingVerses: "ਆਇਤਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ...", selectFirst: "ਪਹਿਲੀ ਆਇਤ ਚੁਣੋ:", selectNext: "ਅਗਲੀ ਆਇਤ ਕਿਹੜੀ ਹੈ?", goodAnswer: "✅ ਸਹੀ ਜਵਾਬ!", badAnswer: "❌ ਗਲਤ ਜਵਾਬ, ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ!", congrats: "✨ ਵਧਾਈਆਂ! ਤੁਸੀਂ ਪੂਰਾ ਕਰ ਲਿਆ! ✨", yourScore: "ਤੁਹਾਡੀ ਪ੍ਰਤੀਸ਼ਤਤਾ:", foundOnFirstTry: "ਪਹਿਲੀ ਕੋਸ਼ਿਸ਼ ਵਿੱਚ ਮਿਲੀਆਂ ਆਇਤਾਂ", restart: "ਮੁੜ ਚਾਲੂ ਕਰੋ", favGroup: "⭐ ਤੁਹਾਡੇ ਪਸੰਦੀਦਾ", otherGroup: "ਹੋਰ ਕਾਰੀ (A-Z)", addFav: "➕ ਪਸੰਦੀਦਾ ਸ਼ਾਮਲ ਕਰੋ", removeFav: "⭐ ਪਸੰਦੀਦਾ ਹਟਾਓ", repeatContextBtn: "🔊 ਪਿਛਲੀ ਆਇਤ ਸੁਣੋ", statsTitle: "ਮੇਰਾ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਅੰਕੜੇ", statTotalVerses: "ਦੁਹਰਾਈਆਂ ਆਇਤਾਂ", statSuccessRate: "ਦਰੁਸਤਗੀ", statSessions: "ਸੈਸ਼ਨ ਪੂਰੇ ਹੋਏ", resetStats: "ਮੇਰੇ ਅੰਕੜੇ ਰੀਸੈਟ ਕਰੋ", statStreak: "ਲੜੀ (ਦਿਨ)", streakInfoTitle: "ਲੜੀ ਦਾ ਸੰਕਲਪ 🔥", streakWhatIsItTitle: "ਲੜੀ ਕੀ ਹੈ?", streakExplanation1: "ਲੜੀ ਉਹਨਾਂ ਲਗਾਤਾਰ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਤੁਸੀਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਆਇਤ ਨੂੰ ਦੁਹਰਾਇਆ ਹੈ।", streakExplanation2: "ਜੇਕਰ ਤੁਸੀਂ ਹਰ ਰੋਜ਼ ਦੁਹਰਾਉਂਦੇ ਹੋ, ਤਾਂ ਤੁਹਾਡੀ ਲਾਟ ਵਧਦੀ ਹੈ। ਪਰ ਸਾਵਧਾਨ! ਜੇ ਤੁਸੀਂ ਬਿਨਾਂ ਦੁਹਰਾਏ ਇੱਕ ਪੂਰਾ ਦਿਨ ਗੁਆ ਦਿੰਦੇ ਹੋ, ਤਾਂ ਲਾਟ ਬੁੱਝ ਜਾਂਦੀ ਹੈ ਅਤੇ ਤੁਹਾਡੀ ਲੜੀ ਜ਼ੀਰੋ 'ਤੇ ਵਾਪਸ ਆ ਜਾਂਦੀ ਹੈ।", streakMotivation: "ਪ੍ਰੇਰਿਤ ਰਹਿਣ ਅਤੇ ਕੁਰਾਨ ਯਾਦ ਕਰਨ ਨੂੰ ਰੋਜ਼ਾਨਾ ਆਦਤ ਬਣਾਉਣ ਦਾ ਇਹ ਇੱਕ ਵਧੀਆ ਤਰੀਕਾ ਹੈ!", nextQuestionBtn: "ਕਿਸੇ ਹੋਰ ਸਵਾਲ 'ਤੇ ਜਾਓ ⏭️" },
    jv: { reviewTitle: "Muraja'ah", subtitle: "Kanca hafalan sampeyan", riwayaLabel: "Gaya wacan", tajweedLabel: "Werna Tajwid", examModeLabel: "Mode Ujian 📝", examFromSurah: "Saka Surah", examToSurah: "Tumeka Surah", numQuestions: "Cacahing pitakonan", optionsCountLabel: "Cacahing pilihan", continueVerse: "Ayat apa sing sawise iki?", surahLabel: "Surah sing arep diwaca", fromVerse: "Saka ayat", toVerse: "Tumeka ayat", reciterLabel: "Qari Audio", startBtn: "Apalna 🚀", backBtn: "⬅ Bali", loadingVerses: "Muat ayat...", selectFirst: "Pilih ayat pisanan:", selectNext: "Apa ayat sabanjure?", goodAnswer: "✅ Wangsulan bener!", badAnswer: "❌ Wangsulan salah, coba maneh!", congrats: "✨ Sugeng! Sampeyan wis rampung! ✨", yourScore: "Persentase sampeyan:", foundOnFirstTry: "ayat ditemokake ing upaya pisanan saka", restart: "Wiwiti maneh", favGroup: "⭐ Favorit sampeyan", otherGroup: "Qari liyane (A-Z)", addFav: "➕ Tambah favorit", removeFav: "⭐ Busak favorit", repeatContextBtn: "🔊 Rungokake ayat sadurunge", statsTitle: "Profil & Statistik Kula", statTotalVerses: "Ayat sing diwaca", statSuccessRate: "Akurasi", statSessions: "Sesi rampung", resetStats: "Reset statistik kula", statStreak: "Runtutan (Dina)", streakInfoTitle: "Konsep Runtutan 🔥", streakWhatIsItTitle: "Apa iku runtutan?", streakExplanation1: "Runtutan minangka jumlah dina berturut-turut sampeyan maca paling ora siji ayat.", streakExplanation2: "Yen sampeyan maca saben dina, geni sampeyan dadi luwih gedhe. Nanging ati-ati! Yen sampeyan kantun sedina muput tanpa maca, geni mati lan runtutan bali menyang nol.", streakMotivation: "Iki cara sing apik kanggo tetep motivasi lan nggawe hafalan Al-Qur'an dadi kebiasaan saben dina!", nextQuestionBtn: "Pindhah menyang pitakonan liyane ⏭️" },
    ha: { reviewTitle: "Bita", subtitle: "Abokin haddar ku", riwayaLabel: "Yanayin karatu", tajweedLabel: "Launukan Tajwidi", examModeLabel: "Tsarin Jarrabawa 📝", examFromSurah: "Daga Surah", examToSurah: "Zuwa Surah", numQuestions: "Yawan tambayoyi", optionsCountLabel: "Yawan zaɓuɓɓuka", continueVerse: "Wace aya ce take zuwa nan take bayan wannan?", surahLabel: "Surar da za a maimaita", fromVerse: "Daga aya", toVerse: "Zuwa aya", reciterLabel: "Makaranci (Audio)", startBtn: "Haddace 🚀", backBtn: "⬅ Koma", loadingVerses: "Ana loda ayoyi...", selectFirst: "Zabi aya ta farko:", selectNext: "Wace aya ce ta gaba?", goodAnswer: "✅ Amsa daidai!", badAnswer: "❌ Amsa kuskure, sake gwadawa!", congrats: "✨ Taya murna! Ka kammala! ✨", yourScore: "Kason ka:", foundOnFirstTry: "aya da aka samu a gwaji na farko daga cikin", restart: "Sake farawa", favGroup: "⭐ Wadanda kuka fi so", otherGroup: "Wasu makaranta (A-Z)", addFav: "➕ Ƙara a waɗanda aka fi so", removeFav: "⭐ Cire daga waɗanda aka fi so", repeatContextBtn: "🔊 Saurari aya ta baya", statsTitle: "Furofayil & Ƙididdiga ta", statTotalVerses: "Ayoyin da aka bita", statSuccessRate: "Daidaito", statSessions: "Zaman da aka kammala", resetStats: "Sake saita ƙididdiga ta", statStreak: "Jerin Ranakun (Streak)", streakInfoTitle: "Tsarin Jerin Ranakun 🔥", streakWhatIsItTitle: "Menene streak?", streakExplanation1: "Streak yana nuna adadin kwanakin da ka jere kana yin bita na aƙalla aya ɗaya.", streakExplanation2: "Idan kana bita kowace rana, wutar ka tana ƙaruwa. Amma ka kiyaye! Idan ka tsallake rana guda ba tare da bita ba, wutar za ta mutu kuma streak ɗinka zai koma sifili.", streakMotivation: "Hanya ce mai kyau don samun ƙwarin gwiwa da mayar da haddar Al-ƙur'ani al'ada ta yau da kullum!", nextQuestionBtn: "Matsa zuwa wata tambaya ⏭️" },
    ru: { reviewTitle: "Повторение", subtitle: "Ваш помощник в заучивании", riwayaLabel: "Стиль чтения", tajweedLabel: "Цвета таджвида", examModeLabel: "Режим экзамена 📝", examFromSurah: "От суры", examToSurah: "До суры", numQuestions: "Количество вопросов", optionsCountLabel: "Количество вариантов", continueVerse: "Какой аят идет сразу после этого?", surahLabel: "Сура для повторения", fromVerse: "От аята", toVerse: "До аята", reciterLabel: "Аудио чтец", startBtn: "Учить 🚀", backBtn: "⬅ Назад", loadingVerses: "Загрузка аятов...", selectFirst: "Выберите первый аят:", selectNext: "Какой следующий аят?", goodAnswer: "✅ Правильный ответ!", badAnswer: "❌ Неправильный ответ, попробуйте еще раз!", congrats: "✨ Поздравляем! Вы завершили! ✨", yourScore: "Ваш процент:", foundOnFirstTry: "аят(ов) найдено с первой попытки из", restart: "Начать заново", favGroup: "⭐ Ваши избранные", otherGroup: "Другие чтецы (А-Я)", addFav: "➕ Добавить в избранное", removeFav: "⭐ Удалить из избранного", repeatContextBtn: "🔊 Слушать предыдущий аят", statsTitle: "Мой профиль и статистика", statTotalVerses: "Повторено аятов", statSuccessRate: "Точность", statSessions: "Завершено сеансов", resetStats: "Сбросить статистику", statStreak: "Серия (Дни)", streakInfoTitle: "Концепция серий 🔥", streakWhatIsItTitle: "Что такое серия?", streakExplanation1: "Серия представляет собой количество дней подряд, в течение которых вы повторяли хотя бы один аят.", streakExplanation2: "Если вы повторяете каждый день, ваше пламя растет. Но будьте осторожны! Если вы пропустите целый день без повторения, пламя погаснет, и ваша серия обнулится.", streakMotivation: "Это отличный способ сохранить мотивацию и сделать заучивание Корана ежедневной привычкой!", nextQuestionBtn: "Перейти к другому вопросу ⏭️" },
    sw: { reviewTitle: "Mapitio", subtitle: "Mwenza wako wa kuhifadhi", riwayaLabel: "Mtindo wa usomaji", tajweedLabel: "Rangi za Tajwid", examModeLabel: "Hali ya Mtihani 📝", examFromSurah: "Kutoka Sura", examToSurah: "Hadi Sura", numQuestions: "Idadi ya maswali", optionsCountLabel: "Idadi ya chaguzi", continueVerse: "Ni aya gani inayofuata mara baada ya hii?", surahLabel: "Sura ya kurejea", fromVerse: "Kutoka aya", toVerse: "Hadi aya", reciterLabel: "Msomaji wa Sauti", startBtn: "Hifadhi 🚀", backBtn: "⬅ Nyuma", loadingVerses: "Inapakia aya...", selectFirst: "Chagua aya ya kwanza:", selectNext: "Ni aya gani inayofuata?", goodAnswer: "✅ Jibu sahihi!", badAnswer: "❌ Jibu si sahihi, jaribu tena!", congrats: "✨ Hongera! Umekamilisha! ✨", yourScore: "Asilimia yako:", foundOnFirstTry: "aya zilizopatikana kwenye jaribio la kwanza kati ya", restart: "Anza upya", favGroup: "⭐ Vipendwa vyako", otherGroup: "Wasomaji wengine (A-Z)", addFav: "➕ Ongeza kipendwa", removeFav: "⭐ Ondoa kipendwa", repeatContextBtn: "🔊 Sikiliza aya iliyopita", statsTitle: "Profaili Yangu & Takwimu", statTotalVerses: "Aya zilizorejewa", statSuccessRate: "Usahihi", statSessions: "Vipindi vilivyokamilika", resetStats: "Weka upya takwimu", statStreak: "Mfululizo (Siku)", streakInfoTitle: "Dhana ya Mfululizo 🔥", streakWhatIsItTitle: "Mfululizo ni nini?", streakExplanation1: "Mfululizo unawakilisha idadi ya siku mfululizo ambazo umerejea angalau aya moja.", streakExplanation2: "Ikiwa unarejea kila siku, mwali wako unakua. Lakini tahadhari! Ukikosa siku nzima bila kurejea, mwali unazimika na mfululizo wako unarudi sifuri.", streakMotivation: "Ni njia nzuri ya kukaa na motisha na kufanya kuhifadhi Quran kuwa tabia ya kila siku!", nextQuestionBtn: "Nenda kwa swali lingine ⏭️" }
};

let currentLang = localStorage.getItem('appLang') || 'fr';
function t(key) { return translations[currentLang]?.[key] || translations['fr'][key] || key; }

function updateUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerText = t(el.getAttribute('data-i18n')); });
    const rtlLangs = ['ar', 'ur', 'fa'];
    document.getElementById('html-root').dir = rtlLangs.includes(currentLang) ? "rtl" : "ltr";
    updateFavButtonStatus();
    if(surahSelect.options.length > 0) renderReciterDropdown();
}

// ================= VARIABLES D'APPLICATION =================
let allVerses = []; let quizVerses = []; let examPrompts = []; 
let currentExamQuestionIndex = 0; let sessionTotalAnswered = 0;
let isExamMode = false; let currentVerseIndex = 0; let score = 0; let madeMistake = false; let currentAudio = null; let chaptersDetails = {}; 
let recitersData = []; 
let favoriteReciters = JSON.parse(localStorage.getItem('favoriteReciters')) || []; favoriteReciters = favoriteReciters.map(id => String(id)); 

const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const statsScreen = document.getElementById('stats-screen');
const streakInfoScreen = document.getElementById('streak-info-screen'); 
const quranPageDiv = document.getElementById('quran-page');
const optionsContainer = document.getElementById('options-container');
const instructionEl = document.getElementById('instruction');
const feedbackEl = document.getElementById('feedback-message');
const riwayaSelect = document.getElementById('riwaya-select');
const surahSelect = document.getElementById('surah-select');
const verseStart = document.getElementById('verse-start'); const verseEnd = document.getElementById('verse-end');     
const examModeCheckbox = document.getElementById('exam-mode-checkbox');
const normalModeBlock = document.getElementById('normal-mode-block');
const examModeBlock = document.getElementById('exam-mode-block');
const examSurahStart = document.getElementById('exam-surah-start'); const examVerseStart = document.getElementById('exam-verse-start');
const examSurahEnd = document.getElementById('exam-surah-end'); const examVerseEnd = document.getElementById('exam-verse-end');
const examQuestionsCount = document.getElementById('exam-questions-count');
const optionsCountSelect = document.getElementById('options-count-select'); 
const reciterSelect = document.getElementById('reciter-select');
const favBtn = document.getElementById('fav-btn');
const tajweedCheckbox = document.getElementById('tajweed-checkbox'); const tajweedContainer = document.getElementById('tajweed-container');
const langSelect = document.getElementById('lang-select');
const progressBar = document.getElementById('progress-bar'); const progressText = document.getElementById('progress-text'); const progressPercentage = document.getElementById('progress-percentage');
const replayAudioBtn = document.getElementById('replay-audio-btn'); 
const nextQuestionBtn = document.getElementById('next-question-btn'); 

function toArabicNumber(n) { const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']; return String(n).replace(/\d/g, x => arabicDigits[x]); }
function cleanVerseText(text) { return (text || '').replace(/[0-9٠-٩۰-۹۝]/g, '').trim(); }

async function loadSurahNames() {
    try {
        surahSelect.innerHTML = `<option value="">${t('loadingVerses')}</option>`;
        examSurahStart.innerHTML = ""; examSurahEnd.innerHTML = "";
        const surahRes = await fetch(`https://api.quran.com/api/v4/chapters?language=${currentLang}`);
        const surahData = await surahRes.json();
        
        if (!surahData.chapters) throw new Error("Erreur de connexion avec Quran.com");
        
        surahSelect.innerHTML = "";
        surahData.chapters.forEach(chapter => {
            chaptersDetails[chapter.id] = chapter.verses_count;
            const optionText = `${chapter.id}. ${chapter.name_arabic} (${chapter.translated_name.name})`;
            const opt1 = document.createElement('option'); opt1.value = chapter.id; opt1.innerText = optionText;
            const opt2 = document.createElement('option'); opt2.value = chapter.id; opt2.innerText = optionText;
            const opt3 = document.createElement('option'); opt3.value = chapter.id; opt3.innerText = optionText;
            surahSelect.appendChild(opt1); examSurahStart.appendChild(opt2); examSurahEnd.appendChild(opt3);
        });
        updateVerseInputsLimits(); updateExamVerseInputsLimits();
    } catch(e) { console.error("Erreur API Surah Names:", e); }
}

function updateVerseInputsLimits() {
    const totalVerses = chaptersDetails[surahSelect.value];
    if (totalVerses) { verseStart.max = totalVerses; verseEnd.max = totalVerses; verseStart.value = 1; verseEnd.value = totalVerses; }
}
function updateExamVerseInputsLimits() {
    const totalStart = chaptersDetails[examSurahStart.value];
    if (totalStart) { examVerseStart.max = totalStart; examVerseStart.value = 1; }
    const totalEnd = chaptersDetails[examSurahEnd.value];
    if (totalEnd) { examVerseEnd.max = totalEnd; examVerseEnd.value = totalEnd; }
}

async function initApp() {
    langSelect.value = currentLang; updateUI(); updateHeaderStreakDisplay();

    try {
        await loadSurahNames();
        const reciterRes = await fetch('https://api.quran.com/api/v4/resources/recitations?language=fr');
        const reciterData = await reciterRes.json();
        const motsAExclure = ['husary', 'tablawi', 'maher', 'dosari', 'dussary', 'matroud', 'basfar', 'shatree', 'shatri', 'neana', 'ajamy', 'ajami', 'alaqim', 'suesy', 'jaber', 'soaid', 'sowaid', 'abbad', 'ghamad'];
        recitersData = (reciterData.recitations || []).filter(r => { return !motsAExclure.some(mot => r.reciter_name.toLowerCase().includes(mot)); }).map(r => { r.riwaya = 'hafs'; return r; });
        const customReciters = [
            { id: "ea_maher", reciter_name: "Maher Al-Muaiqly", riwaya: "hafs" }, { id: "ea_dosari", reciter_name: "Yasser Al-Dosari", riwaya: "hafs" }, { id: "ea_husary", reciter_name: "Mahmoud Khalil Al-Husary", riwaya: "hafs" }, { id: "ea_tablawi", reciter_name: "Mohamed At-Tablawi", riwaya: "hafs" }, { id: "ea_matroud", reciter_name: "Abdullah Matroud", riwaya: "hafs" }, { id: "ea_basfar", reciter_name: "Abdullah Basfar", riwaya: "hafs" }, { id: "ea_shatree", reciter_name: "AbuBakr Ash-Shatree", riwaya: "hafs" }, { id: "ea_neana", reciter_name: "Ahmed Neana", riwaya: "hafs" }, { id: "ea_ajamy", reciter_name: "Ahmed Ibn Ali Al-Ajamy", riwaya: "hafs" }, { id: "ea_alaqimy", reciter_name: "Akram Alalaqimi", riwaya: "hafs" }, { id: "ea_suesy", reciter_name: "Ali Hajjaj Alsuesy", riwaya: "hafs" }, { id: "ea_jaber", reciter_name: "Ali Jaber", riwaya: "hafs" }, { id: "ea_soaid", reciter_name: "Aymen Soaid", riwaya: "hafs" }, { id: "ea_abbad", reciter_name: "Fares Abbad", riwaya: "hafs" }, { id: "ea_ghamadi", reciter_name: "Saad Al-Ghamadi", riwaya: "hafs" }, { id: "ea_w_idossari", reciter_name: "Ibrahim Al-Dossari (Warsh)", riwaya: "warsh" }, { id: "ea_w_yassin", reciter_name: "Yassin Al-Jazaery (Warsh)", riwaya: "warsh" }, { id: "ea_w_basit", reciter_name: "AbdulBaset AbdulSamad (Warsh)", riwaya: "warsh" }
        ];
        recitersData = [...recitersData, ...customReciters];
        recitersData.sort((a, b) => a.reciter_name.localeCompare(b.reciter_name));
        renderReciterDropdown();

        examModeCheckbox.addEventListener('change', (e) => {
            isExamMode = e.target.checked;
            if (isExamMode) { normalModeBlock.style.display = 'none'; examModeBlock.style.display = 'flex'; if (parseInt(examSurahEnd.value) < parseInt(examSurahStart.value)) examSurahEnd.value = examSurahStart.value; } 
            else { normalModeBlock.style.display = 'flex'; examModeBlock.style.display = 'none'; }
        });
        langSelect.addEventListener('change', (e) => { currentLang = e.target.value; localStorage.setItem('appLang', currentLang); updateUI(); loadSurahNames(); });
        surahSelect.addEventListener('change', updateVerseInputsLimits);
        examSurahStart.addEventListener('change', updateExamVerseInputsLimits);
        examSurahEnd.addEventListener('change', updateExamVerseInputsLimits);
        riwayaSelect.addEventListener('change', () => {
            if (riwayaSelect.value === 'warsh') { tajweedCheckbox.checked = false; tajweedCheckbox.disabled = true; tajweedContainer.style.opacity = '0.5'; } 
            else { tajweedCheckbox.disabled = false; tajweedContainer.style.opacity = '1'; }
            renderReciterDropdown();
        });
        reciterSelect.addEventListener('change', updateFavButtonStatus);
        favBtn.addEventListener('click', () => {
            const selectedId = String(reciterSelect.value);
            if (favoriteReciters.includes(selectedId)) {
                favoriteReciters = favoriteReciters.filter(id => id !== selectedId);
                favBtn.classList.remove('is-favorite');
            } else {
                favoriteReciters.push(selectedId);
                favBtn.classList.add('is-favorite');
            }
            localStorage.setItem('favoriteReciters', JSON.stringify(favoriteReciters)); renderReciterDropdown();
        });

        document.getElementById('stats-toggle').addEventListener('click', () => { homeScreen.style.display = 'none'; streakInfoScreen.style.display = 'none'; statsScreen.style.display = 'block'; renderStatsDisplay(); });
        document.getElementById('back-from-stats-btn').addEventListener('click', () => { statsScreen.style.display = 'none'; homeScreen.style.display = 'block'; });
        document.getElementById('reset-stats-btn').addEventListener('click', () => {
            if(confirm(t('resetStats') + " ?")) {
                userStats = { totalAnswered: 0, correctFirstTry: 0, sessionsCompleted: 0, currentStreak: 0, lastStudyDate: null }; userMistakes = {};
                saveStats(); renderStatsDisplay(); updateHeaderStreakDisplay();
            }
        });

        document.getElementById('streak-info-toggle').addEventListener('click', () => {
            if(currentAudio) currentAudio.pause(); homeScreen.style.display = 'none'; statsScreen.style.display = 'none'; quizScreen.style.display = 'none'; streakInfoScreen.style.display = 'block';
        });
        document.getElementById('back-from-streak-btn').addEventListener('click', () => { streakInfoScreen.style.display = 'none'; homeScreen.style.display = 'block'; });

        document.getElementById('start-btn').addEventListener('click', () => {
            if(!surahSelect.value) return; 
            homeScreen.style.display = 'none'; quizScreen.style.display = 'block';
            if (isExamMode) {
                document.getElementById('quiz-title').innerText = t('examModeLabel'); 
                loadExamVerses(reciterSelect.value);
            } else {
                const surahName = surahSelect.options[surahSelect.selectedIndex].text.split('(')[0];
                document.getElementById('quiz-title').innerText = `${t('reviewTitle')} : ${surahName}`;
                loadSurahVerses(surahSelect.value, reciterSelect.value);
            }
        });
        
        document.getElementById('back-btn').addEventListener('click', () => {
            if (currentAudio) currentAudio.pause(); quizScreen.style.display = 'none'; homeScreen.style.display = 'block'; 
        });

        nextQuestionBtn.addEventListener('click', () => { goToNextExamQuestion(); });

    } catch (error) { console.error(error); }
}

function renderStatsDisplay() {
    document.getElementById('stat-streak').innerText = userStats.currentStreak + " 🔥";
    document.getElementById('stat-total').innerText = userStats.totalAnswered;
    const rate = userStats.totalAnswered > 0 ? Math.round((userStats.correctFirstTry / userStats.totalAnswered) * 100) : 0;
    document.getElementById('stat-rate').innerText = rate + "%";
    document.getElementById('stat-sessions').innerText = userStats.sessionsCompleted;
}

function renderReciterDropdown() {
    const currentSelectedId = String(reciterSelect.value); const selectedRiwaya = riwayaSelect.value; reciterSelect.innerHTML = "";
    const favGroup = document.createElement('optgroup'); favGroup.label = t('favGroup');
    const otherGroup = document.createElement('optgroup'); otherGroup.label = t('otherGroup');
    const filteredReciters = recitersData.filter(r => r.riwaya === selectedRiwaya);
    filteredReciters.forEach(reciter => {
        const option = document.createElement('option'); option.value = reciter.id; option.innerText = reciter.reciter_name;
        if (favoriteReciters.includes(String(reciter.id))) favGroup.appendChild(option); else otherGroup.appendChild(option);
    });
    if (favGroup.children.length > 0) reciterSelect.appendChild(favGroup); reciterSelect.appendChild(otherGroup);
    if (currentSelectedId && Array.from(reciterSelect.options).some(opt => String(opt.value) === currentSelectedId)) reciterSelect.value = currentSelectedId;
    else if (favGroup.children.length > 0) reciterSelect.value = favGroup.children[0].value; else if (otherGroup.children.length > 0) reciterSelect.value = otherGroup.children[0].value;
    updateFavButtonStatus();
}

function updateFavButtonStatus() {
    const selectedId = String(reciterSelect.value);
    if (favoriteReciters.includes(selectedId)) { favBtn.innerText = t('removeFav'); favBtn.classList.add('is-favorite'); } 
    else { favBtn.innerText = t('addFav'); favBtn.classList.remove('is-favorite'); }
}

function updateProgress(current, total) {
    if(total === 0) return;
    const percentage = Math.round((current / total) * 100);
    progressBar.style.width = `${percentage}%`; progressText.innerText = `${current} / ${total}`; progressPercentage.innerText = `${percentage}%`;
}

function getAudioUrl(correctVerse, selectedReciterId) {
    if (!correctVerse || !selectedReciterId) return null; 
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
        if (selectedReciterId === "ea_w_idossari") serverUrl = "https://everyayah.com/data/warsh/warsh_ibrahim_aldosary_128kbps/";
        if (selectedReciterId === "ea_w_yassin") serverUrl = "https://everyayah.com/data/warsh/warsh_yassin_al_jazaery_64kbps/";
        if (selectedReciterId === "ea_w_basit") serverUrl = "https://everyayah.com/data/warsh/warsh_Abdul_Basit_128kbps/";
        
        if (!correctVerse.verse_key) return null;
        const parts = correctVerse.verse_key.split(':'); 
        const surahStr = parts[0].padStart(3, '0'); const ayahStr = parts[1].padStart(3, '0');
        return `${serverUrl}${surahStr}${ayahStr}.mp3`;
    } else {
        const audioData = correctVerse.audio; 
        if (audioData && audioData.url) return audioData.url.startsWith('http') ? audioData.url : `https://verses.quran.com/${audioData.url}`;
    }
    return null;
}

// ================= MODE NORMAL =================
async function loadSurahVerses(chapterId, reciterId) {
    optionsContainer.innerHTML = ""; feedbackEl.innerText = "";
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    
    quranPageDiv.style.display = 'block'; nextQuestionBtn.style.display = 'none'; quranPageDiv.innerHTML = "";
    currentVerseIndex = 0; score = 0; madeMistake = false; allVerses = []; quizVerses = []; updateProgress(0, 1);

    try {
        const apiReciterId = String(reciterId).startsWith('ea_') ? 7 : reciterId; 
        let currentPage = 1, totalPages = 1;
        while (currentPage <= totalPages) {
            instructionEl.innerText = t('loadingVerses');
            const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${chapterId}?fields=text_uthmani,text_uthmani_tajweed&audio=${apiReciterId}&page=${currentPage}&per_page=50`);
            const data = await response.json();
            
            if (!data.verses) throw new Error("L'API n'a pas renvoyé les versets. Réessayez dans 1 minute.");
            
            allVerses = allVerses.concat(data.verses); totalPages = data.pagination.total_pages; currentPage++;
        }
        
        let startV = parseInt(verseStart.value) || 1; let endV = parseInt(verseEnd.value) || allVerses.length;
        if (startV < 1) startV = 1; if (endV > allVerses.length) endV = allVerses.length;
        if (startV > endV) { let temp = startV; startV = endV; endV = temp; } 
        
        quizVerses = allVerses.slice(startV - 1, endV); 
        
        if (quizVerses.length === 0) throw new Error("Aucun verset trouvé dans cette sélection.");
        generateQuestion();
        
    } catch (error) { 
        console.error(error); 
        instructionEl.innerText = "❌ Erreur : " + error.message; 
        optionsContainer.innerHTML = `<button class="option-btn" onclick="location.reload()">Recharger l'application</button>`;
    }
}

// ================= MODE EXAMEN =================
async function loadExamVerses(reciterId) {
    optionsContainer.innerHTML = ""; feedbackEl.innerText = "";
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    
    quranPageDiv.style.display = 'block'; quranPageDiv.innerHTML = "";
    currentVerseIndex = 0; score = 0; madeMistake = false; allVerses = []; examPrompts = []; currentExamQuestionIndex = 0; sessionTotalAnswered = 0;
    updateProgress(0, 1);

    try {
        const apiReciterId = String(reciterId).startsWith('ea_') ? 7 : reciterId; 
        let startS = parseInt(examSurahStart.value); let endS = parseInt(examSurahEnd.value);
        if (startS > endS) { let temp = startS; startS = endS; endS = temp; }

        let vStart = parseInt(examVerseStart.value) || 1; let vEnd = parseInt(examVerseEnd.value) || chaptersDetails[endS];

        for (let s = startS; s <= endS; s++) {
            let currentPage = 1, totalPages = 1;
            while (currentPage <= totalPages) {
                instructionEl.innerText = `Préparation... (Sourate ${s}/${endS})`;
                const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${s}?fields=text_uthmani,text_uthmani_tajweed&audio=${apiReciterId}&page=${currentPage}&per_page=50`);
                const data = await response.json();
                
                if (!data.verses) throw new Error("L'API n'a pas renvoyé les versets. Réessayez dans 1 minute.");

                let versesToAdd = data.verses;
                if (s === startS) versesToAdd = versesToAdd.filter(v => parseInt(v.verse_key.split(':')[1]) >= vStart);
                if (s === endS) versesToAdd = versesToAdd.filter(v => parseInt(v.verse_key.split(':')[1]) <= vEnd);
                allVerses = allVerses.concat(versesToAdd); totalPages = data.pagination.total_pages; currentPage++;
            }
        }

        if (allVerses.length < 2) throw new Error("Il faut au moins 2 versets pour un examen !");

        let numQ = parseInt(examQuestionsCount.value); if (numQ >= allVerses.length) numQ = allVerses.length - 1; 
        
        let selectedIndices = [];
        let pool = [];
        
        for (let i = 0; i < allVerses.length - 1; i++) {
            let vKey = allVerses[i+1].verse_key; 
            let mistakes = userMistakes[vKey] || 0;
            let weight = 1 + (mistakes * 5); 
            for (let w = 0; w < weight; w++) pool.push(i);
        }
        pool.sort(() => Math.random() - 0.5);
        for (let idx of pool) {
            if (!selectedIndices.includes(idx)) { selectedIndices.push(idx); if (selectedIndices.length === numQ) break; }
        }
        
        examPrompts = selectedIndices; 
        currentExamQuestionIndex = 0;
        
        startExamQuestion();

    } catch (error) { 
        console.error(error); 
        instructionEl.innerText = "❌ Erreur : " + error.message; 
        optionsContainer.innerHTML = `<button class="option-btn" onclick="location.reload()">Recharger l'application</button>`;
    }
}

function startExamQuestion() {
    if (currentAudio) currentAudio.pause();
    
    if (currentExamQuestionIndex >= examPrompts.length) { finishQuiz(); return; }

    quranPageDiv.innerHTML = ""; 
    nextQuestionBtn.style.display = 'block'; 

    let promptIdx = examPrompts[currentExamQuestionIndex];
    let promptVerse = allVerses[promptIdx];
    
    const useTajweed = tajweedCheckbox.checked && riwayaSelect.value === 'hafs';
    let displayPromptText = cleanVerseText((useTajweed && promptVerse.text_uthmani_tajweed) ? promptVerse.text_uthmani_tajweed : promptVerse.text_uthmani); 
    const arabicVerseNum = toArabicNumber(promptVerse.verse_key.split(':')[1]);
    
    quranPageDiv.innerHTML = `<span>${displayPromptText} <span style="font-family: 'Amiri', serif; color: var(--primary-color);">۝${arabicVerseNum}</span> </span>`;

    currentVerseIndex = promptIdx + 1;
    generateQuestion();
}

function goToNextExamQuestion() {
    currentExamQuestionIndex++;
    startExamQuestion();
}

function finishQuiz() {
    userStats.sessionsCompleted++;
    saveStats();
    
    nextQuestionBtn.style.display = 'none'; replayAudioBtn.style.display = 'none'; quranPageDiv.style.display = 'none';

    let percentage = 0;
    if (isExamMode) percentage = sessionTotalAnswered > 0 ? Math.round((score / sessionTotalAnswered) * 100) : 0;
    else percentage = quizVerses.length > 0 ? Math.round((score / quizVerses.length) * 100) : 0;

    instructionEl.innerText = t('congrats'); 
    const textDir = document.getElementById('html-root').dir;
    optionsContainer.innerHTML = `
        <div dir="${textDir}" style="text-align: center; padding: 20px; background-color: var(--bg-controls); border-radius: 10px; border: 1px solid var(--border-color);">
            <h3 style="color: var(--primary-color); font-size: 24px;">${t('yourScore')}</h3>
            <h1 style="color: var(--primary-color); font-size: 48px; margin: 10px 0;">${percentage}%</h1>
            <p style="color: var(--text-main);">${score} ${t('foundOnFirstTry')} ${isExamMode ? sessionTotalAnswered : quizVerses.length}.</p>
            <button class="option-btn" onclick="location.reload()" style="margin-top: 15px;">${t('restart')}</button>
        </div>
    `;
}

function generateQuestion() {
    feedbackEl.innerText = ""; optionsContainer.innerHTML = ""; madeMistake = false; replayAudioBtn.style.display = 'none';

    if (isExamMode) {
        updateProgress(currentExamQuestionIndex + 1, examPrompts.length);
        if (currentVerseIndex >= allVerses.length) { goToNextExamQuestion(); return; }
    } else {
        updateProgress(currentVerseIndex, quizVerses.length);
        if (currentVerseIndex >= quizVerses.length) { finishQuiz(); return; }
    }

    const useTajweed = tajweedCheckbox.checked && riwayaSelect.value === 'hafs';
    let correctVerse;

    if (isExamMode) {
        instructionEl.innerText = t('continueVerse');
        correctVerse = allVerses[currentVerseIndex];
    } else {
        instructionEl.innerText = currentVerseIndex === 0 ? t('selectFirst') : t('selectNext');
        correctVerse = quizVerses[currentVerseIndex];
    }

    if (!correctVerse) { console.error("Erreur: Verset introuvable"); finishQuiz(); return; }

    let contextVerse = null;
    if (isExamMode) contextVerse = allVerses[currentVerseIndex - 1]; 
    else if (currentVerseIndex > 0) contextVerse = quizVerses[currentVerseIndex - 1];

    if (contextVerse) {
        let contextAudioUrl = getAudioUrl(contextVerse, String(reciterSelect.value));
        if (contextAudioUrl) {
            replayAudioBtn.style.display = 'block';
            replayAudioBtn.onclick = () => {
                if (currentAudio) currentAudio.pause();
                currentAudio = new Audio(contextAudioUrl);
                currentAudio.play().catch(e => console.log(e));
            };
        }
    }

    let audioUrl = getAudioUrl(correctVerse, String(reciterSelect.value));
    
    const targetOptionsCount = parseInt(optionsCountSelect ? optionsCountSelect.value : 4) || 4;
    let options = [correctVerse];
    const firstWord = (correctVerse.text_uthmani || '').split(' ')[0]; 

    let availableDistractors = allVerses.filter(v => v && v.id !== correctVerse.id && v.text_uthmani);
    
    let similar1 = availableDistractors.filter(v => v.text_uthmani.startsWith(firstWord));
    similar1.sort(() => Math.random() - 0.5);
    for (let v of similar1) {
        if (options.length < targetOptionsCount && !options.some(o => o.id === v.id)) options.push(v);
    }

    if (options.length < targetOptionsCount) {
        let similar2 = availableDistractors.filter(v => Math.abs(v.text_uthmani.split(' ').length - (correctVerse.text_uthmani||'').split(' ').length) <= 2);
        similar2.sort(() => Math.random() - 0.5);
        for (let v of similar2) {
            if (options.length < targetOptionsCount && !options.some(o => o.id === v.id)) options.push(v);
        }
    }

    if (options.length < targetOptionsCount) {
        availableDistractors.sort(() => Math.random() - 0.5);
        for (let v of availableDistractors) {
            if (options.length < targetOptionsCount && !options.some(o => o.id === v.id)) options.push(v);
        }
    }
    
    options.sort(() => Math.random() - 0.5); 

    options.forEach(option => {
        const btn = document.createElement('button'); btn.classList.add('option-btn');
        btn.innerHTML = cleanVerseText((useTajweed && option.text_uthmani_tajweed) ? option.text_uthmani_tajweed : option.text_uthmani);
        const displayCorrectText = (useTajweed && correctVerse.text_uthmani_tajweed) ? correctVerse.text_uthmani_tajweed : correctVerse.text_uthmani;
        btn.onclick = () => checkAnswer(option.id, correctVerse.id, displayCorrectText, audioUrl, correctVerse.verse_key);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedId, correctId, correctText, audioUrl, verseKey) {
    if (selectedId === correctId) {
        checkAndUpdateStreak();

        if (!madeMistake) {
            if (userMistakes[verseKey]) userMistakes[verseKey] = Math.max(0, userMistakes[verseKey] - 1);
            userStats.correctFirstTry++;
            score++;
        }
        
        userStats.totalAnswered++;
        if(isExamMode) sessionTotalAnswered++; 
        saveStats();

        feedbackEl.style.color = "var(--primary-color)"; feedbackEl.innerText = t('goodAnswer');

        const arabicVerseNum = toArabicNumber(verseKey.split(':')[1]);
        let cleanCorrectText = cleanVerseText(correctText); 
        
        const verseSpan = document.createElement('span');
        verseSpan.innerHTML = cleanCorrectText + ' <span style="font-family: \'Amiri\', \'Traditional Arabic\', serif;">۝' + arabicVerseNum + '</span> ';
        quranPageDiv.appendChild(verseSpan);

        replayAudioBtn.style.display = 'none';

        if (currentAudio) currentAudio.pause(); 
        if (audioUrl) {
            currentAudio = new Audio(audioUrl);
            currentAudio.play().catch(e => console.log("Audio bloqué :", e));
        }

        currentVerseIndex++;
        setTimeout(() => generateQuestion(), isExamMode ? 1500 : 1000);
    } else {
        feedbackEl.style.color = "#ef4444"; feedbackEl.innerText = t('badAnswer'); 
        if (!madeMistake) { 
            userMistakes[verseKey] = (userMistakes[verseKey] || 0) + 1;
            saveStats();
        }
        madeMistake = true;
    }
}

initApp();
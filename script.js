// Deklarasi Variabel Global
let parsedNames = [];
let generatedTextOutput = "";

// Element DOM
const fileInput = document.getElementById('fileInput');
const fileStatus = document.getElementById('fileStatus');
const nameList = document.getElementById('nameList');
const nameCount = document.getElementById('nameCount');
const groupCountInput = document.getElementById('groupCount');
const generateBtn = document.getElementById('generateBtn');
const errorMessage = document.getElementById('errorMessage');
const resultsContainer = document.getElementById('resultsContainer');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

// Event 1: Membaca file saat diupload
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileStatus.textContent = file.name;
    fileStatus.classList.add('text-brand-600', 'font-medium');

    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        // Bersihkan dan ambil data nama (hapus baris kosong)
        parsedNames = text.split(/\r?\n/).map(name => name.trim()).filter(name => name !== "");
        
        updateNamePreview();
    };
    reader.readAsText(file);
});

// Memperbarui daftar nama di UI sebelah kiri
function updateNamePreview() {
    nameCount.textContent = `${parsedNames.length} nama`;
    nameList.innerHTML = ""; // Bersihkan list

    if (parsedNames.length === 0) {
        nameList.innerHTML = `<li class="text-slate-400 text-sm text-center py-8 italic border-2 border-dashed border-slate-100 rounded-xl">File kosong atau format salah.</li>`;
        return;
    }

    // Buat list nama menggunakan class Tailwind dari safelist
    parsedNames.forEach((name, index) => {
        const li = document.createElement('li');
        li.className = "py-2.5 px-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm flex items-center gap-3 transition-colors hover:bg-slate-100";
        
        li.innerHTML = `
            <span class="w-6 h-6 flex justify-center items-center bg-slate-200 text-slate-500 rounded-md text-xs font-medium">${index + 1}</span>
            <span class="truncate">${name}</span>
        `;
        nameList.appendChild(li);
    });
}

// Event 2: Klik Tombol "Bagi Kelompok"
generateBtn.addEventListener('click', () => {
    const groupCount = parseInt(groupCountInput.value);

    // Validasi input
    if (parsedNames.length === 0) {
        showError("Silakan upload file .txt terlebih dahulu.");
        return;
    }
    if (isNaN(groupCount) || groupCount < 1) {
        showError("Masukkan jumlah kelompok yang valid (minimal 1).");
        return;
    }
    if (groupCount > parsedNames.length) {
        showError("Jumlah kelompok tidak boleh lebih dari jumlah nama yang ada.");
        return;
    }

    hideError();
    processAndRenderGroups(groupCount);
});

// Proses pengacakan dan rendering kelompok
function processAndRenderGroups(groupCount) {
    // 1. Acak nama menggunakan Fisher-Yates Shuffle
    let shuffledNames = [...parsedNames];
    for (let i = shuffledNames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
    }

    // 2. Siapkan array kelompok
    const groups = Array.from({ length: groupCount }, () => []);

    // 3. Bagikan secara merata (Round-Robin)
    shuffledNames.forEach((name, index) => {
        groups[index % groupCount].push(name);
    });

    // 4. Render Hasil ke UI & Siapkan Teks untuk Fitur Salin
    resultsContainer.innerHTML = "";
    generatedTextOutput = "";

    groups.forEach((group, index) => {
        // Teks untuk disalin
        generatedTextOutput += `Kelompok ${index + 1} - ${group.length} orang\n`;
        group.forEach(name => {
            generatedTextOutput += `- ${name}\n`;
        });
        generatedTextOutput += `\n`;

        // Render card UI HTML untuk setiap kelompok
        let listHTML = "";
        group.forEach(name => {
            listHTML += `<li class="flex items-start gap-2 before:content-['•'] before:text-brand-400 before:font-bold text-sm text-slate-700">${name}</li>`;
        });

        const card = document.createElement('div');
        card.className = "bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col border border-slate-200";
        card.innerHTML = `
            <div class="bg-brand-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between">
                <h3 class="font-bold text-brand-700">Kelompok ${index + 1}</h3>
                <span class="bg-brand-200 text-brand-800 px-2 py-1 rounded-full text-xs font-semibold">${group.length} orang</span>
            </div>
            <div class="p-5 flex-1">
                <ul class="space-y-2">
                    ${listHTML}
                </ul>
            </div>
        `;
        resultsContainer.appendChild(card);
    });

    // Tampilkan tombol Salin Hasil
    copyBtn.classList.remove('hidden');
}

// Event 3: Fitur Salin Teks
copyBtn.addEventListener('click', () => {
    if (generatedTextOutput) {
        navigator.clipboard.writeText(generatedTextOutput.trim()).then(() => {
            showToast();
        }).catch(err => {
            alert("Gagal menyalin teks: " + err);
        });
    }
});

// Fungsi Bantuan UI
function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = "";
}

function showToast() {
    // Menampilkan toast menggunakan class Tailwind
    toast.classList.remove('opacity-0', 'translate-y-20', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    
    // Sembunyikan setelah 3 detik
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-20', 'pointer-events-none');
        toast.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }, 3000);
}

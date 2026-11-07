// ==========================================
// 1. DEKLARASI VARIABEL GLOBAL & DOM
// ==========================================
let parsedNames = [];
let generatedGroupsData = [];
let generatedTextOutput = "";
let draggedItem = null; 

const fileInput = document.getElementById('fileInput');
const fileStatus = document.getElementById('fileStatus');
const nameList = document.getElementById('nameList');
const nameCount = document.getElementById('nameCount');

const groupMode = document.getElementById('groupMode'); 
const groupCountInput = document.getElementById('groupCount');
const groupHelpText = document.getElementById('groupHelpText'); 

const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const errorMessage = document.getElementById('errorMessage');
const resultsContainer = document.getElementById('resultsContainer');
const copyBtn = document.getElementById('copyBtn');
const downloadExcelBtn = document.getElementById('downloadExcelBtn');
const downloadImageBtn = document.getElementById('downloadImageBtn'); 
const toast = document.getElementById('toast');
const dropZone = document.getElementById('dropZone');

const generateIcon = document.getElementById('generateIcon');
const loadingIcon = document.getElementById('loadingIcon');
const generateText = document.getElementById('generateText');

// ==========================================
// 2. FUNGSI BANTUAN UI
// ==========================================
function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}
function hideError() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = "";
}
function showToast() {
    toast.classList.remove('opacity-0', 'translate-y-20', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-20', 'pointer-events-none');
        toast.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }, 3000);
}

// ==========================================
// 3. LOGIKA DROPDOWN MODE KELOMPOK
// ==========================================
groupMode.addEventListener('change', () => {
    groupCountInput.value = "";
    if (groupMode.value === 'groupCount') {
        groupCountInput.placeholder = "Contoh: 5";
        groupHelpText.textContent = "Tentukan sistem ingin membuat berapa kelompok.";
    } else {
        groupCountInput.placeholder = "Contoh: 4";
        groupHelpText.textContent = "Tentukan setiap kelompok berisi berapa orang.";
    }
    
    // FIX: Tambahkan w-full agar posisinya pas di tengah layar pembagian
    resultsContainer.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 w-full animate-fade-in-up">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-16 h-16 mb-4 text-slate-300">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p>Mode diubah. Silakan masukkan angka baru dan klik "Bagi Kelompok".</p>
        </div>
    `;
    
    copyBtn.classList.add('hidden');
    downloadExcelBtn.classList.add('hidden');
    if(downloadImageBtn) downloadImageBtn.classList.add('hidden'); 
    hideError();
});

// ==========================================
// 4. LOGIKA UPLOAD & HAPUS NAMA (INLINE DELETE)
// ==========================================
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        const rawNames = text.split(/\r?\n/).map(name => name.trim()).filter(name => name !== "");
        
        parsedNames = [...new Set(rawNames)];
        const duplicateCount = rawNames.length - parsedNames.length;

        if (duplicateCount > 0) {
            fileStatus.textContent = `${file.name} (${duplicateCount} duplikat dihapus)`;
        } else {
            fileStatus.textContent = file.name;
        }
        fileStatus.classList.add('text-brand-600', 'font-medium');
        updateNamePreview();
    };
    reader.readAsText(file);
});

function updateNamePreview() {
    nameCount.textContent = `${parsedNames.length} nama`;
    nameList.innerHTML = ""; 

    if (parsedNames.length === 0) {
        nameList.innerHTML = `<li class="text-slate-400 text-sm text-center py-8 italic border-2 border-dashed border-slate-100 rounded-xl">File kosong atau semua nama telah dihapus.</li>`;
        return;
    }

    parsedNames.forEach((name, index) => {
        const li = document.createElement('li');
        li.className = "py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm flex items-center justify-between transition-colors hover:bg-slate-100 group";
        
        li.innerHTML = `
            <div class="flex items-center gap-3 overflow-hidden">
                <span class="min-w-[24px] h-6 flex justify-center items-center bg-slate-200 text-slate-500 rounded-md text-xs font-medium">${index + 1}</span>
                <span class="truncate" title="${name}">${name}</span>
            </div>
            <button class="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100" onclick="removeName(${index})" title="Hapus nama ini">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
        nameList.appendChild(li);
    });
}

window.removeName = function(index) {
    parsedNames.splice(index, 1);
    updateNamePreview();

    if (generatedGroupsData.length > 0) {
        // FIX: Tambahkan w-full
        resultsContainer.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 w-full animate-fade-in-up">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mb-4 text-amber-300">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="text-amber-600 font-semibold">Daftar Nama Telah Diubah!</p>
                <p class="text-sm mt-1 text-center">Ada nama yang baru saja dihapus.<br>Silakan klik tombol <b>"Bagi Kelompok"</b> lagi untuk memperbarui hasil.</p>
            </div>
        `;
        
        copyBtn.classList.add('hidden');
        downloadExcelBtn.classList.add('hidden');
        if(downloadImageBtn) downloadImageBtn.classList.add('hidden');
        
        generatedGroupsData = [];
        generatedTextOutput = "";
    }
};

// ==========================================
// 5. PENGACAKAN KELOMPOK (DENGAN DRAG & DROP UI)
// ==========================================
generateBtn.addEventListener('click', () => {
    const inputValue = parseInt(groupCountInput.value);
    const mode = groupMode.value;

    if (parsedNames.length === 0) { showError("Silakan upload file .txt terlebih dahulu."); return; }
    if (isNaN(inputValue) || inputValue < 1) { showError("Masukkan angka yang valid (minimal 1)."); return; }
    if (mode === 'groupCount' && inputValue > parsedNames.length) { showError("Jumlah kelompok tidak boleh lebih dari jumlah nama yang ada."); return; }
    if (mode === 'memberCount' && inputValue > parsedNames.length) { showError("Jumlah anggota per kelompok tidak boleh lebih besar dari total nama."); return; }

    hideError();
    startLoadingState();

    setTimeout(() => {
        processAndRenderGroups(inputValue, mode);
        stopLoadingState();
    }, 1200);
});

function startLoadingState() {
    generateBtn.disabled = true;
    generateBtn.classList.add('opacity-80', 'cursor-not-allowed');
    generateIcon.classList.add('hidden');
    loadingIcon.classList.remove('hidden');
    generateText.textContent = "Mengacak Data...";
    resultsContainer.classList.add('opacity-30');
}

function stopLoadingState() {
    generateBtn.disabled = false;
    generateBtn.classList.remove('opacity-80', 'cursor-not-allowed');
    loadingIcon.classList.add('hidden');
    generateIcon.classList.remove('hidden');
    generateText.textContent = "Bagi Kelompok";
    resultsContainer.classList.remove('opacity-30');
}

function processAndRenderGroups(inputValue, mode) {
    let shuffledNames = [...parsedNames];
    for (let i = shuffledNames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
    }

    let groups = [];
    if (mode === 'groupCount') {
        groups = Array.from({ length: inputValue }, () => []);
        shuffledNames.forEach((name, index) => {
            groups[index % inputValue].push(name);
        });
    } else if (mode === 'memberCount') {
        for (let i = 0; i < shuffledNames.length; i += inputValue) {
            groups.push(shuffledNames.slice(i, i + inputValue));
        }
    }

    resultsContainer.innerHTML = "";
    generatedTextOutput = "";
    generatedGroupsData = groups; 

    groups.forEach((group, index) => {
        let listHTML = "";
        group.forEach(name => {
            listHTML += `<li class="draggable-item cursor-grab active:cursor-grabbing flex items-start gap-2 before:content-['•'] before:text-brand-400 before:font-bold text-sm text-slate-700 hover:bg-slate-50 rounded p-1 transition-colors -ml-1" draggable="true">${name}</li>`;
        });

        const card = document.createElement('div');
        card.className = "group-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 opacity-0 animate-fade-in-up transition-all";
        card.style.animationDelay = `${index * 0.1}s`; 
        card.innerHTML = `
            <div class="bg-brand-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between transition-colors duration-300">
                <h3 class="font-bold text-brand-700">Kelompok <span class="group-number">${index + 1}</span></h3>
                <span class="member-count bg-brand-200 text-brand-800 px-2 py-1 rounded-full text-xs font-semibold">${group.length} orang</span>
            </div>
            <div class="drop-zone-container p-5 flex-1 transition-colors duration-300 rounded-b-2xl">
                <ul class="drop-zone space-y-2 min-h-[50px] h-full">
                    ${listHTML}
                </ul>
            </div>
        `;
        resultsContainer.appendChild(card);
    });

    syncDataFromUI(); 
    
    copyBtn.classList.remove('hidden');
    downloadExcelBtn.classList.remove('hidden');
    if(downloadImageBtn) downloadImageBtn.classList.remove('hidden');

    attachGroupDragAndDrop(); 
}

// ==========================================
// 6. LOGIKA DRAG & DROP & SINKRONISASI
// ==========================================
function attachGroupDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable-item');
    const dropZones = document.querySelectorAll('.drop-zone');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', function() {
            draggedItem = this;
            setTimeout(() => this.classList.add('opacity-50'), 0);
        });
        draggable.addEventListener('dragend', function() {
            this.classList.remove('opacity-50');
            draggedItem = null;
            syncDataFromUI(); 
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.parentElement.classList.add('bg-brand-100', 'ring-2', 'ring-brand-500');
        });
        zone.addEventListener('dragleave', function() {
            this.parentElement.classList.remove('bg-brand-100', 'ring-2', 'ring-brand-500');
        });
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.parentElement.classList.remove('bg-brand-100', 'ring-2', 'ring-brand-500');
            if (draggedItem) {
                this.appendChild(draggedItem);
            }
        });
    });
}

function syncDataFromUI() {
    const groupCards = document.querySelectorAll('.group-card');
    generatedGroupsData = [];
    generatedTextOutput = "";

    groupCards.forEach((card, index) => {
        const items = card.querySelectorAll('.draggable-item');
        const countBadge = card.querySelector('.member-count');
        let currentNames = [];
        
        items.forEach(item => {
            currentNames.push(item.textContent.trim());
        });

        countBadge.textContent = `${currentNames.length} orang`;
        generatedGroupsData.push(currentNames);

        generatedTextOutput += `Kelompok ${index + 1} - ${currentNames.length} orang\n`;
        currentNames.forEach(name => { generatedTextOutput += `- ${name}\n`; });
        generatedTextOutput += `\n`;
    });
}

// ==========================================
// 7. COPY, EXCEL, & GAMBAR
// ==========================================
copyBtn.addEventListener('click', () => {
    if (generatedTextOutput) {
        navigator.clipboard.writeText(generatedTextOutput.trim()).then(() => {
            showToast();
        }).catch(err => { alert("Gagal menyalin teks: " + err); });
    }
});

downloadExcelBtn.addEventListener('click', () => {
    if (generatedGroupsData.length === 0) return;
    const excelData = [];
    const headers = generatedGroupsData.map((_, index) => `Kelompok ${index + 1}`);
    excelData.push(headers);
    const maxMembers = Math.max(...generatedGroupsData.map(group => group.length));
    
    for (let i = 0; i < maxMembers; i++) {
        const row = [];
        for (let j = 0; j < generatedGroupsData.length; j++) {
            row.push(generatedGroupsData[j][i] || "");
        }
        excelData.push(row);
    }
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Pembagian");
    XLSX.writeFile(workbook, "Hasil_Pembagian_Kelompok.xlsx");
});

if(downloadImageBtn) {
    downloadImageBtn.addEventListener('click', () => {
        if (generatedGroupsData.length === 0) return;

        const originalContent = downloadImageBtn.innerHTML;
        downloadImageBtn.innerHTML = "Memproses...";
        
        // FIX: Scroll dipaksa ke atas sementara agar html2canvas tidak memotong grid
        const currentScroll = window.scrollY;
        window.scrollTo(0, 0);

        // FIX: Foto kotak putih besarnya (parent), bukan cuma isi dalamnya
        const exportArea = resultsContainer.parentElement;
        
        // Sembunyikan tombol-tombol sebentar biar nggak ikut ke-screenshot
        const actionButtons = copyBtn.parentElement;
        if (actionButtons) actionButtons.style.display = 'none';
        
        html2canvas(exportArea, {
            backgroundColor: "#ffffff", 
            scale: 2, 
            scrollY: 0,
            useCORS: true
        }).then(canvas => {
            const imageURL = canvas.toDataURL("image/png");
            const downloadLink = document.createElement('a');
            downloadLink.href = imageURL;
            downloadLink.download = "Hasil_Kelompok.png";
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Kembalikan kondisi web seperti semula
            if (actionButtons) actionButtons.style.display = '';
            window.scrollTo(0, currentScroll);
            downloadImageBtn.innerHTML = originalContent;
        }).catch(err => {
            alert("Gagal membuat gambar: " + err);
            if (actionButtons) actionButtons.style.display = '';
            window.scrollTo(0, currentScroll);
            downloadImageBtn.innerHTML = originalContent;
        });
    });
}

// ==========================================
// 8. RESET DATA
// ==========================================
resetBtn.addEventListener('click', () => {
    parsedNames = [];
    generatedGroupsData = [];
    generatedTextOutput = "";
    
    fileInput.value = ""; 
    fileStatus.textContent = "Belum ada file terpilih";
    fileStatus.classList.remove('text-brand-600', 'font-medium');
    groupMode.value = "groupCount";
    groupCountInput.value = "";
    groupCountInput.placeholder = "Contoh: 5";
    groupHelpText.textContent = "Tentukan sistem ingin membuat berapa kelompok.";
    hideError();

    nameCount.textContent = "0 nama";
    nameList.innerHTML = `<li class="text-slate-400 text-sm text-center py-8 italic border-2 border-dashed border-slate-100 rounded-xl">Nama-nama akan muncul di sini setelah file diupload.</li>`;
    
    // FIX: Tambahkan w-full
    resultsContainer.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 w-full animate-fade-in-up">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-16 h-16 mb-4 text-slate-300">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p>Belum ada kelompok yang dibagikan.</p>
        </div>
    `;
    
    copyBtn.classList.add('hidden');
    downloadExcelBtn.classList.add('hidden');
    if(downloadImageBtn) downloadImageBtn.classList.add('hidden');
});

// ==========================================
// 9. UPLOAD FILE DRAG AND DROP (AREA KIRI)
// ==========================================
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    window.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); }, false);
});
dropZone.addEventListener('dragover', () => {
    dropZone.classList.remove('border-slate-300', 'bg-slate-50', 'border-dashed');
    dropZone.classList.add('border-brand-500', 'bg-brand-50', 'border-solid');
});
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-brand-500', 'bg-brand-50', 'border-solid');
    dropZone.classList.add('border-slate-300', 'bg-slate-50', 'border-dashed');
});
dropZone.addEventListener('drop', (e) => {
    dropZone.classList.remove('border-brand-500', 'bg-brand-50', 'border-solid');
    dropZone.classList.add('border-slate-300', 'bg-slate-50', 'border-dashed');
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
        if (files[0].type === "text/plain" || files[0].name.endsWith('.txt')) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[0]);
            fileInput.files = dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        } else {
            showError("Format file tidak didukung. Harap upload file berekstensi .txt");
        }
    }
});

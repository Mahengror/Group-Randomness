// Global State
let namesList = [];
let groupedResults = [];

// DOM Elements
const fileInput = document.getElementById('fileInput');
const fileStatus = document.getElementById('fileStatus');
const nameListEl = document.getElementById('nameList');
const nameCountEl = document.getElementById('nameCount');
const groupCountInput = document.getElementById('groupCount');
const generateBtn = document.getElementById('generateBtn');
const resultsContainer = document.getElementById('resultsContainer');
const errorMessage = document.getElementById('errorMessage');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

// File Upload Handler
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check extension
    if (!file.name.endsWith('.txt')) {
        showError('Tolong upload file dengan format .txt');
        return;
    }

    fileStatus.textContent = file.name;
    hideError();

    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        // Parse text: split by newline, trim whitespace, remove empty lines
        namesList = text.split(/\r?\n/)
                        .map(name => name.trim())
                        .filter(name => name.length > 0);
        
        renderNameList();
    };
    reader.onerror = function() {
        showError('Gagal membaca file.');
    };
    reader.readAsText(file);
});

// Render uploaded names in the preview panel
function renderNameList() {
    nameListEl.innerHTML = '';
    nameCountEl.textContent = `${namesList.length} nama`;

    if (namesList.length === 0) {
        nameListEl.innerHTML = '<li class="text-slate-400 text-sm text-center py-8 italic border-2 border-dashed border-slate-100 rounded-xl">File kosong atau tidak berisi teks yang valid.</li>';
        return;
    }

    // Create list items
    namesList.forEach((name, index) => {
        const li = document.createElement('li');
        li.className = 'py-2.5 px-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm flex items-center gap-3 transition-colors hover:bg-slate-100';
        
        const badge = document.createElement('span');
        badge.className = 'w-6 h-6 flex items-center justify-center bg-slate-200 text-slate-500 rounded-md text-xs font-medium';
        badge.textContent = index + 1;
        
        const nameText = document.createElement('span');
        nameText.className = 'font-medium truncate';
        nameText.textContent = name;

        li.appendChild(badge);
        li.appendChild(nameText);
        nameListEl.appendChild(li);
    });
}

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Generate Groups Logic
generateBtn.addEventListener('click', function() {
    const groupCountStr = groupCountInput.value;
    const groupCount = parseInt(groupCountStr);

    // Validation
    if (namesList.length === 0) {
        showError('Silakan upload file .txt berisi daftar nama terlebih dahulu.');
        return;
    }
    if (!groupCountStr || isNaN(groupCount) || groupCount < 1) {
        showError('Masukkan jumlah kelompok yang valid (minimal 1).');
        return;
    }
    if (groupCount > namesList.length) {
        showError(`Jumlah kelompok (${groupCount}) tidak boleh lebih besar dari total nama (${namesList.length}).`);
        return;
    }

    hideError();

    // 1. Copy and Shuffle the names
    const shuffledNames = shuffleArray([...namesList]);
    
    // 2. Initialize empty groups
    groupedResults = Array.from({ length: groupCount }, () => []);

    // 3. Distribute names evenly
    // Using modulo operator guarantees even distribution of remainder
    for (let i = 0; i < shuffledNames.length; i++) {
        groupedResults[i % groupCount].push(shuffledNames[i]);
    }

    // 4. Render Results
    renderResults();
});

// Render Results in Cards
function renderResults() {
    resultsContainer.innerHTML = '';
    
    if (groupedResults.length > 0) {
        copyBtn.classList.remove('hidden');
    }

    groupedResults.forEach((group, index) => {
        // Card container
        const card = document.createElement('div');
        card.className = 'bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col';
        
        // Card Header
        const header = document.createElement('div');
        header.className = 'bg-brand-50 border-b border-slate-100 px-5 py-3 flex justify-between items-center';
        
        const title = document.createElement('h3');
        title.className = 'font-bold text-brand-700';
        title.textContent = `Kelompok ${index + 1}`;
        
        const countBadge = document.createElement('span');
        countBadge.className = 'text-xs font-semibold bg-brand-200 text-brand-800 px-2 py-1 rounded-full';
        countBadge.textContent = `${group.length} Orang`;
        
        header.appendChild(title);
        header.appendChild(countBadge);
        card.appendChild(header);

        // List Container
        const listContainer = document.createElement('div');
        listContainer.className = 'p-5 flex-1';
        
        const ul = document.createElement('ul');
        ul.className = 'space-y-2';

        // Add names to list
        group.forEach(name => {
            const li = document.createElement('li');
            li.className = 'text-slate-700 text-sm flex items-start gap-2 before:content-["•"] before:text-brand-400 before:font-bold';
            li.textContent = name;
            ul.appendChild(li);
        });

        listContainer.appendChild(ul);
        card.appendChild(listContainer);
        
        resultsContainer.appendChild(card);
    });
}

// Copy Text to Clipboard Functionality
copyBtn.addEventListener('click', () => {
    if(groupedResults.length === 0) return;

    let textToCopy = "Hasil Pembagian Kelompok:\n\n";
    groupedResults.forEach((group, index) => {
        textToCopy += `Kelompok ${index + 1} (${group.length} orang):\n`;
        group.forEach(name => {
            textToCopy += `- ${name}\n`;
        });
        textToCopy += "\n";
    });

    // Modern clipboard API fallback to execCommand
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Hasil disalin ke clipboard!');
        }).catch(err => {
            fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
        fallbackCopyTextToClipboard(textToCopy);
    }
});

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast('Hasil disalin ke clipboard!');
    } catch (err) {
        showError('Gagal menyalin teks.');
    }
    document.body.removeChild(textArea);
}

// Helper function to display error messages without using alert()
function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
    // Scroll to error if not in view (useful for mobile)
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
}

function showToast(msg) {
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.textContent = msg;
    
    // Animate in
    toast.classList.remove('translate-y-20', 'opacity-0');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

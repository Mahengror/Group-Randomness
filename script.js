document.addEventListener('DOMContentLoaded', () => {
    const fileUpload = document.getElementById('file-upload');
    const fileStatus = document.getElementById('file-status');
    const groupCountInput = document.getElementById('group-count');
    const generateBtn = document.getElementById('generate-btn');
    const totalNamesDisplay = document.getElementById('total-names');
    const resultsContainer = document.getElementById('results-container');

    let namesArray = [];

    // Menangani unggahan file
    fileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            // Memisahkan berdasarkan baris baru, menghapus spasi kosong, dan membuang baris kosong
            namesArray = content.split(/\r?\n/).map(name => name.trim()).filter(name => name.length > 0);
            
            fileStatus.textContent = `File dimuat: ${file.name} (${namesArray.length} nama)`;
            totalNamesDisplay.textContent = `${namesArray.length} Nama`;
            checkValidity();
        };
        reader.readAsText(file);
    });

    // Validasi input untuk mengaktifkan tombol
    groupCountInput.addEventListener('input', checkValidity);

    function checkValidity() {
        const groupCount = parseInt(groupCountInput.value);
        if (namesArray.length > 0 && groupCount > 0 && groupCount <= namesArray.length) {
            generateBtn.disabled = false;
        } else {
            generateBtn.disabled = true;
        }
    }

    // Algoritma Fisher-Yates untuk mengacak array
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Aksi klik tombol generate
    generateBtn.addEventListener('click', () => {
        const numGroups = parseInt(groupCountInput.value);
        const shuffledNames = shuffleArray(namesArray);
        
        // Inisialisasi array untuk kelompok
        const groups = Array.from({ length: numGroups }, () => []);

        // Distribusi *Round-Robin* (membagikan rata sisa anggota)
        shuffledNames.forEach((name, index) => {
            const groupIndex = index % numGroups;
            groups[groupIndex].push(name);
        });

        renderGroups(groups);
    });

    // Menampilkan hasil ke layar
    function renderGroups(groups) {
        resultsContainer.innerHTML = ''; // Bersihkan hasil sebelumnya

        groups.forEach((group, index) => {
            // Container kelompok
            const groupDiv = document.createElement('div');
            groupDiv.className = 'flex flex-col';

            // Header kelompok
            const header = document.createElement('h3');
            header.className = 'font-serif text-3xl mb-4 text-stone-900 border-b border-stone-800/10 pb-2';
            header.innerHTML = `Kel. ${(index + 1).toString().padStart(2, '0')} <span class="text-sm font-sans text-stone-800/40 ml-2 font-medium tracking-wide uppercase">${group.length} anggota</span>`;
            
            // List nama
            const ul = document.createElement('ul');
            ul.className = 'space-y-2';

            group.forEach(name => {
                const li = document.createElement('li');
                li.className = 'text-stone-800 font-medium py-1';
                li.textContent = name;
                ul.appendChild(li);
            });

            groupDiv.appendChild(header);
            groupDiv.appendChild(ul);
            resultsContainer.appendChild(groupDiv);
        });
    }
});

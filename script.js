document.getElementById('generateBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const groupCountInput = document.getElementById('groupCount');
    
    const file = fileInput.files[0];
    const groupCount = parseInt(groupCountInput.value);

    // Validasi input
    if (!file) {
        alert("Silakan upload file .txt terlebih dahulu!");
        return;
    }
    if (isNaN(groupCount) || groupCount < 1) {
        alert("Masukkan jumlah kelompok yang valid!");
        return;
    }

    // Membaca isi file txt
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        // Pisahkan teks berdasarkan enter (baris baru), hapus spasi, dan saring baris kosong
        const names = text.split(/\r?\n/).map(name => name.trim()).filter(name => name !== "");

        if (names.length === 0) {
            alert("File txt kosong atau format tidak sesuai.");
            return;
        }
        if (groupCount > names.length) {
            alert("Jumlah kelompok tidak boleh lebih besar dari jumlah nama.");
            return;
        }

        processGroups(names, groupCount);
    };
    reader.readAsText(file);
});

function processGroups(names, groupCount) {
    // Mengacak susunan array nama (Algoritma Fisher-Yates)
    for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [names[i], names[j]] = [names[j], names[i]];
    }

    // Menyiapkan array kosong untuk setiap kelompok
    const groups = Array.from({ length: groupCount }, () => []);

    // Membagikan nama satu per satu ke setiap kelompok secara bergiliran (Round-Robin)
    names.forEach((name, index) => {
        groups[index % groupCount].push(name);
    });

    // Format output teks
    let resultText = "";
    groups.forEach((group, index) => {
        resultText += `Kelompok ${index + 1} - ${group.length} orang\n`;
        group.forEach(name => {
            resultText += `- ${name}\n`;
        });
        resultText += `\n`;
    });

    // Menampilkan hasil ke layar
    document.getElementById('resultText').textContent = resultText.trim();
    document.getElementById('outputContainer').classList.remove('hidden');

    // Menyimpan teks untuk fitur copy
    window.generatedText = resultText.trim();
}

// Fitur Copy Teks
document.getElementById('copyBtn').addEventListener('click', () => {
    if (window.generatedText) {
        navigator.clipboard.writeText(window.generatedText).then(() => {
            const btn = document.getElementById('copyBtn');
            btn.textContent = "Berhasil Disalin!";
            setTimeout(() => {
                btn.textContent = "Salin Hasil";
            }, 2000);
        }).catch(err => {
            alert("Gagal menyalin teks: " + err);
        });
    }
});

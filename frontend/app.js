document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const reportInput = document.getElementById('reportInput');
    const resultSection = document.getElementById('resultSection');
    
    const statusValue = document.getElementById('statusValue');
    const statusIcon = document.getElementById('statusIcon');
    const typeValue = document.getElementById('typeValue');
    const typeIcon = document.getElementById('typeIcon');
    const echoText = document.getElementById('echoText');
    const statusBox = document.querySelector('.status-box');

    const API_URL = "http://127.0.0.1:8000/analyze"; // FastAPI default port

    analyzeBtn.addEventListener('click', async () => {
        const text = reportInput.value.trim();
        
        if (!text) {
            alert('Silakan masukkan laporan terlebih dahulu.');
            return;
        }

        // Loading state
        const originalBtnText = analyzeBtn.innerHTML;
        analyzeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menganalisis...';
        analyzeBtn.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ laporan: text })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Update UI with results
            displayResults(data);

        } catch (error) {
            console.error('Error:', error);
            alert('Gagal menghubungi server. Pastikan backend (FastAPI) sudah berjalan.');
        } finally {
            // Restore button state
            analyzeBtn.innerHTML = originalBtnText;
            analyzeBtn.disabled = false;
        }
    });

    function displayResults(data) {
        // Show result section
        resultSection.classList.remove('hidden');
        
        // Echo text
        echoText.textContent = `"${data.laporan}"`;

        // Update Status
        statusValue.textContent = data.status;
        statusBox.className = 'result-box status-box'; // Reset classes
        
        if (data.status === 'Aman') {
            statusBox.classList.add('status-aman');
            statusIcon.className = 'fa-solid fa-shield-check';
        } else if (data.status === 'Waspada') {
            statusBox.classList.add('status-waspada');
            statusIcon.className = 'fa-solid fa-triangle-exclamation';
        } else if (data.status === 'Bahaya') {
            statusBox.classList.add('status-bahaya');
            statusIcon.className = 'fa-solid fa-skull-crossbones';
        }

        // Update Jenis Bencana
        typeValue.textContent = data.jenis_bencana;
        
        if (data.jenis_bencana.toLowerCase() === 'banjir') {
            typeIcon.className = 'fa-solid fa-water';
        } else if (data.jenis_bencana.toLowerCase() === 'longsor') {
            typeIcon.className = 'fa-solid fa-hill-rockslide';
        } else if (data.jenis_bencana.toLowerCase() === 'angin kencang' || data.jenis_bencana.toLowerCase() === 'puting beliung') {
            typeIcon.className = 'fa-solid fa-wind';
        } else {
            typeIcon.className = 'fa-solid fa-cloud-sun';
        }

        // Smooth scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Load semester data from localStorage
    loadSemesterData();
    
    // Calculate button functionality
    document.getElementById('calculate-year').addEventListener('click', calculateYearAverage);
    
    function loadSemesterData() {
        // Load semester 1 data
        const semester1Average = localStorage.getItem('semester1-average') || '0';
        const semester1Credits = localStorage.getItem('semester1-credits') || '0';
        
        // Load semester 2 data
        const semester2Average = localStorage.getItem('semester2-average') || '0';
        const semester2Credits = localStorage.getItem('semester2-credits') || '0';
        
        // Display semester data
        document.getElementById('semester1-average').textContent = semester1Average;
        document.getElementById('semester1-credits').textContent = semester1Credits;
        document.getElementById('semester2-average').textContent = semester2Average;
        document.getElementById('semester2-credits').textContent = semester2Credits;
        
        // Calculate year average on load
        calculateYearAverage();
    }
    
    function calculateYearAverage() {
        const s1Mark = parseFloat(document.getElementById('semester1-average').textContent) || 0;
        const s1Cred = parseInt(document.getElementById('semester1-credits').textContent) || 0;
        const s2Mark = parseFloat(document.getElementById('semester2-average').textContent) || 0;
        const s2Cred = parseInt(document.getElementById('semester2-credits').textContent) || 0;
        
        // In Algerian university system, year average is calculated as:
        // (S1_average + S2_average) / 2
        // Credits are simply added together
        const yearAverage = ((s1Mark + s2Mark) / 2).toFixed(2);
        const totalCredits = s1Cred + s2Cred;
        
        // Display results
        document.getElementById('year-average').textContent = yearAverage;
        document.getElementById('year-credits').textContent = totalCredits;
        
        // Save to localStorage
        localStorage.setItem('year-average', yearAverage);
        localStorage.setItem('year-credits', totalCredits);
    }
});


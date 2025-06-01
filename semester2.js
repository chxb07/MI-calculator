document.addEventListener('DOMContentLoaded', function() {
    const moduleRows = document.querySelectorAll('.module-row');
    const unitRows = document.querySelectorAll('.unit-row');
    const semesterTotalRow = document.querySelector('.semester-total-row');
    const calculateBtn = document.getElementById('calculate');
    
    // Add event listeners to all inputs
    const allInputs = document.querySelectorAll('.note-input');
    allInputs.forEach(input => {
        input.addEventListener('input', validateInput);
    });
    
    // Validate input function
    function validateInput(e) {
        const input = e.target;
        const value = parseFloat(input.value);
        
        if (isNaN(value)) {
            input.value = '';
        } else {
            if (value < 0) input.value = 0;
            if (value > 20) input.value = 20;
        }
    }
    
    // Calculate button functionality
    calculateBtn.addEventListener('click', calculateAll);
    
    function calculateAll() {
        // Calculate module averages
        moduleRows.forEach(row => {
            calculateModuleAverage(row);
        });
        
        // Calculate unit averages
        unitRows.forEach(row => {
            calculateUnitAverage(row);
        });
        
        // Calculate semester average
        calculateSemesterAverage();
    }
    
    function calculateModuleAverage(moduleRow) {
        const inputs = moduleRow.querySelectorAll('.note-input');
        const moyenneCol = moduleRow.querySelector('.moyenne-col');
        const credModCol = moduleRow.querySelector('.cred-mod-col');
        const coef = parseFloat(moduleRow.querySelector('.coef-col').textContent);
        const cred = parseFloat(moduleRow.querySelector('.cred-col').textContent);
        
        // Algerian university calculation method
        let tdMark = 0;
        let tpMark = 0;
        let examMark = 0;
        let hasTD = false;
        let hasTP = false;
        let hasExam = false;
        
        inputs.forEach(input => {
            if (input.classList.contains('td-input') && input.value) {
                tdMark = parseFloat(input.value);
                hasTD = true;
            }
            if (input.classList.contains('tp-input') && input.value) {
                tpMark = parseFloat(input.value);
                hasTP = true;
            }
            if (input.classList.contains('exam-input') && input.value) {
                examMark = parseFloat(input.value);
                hasExam = true;
            }
        });
        
        let average = 0;
        
        if (hasExam) {
            // Correct Algerian university calculation: 40% TD/TP + 60% Exam
            if (hasTD && hasTP) {
                // If module has both TD and TP, average them for the 40% component
                const tdTpAverage = (tdMark + tpMark) / 2;
                average = (0.4 * tdTpAverage) + (0.6 * examMark);
            } else if (hasTD) {
                // If module has only TD
                average = (0.4 * tdMark) + (0.6 * examMark);
            } else if (hasTP) {
                // If module has only TP
                average = (0.4 * tpMark) + (0.6 * examMark);
            } else {
                // If module has only Exam
                average = examMark;
            }
            
            moyenneCol.textContent = average.toFixed(2);
            
            // Calculate credits obtained
            if (average >= 10) {
                credModCol.textContent = cred;
            } else {
                credModCol.textContent = '0';
            }
        } else {
            moyenneCol.textContent = '0';
            credModCol.textContent = '0';
        }
    }
    
    function calculateUnitAverage(unitRow) {
        const unitName = unitRow.querySelector('.module-col').textContent;
        const moyenneCol = unitRow.querySelector('.moyenne-col');
        const credModCol = unitRow.querySelector('.cred-mod-col');
        
        let totalWeightedMarks = 0;
        let totalCoef = 0;
        let totalCred = 0;
        
        // Find all module rows until next unit row
        let nextRow = unitRow.nextElementSibling;
        while (nextRow && !nextRow.classList.contains('unit-row') && !nextRow.classList.contains('semester-total-row')) {
            if (nextRow.classList.contains('module-row')) {
                const moduleCoef = parseFloat(nextRow.querySelector('.coef-col').textContent);
                const moduleAvg = parseFloat(nextRow.querySelector('.moyenne-col').textContent);
                const moduleCred = parseFloat(nextRow.querySelector('.cred-mod-col').textContent);
                
                totalWeightedMarks += moduleAvg * moduleCoef;
                totalCoef += moduleCoef;
                totalCred += moduleCred;
            }
            nextRow = nextRow.nextElementSibling;
        }
        
        if (totalCoef > 0) {
            const unitAverage = totalWeightedMarks / totalCoef;
            moyenneCol.textContent = unitAverage.toFixed(2);
            
            // In Algerian system, if unit average >= 10, all modules in the unit get their credits
            // even if some modules have mark < 10
            if (unitAverage >= 10) {
                let unitTotalCred = 0;
                nextRow = unitRow.nextElementSibling;
                while (nextRow && !nextRow.classList.contains('unit-row') && !nextRow.classList.contains('semester-total-row')) {
                    if (nextRow.classList.contains('module-row')) {
                        const moduleCred = parseFloat(nextRow.querySelector('.cred-col').textContent);
                        unitTotalCred += moduleCred;
                        nextRow.querySelector('.cred-mod-col').textContent = moduleCred;
                    }
                    nextRow = nextRow.nextElementSibling;
                }
                credModCol.textContent = unitTotalCred;
            } else {
                credModCol.textContent = totalCred;
            }
        } else {
            moyenneCol.textContent = '0';
            credModCol.textContent = '0';
        }
    }
    
    function calculateSemesterAverage() {
        const moyenneCol = semesterTotalRow.querySelector('.moyenne-col');
        const credModCol = semesterTotalRow.querySelector('.cred-mod-col');
        
        let totalWeightedMarks = 0;
        let totalCoef = 0;
        let totalCred = 0;
        
        // Calculate using module averages and their coefficients
        moduleRows.forEach(row => {
            const moduleCoef = parseFloat(row.querySelector('.coef-col').textContent);
            const moduleAvg = parseFloat(row.querySelector('.moyenne-col').textContent);
            const moduleCred = parseFloat(row.querySelector('.cred-mod-col').textContent);
            
            totalWeightedMarks += moduleAvg * moduleCoef;
            totalCoef += moduleCoef;
            totalCred += moduleCred;
        });
        
        if (totalCoef > 0) {
            const semesterAverage = totalWeightedMarks / totalCoef;
            moyenneCol.textContent = semesterAverage.toFixed(2);
            credModCol.textContent = totalCred;
            
            // Save to localStorage for year calculator
            localStorage.setItem('semester2-average', semesterAverage.toFixed(2));
            localStorage.setItem('semester2-credits', totalCred);
        } else {
            moyenneCol.textContent = '0';
            credModCol.textContent = '0';
        }
    }
    
    // Load saved data if available
    function loadSavedData() {
        const savedData = localStorage.getItem('semester2-data');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                // Implementation for loading saved data can be added here
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }
});


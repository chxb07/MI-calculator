document.addEventListener('DOMContentLoaded', function() {
    let subjectCount = 1;
    const currentPage = window.location.pathname.split('/').pop();
    const storageKey = currentPage.replace('.html', '-data');
    
    // Load saved data if available
    loadSavedData();
    
    // Add subject button functionality
    document.getElementById('add-subject').addEventListener('click', function() {
        subjectCount++;
        
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        formGroup.dataset.subject = subjectCount;
        
        formGroup.innerHTML = `
            <label for="subject${subjectCount}">Subject ${subjectCount}</label>
            <input type="number" id="subject${subjectCount}-mark" placeholder="Mark" min="0" max="20" step="0.01">
            <input type="number" id="subject${subjectCount}-coef" placeholder="Coefficient" min="1" step="1" value="1">
            <button class="remove-subject btn">Remove</button>
        `;
        
        // Insert before the "Add Subject" button
        document.getElementById('add-subject').before(formGroup);
        
        // Add remove functionality
        formGroup.querySelector('.remove-subject').addEventListener('click', function() {
            formGroup.remove();
            saveData();
        });
        
        // Add input event listeners for auto-save
        const inputs = formGroup.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', validateInput);
            input.addEventListener('change', saveData);
        });
    });
    
    // Add input validation and auto-save to existing inputs
    const initialInputs = document.querySelectorAll('input');
    initialInputs.forEach(input => {
        input.addEventListener('input', validateInput);
        input.addEventListener('change', saveData);
    });
    
    // Validate input function
    function validateInput(e) {
        const input = e.target;
        const value = parseFloat(input.value);
        
        if (input.id.includes('-mark')) {
            if (value < 0) input.value = 0;
            if (value > 20) input.value = 20;
        } else if (input.id.includes('-coef')) {
            if (value < 1) input.value = 1;
        }
    }
    
    // Calculate button functionality
    document.getElementById('calculate').addEventListener('click', function() {
        let totalWeightedMarks = 0;
        let totalCoefficients = 0;
        let allFormGroups = document.querySelectorAll('.form-group');
        
        allFormGroups.forEach(group => {
            const markInput = group.querySelector('input[id$="-mark"]');
            const coefInput = group.querySelector('input[id$="-coef"]');
            
            if (markInput && coefInput && markInput.value && coefInput.value) {
                const mark = parseFloat(markInput.value);
                const coef = parseInt(coefInput.value);
                
                totalWeightedMarks += mark * coef;
                totalCoefficients += coef;
            }
        });
        
        // Calculate and display average
        if (totalCoefficients > 0) {
            const average = (totalWeightedMarks / totalCoefficients).toFixed(2);
            document.getElementById('average').textContent = average;
            
            // Save the calculated average
            localStorage.setItem(`${storageKey}-average`, average);
        } else {
            document.getElementById('average').textContent = "Please enter valid marks";
        }
        
        saveData();
    });
    
    // Save data to localStorage
    function saveData() {
        const data = {
            subjects: []
        };
        
        const allFormGroups = document.querySelectorAll('.form-group');
        allFormGroups.forEach(group => {
            const markInput = group.querySelector('input[id$="-mark"]');
            const coefInput = group.querySelector('input[id$="-coef"]');
            
            if (markInput && coefInput) {
                data.subjects.push({
                    mark: markInput.value,
                    coef: coefInput.value
                });
            }
        });
        
        localStorage.setItem(storageKey, JSON.stringify(data));
    }
    
    // Load saved data from localStorage
    function loadSavedData() {
        const savedData = localStorage.getItem(storageKey);
        const savedAverage = localStorage.getItem(`${storageKey}-average`);
        
        if (savedAverage) {
            document.getElementById('average').textContent = savedAverage;
        }
        
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Remove the initial form group
            const initialFormGroup = document.querySelector('.form-group');
            if (initialFormGroup) {
                initialFormGroup.remove();
            }
            
            // Add form groups for each saved subject
            data.subjects.forEach((subject, index) => {
                subjectCount = index + 1;
                
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';
                formGroup.dataset.subject = subjectCount;
                
                const removeButton = subjectCount > 1 ? '<button class="remove-subject btn">Remove</button>' : '';
                
                formGroup.innerHTML = `
                    <label for="subject${subjectCount}">Subject ${subjectCount}</label>
                    <input type="number" id="subject${subjectCount}-mark" placeholder="Mark" min="0" max="20" step="0.01" value="${subject.mark}">
                    <input type="number" id="subject${subjectCount}-coef" placeholder="Coefficient" min="1" step="1" value="${subject.coef}">
                    ${removeButton}
                `;
                
                // Insert before the "Add Subject" button
                document.getElementById('add-subject').before(formGroup);
                
                // Add remove functionality if button exists
                const removeBtn = formGroup.querySelector('.remove-subject');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        formGroup.remove();
                        saveData();
                    });
                }
                
                // Add input event listeners
                const inputs = formGroup.querySelectorAll('input');
                inputs.forEach(input => {
                    input.addEventListener('input', validateInput);
                    input.addEventListener('change', saveData);
                });
            });
        }
    }
});

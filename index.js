document.addEventListener("DOMContentLoaded", () => {
    const classEntries = document.getElementById("class-entries");
    const addClassButton = document.getElementById("add-class");
    const calculateGPAButton = document.getElementById("calculate-gpa");
    const gpaResult = document.getElementById("gpa-result");

    fetch('classes.json')
        .then((response) => response.json())
        .then((classes) => {
            const classSelect = document.getElementById('class-select');
            
            classes.forEach((cls) => {
                const option = document.createElement('option');
                option.value = JSON.stringify(cls);
                option.textContent = '${cls.name} (${cls.type})';
                classSelect.appendChild(option);
            });
        });

    document.getElementById('add-class-btn').addEventListener('click', () => {
        const selectedClass = document.getElementById('class-select').value;

        if (selectedClass) {
            const classData = JSON.parse(selectedClass);
            console.log('Added Class: ', classData);
        } else {
            alert('Please select a class.');
        }
    });

    calculateGPAButton.addEventListener("click", () => {
        const classes = classEntries.querySelectorAll(".class-entry");
        if (classes.length === 0) {
            gpaResult.textContent = "Please add at least one class to calculate GPA.";
            return;
        }

        let totalPoints = 0;
        let totalCredits = 0;

        classes.forEach((classEntry) => {
            const classType = classEntry.querySelector(".class-type").value;
            const classDuration = classEntry.querySelector(".class-duration").value;
            const classGrade = classEntry.querySelector(".class-grade").value;

            const gradePoints = gradePointMap[classGrade] || 0;
            const typeWeight = classTypeWeight[classType] || 1.0;
            const durationMultiplier = classLengthMultiplier[classDuration] || 0.5;

            const credits = durationMultiplier * 10; // Assuming 10 credits for a year-long class
            totalCredits += credits;
            totalPoints += gradePoints * typeWeight * credits;
        });

        const weightedGPA = (totalPoints / totalCredits).toFixed(2);
        gpaResult.textContent = `Your predicted GPA is ${weightedGPA}.`;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Graduation Requirements Data
    const graduationRequirements = {
        Math: 20,
        Science: 20,
        English: 40,
        History: 30,
        Health: 5,
        PE: 20,
        ArtLanguage: 10,
        Total: 220,
    };

    // Store entered classes
    const enteredClasses = [];

    // GPA Calculator: Add Class Event
    document.getElementById('add-class').addEventListener('click', () => {
        const className = document.querySelector('.class-name').value;
        const classType = document.querySelector('.class-type').value;
        const classDuration = document.querySelector('.class-duration').value;

        if (className) {
            // Example: Storing class info
            enteredClasses.push({
                name: className,
                type: classType,
                duration: classDuration,
            });
        }
    });

    // Graduation Requirements: Check Progress Event
    document.getElementById('check-requirements').addEventListener('click', () => {
        const requirementList = document.getElementById('requirement-list');
        requirementList.innerHTML = ''; // Clear previous results

        // Example: Check entered classes against requirements
        const fulfilledRequirements = {};
        for (const subject in graduationRequirements) {
            fulfilledRequirements[subject] = 0;
        }

        enteredClasses.forEach((cls) => {
            // Match classes to subjects (basic matching based on name, e.g., "Math 101" → Math)
            const subject = Object.keys(graduationRequirements).find((req) =>
                cls.name.toLowerCase().includes(req.toLowerCase())
            );
            if (subject) {
                // Increment fulfilled credits
                fulfilledRequirements[subject] += cls.duration === 'year' ? 10 : 5; // Example: Year = 10 credits, Semester = 5
            }
        });

        // Generate Requirement Status
        for (const subject in graduationRequirements) {
            const requiredCredits = graduationRequirements[subject];
            const earnedCredits = fulfilledRequirements[subject];

            const listItem = document.createElement('li');
            if (earnedCredits >= requiredCredits) {
                listItem.textContent = `${subject}: Completed (${earnedCredits}/${requiredCredits})`;
                listItem.style.color = 'green';
            } else {
                listItem.textContent = `${subject}: In Progress (${earnedCredits}/${requiredCredits})`;
                listItem.style.color = 'orange';
            }
            requirementList.appendChild(listItem);
        }
    });
});


//final grade calculator
document.getElementById('calculate-final-grade').addEventListener('click', () => {
    const currentGrade = parseFloat(document.getElementById('current-grade').value);
    const examWeight = parseFloat(document.getElementById('exam-weight').value) / 100;
    const desiredGrade = parseFloat(document.getElementById('desired-grade').value);

    if (isNaN(currentGrade) || isNaN(examWeight) || isNaN(desiredGrade)) {
        document.getElementById('final-grade-result').textContent = 'Please fill in all fields with valid numbers.';
        return;
    }

    if (examWeight <= 0 || examWeight > 1) {
        document.getElementById('final-grade-result').textContent = 'Final exam weight must be a percentage between 0 and 100.';
        return;
    }

    const requiredFinalGrade = (desiredGrade - (1 - examWeight) * currentGrade) / examWeight;

    if (requiredFinalGrade > 100) {
        document.getElementById('final-grade-result').textContent = 
            `You need ${requiredFinalGrade.toFixed(2)}%, which is more than 100%. This goal might not be achievable.`;
    } else if (requiredFinalGrade < 0) {
        document.getElementById('final-grade-result').textContent = 
            'You already have enough points to achieve your desired grade!';
    } else {
        document.getElementById('final-grade-result').textContent = 
            `You need to score at least ${requiredFinalGrade.toFixed(2)}% on the final.`;
    }
});
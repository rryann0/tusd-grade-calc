document.addEventListener("DOMContentLoaded", () => {
    const classEntries = document.getElementById("class-entries");
    const addClassButton = document.getElementById("add-class");
    const calculateGPAButton = document.getElementById("calculate-gpa");
    const gpaResult = document.getElementById("gpa-result");

    const gradePointMap = {
        "A": 4.0,
        "B": 3.0,
        "C": 2.0,
        "D": 1.0,
        "F": 0.0
    };

    const classTypeWeight = {
        regular: 1.0,
        honors: 1.25,
        ap: 1.25,
        dual: 1.0,
        dualPartner: 1.25
    };

    const classLengthMultiplier = {
        semester: 5,
        year: 10,
        quarter: 2.5
    };

    addClassButton.addEventListener("click", () => {
        const classEntry = document.createElement("div");
        classEntry.classList.add("class-entry");
        classEntry.innerHTML = `
            <input type="text" placeholder="Class Name" class="class-name" required>

            <div class="header-group">
                <div class="class-entry-header">Class Type</div>
                <select class="class-type">
                    <option value="regular">Regular</option>
                    <option value="honors">Honors</option>
                    <option value="ap">AP</option>
                    <option value="dual">Dual Enrollment</option>
                    <option value="dualPartner">Dual Enrollment Partnership</option>
                </select>
            </div>

            <div class="header-group">
                <div class="class-entry-header">Duration</div>
                <select class="class-duration">
                    <option value="semester">Semester</option>
                    <option value="year">Year</option>
                    <option value="quarter">Quarter</option>
                </select>
            </div>

            <div class="header-group">
                <div class="class-entry-header">Grade</div>
                <select class="class-grade">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                </select>
            </div>

            <button type="button" class="remove-class">Remove</button>
        `;
        classEntry.querySelector(".remove-class").addEventListener("click", () => {
            classEntry.remove();
        });
        classEntries.appendChild(classEntry);
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
        Math: 20, // Example: 30 credits
        Science: 20,
        English: 40,
        History: 30,
        Health: 5,
        PE: 20,
        ArtLanguage: 10,
        Electives: 75,
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
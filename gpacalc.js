// GPA Calculation Script

document.getElementById('calculate-gpa').addEventListener('click', function() {
    const currentGPA = parseFloat(document.getElementById('current-gpa').value);
    const totalCredits = parseInt(document.getElementById('total-credits').value);
    const futureGrades = document.getElementById('future-grades').value.trim().split(/,\s*/);

    const gradePoints = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
    };

    let futureCredits = futureGrades.length;
    let futureGradePoints = 0;

    for (let grade of futureGrades) {
        if (gradePoints[grade] !== undefined) {
            futureGradePoints += gradePoints[grade];
        } else {
            alert(`Invalid grade input: ${grade}`);
            return;
        }
    }

    const totalGradePoints = (currentGPA * totalCredits) + futureGradePoints;
    const totalCourses = totalCredits + futureCredits;
    const predictedGPA = totalGradePoints / totalCourses;

    document.getElementById('gpa-result').textContent = `Your predicted GPA is: ${predictedGPA.toFixed(2)}`;
});

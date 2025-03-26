function calculateStats() {
    let input = document.getElementById("numbers").value;
    let numbers = input.split(",").map(num => parseFloat(num.trim())).filter(num => !isNaN(num));

    if (numbers.length === 0) {
        alert("Please enter valid numbers!");
        return;
    }

    // Calculate Mean
    let mean = numbers.reduce((acc, val) => acc + val, 0) / numbers.length;

    // Calculate Mode
    let frequency = {};
    numbers.forEach(num => frequency[num] = (frequency[num] || 0) + 1);
    let maxFreq = Math.max(...Object.values(frequency));
    let mode = Object.keys(frequency).filter(key => frequency[key] === maxFreq).map(Number);

    // Calculate Median
    numbers.sort((a, b) => a - b);
    let median;
    let mid = Math.floor(numbers.length / 2);
    if (numbers.length % 2 === 0) {
        median = (numbers[mid - 1] + numbers[mid]) / 2;
    } else {
        median = numbers[mid];
    }

    // Display Results
    document.getElementById("meanResult").innerText = mean.toFixed(2);
    document.getElementById("modeResult").innerText = mode.join(", ") || "None";
    document.getElementById("medianResult").innerText = median.toFixed(2);
}
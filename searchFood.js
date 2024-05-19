document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', () => {
        console.log('Button clicked!');
        searchFood();
    });
});

async function searchFood() {
    console.log('searchFood triggered');
    const foodItem = document.getElementById('foodInput').value;
    const quantity = document.getElementById('quantityInput').value;
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!foodItem || !quantity) {
        alert('Please enter both a food item and quantity.');
        return;
    }

    console.log('Fetching data for:', foodItem, quantity);

    const apiKey = 'mksbdSYvWyT4vaVEhgKg4ARhd7ubU9vPcMbBMPAb';
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(foodItem)}&api_key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('API response:', data);

        if (data.foods && data.foods.length > 0) {
            const food = data.foods[0]; // Assuming the first result is the most relevant
            const nutrients = food.foodNutrients.reduce((acc, nutrient) => {
                acc[nutrient.nutrientName] = nutrient.value;
                return acc;
            }, {});

            const energy = (nutrients['Energy'] || 0) * quantity / 100;
            const protein = (nutrients['Protein'] || 0) * quantity / 100;
            const fat = (nutrients['Total lipid (fat)'] || 0) * quantity / 100;
            const carbs = (nutrients['Carbohydrate, by difference'] || 0) * quantity / 100;

            resultsContainer.innerHTML = `
                <p>${food.description} (${quantity} g):</p>
                <p>Energy: ${energy.toFixed(2)} kcal</p>
                <p>Protein: ${protein.toFixed(2)} g</p>
                <p>Total Fat: ${fat.toFixed(2)} g</p>
                <p>Carbohydrates: ${carbs.toFixed(2)} g</p>
            `;
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsContainer.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    }
}

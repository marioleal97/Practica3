const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const searchCriteria = document.getElementById('searchCriteria');
const resultsContainer = document.getElementById('resultsContainer');
const recipeDetails = document.getElementById('recipeDetails');
const popularIngredientsContainer = document.getElementById('popularIngredients');
const randomMealsContainer = document.getElementById('randomMeals');
const randomIngredientsContainer = document.getElementById('randomIngredients');

searchButton.addEventListener('click', search);

function search() {
    const searchValue = searchInput.value.trim();
    const searchType = searchCriteria.value;

    if (searchValue === '') {
        alert('Please enter a search value.');
        return;
    }

    let url = '';

    switch (searchType) {
        case 'name':
            url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;
            break;
        case 'ingredient':
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchValue}`;
            break;
        case 'category':
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchValue}`;
            break;
        case 'area':
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchValue}`;
            break;
        default:
            console.error('Invalid search criteria');
            return;
    }

    fetch(url)
       .then(response => response.json())
       .then(data => {
            if (!data.meals) {
                alert('No results found. Please try again.');
                return;
            }

            if (searchType === 'name') {
                displayRecipeDetails(data.meals[0].strMeal);
            } else {
                displayResults(data.meals);
            }
        })
       .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayResults(results) {
    resultsContainer.innerHTML = '';

    results.slice(0, 18).forEach(result => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        const recipeImage = document.createElement('img');
        recipeImage.src = result.strMealThumb;

        const recipeName = document.createElement('p');
        recipeName.textContent = result.strMeal;

        recipeCard.appendChild(recipeImage);
        recipeCard.appendChild(recipeName);

        recipeCard.addEventListener('click', () => {
            displayRecipeDetails(result.strMeal);
        });

        resultsContainer.appendChild(recipeCard);
    });
}

function displayRecipeDetails(recipeName) {
    recipeDetails.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`)
        .then(response => response.json())
        .then(data => {
            if (!data.meals) {
                alert('No results found. Please try again.');
                return;
            }

            const recipe = data.meals[0];

            const recipeTitle = document.createElement('h2');
            recipeTitle.textContent = recipe.strMeal;

            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.strMealThumb;

            const recipeIngredients = document.createElement('ul');

            for (let i = 1; i <= 20; i++) {
                const ingredient = recipe[`strIngredient${i}`];
                const measure = recipe[`strMeasure${i}`];

                if (!ingredient) break;

                const ingredientItem = document.createElement('li');
                ingredientItem.textContent = `${ingredient} - ${measure}`;

                recipeIngredients.appendChild(ingredientItem);
            }

            recipeDetails.appendChild(recipeTitle);
            recipeDetails.appendChild(recipeImage);
            recipeDetails.appendChild(recipeIngredients);
            recipeDetails.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayIngredients(ingredients, container) {
    container.innerHTML = '';

    ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('div');
        ingredientItem.classList.add('ingredient-item');

        const image = document.createElement('img');
        image.src = `https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}-Small.png`;
        image.alt = ingredient.strIngredient;
        ingredientItem.appendChild(image);

        const description = document.createElement('p');
        description.textContent = ingredient.strDescription || 'No description available';
        ingredientItem.appendChild(description);

        container.appendChild(ingredientItem);
    });
}

function displayMeals(meals, container) {
    container.innerHTML = '';

    meals.forEach(meal => {
        const mealItem = document.createElement('div');
        mealItem.classList.add('meal-item');

        const image = document.createElement('img');
        image.src = meal.strMealThumb;
        image.alt = meal.strMeal;
        mealItem.appendChild(image);

        const description = document.createElement('p');
        description.textContent = meal.strInstructions.slice(0, 100) + '...'; // Mostramos solo las primeras 100 caracteres de las instrucciones
        mealItem.appendChild(description);

        container.appendChild(mealItem);
    });
}

// List of categories, ingredients, and areas
const getListHttp = (category, http) => {
    return fetchHttp(
        `https://www.themealdb.com/api/json/v1/1/list.php?${category}=list`
    ).then((res) => res.json())
        .then((data) => data[category].map((el) => el.name));
};

const fetchHttp = (url) => {
    return fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("HTTP error " + response.status);
            }
        })
}

const loadList = async (category) => {
    try {
        const list = await getListHttp(category, fetchHttp);
        return list;
    } catch (error) {
        console.error(error);
    }
};

const populateCategories = async () => {
    const categories = await loadList("c");
    const selector = document.getElementById("searchCriteria");

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        selector.appendChild(option);
    });
};

populateCategories();

// Load popular ingredients
fetch('https://www.themealdb.com/api/json/v1/1/popular.php')
    .then(response => response.json())
    .then(data => {
        const popularIngredients = data.ingredients.slice(0, 5);
        displayIngredients(popularIngredients, popularIngredientsContainer);
    })
    .catch(error => console.error('Error fetching popular ingredients:', error));

// Load random meals
fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
        const randomMeals = data.meals.slice(0, 6);
        displayMeals(randomMeals, randomMealsContainer);
    })
    .catch(error => console.error('Error fetching random meals:', error));

// Load random ingredients
fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
        const randomIngredients = data.meals[0].strIngredient.slice(0, 5);
        displayIngredients(randomIngredients, randomIngredientsContainer);
    })
    .catch(error => console.error('Error fetching random ingredients:', error));

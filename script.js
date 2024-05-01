const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const searchCriteria = document.getElementById("searchCriteria");
const resultsContainer = document.getElementById("resultsContainer");
const recipeDetails = document.getElementById("recipeDetails");
const newSearchButton = document.getElementById("newSearchButton");

searchButton.addEventListener("click", search);
newSearchButton.addEventListener("click", newSearch);

function search() {
  const searchValue = searchInput.value.trim();
  const searchType = searchCriteria.value;

  if (searchValue === "") {
    alert("Please enter a search value.");
    return;
  }

  let url = "";

  switch (searchType) {
    case "name":
      url =
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchValue;
      break;
    case "ingredient":
      url =
        "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + searchValue;
      break;
    case "category":
      url =
        "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + searchValue;
      break;
    case "area":
      url =
        "https://www.themealdb.com/api/json/v1/1/filter.php?a=" + searchValue;
      break;
    default:
      console.error("Invalid search criteria");
      return;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Agregamos esta línea para imprimir los datos recibidos en la consola
      if (!data.meals) {
        alert("No results found. Please try again.");
        return;
      }

      if (searchType === "name") {
        displayRecipeDetails(data.meals[0].strMeal);
      } else {
        displayResults(data.meals);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function displayResults(results) {
  resultsContainer.innerHTML = "";

  results.slice(0, 18).forEach((result) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    const recipeImage = document.createElement("img");
    recipeImage.src = result.strMealThumb;

    const recipeName = document.createElement("p");
    recipeName.textContent = result.strMeal;

    recipeCard.appendChild(recipeImage);
    recipeCard.appendChild(recipeName);

    recipeCard.addEventListener("click", () => {
      displayRecipeDetails(result.strMeal);
      hideOtherResults(recipeCard);
    });

    resultsContainer.appendChild(recipeCard);
  });
}

function clearResults() {
  resultsContainer.innerHTML = "";
  recipeDetails.innerHTML = "";
}

function displayRecipeDetails(recipeName) {
  // Ocultar los resultados de búsqueda
  clearResults();

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.meals) {
        alert("No results found. Please try again.");
        return;
      }

      const recipe = data.meals[0];

      // Mostrar solo los detalles de la receta
      const recipeTitle = document.createElement("h2");
      recipeTitle.textContent = recipe.strMeal;

      const recipeImage = document.createElement("img");
      recipeImage.src = recipe.strMealThumb;

      const recipeIngredients = document.createElement("ul");

      for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];

        if (!ingredient) break;

        const ingredientItem = document.createElement("li");
        ingredientItem.textContent = `${ingredient} - ${measure}`;

        recipeIngredients.appendChild(ingredientItem);
      }

      const recipeInstructions = document.createElement("p");
      recipeInstructions.textContent = recipe.strInstructions;

      recipeDetails.appendChild(recipeTitle);
      recipeDetails.appendChild(recipeImage);
      recipeDetails.appendChild(recipeIngredients);
      recipeDetails.appendChild(recipeInstructions);

      // Mostrar los detalles de la receta y ocultar otros elementos
      recipeDetails.style.display = "block";
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function hideOtherResults(clickedRecipeCard) {
  const allRecipeCards = document.querySelectorAll(".recipe-card");

  allRecipeCards.forEach((recipeCard) => {
    if (recipeCard !== clickedRecipeCard) {
      recipeCard.style.display = "none";
    }
  });
}

function newSearch() {
  // Limpiar los resultados y mostrar solo el encabezado
  clearResults();
  document.querySelector("header").style.display = "flex";
}
footer {
    background-color: #333;
    color: #fff;
    padding: 20px;
    text-align: center;
  }
  
  .footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .footer-text {
    margin: 5px 0;
  }
  

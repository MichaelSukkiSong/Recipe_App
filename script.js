/* **************************
3. Recipe App
- recipe info on click
- fav recipe (w/ localStorage)
************************** */

/* elements */

const elements = {
    randomImage: document.getElementById("random-recipe-img"),
    randomName: document.querySelector(".random-recipe-footer h3"),
    recipeSection: document.querySelector(".random-recipe-section"),
    inputField: document.querySelector(".search-field"),
    recipeCard: document.querySelector(".recipe-card"),
    likeBtn: document.querySelector(".like-btn"),
    favorites: document.querySelector(".favorites"),
    favorite: document.querySelector(".favorite"),
    favoriteImg: document.querySelector(".favorite > a > img"),
    favoriteName: document.querySelector(".favorite-text"),
}

/* functions */

const getRandomRecipe = async () => {
    // fetch data
    const result = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await result.json();
    // console.log(data.meals[0]);
    const img_url = data.meals[0].strMealThumb;
    const sttMeal = data.meals[0].strMeal;
    const idMeal = data.meals[0].idMeal;
    // set recipe image in DOM
    elements.randomImage.src = img_url
    // set recipe name in DOM
    elements.randomName.textContent = sttMeal;
    // set recipe id in DOM
    elements.recipeCard.setAttribute("id", idMeal);
}

const searchMeal = async (query) => {
    try {
        // fetch data
        const result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        const data = await result.json();
        // console.log(data.meals);
        return data.meals;
    } catch (error) {
        alert(error);
    }
}

const displaySearch = (data) => {
    let new_markup = '';
    for (let i = 0; i < data.length; i++ ) {
        const markup = `
            <div class="recipe-card" id=${data[i].idMeal}>
                <div class="random-recipe-img-container">
                    <a href="#" >
                        <img src=${data[i].strMealThumb} id="random-recipe-img">
                    </a>
                </div>
                <div class="random-recipe-footer">
                    <h3>${data[i].strMeal}</h3>
                    <button class="like-btn"><i onclick="toggleSearchedRecipeFavFunc(this)" class="far fa-heart"></i></button>
                </div>
            </div>
            `;
        new_markup += markup;
    }
    elements.recipeSection.insertAdjacentHTML("beforeend", new_markup);
}


const getLocalStorageID = () => {
    const items = {...localStorage};
    const itemsIDArr = Object.keys(items);
    return itemsIDArr;
}

const getRecipeDetailByID = async (id) => {
    try {
        const result = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        const data = await result.json();
        // console.log(data.meals[0]);
        return data.meals[0];
    } catch(error) {
        alert(error);
    }
}

const displayFavorite = (data) => {
    let new_markup = '';
    for (let i = 0; i < data.length; i++) {
        const markup = `
        <div class="favorite">
            <a href="#" >
                <img src=${data[i].strMealThumb} alt="favorite-food-image"></br>
                <span class="favorite-text">${data[i].strMeal}</span>
            </a>
        </div>
        `;
        new_markup += markup;
    }
    elements.favorites.insertAdjacentHTML("beforeend", new_markup);
}

const loadLocalStorageDBToUI = () => {
        // get local storage id data
        const itemsIDArr = getLocalStorageID();
        // console.log(itemsIDArr);

        // get detailed meal data
        const mealDetailsArr = itemsIDArr.map(el => getRecipeDetailByID(el));
        // console.log(mealDetailsArr);
        
        // clear favorites UI
        clearFavorites();

        // load image and name in favorites UI
        Promise.all(mealDetailsArr).then(val => {
            displayFavorite(val);
        })
}

const clearSearchResult = () => {
    elements.recipeSection.innerHTML = '';
}

const clearFavorites = () => {
    elements.favorites.innerHTML = '';
}

function toggleSearchedRecipeFavFunc(x) {
    x.classList.toggle("fas");
    // get recipe id
    // add recipe id to favorite meals(DB)
    // add recipe id to favorite meals(UI)
}

/* on load */

window.addEventListener("load", getRandomRecipe);
window.addEventListener("load", loadLocalStorageDBToUI);

/* search button */

document.querySelector(".search-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    // get query from input
    const input = elements.inputField.value;

    // search the query
    const searchResult = await searchMeal(input);
    console.log(searchResult) // [{}, {}, {}, ...]

    // clear search results
    clearSearchResult();

    // display in UI
    displaySearch(searchResult);
})

/* favorite button */

elements.recipeSection.addEventListener("click", e => {
    if (e.target.matches(".like-btn, .like-btn *")) {
        // toggle icon
        elements.likeBtn.firstElementChild.classList.toggle("fas");

        // get recipe id
        const randomRecipeID = e.target.parentNode.parentNode.parentNode.id
        // console.log(randomRecipeID);
        
        // add recipe id to favorites localStorage DB
        localStorage.setItem(randomRecipeID, randomRecipeID);

        loadLocalStorageDBToUI();
    }
})


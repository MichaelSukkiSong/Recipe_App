/* **************************
3. Recipe App
- recipe info on click
- fav recipe (w/ localStorage)
************************** */

/* elements */

const elements = {
    randomImage: document.getElementById("random-recipe-img"),
    randomName: document.querySelector(".random-recipe-footer h3")
}

/* random recipe section */

const getRandomRecipe = async () => {
    // fetch data
    const result = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await result.json();
    // console.log(data.meals[0]);
    const img_url = data.meals[0].strMealThumb;
    const sttMeal = data.meals[0].strMeal;
    // set recipe image in DOM
    elements.randomImage.src = img_url
    // set recipe name in DOM
    elements.randomName.textContent = sttMeal;
}

getRandomRecipe();

const searchMeal = async (query) => {
    // fetch data
    const result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const data = await result.json();
    console.log(data.meals[0]);
}

searchMeal('pizza');
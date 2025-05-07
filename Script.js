const API_KEY = "05951906b9ec4d67aed5f6ea0279bea0";  
const NEWS_URL = "https://newsapi.org/v2/everything?q=";
const WEATHER_API_KEY = "b00a96ee82039ce016e2278ad5a26444";  
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?q=";

window.addEventListener('load', () => {
    fetchWeather("Sangareddy");  
    fetchNews("India");  
});


function reload() {
    window.location.reload();
}


async function fetchWeather(city) {
    try {
        const res = await fetch(`${WEATHER_URL}${city}&appid=${WEATHER_API_KEY}&units=metric`);
        const data = await res.json();

        if (data.cod === 200) {
            const temp = Math.round(data.main.temp);
            const city = data.name;
            const weather = data.weather[0].main;
            const weatherInfo = document.getElementById("weather-info");
            weatherInfo.innerHTML = `${city}: ${weather}, ${temp}°C`;
        } else {
            document.getElementById("weather-info").innerText = "Weather data unavailable";
        }
    } catch (error) {
        document.getElementById("weather-info").innerText = "Weather data unavailable";
    }
}

// Function to fetch news based on query
async function fetchNews(query) {
    const res = await fetch(`${NEWS_URL}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    
    if (data.status === "ok") {
        bindData(data.articles);
    } else {
        console.error("Error fetching news: ", data);
        document.getElementById('cards-container').innerHTML = "<p>Unable to fetch news data.</p>";
    }
}

function bindData(articles) {
    const cardContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');
    cardContainer.innerHTML = "";  

    if (articles.length === 0) {
        cardContainer.innerHTML = "<p>No news articles found.</p>";
        return;
    }

    articles.forEach(article => {
        if (!article.urlToImage) return;  
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardContainer.appendChild(cardClone);
    });
}


function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    });
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });
}


const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;

    
    fetchNews(query);

    
    fetchWeather(query);
});

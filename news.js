const API_KEY = "a6cc170cc29384d6c623a3e34b62deca";
const QUERY = "oil gas energy OR financial markets OR business economy";
const MAX_HEADLINES = 10;
let allArticles = [];

async function fetchNews() {
    const newsList = document.getElementById("news-list");
    if (!newsList) return;
    newsList.innerHTML = "<li>Loading...</li>";

    try {
        const apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(QUERY)}&lang=en&max=10&token=${API_KEY}`;
        const url = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log("GNews response:", data);

        if (!data.articles || data.articles.length === 0) {
            newsList.innerHTML = "<li>No headlines found.</li>";
            return;
        }

        allArticles = data.articles;
        console.log("Total articles:", allArticles.length);
        renderHeadlines(5);

    } catch (err) {
        const newsList = document.getElementById("news-list");
        if (newsList) newsList.innerHTML = "<li>Failed to load news.</li>";
        console.error("News fetch error:", err);
    }
}

function renderHeadlines(count) {
    const newsList = document.getElementById("news-list");
    const showMoreBtn = document.getElementById("show-more-btn");
    if (!newsList || !showMoreBtn) return;

    newsList.innerHTML = "";
    allArticles.slice(0, count).forEach(article => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
        newsList.appendChild(li);
    });

    if (count < allArticles.length) {
        showMoreBtn.style.display = "block";
        showMoreBtn.onclick = () => {
            renderHeadlines(MAX_HEADLINES);
            showMoreBtn.style.display = "none";
        };
    } else {
        showMoreBtn.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchNews();
    setInterval(fetchNews, 60 * 60 * 1000);
});
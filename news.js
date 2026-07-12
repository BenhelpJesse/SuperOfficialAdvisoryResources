const API_KEY = "1e1ceb03cd4d4abf89dec55d5672ba20";
const TOPICS = ["oil gas energy markets", "financial markets stocks", "business economy"];
const MAX_HEADLINES = 10;
let allArticles = [];

async function fetchNews() {
    const newsList = document.getElementById("news-list");
    if (!newsList) return;
    newsList.innerHTML = "<li>Loading...</li>";

    try {
        const fetched = [];

        for (const topic of TOPICS) {
            const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&sortBy=publishedAt&pageSize=4&apiKey=${API_KEY}`;
            const res = await fetch(url);
            const data = await res.json();
            console.log("NewsAPI response:", data);
            if (data.articles) fetched.push(...data.articles);
        }

        const seen = new Set();
        allArticles = fetched
            .filter(a => {
                if (seen.has(a.url)) return false;
                seen.add(a.url);
                return true;
            })
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, MAX_HEADLINES);
        console.log("Total articles after debup:", allArticles.length);
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
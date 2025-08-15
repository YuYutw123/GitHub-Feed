function getLastWeekDate() {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
}

async function fetchWeeklyTrendingRepos() {
    const lastWeek = getLastWeekDate();
    const url = `https://api.github.com/search/repositories?q=created:>${lastWeek}+stars:>50&sort=stars&order=desc&per_page=50`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        await chrome.storage.local.set({
            repoPool: data.items,
            lastFetchDate: new Date().toDateString()
        });

        console.log("Weekly trending repository list updated, total", data.items.length, "repositories");
    } catch (err) {
        console.error("Failed to fetch GitHub weekly trending repositories:", err);
    }
}

// Create a daily alarm to fetch repositories every 24 hours
chrome.alarms.create("dailyFetch", { periodInMinutes: 1440 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "dailyFetch") {
        fetchWeeklyTrendingRepos();
    }
});

// Fetch trending repos on browser startup if not fetched today
chrome.runtime.onStartup.addListener(async () => {
    const { lastFetchDate } = await chrome.storage.local.get("lastFetchDate");
    if (lastFetchDate !== new Date().toDateString()) {
        fetchWeeklyTrendingRepos();
    }
});

// Fetch trending repos when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    fetchWeeklyTrendingRepos();
});

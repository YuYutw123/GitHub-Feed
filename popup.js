const COOLDOWN_MS = 60 * 60 * 1000;
const cooldownEl = document.getElementById("cooldown");
const cooldownBar = document.getElementById("cooldown-bar");
const cooldownText = document.getElementById("cooldown-text");
const nextBtn = document.getElementById("next-btn");

let cooldownTimer = null;

function startCooldown(lastShownTime) {
    const now = Date.now();
    const remaining = COOLDOWN_MS - (now - lastShownTime);

    if (remaining > 0) {
        nextBtn.disabled = true;
        cooldownEl.style.display = "block";

        const total = COOLDOWN_MS;
        updateCooldownBar(remaining, total);

        cooldownTimer = setInterval(() => {
            const timeLeft = total - (Date.now() - lastShownTime);
            if (timeLeft <= 0) {
                clearInterval(cooldownTimer);
                nextBtn.disabled = false;
                cooldownEl.style.display = "none";
                cooldownBar.style.width = "0%";
            } else {
                updateCooldownBar(timeLeft, total);
            }
        }, 1000);
    } else {
        nextBtn.disabled = false;
        cooldownEl.style.display = "none";
    }
}

function getLanguageColor(language) {
    // Language to color mapping
    const colors = {
        JavaScript: "#f1e05a",
        TypeScript: "#3178c6",
        Python: "#3572A5",
        Java: "#b07219",
        C: "#555555",
        "C++": "#f34b7d",
        Go: "#00ADD8",
        Rust: "#dea584",
        HTML: "#e34c26",
        CSS: "#563d7c"
    };
    return colors[language] || "#ededed"; // Defalut to light gray if unknown
}

function updateCooldownBar(timeLeft, total) {
    const percent = ((total - timeLeft) / total) * 100;
    cooldownBar.style.width = `${percent}%`;
    const minutes = Math.floor(timeLeft / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
    cooldownText.textContent = `${minutes}m ${seconds}s left`;
}

async function getRandomRepoFromPool(forceRefresh = false) {
    const { repoPool, lastShownRepo, lastShownTime } = await chrome.storage.local.get([
        "repoPool",
        "lastShownRepo",
        "lastShownTime"
    ]);

    const now = Date.now();

    if (!forceRefresh && lastShownRepo && lastShownTime && now - lastShownTime < COOLDOWN_MS) {
        startCooldown(lastShownTime);
        return lastShownRepo;
    }

    if (forceRefresh && lastShownTime && now - lastShownTime < COOLDOWN_MS) {
        startCooldown(lastShownTime);
        return lastShownRepo;
    }

    if (repoPool && repoPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * repoPool.length);
        const newRepo = repoPool[randomIndex];

        await chrome.storage.local.set({
            lastShownRepo: newRepo,
            lastShownTime: now
        });

        startCooldown(now);
        return newRepo;
    }

    throw new Error("No data, please refresh the repository pool.");
}

async function displayRepo(forceRefresh = false) {
    try {
        const repo = await getRandomRepoFromPool(forceRefresh);

        const card = document.getElementById("repo-card");
        card.innerHTML = `
            <div class="repo-header">
                <div class="owner">
                    <img src="${repo.owner.avatar_url}" alt="avatar" class="avatar">
                    <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.full_name}</a>
                </div>
                <span class="stars">⭐ ${repo.stargazers_count}</span>
            </div>
            <p class="description">${repo.description || "No description"}</p>
            <div class="repo-footer">
                <span class="lang">
                    <span class="lang-dot" style="background:${getLanguageColor(repo.language)}"></span>
                    ${repo.language || "Unknown language"}
                </span>
                <span class="updated">Updated at ${new Date(repo.updated_at).toLocaleDateString()}</span>
            </div>
        `;
    } catch (err) {
        console.error(err);
        document.getElementById("repo-card").innerHTML = `<p class="error">"Failed to load or no data available"</p>`;
    }
}

nextBtn.addEventListener("click", () => {
    displayRepo(true);
});

// displayRepo();

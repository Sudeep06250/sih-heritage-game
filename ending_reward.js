/**
 * Bharat Quest - Odisha Finale Ending Module
 * Author: SIH Heritage Team
 * 
 * Usage in any game / branch:
 *   1. Include script: <script src="ending_reward.js"></script>
 *   2. Call function on game end: showKalingaVeeraReward();
 */

(function () {
  "use strict";

  // Inject Styles for the Reward Modal
  function injectRewardStyles() {
    if (document.getElementById("kalinga-reward-styles")) return;

    const style = document.createElement("style");
    style.id = "kalinga-reward-styles";
    style.textContent = `
      @keyframes kvModalFadeIn {
        from { opacity: 0; backdrop-filter: blur(0px); }
        to { opacity: 1; backdrop-filter: blur(10px); }
      }
      @keyframes kvCardPop {
        0% { transform: scale(0.8) translateY(30px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      @keyframes kvBadgeGlow {
        0%, 100% { box-shadow: 0 0 25px rgba(245, 158, 11, 0.5), 0 0 50px rgba(245, 158, 11, 0.2); }
        50% { box-shadow: 0 0 45px rgba(245, 158, 11, 0.85), 0 0 80px rgba(245, 158, 11, 0.4); }
      }
      @keyframes kvPulseGold {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .kv-reward-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(5, 7, 15, 0.85);
        animation: kvModalFadeIn 0.4s ease forwards;
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        box-sizing: border-box;
      }

      .kv-reward-card {
        width: 100%;
        max-width: 480px;
        background: linear-gradient(145deg, rgba(26, 32, 54, 0.95), rgba(12, 16, 30, 0.98));
        border: 1.5px solid rgba(245, 158, 11, 0.6);
        border-radius: 28px;
        padding: 36px 28px 30px;
        text-align: center;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.2);
        animation: kvCardPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        position: relative;
        box-sizing: border-box;
      }

      .kv-badge-wrapper {
        position: relative;
        width: 130px;
        height: 130px;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .kv-badge-glow-ring {
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        border: 2px dashed rgba(245, 158, 11, 0.5);
        animation: kvPulseGold 3s infinite ease-in-out;
      }

      .kv-badge-img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 3px solid #f59e0b;
        object-fit: cover;
        animation: kvBadgeGlow 2.5s infinite ease-in-out;
        display: block;
      }

      .kv-ribbon {
        display: inline-block;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.15));
        border: 1px solid rgba(245, 158, 11, 0.6);
        color: #fef08a;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
        padding: 5px 16px;
        border-radius: 999px;
        margin-bottom: 12px;
      }

      .kv-badge-title {
        font-size: 26px;
        font-weight: 800;
        color: #fff;
        margin: 0 0 6px;
        letter-spacing: 0.5px;
        text-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
      }

      .kv-badge-desc {
        font-size: 14px;
        color: #cbd5e1;
        margin: 0 0 24px;
        line-height: 1.5;
      }

      .kv-unlock-box {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(245, 158, 11, 0.35);
        border-radius: 18px;
        padding: 14px 18px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 14px;
        text-align: left;
      }

      .kv-unlock-icon {
        font-size: 30px;
        flex-shrink: 0;
      }

      .kv-unlock-tag {
        font-size: 10.5px;
        font-weight: 800;
        color: #f59e0b;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      }

      .kv-unlock-name {
        font-size: 15px;
        font-weight: 700;
        color: #fef08a;
        margin: 2px 0 0;
      }

      .kv-btn-map {
        display: block;
        width: 100%;
        padding: 16px 24px;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        border: none;
        border-radius: 999px;
        color: #080c1a;
        font-size: 14px;
        font-weight: 800;
        letter-spacing: 1px;
        text-transform: uppercase;
        cursor: pointer;
        text-decoration: none;
        box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        transition: transform 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
      }

      .kv-btn-map:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(245, 158, 11, 0.6);
      }
    `;
    document.head.appendChild(style);
  }

  // Trigger the reward and unlock state
  window.showKalingaVeeraReward = function (options) {
    options = options || {};
    const mapUrl = options.mapUrl || "map.html";
    const badgeImgSrc = options.badgeImg || "assets/odisha-badge.jpg";

    injectRewardStyles();

    // 1. Award KalingaVeera Badge to LocalStorage
    let userBadges = [];
    try {
      userBadges = JSON.parse(localStorage.getItem("user_badges") || "[]");
    } catch (e) {
      userBadges = [];
    }

    if (!userBadges.some(b => b.id === "kalinga_veera")) {
      userBadges.push({
        id: "kalinga_veera",
        title: "KalingaVeera",
        subtitle: "Master of Odisha Heritage & Sacred Echoes",
        region: "Odisha",
        image: badgeImgSrc,
        dateEarned: new Date().toLocaleDateString()
      });
      localStorage.setItem("user_badges", JSON.stringify(userBadges));
    }

    // 2. Unlock Rajasthan in LocalStorage
    let unlockedStates = ["odisha"];
    try {
      const stored = JSON.parse(localStorage.getItem("unlocked_states"));
      if (Array.isArray(stored) && stored.length > 0) unlockedStates = stored;
    } catch (e) {}

    if (!unlockedStates.includes("rajasthan")) {
      unlockedStates.push("rajasthan");
      localStorage.setItem("unlocked_states", JSON.stringify(unlockedStates));
    }
    localStorage.setItem("completed_odisha_sound_quest", "true");

    // 3. Render Modal UI
    const existing = document.getElementById("kvRewardModal");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "kvRewardModal";
    overlay.className = "kv-reward-overlay";

    overlay.innerHTML = `
      <div class="kv-reward-card">
        <div class="kv-badge-wrapper">
          <div class="kv-badge-glow-ring"></div>
          <img src="${badgeImgSrc}" class="kv-badge-img" alt="KalingaVeera Badge" />
        </div>
        <span class="kv-ribbon">🏆 ODIA HERITAGE BADGE EARNED</span>
        <h2 class="kv-badge-title">KalingaVeera</h2>
        <p class="kv-badge-desc">You have conquered the Sacred Echoes & Lore of Odisha! Your legacy is etched in stone.</p>

        <div class="kv-unlock-box">
          <div class="kv-unlock-icon">🏰</div>
          <div>
            <div class="kv-unlock-tag">MAP DESTINATION UNLOCKED</div>
            <div class="kv-unlock-name">Rajasthan — Land of Forts & Thar Ragas</div>
          </div>
        </div>

        <a href="${mapUrl}?unlocked=rajasthan" class="kv-btn-map" id="kvOpenMapBtn">
          🗺️ OPEN MAP & EXPLORE RAJASTHAN →
        </a>
      </div>
    `;

    document.body.appendChild(overlay);
  };
})();

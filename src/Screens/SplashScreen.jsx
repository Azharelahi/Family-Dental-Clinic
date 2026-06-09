import { useEffect, useState } from "react";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

// Inject keyframe animations into document head (Electron-safe approach)
function injectKeyframes() {
  if (document.getElementById("splash-keyframes")) return;
  const style = document.createElement("style");
  style.id = "splash-keyframes";
  style.textContent = `
    @keyframes splashFadeIn {
      from { opacity: 0; transform: scale(0.88); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes splashFadeOut {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50%       { transform: scale(1.07); }
    }
    @keyframes dotDot {
      0%   { content: '.'; }
      33%  { content: '..'; }
      66%  { content: '...'; }
      100% { content: '.'; }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
  `;
  document.head.appendChild(style);
}

const styles = {
  wrapper: {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(145deg, #0a2855 0%, #0d3b7a 45%, #005B6E 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "32px",
    zIndex: 9999,
    fontFamily: ff,
    userSelect: "none",
  },
  contentBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    animation: "splashFadeIn 0.7s cubic-bezier(0.22,1,0.36,1) both",
  },
  logoRing: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.07)",
    border: "2px solid rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "pulse 2.4s ease-in-out infinite",
    boxShadow: "0 0 40px rgba(0,151,167,0.35)",
  },
  titleGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  headline: {
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    margin: 0,
    lineHeight: "1.2",
  },
  tagline: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "13px",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    margin: 0,
    fontWeight: "400",
  },
  divider: {
    width: "48px",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #0097A7, transparent)",
    borderRadius: "2px",
  },
  loaderTrack: {
    width: "200px",
    height: "3px",
    background: "rgba(255,255,255,0.12)",
    borderRadius: "2px",
    overflow: "hidden",
    position: "relative",
  },
  loaderFill: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    background: "linear-gradient(90deg, #1565C0, #0097A7)",
    borderRadius: "2px",
    transition: "width 0.08s linear",
  },
  loadingText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: "12px",
    letterSpacing: "1px",
    margin: 0,
  },
  version: {
    position: "fixed",
    bottom: "24px",
    color: "rgba(255,255,255,0.2)",
    fontSize: "11px",
    letterSpacing: "0.5px",
  },
};

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    injectKeyframes();
  }, []);

  useEffect(() => {
    // Simulate loading progress over ~2.5 seconds
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 8 + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        // Fade out then call onComplete
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => onComplete(), 500);
        }, 300);
      } else {
        setProgress(Math.round(current));
      }
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  const wrapperStyle = {
    ...styles.wrapper,
    animation: fadingOut ? "splashFadeOut 0.5s ease forwards" : undefined,
  };

  return (
    <div style={wrapperStyle}>
      <div style={styles.contentBlock}>
        {/* Animated tooth logo */}
        <div style={styles.logoRing}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path
              d="M30 8C24 8 19 11.5 17 15.5 15 19.5 15 24 15 27c0 6 2 11 3 16 .6 3 1.5 8 3.5 8 1.5 0 2-1.5 3-5 .8-2.5 1.5-5 5.5-5s4.7 2.5 5.5 5c1 3.5 1.5 5 3 5 2 0 2.9-5 3.5-8 1-5 3-10 3-16 0-3 0-7.5-2-11.5C41 11.5 36 8 30 8z"
              fill="#ffffff"
              opacity="0.95"
            />
          </svg>
        </div>

        <div style={styles.titleGroup}>
          <h1 style={styles.headline}>Family Dental Clinic</h1>
          <p style={styles.tagline}>Professional Dental Care</p>
          <div style={styles.divider} />
        </div>

        {/* Progress bar */}
        <div>
          <div style={styles.loaderTrack}>
            <div style={{ ...styles.loaderFill, width: `${progress}%` }} />
          </div>
        </div>

        <p style={styles.loadingText}>
          {progress < 100 ? `Loading system... ${progress}%` : "Ready"}
        </p>
      </div>

      <p style={styles.version}>v1.0.0 · Desktop Edition</p>
    </div>
  );
}
"""AI News Credibility & Sensationalism Analysis Engine.

Performs linguistic feature extraction, panic/urgency cue detection,
and clickbait scoring to evaluate the authenticity and viral diffusion potential
of user-submitted news headlines.
"""

import re
from typing import Dict, Any, List


# Linguistic Lexicons for Fake News Feature Extraction
PANIC_KEYWORDS = {
    "urgent", "alert", "danger", "emergency", "crisis", "warning", "panic",
    "deadly", "fatal", "collapse", "crash", "freeze", "banned", "shutdown",
    "midnight", "now", "immediately", "withdraw", "sealed", "attack", "catastrophe"
}

SENSATIONAL_PATTERNS = [
    r"you won'?t believe",
    r"shocking (truth|leak|video|revelation)",
    r"secret (plan|memo|agreement|cure)",
    r"they don'?t want you to know",
    r"what doctors (aren'?t|won'?t) tell",
    r"100% (guaranteed|proven|real)",
    r"miracle cure",
    r"share before (it'?s deleted|they remove)",
    r"forward to (all|everyone|groups)"
]

AUTHORITATIVE_TERMS = {
    "reuters", "associated press", "gazette", "ministry", "official statement",
    "supreme court", "press release", "peer-reviewed", "journal", "spokesperson",
    "verified report", "rbi", "sec", "who", "cdc", "aiims"
}


def analyze_news_credibility(headline: str) -> Dict[str, Any]:
    """Analyze a news headline and return credibility score, virality, and red flags.
    
    Returns:
        dict: {
            "headline": str,
            "credibility_score": int (0 - 100),
            "verdict": str,
            "verdict_level": "danger" | "warning" | "success",
            "predicted_virality": float (0.1 - 1.0),
            "red_flags": List[str],
            "linguistic_stats": dict,
            "recommended_counter_action": str
        }
    """
    if not headline or not headline.strip():
        return {
            "headline": "",
            "credibility_score": 50,
            "verdict": "AWAITING INPUT",
            "verdict_level": "warning",
            "predicted_virality": 0.70,
            "red_flags": ["No text provided for linguistic audit."],
            "linguistic_stats": {},
            "recommended_counter_action": "Enter a news headline or social media message to analyze."
        }

    raw = headline.strip()
    words = re.findall(r"\b[A-Za-z]+\b", raw.lower())
    total_words = max(1, len(words))

    red_flags: List[str] = []
    penalty_score = 0
    virality_boost = 0.0

    # 1. Panic & Urgency Cues
    panic_hits = [w for w in words if w in PANIC_KEYWORDS]
    if panic_hits:
        penalty_score += min(35, len(panic_hits) * 12)
        virality_boost += min(0.25, len(panic_hits) * 0.08)
        red_flags.append(f"Artificial Urgency / Panic Triggers detected: [{', '.join(set(panic_hits))}]")

    # 2. Sensationalism & Clickbait Regex
    lower_raw = raw.lower()
    sensational_hits = []
    for pat in SENSATIONAL_PATTERNS:
        match = re.search(pat, lower_raw)
        if match:
            sensational_hits.append(match.group(0))

    if sensational_hits:
        penalty_score += min(30, len(sensational_hits) * 15)
        virality_boost += 0.15
        red_flags.append(f"Viral Sensationalism / Clickbait phrase detected: '{sensational_hits[0]}'")

    # 3. Capitalization Abuse (All-Caps shouting)
    alpha_chars = [c for c in raw if c.isalpha()]
    upper_chars = [c for c in alpha_chars if c.isupper()]
    caps_ratio = len(upper_chars) / max(1, len(alpha_chars))

    if caps_ratio > 0.40 and len(alpha_chars) > 10:
        penalty_score += 18
        virality_boost += 0.10
        red_flags.append(f"Excessive Capitalization ({int(caps_ratio * 100)}% Uppercase) indicating emotional agitation.")

    # 4. Punctuation Abuse (Excessive !, ?)
    exclamations = raw.count("!")
    questions = raw.count("?")
    if exclamations >= 2:
        penalty_score += 15
        virality_boost += 0.08
        red_flags.append(f"Excessive Exclamation Marks ({exclamations}x '!') used to force emotional urgency.")
    if questions >= 2:
        penalty_score += 10
        red_flags.append("Multiple rhetorical questions used to bypass defamation liability.")

    # 5. Authoritative Citation Check
    has_authoritative = any(auth in lower_raw for auth in AUTHORITATIVE_TERMS)
    if has_authoritative:
        penalty_score = max(0, penalty_score - 25)
        virality_boost -= 0.10

    # Calculate final credibility score (0 - 100)
    credibility = max(8, min(95, 88 - penalty_score))
    
    # Base virality starts at 0.55, increases with panic and emotional triggers
    virality = round(max(0.20, min(0.98, 0.55 + virality_boost)), 2)

    # Determine Verdict and Level
    if credibility <= 45:
        verdict = "CRITICAL RISK // PROBABLE FAKE NEWS"
        verdict_level = "danger"
        counter = "Issue immediate public clarification and deploy priority fact-checking beacon."
    elif credibility <= 65:
        verdict = "MODERATE RISK // UNVERIFIED SENSATIONAL CLAIM"
        verdict_level = "warning"
        counter = "Require secondary source verification before forwarding along network vectors."
    else:
        verdict = "LOW RISK // PLAUSIBLE OBJECTIVE REPORTING"
        verdict_level = "success"
        counter = "Information appears neutral; standard observation recommended."

    if not red_flags:
        red_flags.append("No obvious sensationalism or linguistic panic cues detected.")

    return {
        "headline": raw,
        "credibility_score": credibility,
        "verdict": verdict,
        "verdict_level": verdict_level,
        "status_class": verdict_level,
        "predicted_virality": virality,
        "red_flags": red_flags,
        "linguistic_stats": {
            "word_count": total_words,
            "caps_ratio": round(caps_ratio, 2),
            "panic_word_count": len(panic_hits),
            "exclamation_count": exclamations
        },
        "recommended_counter_action": counter,
        "counter_narrative": counter
    }

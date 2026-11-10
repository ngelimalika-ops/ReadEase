// DOM Elements
const textInput = document.getElementById('text-input');
const readAloudBtn = document.getElementById('read-aloud-btn');
const stopBtn = document.getElementById('stop-btn');
const simplifyBtn = document.getElementById('simplify-btn');
const themeToggle = document.getElementById('theme-toggle');
const increaseFontBtn = document.getElementById('increase-font');
const decreaseFontBtn = document.getElementById('decrease-font');
const fontSizeDisplay = document.getElementById('font-size-display');
const simplifiedSection = document.getElementById('simplified-section');
const simplifiedText = document.getElementById('simplified-text');
const closeSimplifiedBtn = document.getElementById('close-simplified');

// State Variables
let currentFontSize = 16;
let isSpeaking = false;
const minFontSize = 12;
const maxFontSize = 32;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadThemePreference();
    loadFontSizePreference();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    readAloudBtn.addEventListener('click', handleReadAloud);
    stopBtn.addEventListener('click', handleStop);
    simplifyBtn.addEventListener('click', handleSimplify);
    themeToggle.addEventListener('click', toggleTheme);
    increaseFontBtn.addEventListener('click', increaseFontSize);
    decreaseFontBtn.addEventListener('click', decreaseFontSize);
    closeSimplifiedBtn.addEventListener('click', closeSimplified);
}

// Read Aloud Function
function handleReadAloud() {
    const text = textInput.value.trim();

    if (!text) {
        alert('Please enter some text to read aloud.');
        return;
    }

    if (isSpeaking) {
        speechSynthesis.cancel();
        isSpeaking = false;
        readAloudBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
        isSpeaking = true;
        readAloudBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
    };

    utterance.onend = () => {
        isSpeaking = false;
        readAloudBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
    };

    utterance.onerror = () => {
        isSpeaking = false;
        readAloudBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
        alert('Text-to-speech encountered an error. Please try again.');
    };

    speechSynthesis.speak(utterance);
}

// Stop Reading
function handleStop() {
    speechSynthesis.cancel();
    isSpeaking = false;
    readAloudBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
}

// Simplify Text Function
function handleSimplify() {
    const text = textInput.value.trim();

    if (!text) {
        alert('Please enter some text to simplify.');
        return;
    }

    const simplified = simplifyText(text);
    simplifiedText.textContent = simplified;
    simplifiedSection.style.display = 'block';
    simplifiedSection.scrollIntoView({ behavior: 'smooth' });
}

// Text Simplification Algorithm
function simplifyText(text) {
    // Split into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    const simplifiedSentences = sentences.map(sentence => {
        let simplified = sentence.trim();

        // Replace complex words with simpler alternatives
        const complexWords = {
            'utilize': 'use',
            'approximately': 'about',
            'subsequently': 'then',
            'nevertheless': 'however',
            'furthermore': 'also',
            'consequently': 'so',
            'therefore': 'so',
            'moreover': 'also',
            'notwithstanding': 'despite',
            'endeavor': 'try',
            'facilitate': 'help',
            'ameliorate': 'improve',
            'terminate': 'end',
            'initiate': 'start',
            'elucidate': 'explain',
            'expedite': 'speed up',
            'exacerbate': 'make worse',
            'mitigate': 'reduce',
            'perplexed': 'confused',
            'ubiquitous': 'everywhere',
            'ephemeral': 'temporary',
            'benevolent': 'kind',
            'malevolent': 'evil',
            'redundant': 'repetitive',
            'superfluous': 'extra',
            'ambiguous': 'unclear',
            'meticulous': 'careful',
            'pragmatic': 'practical',
            'theoretical': 'in theory',
            'contemporary': 'modern',
            'obsolete': 'outdated',
            'unprecedented': 'never seen before',
            'inevitable': 'certain to happen',
            'pertinent': 'relevant',
            'incessant': 'constant',
            'intermittent': 'on and off'
        };

        // Replace complex words (case-insensitive)
        for (const [complex, simple] of Object.entries(complexWords)) {
            const regex = new RegExp(`\\b${complex}\\b`, 'gi');
            simplified = simplified.replace(regex, simple);
        }

        // Break up very long sentences
        if (simplified.length > 150) {
            // Try to split at commas or conjunctions
            if (simplified.includes(',')) {
                simplified = simplified.replace(/,/g, '.\n');
            } else if (simplified.includes(' and ')) {
                simplified = simplified.replace(/ and /g, '.\n');
            }
        }

        return simplified;
    });

    return simplifiedSentences.join(' ').trim();
}

// Close Simplified Section
function closeSimplified() {
    simplifiedSection.style.display = 'none';
}

// Font Size Controls
function increaseFontSize() {
    if (currentFontSize < maxFontSize) {
        currentFontSize += 2;
        updateFontSize();
    }
}

function decreaseFontSize() {
    if (currentFontSize > minFontSize) {
        currentFontSize -= 2;
        updateFontSize();
    }
}

function updateFontSize() {
    textInput.style.fontSize = currentFontSize + 'px';
    fontSizeDisplay.textContent = currentFontSize + 'px';
    saveFontSizePreference();
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    saveThemePreference(isDarkMode);
}

// Local Storage - Theme
function saveThemePreference(isDarkMode) {
    localStorage.setItem('readease-theme', isDarkMode ? 'dark' : 'light');
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('readease-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ Light Mode';
    }
}

// Local Storage - Font Size
function saveFontSizePreference() {
    localStorage.setItem('readease-fontsize', currentFontSize);
}

function loadFontSizePreference() {
    const savedFontSize = localStorage.getItem('readease-fontsize');
    if (savedFontSize) {
        currentFontSize = parseInt(savedFontSize);
        updateFontSize();
    }
}

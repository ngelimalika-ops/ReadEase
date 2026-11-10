// DOM Elements
const textInput = document.getElementById('text-input');
const readAloudBtn = document.getElementById('read-aloud-btn');
const stopBtn = document.getElementById('stop-btn');
const simplifyBtn = document.getElementById('simplify-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const themeToggle = document.getElementById('theme-toggle');
const increaseFontBtn = document.getElementById('increase-font');
const decreaseFontBtn = document.getElementById('decrease-font');
const fontSizeDisplay = document.getElementById('font-size-display');
const simplifiedSection = document.getElementById('simplified-section');
const simplifiedText = document.getElementById('simplified-text');
const closeSimplifiedBtn = document.getElementById('close-simplified');
const copySimplifiedBtn = document.getElementById('copy-simplified-btn');
const charCountDisplay = document.getElementById('char-count');
const wordCountDisplay = document.getElementById('word-count');
const charCountStatDisplay = document.getElementById('char-count-stat');
const readingTimeDisplay = document.getElementById('reading-time');
const sentenceCountDisplay = document.getElementById('sentence-count');

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
    updateStats();
});

// Event Listeners
function setupEventListeners() {
    readAloudBtn.addEventListener('click', handleReadAloud);
    stopBtn.addEventListener('click', handleStop);
    simplifyBtn.addEventListener('click', handleSimplify);
    copyBtn.addEventListener('click', handleCopyText);
    downloadBtn.addEventListener('click', handleDownloadText);
    themeToggle.addEventListener('click', toggleTheme);
    increaseFontBtn.addEventListener('click', increaseFontSize);
    decreaseFontBtn.addEventListener('click', decreaseFontSize);
    closeSimplifiedBtn.addEventListener('click', closeSimplified);
    copySimplifiedBtn.addEventListener('click', handleCopySimplified);
    textInput.addEventListener('input', updateStats);
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

// Copy Text to Clipboard
function handleCopyText() {
    const text = textInput.value.trim();

    if (!text) {
        alert('Please enter some text to copy.');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showNotification('✓ Text copied to clipboard!');
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = '📋 Copy Text';
        }, 2000);
    }).catch(() => {
        alert('Failed to copy text. Please try again.');
    });
}

// Copy Simplified Text
function handleCopySimplified() {
    const text = simplifiedText.textContent.trim();

    if (!text) {
        alert('No simplified text to copy.');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showNotification('✓ Simplified text copied to clipboard!');
        copySimplifiedBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copySimplifiedBtn.textContent = '📋 Copy';
        }, 2000);
    }).catch(() => {
        alert('Failed to copy text. Please try again.');
    });
}

// Download Text as File
function handleDownloadText() {
    const text = textInput.value.trim();

    if (!text) {
        alert('Please enter some text to download.');
        return;
    }

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'readease-text.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification('✓ Text downloaded successfully!');
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
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
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    const simplifiedSentences = sentences.map(sentence => {
        let simplified = sentence.trim();

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
            'intermittent': 'on and off',
            'diligent': 'hardworking',
            'eloquent': 'well-spoken',
            'meager': 'small',
            'abundant': 'plenty',
            'gregarious': 'social',
            'solitary': 'alone',
            'prudent': 'wise',
            'reckless': 'careless',
            'vigilant': 'watchful',
            'negligent': 'careless',
            'resilient': 'strong',
            'fragile': 'delicate'
        };

        for (const [complex, simple] of Object.entries(complexWords)) {
            const regex = new RegExp(`\\b${complex}\\b`, 'gi');
            simplified = simplified.replace(regex, simple);
        }

        if (simplified.length > 150) {
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

// Update Statistics
function updateStats() {
    const text = textInput.value.trim();
    
    // Character count
    const charCount = text.length;
    charCountDisplay.textContent = charCount;
    charCountStatDisplay.textContent = charCount;
    
    // Word count
    const wordCount = text.length === 0 ? 0 : text.split(/\s+/).length;
    wordCountDisplay.textContent = wordCount;
    
    // Sentence count
    const sentenceCount = text.length === 0 ? 0 : (text.match(/[.!?]+/g) || []).length;
    sentenceCountDisplay.textContent = sentenceCount;
    
    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);
    readingTimeDisplay.textContent = readingTime === 0 ? '0 min' : readingTime + ' min';
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

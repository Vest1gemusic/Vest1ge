document.addEventListener('DOMContentLoaded', () => {
    // JavaScript for Translation Project
    const words = document.querySelectorAll('.word');
    const inputLines = document.querySelectorAll('.input-line');
    let originalPositions = {};

    let isAnimating = false;

    // FLIP technique animation (First Last Invert Play)
    const flip = (word, settings) => {
        const invert = {
            x: settings.first.left - settings.last.left,
            y: settings.first.top - settings.last.top
        };

        let animation = word.animate(
            [
                { transform: `scale(1, 1) translate(${invert.x}px, ${invert.y}px)` },
                { transform: `scale(1, 1) translate(0, 0)` }
            ],
            {
                duration: 300,
                easing: "ease"
            }
        );

        animation.onfinish = () => (isAnimating = false);
    };

    // Function to check and add a new line in .origin if necessary
    const checkAddNewLine = () => {
        const origin = document.querySelector('.origin');
        const lines = origin.querySelectorAll('.container');

        // Check if the last line has more than 5 words
        if (lines.length === 0 || lines[lines.length - 1].children.length >= 5) {
            const newLine = document.createElement('div');
            newLine.classList.add('container');
            origin.appendChild(newLine);
        }
    };

    // Save the original position of each word
    const saveOriginalPositions = () => {
        words.forEach(word => {
            const rect = word.getBoundingClientRect();
            originalPositions[word.innerText] = { top: rect.top, left: rect.left, container: word.closest('.container') };
        });
    };

    // Move the word to the next available input line
    const move = (word) => {
        let currentLineIndex = 0;

        // Find the next available input line
        for (let i = 0; i < inputLines.length; i++) {
            if (inputLines[i].children.length < 7) {
                currentLineIndex = i;
                break;
            }
        }

        const currentLine = inputLines[currentLineIndex];

        if (currentLine.children.length >= 7) {
            // Handle case when all lines are full (optional)
            return;
        }

        const id = Math.random().toString(36).substring(7);
        const container = word.closest('.container');
        let rect = word.getBoundingClientRect();
        let first, last;

        isAnimating = true;

        container.dataset.id = id;
        word.dataset.id = id;

        container.style.height = `${word.offsetHeight}px`;
        container.style.width = `${word.offsetWidth}px`;

        first = { top: rect.top, left: rect.left };
        currentLine.appendChild(word);
        rect = word.getBoundingClientRect();
        last = { top: rect.top, left: rect.left };

        checkAddNewLine(); // Check and add new line if needed

        flip(word, { first, last });
    };

    // Move the word back to its original container
    const putback = (word) => {
        const originalPosition = originalPositions[word.innerText];
        const container = originalPosition.container;
        const siblings = Array.from(inputLines).map(line => Array.from(line.children)).flat().filter(sib => sib !== word);

        let rect = word.getBoundingClientRect();
        let first, last;

        isAnimating = true;

        first = { top: rect.top, left: rect.left };

        siblings.forEach((sib) => {
            let rect = sib.getBoundingClientRect();
            sib.__first = { top: rect.top, left: rect.left };
        });

        container.appendChild(word);
        rect = word.getBoundingClientRect();
        last = { top: originalPosition.top, left: originalPosition.left }; // Use the original position for the last position

        siblings.forEach((sib) => {
            let rect = sib.getBoundingClientRect();
            sib.__last = { top: rect.top, left: rect.left };
        });

        flip(word, { first, last });
    };

    words.forEach((word) => {
        let rect = word.getBoundingClientRect();
        word.__first = { top: rect.top, left: rect.left };
    });

    words.forEach((word) => {
        word.addEventListener('click', () => {
            if (isAnimating) return;

            if (word.closest('.origin')) {
                move(word);
            } else {
                putback(word);
            }
        });
    });

    saveOriginalPositions();

    // JavaScript for Lyrics Project
    const lyricsDisplay = document.getElementById('lyrics-displaymain');
    const lines = [
        `This is the first line`,
        `And the second`,
        `Here's the third`,
        `Four`,
        `5th line is right here`,
        `Lastly, number six`
    ];
    let currentLineIndex = 0;

    displayLyrics();

    function displayLyrics() {
        lyricsDisplay.innerHTML = '';

        lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.classList.add('lyrics-line');

            if (index % 2 === 1) {
                lineElement.classList.add('right');
            }

            for (let i = 0; i < line.length; i++) {
                const span = document.createElement('span');
                span.textContent = line[i];
                lineElement.appendChild(span);
            }

            lyricsDisplay.appendChild(lineElement);
        });

        highlightCurrentLine();
    }

    const nextLineButton = document.getElementById('next-line-button');
    nextLineButton.addEventListener('click', () => {
        if (currentLineIndex < lines.length) {
            animateCurrentLine();
            currentLineIndex++;
        } else {
            currentLineIndex = 0;
            animateCurrentLine();
        }
    });

    function animateCurrentLine() {
        const lineElements = lyricsDisplay.querySelectorAll('.lyrics-line');

        if (currentLineIndex > 0) {
            const prevLineElement = lineElements[currentLineIndex - 1];
            const prevSpans = prevLineElement.querySelectorAll('span');
            prevSpans.forEach(span => {
                span.style.animation = `colorFadeBack 1s forwards`;
            });
        } else if (currentLineIndex === 0 && lineElements.length > 0) {
            const lastLineElement = lineElements[lineElements.length - 1];
            const lastSpans = lastLineElement.querySelectorAll('span');
            lastSpans.forEach(span => {
                span.style.animation = `colorFadeBack 1s forwards`;
            });
        }

        const currentLineElement = lineElements[currentLineIndex];
        const spans = currentLineElement.querySelectorAll('span');

        spans.forEach((span, index) => {
            span.style.animation = `colorChange 1s ${index * 0.05}s forwards`;
        });
    }

    function highlightCurrentLine() {
        const lineElements = lyricsDisplay.querySelectorAll('.lyrics-line');
        lineElements.forEach((lineElement, index) => {
            if (index === currentLineIndex) {
                lineElement.style.color = 'rgb(221, 221, 222)';
            } else {
                lineElement.style.color = 'rgb(99, 96, 100)';
            }
        });
    }

    // Switch between Translation and Lyrics projects
    const nextProjectButton = document.getElementById('next-project-button');
    const translationProject = document.getElementById('translation-project');
    const lyricsProject = document.getElementById('lyrics-project');
    let currentProject = translationProject;

    nextProjectButton.addEventListener('click', () => {
        currentProject.style.display = 'none';
        currentProject = currentProject === translationProject ? lyricsProject : translationProject;
        currentProject.style.display = 'block';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const projects = [
        {
            type: 'translation',
            content: `
                Write this in English
                ¿Dónde están los baños?
            `
        },
        {
            type: 'lyrics',
            content: `
                left: This is the first line
                right: And the second
                left: Here's the third
                right: Four
                left: 5th line is right here
                right: Lastly, number six
            `
        },
        // Add more projects similarly structured here
    ];

    const projectDisplay = document.getElementById('project-display');
    let currentProjectIndex = 0;

    displayProject();

    function displayProject() {
        const project = projects[currentProjectIndex];

        projectDisplay.innerHTML = ''; // Clear previous content

        if (project.type === 'translation') {
            displayTranslation(project.content);
        } else if (project.type === 'lyrics') {
            displayLyrics(project.content);
        }
        // Add more conditions for different project types as needed
    }

    function displayTranslation(content) {
        // Implement your translation display logic here
        projectDisplay.innerHTML = `
            <div class="translation-project">
                <!-- Your translation HTML structure -->
            </div>
        `;
        // Implement functionality for the translation project
        // You can use the previous code for the translation project here
    }

    function displayLyrics(content) {
        // Implement your lyrics display logic here
        const lines = content.trim().split('\n');
        let currentLineIndex = 0;

        lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.classList.add('lyrics-line');

            if (line.trim().startsWith('right:')) {
                lineElement.classList.add('right');
                line = line.replace('right:', '').trim();
            } else {
                line = line.replace('left:', '').trim();
            }

            for (let i = 0; i < line.length; i++) {
                const span = document.createElement('span');
                span.textContent = line[i];
                lineElement.appendChild(span);
            }

            projectDisplay.appendChild(lineElement);
        });

        highlightCurrentLine();
    }

    const nextProjectButton = document.getElementById('next-project-button');
    nextProjectButton.addEventListener('click', () => {
        if (currentProjectIndex < projects.length - 1) {
            currentProjectIndex++;
        } else {
            currentProjectIndex = 0;
        }
        displayProject();
    });

    function highlightCurrentLine() {
        const lineElements = projectDisplay.querySelectorAll('.lyrics-line');
        lineElements.forEach((lineElement, index) => {
            if (index === 0) {
                lineElement.style.color = 'rgb(221, 221, 222)';
            } else {
                lineElement.style.color = 'rgb(99, 96, 100)';
            }
        });
    }
});

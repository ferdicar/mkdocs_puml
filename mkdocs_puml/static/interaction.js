let copy_svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy">
<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
</svg>
`;

let check_svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check green">
<path d="M20 6 9 17l-5-5"/>
</svg>
`;

let controls = `
<div class="control">
    <button class="icon-button puml-copy">
        ${copy_svg}
    </button>
    <hr />
    <button class="icon-button puml-zoom-in">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus">
        <path d="M5 12h14"/><path d="M12 5v14"/>
        </svg>
    </button>
    <button class="icon-button puml-zoom-reset">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
    </button>
    <button class="icon-button puml-zoom-out">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus">
        <path d="M5 12h14"/>
        </svg>
    </button>
</div>
`;

document.addEventListener("DOMContentLoaded", function() {
    const svgs = document.querySelectorAll('.puml .diagram');
    svgs.forEach(svg => {
        // Get the computed width and height of each SVG
        // const rect = svg.querySelector('rect');
        let width = svg.getAttribute('width');
        let height = svg.getAttribute('height');

        width = parseInt(width);
        height = parseInt(height);

        if(isNaN(width) || isNaN(height)) {
            return
        }

        if (width > height) {
            svg.classList.add('wide-svg');
        }

        const g = svg.querySelector('g');
        const panzoom = Panzoom(g);

        g.parentElement.addEventListener('wheel', function (event) {
            if (!event.shiftKey) return
            // Panzoom will automatically use `deltaX` here instead
            // of `deltaY`. On a mac, the shift modifier usually
            // translates to horizontal scrolling, but Panzoom assumes
            // the desired behavior is zooming.
            panzoom.zoomWithWheel(event)
        });

        svg.insertAdjacentHTML("beforebegin", controls);

        const control = svg.parentElement.querySelector(".control");
        const copyBtn = control.querySelector(".puml-copy");
        const zoomResetBtn = control.querySelector(".puml-zoom-reset");
        const zoomInBtn = control.querySelector(".puml-zoom-in");
        const zoomOutBtn = control.querySelector(".puml-zoom-out");

        zoomResetBtn.addEventListener("click", event => {
            panzoom.reset({animate: false});
        });
        zoomInBtn.addEventListener("click", event => {
            panzoom.zoomIn();
        });
        zoomOutBtn.addEventListener("click", event => {
            panzoom.zoomOut();
        });

        let timeout = null;
        copyBtn.addEventListener("click", event => {
            clearTimeout(timeout);

            let btn = event.target.closest('button');
            btn.innerHTML = check_svg;

            timeout = setTimeout(() => {
                btn.innerHTML = copy_svg;
            }, 1500);
        });
        copyBtn.addEventListener("click", e => {
            const svgString = new XMLSerializer().serializeToString(svg);

            if(ClipboardItem.supports('image/svg+xml')){
                // Copy svg as file works only for https
                const blob = new Blob([svgString], { type: 'image/svg+xml' });
                navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            } else {
                // otherwise copy svg as text
                navigator.clipboard.writeText(svgString);
            }
        });
    });
});

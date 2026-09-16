/// global variables
let url = location.href;
let percent = -1;
///


async function init() {
    percent = await get_percent();
}


function scroll_watcher() {
    // prevent duplicate registration
    if (globalThis.__scroll_watcher) { return; }
    globalThis.__scroll_watcher = true;

    let timer = 0;

    addEventListener("scroll", () => {
        // record once if scrolling many times in 50ms
        if (timer) { return; }
        
        timer = setTimeout(() => {
            timer = 0;
            const total = document.scrollingElement.scrollHeight - window.innerHeight;

            chrome.storage.local.set({ 
                [url] : (window.scrollY / total) * 100
            });
        }, 500);
    });
};

// using example: scroll_to(47)
function scroll_to(percent) {
    if (percent <= 0 ) { return; }

    const el = document.scrollingElement;       
    const total = el.scrollHeight - window.innerHeight;
    
    window.scrollTo({
        left : 0, 
        top : (total * percent) / 100,
        behavior : "smooth"
    });
}

async function get_percent() {
    const {[url] : percent} = await chrome.storage.local.get({[url] : 0});
    return percent;
}


/// style_code, css_code
let style_code = `
    <style>
        :host { all: initial; }
        .card {
            width: 280px; padding: 12px 14px;
            background: rgb(1, 17, 25); color: #eaeaea;
            border-left: 3px solid #76b900;
            font: 24px/1.5 system-ui, sans-serif;
            box-shadow: 0 8px 28px rgba(0,0,0,.4);
            opacity: 0; transform: translateY(-10px);
            transition: opacity .2s, transform .2s;
            position: fixed;
            right : 1%;
            top : 10%;
        }
        .card.in { opacity: 1; transform: translateY(0); }
        .sub { color: #9aa0a6; font-size: 12px; margin-top: 2px; }
    </style>
    <div class="card">
        <div>欢迎回来</div>
    </div> `;

let css_code = "position:fixed;top:16px;right:16px;z-index:2147483647";
///

function attach_banner() {
    if (globalThis.__attach_banner) { return; }
    globalThis.__attach_banner = true;

    // if has no record or you haven't scroll this page since you opened it,
    // do not show the banner
    if (percent <= 0) { return; }

    const host = document.createElement("div");
    host.style.cssText = css_code;

    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = style_code;

    document.documentElement.appendChild(host);

    // enable fade in and out
    const card = root.querySelector(".card");
    requestAnimationFrame(() => card.classList.add("in"));

    // fade out
    setTimeout(() => {
        card.classList.remove("in");          
        setTimeout(() => host.remove(), 250);
    }, 5000);
}


async function main() {
    await init();

    scroll_watcher();
    attach_banner();

    await new Promise(resolve => setTimeout(resolve, 1000));

    scroll_to(percent);
}

main();




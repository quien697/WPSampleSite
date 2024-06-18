import axios from "axios";

class Search {
    constructor() {
        this.addSearchHTML();
        this.openButton = document.querySelectorAll(".js-search-trigger");
        this.closeButton = document.querySelector(".search-overlay__close");
        this.resultsDiv = document.querySelector("#search-overlay__results");
        this.searchOverlay = document.querySelector(".search-overlay");
        this.searchField = document.querySelector("#search-term");
        this.isOverlayOpen = false;
        this.isSpinnerVisible = false;
        this.previousValue = null;
        this.typingTimer = null;
        this.events();
    }

    events() {
        this.openButton.forEach(element => {
            element.addEventListener("click", e => {
                e.preventDefault();
                this.openOverlay();
            });
        });
        this.closeButton.addEventListener("click", () => this.closeOverlay());
        this.searchField.addEventListener("keyup", () => this.typingLogic());
        document.addEventListener("keydown", e => this.keyPressDispatcher(e));
    }

    keyPressDispatcher(e) {
        if (
            e.keyCode === 83 && !this.isOverlayOpen &&
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA"
        ) {
            this.openOverlay();
        }
        if (e.keyCode === 27 && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }

    typingLogic() {
        if (this.searchField.value !== this.previousValue) {
            clearTimeout(this.typingTimer);
            if (this.searchField.value) {
                if (!this.isSpinnerVisible) {
                    this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>';
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 750);
            } else {
                this.resultsDiv.innerHTML = "";
                this.isSpinnerVisible = false;
            }
        }
        this.previousValue = this.searchField.val();
    }

    async getResults() {
        try {
            const url = wpSampleSiteData.root_url + "/wp-json/wpSampleSite/v1/search?term=" + this.searchField.value;
            const response = await axios.get(url);
            const results = response.data;
            this.resultsDiv.innerHTML = `
                <div class="row">
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">General Information</h2>
                        ${results.generalInfo.length ? '<ul class="link-list min-list">' : "<p>No general information matches that search.</p>"}
                            ${results.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a> ${item.postType === "post" ? `by ${item.authorName}` : ""}</li>`).join("")}
                        ${results.generalInfo.length ? "</ul>" : ""}
                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Programs</h2>
                        ${results.programs.length ? '<ul class="link-list min-list">' : `<p>No programs match that search. <a href="${wpSampleSiteData.root_url}/programs">View all programs</a></p>`}
                            ${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join("")}
                        ${results.programs.length ? "</ul>" : ""}
            
                        <h2 class="search-overlay__section-title">Professors</h2>
                        ${results.professors.length ? '<ul class="professor-cards">' : `<p>No professors match that search.</p>`}
                        ${results.professors.map(item => `
                            <li class="professor-card__list-item">
                                <a class="professor-card" href="${item.permalink}">
                                    <img class="professor-card__image" src="${item.image}" alt="${item.title}">
                                    <span class="professor-card__name">${item.title}</span>
                                </a>
                            </li>
                        `).join("")}
                        ${results.professors.length ? "</ul>" : ""}
                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Campuses</h2>
                        ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match that search. <a href="${wpSampleSiteData.root_url}/campuses">View all campuses</a></p>`}
                            ${results.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join("")}
                        ${results.campuses.length ? "</ul>" : ""}
            
                        <h2 class="search-overlay__section-title">Events</h2>
                        ${results.events.length ? "" : `<p>No events match that search. <a href="${wpSampleSiteData.root_url}/events">View all events</a></p>`}
                        ${results.events.map(item => `
                            <div class="event-summary">
                                <a class="event-summary__date t-center" href="${item.permalink}">
                                    <span class="event-summary__month">${item.month}</span>
                                    <span class="event-summary__day">${item.day}</span>  
                                </a>
                                <div class="event-summary__content">
                                    <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
                                    <p>${item.description} <a href="${item.permalink}" class="nu gray">Learn more</a></p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
            this.isSpinnerVisible = false;
        } catch (e) {
            console.log("Error: " . e);
        }
    }

    openOverlay() {
        this.searchOverlay.classList.add("search-overlay--active");
        document.body.classList.add("body-no-scroll");
        this.searchField.value = "";
        setTimeout(() => this.searchField.focus(), 301);
        this.isOverlayOpen = true;
        return false;
    }

    closeOverlay() {
        this.searchOverlay.classList.remove("search-overlay--active");
        document.body.classList.remove("body-no-scroll");
        this.isOverlayOpen = false;
    };

    addSearchHTML() {
        document.body.insertAdjacentHTML("beforeend", `
            <div class="search-overlay">
                <div class="search-overlay__top">
                    <div class="container">
                        <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                        <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term" aria-autocomplete="off">
                        <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
                    </div>
                </div>
                <div class="container">
                    <div id="search-overlay__results"></div>
                </div>
            </div>
        `);
    }
}

export default Search;
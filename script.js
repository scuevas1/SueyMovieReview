(function () {
  const state = {
    data: [],
    filters: {
      genres: new Set(),
      minRating: 3,
    }
  };

  const els = {
    form: document.getElementById("filterForm"),
    cards: document.getElementById("cards"),
    ratingOut: document.getElementById("ratingOut"),
    genreChips: document.getElementById("genreChips"),
    reset: document.getElementById("resetBtn")
  };

  //this will load the inline JSON info of the movie first
  try {
    const raw = document.getElementById("movies-data")?.textContent?.trim() || "";
    const parsed = raw ? JSON.parse(raw) : null;
    state.data = Array.isArray(parsed?.movies) ? parsed.movies : [];
  } catch {
    state.data = [];
  }
  //this will make the function run when the page loads
  hydrateFilterOptions(state.data);
  render();

  
  function hydrateFilterOptions(list) {
    //these are the genre options from the filter. So the user can choose from those options and it will bring up a movie that is one of those genres. 
    if (!els.genreChips) return;   
    const genres = Array.from(new Set(list.flatMap(m => m.genres || []))).sort();
    els.genreChips.innerHTML = genres.map(g => `
      <label class="chip"><input type="checkbox" name="genre" value="${g}">${g}</label>
    `).join("");
  } 

  //this function will read the current form values into state. It will work when you click the apply button.
  function readFormIntoState() {
    const fd = new FormData(els.form);
    state.filters.minRating = Number(fd.get("minRating")) || 3;
    state.filters.genres    = new Set(fd.getAll("genre"));
  }

   //this part applies the filters that the user puts.
  function applyFilters(){
    const { genres, minRating, } = state.filters;

    return state.data.filter(m => {
      const genreOk  = genres.size ? (m.genres||[]).some(g => genres.has(g)) : true;
      const ratingOk = (m.rating||0) >= Number(minRating);
      return genreOk && ratingOk;
    });
  }

  //this part sorts the filtered movie list based on the selected sort option 
  function sortItems(list){
    return list.slice().sort((a,b)=> a.title.localeCompare(b.title));
  }

  //this will make a card for each movie. It will help organize the movies. it will provide info like the genre, year, rating and etc.
  function toCard(m) {
    const tags = (m.genres || []).map(t => `<span class="tag">${t}</span>`).join("");
    const poster = m.poster;  
    const href = m.slug || "#";
    return `
        <li>
        <a class="card-link" href="${href}">
            <article class="card">
            <figure><img src="${poster}" alt="Poster for ${m.title}" loading="lazy" /></figure>
            <h3>${m.title}</h3>
            <p class="meta">${m.year || ""} • <span class="badge">${(m.rating || 0).toFixed(1)}★</span></p>
            <div class="tags">${tags}</div>
            <p class="cta"><span class="btn">Read review</span></p>
            </article>
        </a>
        </li>
    `;
  }

  //this part will render the filtered, sorted, and paginated list to the page
  function render() {
    const filtered = applyFilters();
    els.cards.innerHTML = filtered.map(toCard).join("");
  }

  //this will keep the slider's number in sync, but it will not render.
  const ratingInput = document.querySelector('input[name="minRating"]');
  const ratingOut   = document.getElementById('ratingOut');

  function showRating(v) {
    ratingOut.textContent = Number(v).toFixed(1).replace(/\.0$/, '');
  }

  if (ratingInput && ratingOut) {
    showRating(ratingInput.value);

    ratingInput.addEventListener('input',  (e) => showRating(e.target.value));
    ratingInput.addEventListener('change', (e) => showRating(e.target.value));
  }


  //this submit button is the 'apply' button. It will read the values and make the changes on the page. 
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    readFormIntoState();
    render();
  });
  
  //this is the event listener that when the reset button is clicked it will reset the filter.
  els.reset.addEventListener("click", () => {
    state.filters = {
        genres: new Set(),
        minRating: 3,
    };

    els.form.reset();       
    if (els.ratingOut) els.ratingOut.textContent = state.filters.minRating;                        
    hydrateFilterOptions(state.data);            
    render();                                   
  });
})();

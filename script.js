(function(){
  const state = {
    data: [],
    filters: {
      genres: new Set(),
      q: "",
      minRating: 3,
      year: "",
      sort: "title-asc",
      perPage: 9,
      page: 1,
    },
  };

  const els = {
    form: document.getElementById("filterForm"),
    cards: document.getElementById("cards"),
    count: document.getElementById("count"),
    pageOut: document.getElementById("pageOut"),
    prev: document.getElementById("prevBtn"),
    next: document.getElementById("nextBtn"),
    ratingOut: document.getElementById("ratingOut"),
    genreChips: document.getElementById("genreChips"),
    yearSelect: document.getElementById("yearSelect"),
  };

  document.getElementById("year").textContent = new Date().getFullYear();

  //this part loads the info in the json first
  const inline = document.getElementById("movies-data")?.textContent?.trim() || "";
  try {
    state.data = JSON.parse(inline).movies || [];
  } catch { state.data = []; }

  //this renders the filter options instantly.
  hydrateFilterOptions(state.data);
  render();

  function hydrateFilterOptions(list){
    //these are the genre options from the filter. So the user can choose from those options and it will bring up a movie that is one of those genres.
    const genres = Array.from(new Set(list.flatMap(m => m.genres || []))).sort();
    els.genreChips.innerHTML = genres.map(g => `
      <label class="chip"><input type="checkbox" name="genre" value="${g}"> ${g}</label>
    `).join("");

    //this will the year options part. so the user can put in a year and it will bring up the movies of that year.
    const years = Array.from(new Set(list.map(m => m.year))).filter(Boolean).sort((a,b)=>b-a);
    els.yearSelect.insertAdjacentHTML("beforeend", years.map(y => `<option value="${y}">${y}</option>`).join(""));
  }
})();

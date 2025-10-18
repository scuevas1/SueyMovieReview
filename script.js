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

  //this part applies the filters that the user puts.
  function applyFilters(){
    const { genres, q, minRating, year } = state.filters;
    const needle = q.trim().toLowerCase();

    return state.data.filter(m => {
      const genreOk  = genres.size ? (m.genres||[]).some(g => genres.has(g)) : true;
      const ratingOk = (m.rating||0) >= Number(minRating);
      const yearOk   = year ? String(m.year) === String(year) : true;
      const haystack = `${m.title} ${(m.cast||[]).join(" ")} ${(m.keywords||[]).join(" ")}`.toLowerCase();
      const searchOk = needle ? haystack.includes(needle) : true;
      return genreOk && ratingOk && yearOk && searchOk;
    });
  }

  //this part sorts the filtered movie list based on the selected sort option 
  function sortItems(list){
    const [key, dir] = state.filters.sort.split("-");
    const mult = dir === "asc" ? 1 : -1;
    return list.sort((a,b)=>{
      if (key === "title")  return a.title.localeCompare(b.title) * mult;
      if (key === "rating") return ((a.rating||0)-(b.rating||0)) * mult;
      if (key === "year")   return ((a.year||0)-(b.year||0)) * mult;
      return 0;
    });
  }

  //this part figures out which items should be shown on the index.html page when the filter is edited.
  function paginate(list){
    const per = Number(state.filters.perPage);
    const start = (state.filters.page - 1) * per;
    const totalPages = Math.max(1, Math.ceil(list.length / per));
    const pageItems = list.slice(start, start + per);
    return [pageItems, totalPages];
  }


})();

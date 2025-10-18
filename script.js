(function () {
  const state = {
    data: [],
    filters: {
      genres: new Set(),
      q: "",
      minRating: 3,
      year: "",
      sort: "title-asc",
      perPage: 9,
      page: 1
    }
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
    yearSelect: document.getElementById("yearSelect")
  };

  document.getElementById("year").textContent = new Date().getFullYear();
})();

(function () {

//the set state for the filter & search    
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

  const cardsList = document.getElementById('cards');
  const countEl = document.getElementById('count');
  const filterForm = document.getElementById('filterForm');
  const genreChips = document.getElementById('genreChips');
  const yearSelect = document.getElementById('yearSelect');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageOut = document.getElementById('pageOut');
  const ratingOut= document.getElementById('ratingOut');

  let allMovies = [];
  let filteredMovies = [];
  let currentPage = 1;
  let perPage = 9;

  document.getElementById("year").textContent = new Date().getFullYear();


  

  function loadMovies() {
    const dataScript = document.getElementById('movies-data');
    if (!dataScript) return;
    const data = JSON.parse(dataScript.textContent);
    allMovies = data.movies;
    filteredMovies = [...allMovies];
    console.log(`Loaded ${allMovies.length} movies`);
  }

  loadMovies();
})();
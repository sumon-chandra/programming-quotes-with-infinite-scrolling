// !!!! To avoid the conflict of variables and functions that you have defined, you can wrap the whole code in an IIFE. !!!

(function () {
  const quotesEl = document.querySelector(".quotes");
  const loader = document.querySelector(".loader");
  loader.textContent = "Loading.......";
  // ** Get Quotes **
  const getQuotes = async (page, limit) => {
    const API_URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
    const response = await fetch(API_URL);
    // handle 404
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.status}`);
    }
    return await response.json();
  };

  // ** Show the Quotes **
  const showQuotes = (quotes) => {
    quotes.forEach((quote) => {
      const figure = document.createElement("figure");
      const blockquote = document.createElement("blockquote");
      const figcaption = document.createElement("figcaption");
      const p = document.createElement("p");
      p.textContent = quote.quote;
      figcaption.textContent = `--- ${quote.author}`;
      blockquote.appendChild(p);
      figure.append(blockquote, figcaption);
      figure.classList.add("quote");
      quotesEl.appendChild(figure);
    });
  };

  // ** Show & Hide indicators **
  const hideLoader = () => {
    loader.classList.add("hide");
  };
  const showLoader = () => {
    loader.classList.add("show");
  };

  // ** Control variables **
  let currentPage = 1;
  const limit = 10;
  let total = 0;

  // ** Has more Quotes? **
  const hasMoreQuotes = (page, limit, total) => {
    const startIndex = (page - 1) * limit + 1;
    return total === 0 || startIndex < total;
  };

  // ** Load quotes **
  const loadQuotes = async (page, limit) => {
    // show the loader
    showLoader();

    // 0.5 second later the quotes will be loaded
    setTimeout(async () => {
      try {
        // if having more quotes to fetch
        if (hasMoreQuotes(page, limit, total)) {
          // call the API to get quotes
          const response = await getQuotes(page, limit);
          // show quotes
          showQuotes(response.data);
          // update the total
          total = response.total;
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        hideLoader();
      }
    }, 500);
  };

  // ** Attach Scroll event **
  window.addEventListener(
    "scroll",
    () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (
        scrollTop + clientHeight >= scrollHeight - 5 &&
        hasMoreQuotes(currentPage, limit, total)
      ) {
        currentPage++;
        loadQuotes(currentPage, limit);
      }
    },
    {
      passive: true,
    }
  );

  loadQuotes(currentPage, limit);
})();

const API_KEY = "AIzaSyBhBqi0Gj6aKHuqI_e5lJVBL3ko28KRcYA";
const RANDOM_BOOK_QUERY = "classic literature";

async function searchBooks() {
    const [bookList] = localStorage.getItem("bookList")

    const query = document.getElementById("search").value;
    if (!query) {
        alert("Please enter a book name to search.");
        return;
    }
    
    localStorage.setItem("bookList", JSON.stringify([query]))

    // const a = localStorage.getItem("bookList")
    // console.log(a, "====================");
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <div class="loading">
            <p>Searching for books...</p>
        </div>
    `;

    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            resultsDiv.innerHTML = "";
            data.items.forEach((book) => {
                const bookCard = createBookCard(book);
                resultsDiv.appendChild(bookCard);
            });
        } else {
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <p>No books found. Try a different query.</p>
                </div>
            `;
        }
    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="error">
                <p>Error fetching book data. Please try again later.</p>
            </div>
        `;
        console.error("Error fetching books:", error);
    }
}

function createBookCard(book) {
    console.log(book);
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";

    const title = book.volumeInfo.title || "No Title Available";
    const authors = book.volumeInfo.authors?.join(", ") || "Unknown Author";
    const thumbnail = book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150x225?text=No+Image";
    const previewLink = book.volumeInfo.previewLink || "#";
    const webViewLink = book.accessInfo.viewability !== "NO_PAGES" ? book.accessInfo.webReaderLink : null;
    const buyLink = book.saleInfo?.buyLink;

    bookCard.innerHTML = `
        <img src="${thumbnail}" alt="${title}" />
        <h3>${title}</h3>
        <p><strong>Author(s):</strong> ${authors}</p>
        <div class="book-buttons">
            <a href="${previewLink}" target="_blank" class="button read-more">Read More</a>
            ${webViewLink ? `<a href="${webViewLink}" target="_blank" class="button read-pdf">Read PDF</a>` : ""}
            ${buyLink ? `<a href="${buyLink}" target="_blank" class="button buy-book">Buy eBook</a>` : ""}
        </div>
    `;

    return bookCard;
}

async function displayRandomBook() {
    let randomBook;
    const randomBookDiv = document.getElementById("about-random-book");
    randomBookDiv.innerHTML = `
        <div class="loading">
            <p>Finding a book for you...</p>
        </div>
    `;
    const bookList = localStorage.getItem("bookList")   ////////////////////////////
    if(!bookList){
        const list = ["atomic habit"];

        localStorage.setItem("bookList", JSON.stringify(list));
    }
    
    // const a = localStorage.getItem("bookList")
    // console.log(a, "====================");

    try {
        const [b] = JSON.parse(bookList);
        console.log(b, "====================");
        console.log(Array.isArray(b), "====================");
        const title = JSON.stringify({book: b})
        console.log(title, "===++++++++++++");
       const geminiResponse = await fetch("https://bookfinder1010.vercel.app/ai" , {
            method: 'POST', // Specify the request method
            headers: {
                'Content-Type': 'application/json' // Set headers (adjust as needed)
            },
            body: title // Convert data to JSON format
        })
        
        const data = await geminiResponse.json();
        console.log(data.response)
        randomBook = data.response;
    } catch (error) {
        console.log(error)
    }
    try {

        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${randomBook}&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.items.length);
            const book = data.items[randomIndex];

            const title = book.volumeInfo.title || "No Title Available";
            const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown Author";
            const description = book.volumeInfo.description || "No description available.";
            const thumbnail = book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/200x300?text=No+Image";

            randomBookDiv.innerHTML = `
                <div class="random-book-content">
                    <img src="${thumbnail}" alt="${title}" />
                    <div class="book-details">
                        <h4>${title}</h4>
                        <p><strong>Author(s):</strong> ${authors}</p>
                        <p><strong>Description:</strong> ${description}</p>
                    </div>
                </div>
            `;
        } else {
            randomBookDiv.innerHTML = `
                <div class="no-results">
                    <p>No random book found. Try refreshing the page.</p>
                </div>
            `;
        }
    } catch (error) {
        randomBookDiv.innerHTML = `
            <div class="error">
                <p>Cannot fetch book. Please try again later.</p>
            </div>
        `;
        console.error("Cannot fetch book:", error);
    }
}

window.onload = () => {
    displayRandomBook();
};
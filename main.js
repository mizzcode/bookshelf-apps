document.addEventListener("DOMContentLoaded", function() {
    // membuat key untuk local storage
    const KEY_BOOKS = "key-books";
    // membuat nama custom event
    const RENDER_EVENT = "render-books";
    // menampung object buku
    const books = [];
    // add custom event handler untuk render buku
    document.addEventListener(RENDER_EVENT, function() {
        const incompleteBook = document.getElementById("incompleteBookshelfList");
        incompleteBook.innerHTML = "";

        const completeBook = document.getElementById("completeBookshelfList");
        completeBook.innerHTML = "";

        for (let book of books) {
            const bookElement = makeBook(book); 
            if (!book.isComplete) {
                incompleteBook.append(bookElement);
            } else {
                completeBook.append(bookElement); 
            }
        }
    });

    const checkbox = document.getElementById("inputBookIsComplete");
    const rakBuku = document.getElementById("rak");
    rakBuku.innerText = "Belum selesai dibaca";
    
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            rakBuku.innerText = "Selesai dibaca";
        } else {
            rakBuku.innerText = "Belum selesai dibaca";
        }
    });
    // form input book
    document.getElementById("inputBook").addEventListener("submit", function(e) {
        e.preventDefault();
        addBook();
    });
    // form search book
    document.getElementById("searchBook").addEventListener("submit", function(e) {
        e.preventDefault();
        searchBook();
    })

    // Method Search Book
    function searchBook() {
        // get input search and then change to lower case
        const inputSearchBookTitle = document.getElementById("searchBookTitle").value.toLowerCase();
        // get all element article
        const listArticle = document.querySelectorAll("article"); 
        // get all element h3
        const bookTitle = document.querySelectorAll(".book-title");
        // perulangan dengan panjang sesuai artikel
        for (let i = 0; i < listArticle.length; i++) {
            // judul buku
            const bookTitleText = bookTitle[i].innerText.toLowerCase();
            // cek apakah input nya kosong apa tidak
            if (inputSearchBookTitle != "") {
                // jika dalam input search mengandung sepotong kata dari judul buku maka hapus atribut hidden
                if (bookTitleText.includes(inputSearchBookTitle)) {
                    listArticle[i].removeAttribute("hidden");
                    // tapi jika tidak ada maka set atribut hidden
                } else {
                    listArticle[i].setAttribute("hidden", true);
                }
                // jika kosong hapus atribut hidden
            } else {
                listArticle[i].removeAttribute("hidden");
            }
        }
    }
    

    function addBook() {
        const id = +new Date;
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = document.getElementById("inputBookYear").value;
        let isComplete = false;
        
        if (checkbox.checked) {
            isComplete = true;
        }

        const objectBook = {
            id,
            title,
            author,
            year: parseInt(year),
            isComplete: Boolean(isComplete)
        }
        books.push(objectBook);

        // bangkitkan render event
        document.dispatchEvent(new Event(RENDER_EVENT));
        // simpan buku baru ke local storage
        saveWebStorage();
    }

    function makeBook(bookObject) {
        const bookTitle = document.createElement("h3");
        bookTitle.classList.add("book-title");
        bookTitle.innerText = bookObject.title;

        const bookAuthor = document.createElement("p");
        bookAuthor.innerText = `Penulis: ${bookObject.author}`;

        const bookYear = document.createElement("p");
        bookYear.innerText = `Tahun: ${bookObject.year}`;

        const article = document.createElement("article");
        article.classList.add("book_item");
        article.append(bookTitle, bookAuthor, bookYear);

        if (!bookObject.isComplete) {
            const notFinishedReading = document.createElement("button");
            notFinishedReading.classList.add("green");
            notFinishedReading.innerText = "Selesai dibaca";
            notFinishedReading.addEventListener("click", function() {
                // memindahkan buku ke selesai dibaca
                addBookToCompleted(bookObject.id);
                // jika ada data buku berubah maka simpan juga perubahan nya ke web storage
                saveWebStorage();
            });

            const deleteBookIncompleted = document.createElement("button");
            deleteBookIncompleted.classList.add("red");
            deleteBookIncompleted.innerText = "Hapus buku";
            deleteBookIncompleted.addEventListener("click", function() {
                // hapus buku
                deleteBook(bookObject.id);
                // jika ada data buku berubah maka simpan juga perubahan nya ke web storage
                saveWebStorage();
            });

            const div = document.createElement("div");
            div.classList.add("action");
            div.append(notFinishedReading, deleteBookIncompleted);

            article.append(div);
        } else {
            const finishedReading = document.createElement("button");
            finishedReading.classList.add("green");
            finishedReading.innerText = "Belum selesai dibaca";
            finishedReading.addEventListener("click", function() {
                moveBookToIncompleted(bookObject.id);
                // jika ada data buku berubah maka simpan juga perubahan nya ke web storage
                saveWebStorage();
            });

            const deleteBookCompleted = document.createElement("button");
            deleteBookCompleted.classList.add("red");
            deleteBookCompleted.innerText = "Hapus buku";
            deleteBookCompleted.addEventListener("click", function() {
                deleteBook(bookObject.id);
            });

            const div = document.createElement("div");
            div.classList.add("action");
            div.append(finishedReading, deleteBookCompleted);

            article.append(div);
        }

        return article;
    }

    function addBookToCompleted(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function moveBookToIncompleted(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function deleteBook(bookId) {
        const bookTarget = findBookIndex(bookId);

        if (bookTarget == -1) return;

        books.splice(bookTarget, 1);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveWebStorage();
    }

    function findBookIndex(bookId) {
        // looping data array
        for (const index in books) {
            // cek jika object id dalam array sama dengan book id yang di cari
            if (books[index].id == bookId) {
                return index;
            }
        }
        return -1;
    }
    

    function findBook(bookId) {
        for (let book of books) {
            if (book.id == bookId) {
                return book;
            }
        }
    }

    function supportWebStorage() {
        if (typeof localStorage !== "undefined") {
            return true;
        } else {
            alert("Maaf, browser anda tidak mendukung web storage");
            return false;
        }
    }

    function saveWebStorage() {
        if (supportWebStorage()) {
            const stringify = JSON.stringify(books);
            localStorage.setItem(KEY_BOOKS, stringify);
        } 
    }

    window.addEventListener("load", function() {
        if (supportWebStorage()) {
            if (localStorage.getItem(KEY_BOOKS) !== null) {
                const data = JSON.parse(localStorage.getItem(KEY_BOOKS));
                for (let book of data) {
                    books.push(book);
                }

                document.dispatchEvent(new Event(RENDER_EVENT));
            }
        }
    });
});
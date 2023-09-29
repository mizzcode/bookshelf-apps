document.addEventListener("DOMContentLoaded", function() {
    // membuat key untuk local storage
    const KEY_BOOKS = "key-books";
    // membuat nama custom event
    const RENDER_EVENT = "render-books";
    // menampung object buku
    const books = [];
    // add custom event handler untuk render buku
    document.addEventListener(RENDER_EVENT, function() {
        // ambil element div untuk rak belum selesai dibaca
        const incompleteBook = document.getElementById("incompleteBookshelfList");
        // hapus agar bersih isi dari element div untuk rak belum selesai dibaca
        incompleteBook.innerHTML = "";
        // ambil element div untuk rak selesai dibaca
        const completeBook = document.getElementById("completeBookshelfList");
        // hapus agar bersih isi dari element div untuk rak selesai dibaca
        completeBook.innerHTML = "";

        // looping data array buku
        for (let book of books) {
            // membuat element buku
            const bookElement = makeBook(book); 
            // jika buku belum selesai dibaca atau isComplete nya false
            if (!book.isComplete) {
                // masukkan element-element buku ke rak buku belum selesai dibaca
                incompleteBook.append(bookElement);
            } else {
                // jika buku selesai dibaca atau isComplete nya true
                // masukkan element-element buku ke rak buku selesai dibaca
                completeBook.append(bookElement); 
            }
        }
    });
    // ambil element input checkbox
    const checkbox = document.getElementById("inputBookIsComplete");
    // ambil element span untuk rak buku
    const rakBuku = document.getElementById("rak");
    // set default untuk rak buku
    rakBuku.innerText = "Belum selesai dibaca";
    // membuat event change untuk input checkbox
    checkbox.addEventListener("change", function() {
        // jika di centang maka ubah text rak buku nya
        if (checkbox.checked) {
            rakBuku.innerText = "Selesai dibaca";
        } else {
            rakBuku.innerText = "Belum selesai dibaca";
        }
    });
    // form input book
    document.getElementById("inputBook").addEventListener("submit", function(e) {
        // agar tidak me-refresh halaman ketika submit
        e.preventDefault();
        // memanggil method menambah buku
        addBook();
    });
    // form search book
    document.getElementById("searchBook").addEventListener("submit", function(e) {
        // agar tidak me-refresh halaman ketika submit
        e.preventDefault();
        // memanggil method mencari buku
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
                // jika input kosong hapus atribut hidden
            } else {
                listArticle[i].removeAttribute("hidden");
            }
        }
    }
    
    // method menambah buku
    function addBook() {
        // membuat random number atau timestamp
        const id = +new Date;
        // mengambil value dari input book title
        const title = document.getElementById("inputBookTitle").value;
        // mengambil value dari input book author
        const author = document.getElementById("inputBookAuthor").value;
        // mengambil value dari input book year
        const year = document.getElementById("inputBookYear").value;
        // set default dibaca nya false
        let isComplete = false;
        // jika input checkbox pada form di centang maka ubah value nya jadi true
        if (checkbox.checked) {
            isComplete = true;
        }
        /*
            membuat object baru untuk buku dengan value dari masing-masing input, 
            khusus year akan di ubah menjadi tipe data integer dan isComplete jadi tipe data boolean
         */
        const objectBook = {
            id,
            title,
            author,
            year: parseInt(year),
            isComplete: Boolean(isComplete)
        }
        // memasukkan object ke array
        books.push(objectBook);

        // bangkitkan render event
        document.dispatchEvent(new Event(RENDER_EVENT));
        // simpan buku baru ke local storage
        saveWebStorage();
    }
    // method untuk membuat buku atau membuat sebuah element-element baru
    function makeBook(bookObject) {
        // membuat element baru heading 3
        const bookTitle = document.createElement("h3");
        // menambahkan atribut class dengan value book-title
        bookTitle.classList.add("book-title");
        // set text untuk heading nya dari bookObject.title
        bookTitle.innerText = bookObject.title;
        // membuat element baru untuk author dengan element paragraf
        const bookAuthor = document.createElement("p");
        // set text untuk paragraf nya
        bookAuthor.innerText = `Penulis: ${bookObject.author}`;
        // membuat element baru untuk tahun terbit nya buku menggunakan element paragraf
        const bookYear = document.createElement("p");
        // set text untuk paragraf
        bookYear.innerText = `Tahun: ${bookObject.year}`;
        // membuat element article
        const article = document.createElement("article");
        // menambahkan atribut class dengan value book_item
        article.classList.add("book_item");
        // memasukkan beberapa child element ke element article
        article.append(bookTitle, bookAuthor, bookYear);

        if (!bookObject.isComplete) {
            const notFinishedReading = document.createElement("button");
            notFinishedReading.classList.add("green");
            notFinishedReading.innerText = "Selesai dibaca";
            notFinishedReading.addEventListener("click", function() {
                // muncul popup confirm untuk memastikan benar-benar ingin dipindahkan ke rak buku lainnya?
                if (confirm("Pindahkan ke rak buku selesai dibaca?")) {
                    // jika ya pindahkan buku ke selesai dibaca
                    addBookToCompleted(bookObject.id);
                    // jika ada data buku berubah maka simpan juga perubahan nya ke web storage
                    saveWebStorage();
                }
            });

            const deleteBookIncompleted = document.createElement("button");
            deleteBookIncompleted.classList.add("red");
            deleteBookIncompleted.innerText = "Hapus buku";
            deleteBookIncompleted.addEventListener("click", function() {
                // muncul popup confirm untuk memastikan benar-benar ingin dipindahkan ke rak buku lainnya?
                if (confirm("Yakin ingin menghapus buku?")) {
                    // jika ya maka hapus buku
                    deleteBook(bookObject.id);
                    // jika ada data buku berubah maka simpan juga perubahan nya ke web storage
                    saveWebStorage();
                }
            });
            // membuat element div
            const div = document.createElement("div");
            // menambahkan atribut class dengan value action
            div.classList.add("action");
            // memasukkan beberapa child element ke element div
            div.append(notFinishedReading, deleteBookIncompleted);
            // masukkan element div ke element article
            article.append(div);
        } else {
            const finishedReading = document.createElement("button");
            finishedReading.classList.add("green");
            finishedReading.innerText = "Belum selesai dibaca";
            finishedReading.addEventListener("click", function() {
                // muncul popup confirm untuk memastikan benar-benar ingin dipindahkan ke rak buku lainnya?
                if (confirm("Pindahkan ke rak buku belum selesai dibaca?")) {
                    // jika ya pindahkan buku ke belum selesai dibaca
                    moveBookToIncompleted(bookObject.id);
                    // jika ada data buku berubah maka simpan juga perubahan nya ke web storage
                    saveWebStorage();
                }
            });

            const deleteBookCompleted = document.createElement("button");
            deleteBookCompleted.classList.add("red");
            deleteBookCompleted.innerText = "Hapus buku";
            deleteBookCompleted.addEventListener("click", function() {
                // muncul popup confirm untuk memastikan benar-benar ingin dipindahkan ke rak buku lainnya?
                if (confirm("Yakin ingin menghapus buku?")) {
                    // jika ya maka hapus buku
                    deleteBook(bookObject.id);
                    // jika ada data buku berubah maka simpan juga perubahan nya ke web storage
                    saveWebStorage();
                }
            });
            // membuat element div
            const div = document.createElement("div");
            // menambahkan atribut class dengan value action
            div.classList.add("action");
            // memasukkan beberapa child element ke element div
            div.append(finishedReading, deleteBookCompleted);
            // memasukkan element div ke element article
            article.append(div);
        }
        return article;
    }
    // membuat method untuk memindahkan buku ke rak selesai dibaca
    function addBookToCompleted(bookId) {
        // mencari buku berdasarkan id
        const bookTarget = findBook(bookId);
        // jika buku tidak ada langsung return
        if (bookTarget == null) return;
        // jika buku nya ada maka ubah isComplete menjadi true
        bookTarget.isComplete = true;
        // membangkitkan custom event untuk update data buku
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
    // membuat method untuk memindahkan buku ke rak belum selesai dibaca
    function moveBookToIncompleted(bookId) {
        // mencari buku berdasarkan id
        const bookTarget = findBook(bookId);
        // jika buku tidak ada langsung return
        if (bookTarget == null) return;
        // jika buku nya ada maka ubah isComplete menjadi false
        bookTarget.isComplete = false;
        // membangkitkan custom event untuk update data buku
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
    // membuat method untuk menghapus buku
    function deleteBook(bookId) {
        // mencari buku berdasarkan index
        const bookTarget = findBookIndex(bookId);
        // jika buku tidak ada langsung return
        if (bookTarget == -1) return;
        // hapus buku berdasarkan index kemudian hapus 1 data
        books.splice(bookTarget, 1);
        // membangkitkan custom event untuk update data buku
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
    // membuat method untuk mencari buku untuk mendapatkan index dari buku
    function findBookIndex(bookId) {
        // looping data array
        for (const index in books) {
            // cek jika object id dalam array sama dengan book id yang di cari
            if (books[index].id == bookId) {
                // return index nya
                return index;
            }
        }
        // jika tidak cocok maka return -1 artinya tidak ada buku yang cocok
        return -1;
    }
    // membuat method mencari buku untuk mendapatkan data buku
    function findBook(bookId) {
        // looping array buku
        for (let book of books) {
            // mengecek apakah cocok dengan book id yang di cari
            if (book.id == bookId) {
                // jika ada maka return data buku
                return book;
            }
        }
        // jika tidak ada data buku return null
        return null;
    }
    // membuat method untuk mengecek apakah browser support dengan web storage ?
    function supportWebStorage() {
        // jika local storage tidak undefined
        if (typeof localStorage !== "undefined") {
            return true;
        } else {
            // jika tidak support berikan alert
            alert("Maaf, browser anda tidak mendukung web storage");
            return false;
        }
    }
    // membuat method untuk menyimpan data array buku ke local storage
    function saveWebStorage() {
        // cek apakah support web storage
        if (supportWebStorage()) {
            // jika ya maka ubah menjadi json string
            const stringify = JSON.stringify(books);
            // lalu simpan ke local storage berdasarkan key
            localStorage.setItem(KEY_BOOKS, stringify);
        } 
    }
    // membuat event jika browser selesai di load
    // ini event agar ketika browser ter-refresh data di rak buku masih tetap terjaga
    window.addEventListener("load", function() {
        // cek apakah support web storage
        if (supportWebStorage()) {
            // cek jika data buku di local storage itu tidak null
            if (localStorage.getItem(KEY_BOOKS) !== null) {
                // ambil data dari local storage kemudian parsing ke object asli
                const data = JSON.parse(localStorage.getItem(KEY_BOOKS));
                // looping data array yang isi nya object asli
                for (let book of data) {
                    // masing-masing object akan di masukkan ke array buku
                    books.push(book);
                }
                // kemudian bangkitkan event untuk update data buku
                document.dispatchEvent(new Event(RENDER_EVENT));
            }
        }
    });
});
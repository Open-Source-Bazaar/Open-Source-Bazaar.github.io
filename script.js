// Mock data for Open Library
const books = [
    {
        id: 1,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt, David Thomas",
        status: "available",
        borrower: null,
        returnDate: null,
        description: "A timeless guide to software craftsmanship. Covers topics from career development to practical techniques.",
        cover: "https://placehold.co/150x200?text=Pragmatic+Prog"
    },
    {
        id: 2,
        title: "Clean Code",
        author: "Robert C. Martin",
        status: "borrowed",
        borrower: "Alice",
        returnDate: "2025-03-10",
        description: "A handbook of agile software craftsmanship. Learn to write code that is readable, maintainable, and efficient.",
        cover: "https://placehold.co/150x200?text=Clean+Code"
    },
    {
        id: 3,
        title: "Design Patterns",
        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        status: "available",
        borrower: null,
        returnDate: null,
        description: "The classic reference for object-oriented design patterns. Essential for any serious developer.",
        cover: "https://placehold.co/150x200?text=Design+Patterns"
    },
    {
        id: 4,
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        status: "borrowed",
        borrower: "Bob",
        returnDate: "2025-03-15",
        description: "Dive deep into the JavaScript language. This series explores the trickier parts of JS.",
        cover: "https://placehold.co/150x200?text=YDKJS"
    },
    {
        id: 5,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
        status: "available",
        borrower: null,
        returnDate: null,
        description: "The go-to textbook for algorithms. Covers sorting, graph algorithms, dynamic programming, and more.",
        cover: "https://placehold.co/150x200?text=Algorithms"
    },
    {
        id: 6,
        title: "The Art of Computer Programming",
        author: "Donald E. Knuth",
        status: "borrowed",
        borrower: "Charlie",
        returnDate: "2025-04-01",
        description: "Knuth's masterwork. Comprehensive and authoritative, though challenging.",
        cover: "https://placehold.co/150x200?text=TAOCP"
    }
];

// Render book grid
function renderBooks(filteredBooks) {
    const container = document.getElementById('book-list');
    container.innerHTML = '';
    if (!filteredBooks || filteredBooks.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#7f8c8d;">No books found.</p>';
        return;
    }
    filteredBooks.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.id = book.id;
        card.addEventListener('click', () => openModal(book.id));

        const statusClass = book.status === 'available' ? 'available' : 'borrowed';
        const statusText = book.status === 'available' ? 'Available' : 'Borrowed';
        let borrowerInfo = '';
        if (book.status === 'borrowed' && book.borrower) {
            borrowerInfo = `<div class="borrower">Borrowed by <span>${book.borrower}</span></div>`;
        }

        card.innerHTML = `
            <h3>${book.title}</h3>
            <div class="author">by ${book.author}</div>
            <div class="status ${statusClass}">${statusText}</div>
            ${borrowerInfo}
        `;
        container.appendChild(card);
    });
}

// Open modal with book details
function openModal(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const modal = document.getElementById('book-modal');
    const body = document.getElementById('modal-body');
    const statusClass = book.status === 'available' ? 'available' : 'borrowed';
    const statusText = book.status === 'available' ? 'Available' : 'Borrowed';
    let borrowInfo = '';
    if (book.status === 'borrowed' && book.borrower && book.returnDate) {
        borrowInfo = `
            <div class="borrow-info">
                <p><strong>Status:</strong> <span class="${statusClass}">${statusText}</span></p>
                <p><strong>Borrowed by:</strong> ${book.borrower}</p>
                <p><strong>Expected return:</strong> ${book.returnDate}</p>
            </div>
        `;
    } else {
        borrowInfo = `
            <div class="borrow-info">
                <p><strong>Status:</strong> <span class="${statusClass}">${statusText}</span></p>
                <p>This book is available for borrowing.</p>
            </div>
        `;
    }

    const borrowButton = book.status === 'available' 
        ? '<button class="btn-borrow" onclick="borrowBook(' + book.id + ')">Borrow This Book</button>'
        : '<button class="btn-borrow" disabled>Currently Borrowed</button>';

    body.innerHTML = `
        <h2>${book.title}</h2>
        <div class="author">by ${book.author}</div>
        <p class="description">${book.description}</p>
        ${borrowInfo}
        ${borrowButton}
    `;

    modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('book-modal');
    modal.classList.add('hidden');
}

// Borrow book (simulate)
function borrowBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book || book.status !== 'available') return;

    // Simulate borrowing: update status
    book.status = 'borrowed';
    book.borrower = 'You (current user)';
    book.returnDate = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]; // 24h

    alert(`You have borrowed "${book.title}". It will be returned automatically on ${book.returnDate}.`);
    closeModal();
    applyFilters();
}

// Filter and search
function applyFilters() {
    const searchTerm = document.getElementById('search').value.toLowerCase().trim();
    const statusFilter = document.getElementById('filter-status').value;

    let filtered = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                              book.author.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    renderBooks(filtered);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderBooks(books);

    document.getElementById('search').addEventListener('input', applyFilters);
    document.getElementById('filter-status').addEventListener('change', applyFilters);

    // Close modal on X click
    document.querySelector('.close-btn').addEventListener('click', closeModal);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('book-modal');
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
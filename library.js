// Sample book data
const books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', status: 'available', borrower: null, dueDate: null },
  { id: 2, title: 'The Pragmatic Programmer', author: 'David Thomas', isbn: '978-0135957059', status: 'borrowed', borrower: 'Alice', dueDate: '2025-03-15' },
  { id: 3, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', status: 'available' },
  { id: 4, title: 'Design Patterns', author: 'Erich Gamma', isbn: '978-0201633610', status: 'borrowed', borrower: 'Bob', dueDate: '2025-03-20' },
  { id: 5, title: 'The Mythical Man-Month', author: 'Fred Brooks', isbn: '978-0201835953', status: 'available' }
];

const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const bookModal = document.getElementById('book-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

function renderBooks(filteredBooks) {
  bookList.innerHTML = '';
  filteredBooks.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.id = book.id;
    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>ISBN:</strong> ${book.isbn}</p>
      <span class="status ${book.status}">${book.status === 'available' ? 'Available' : 'Borrowed'}</span>
    `;
    card.addEventListener('click', () => showBookDetail(book));
    bookList.appendChild(card);
  });
}

function filterBooks() {
  const searchTerm = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  let filtered = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                          book.author.toLowerCase().includes(searchTerm);
    const matchesStatus = status === 'all' || book.status === status;
    return matchesSearch && matchesStatus;
  });
  renderBooks(filtered);
}

function showBookDetail(book) {
  let detailHTML = `
    <h2>${book.title}</h2>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>ISBN:</strong> ${book.isbn}</p>
    <p><strong>Status:</strong> <span class="status ${book.status}">${book.status === 'available' ? 'Available' : 'Borrowed'}</span></p>
  `;
  if (book.status === 'borrowed') {
    detailHTML += `
      <p><strong>Borrowed by:</strong> ${book.borrower}</p>
      <p><strong>Due date:</strong> ${book.dueDate}</p>
    `;
  } else {
    detailHTML += `<p>This book is currently available for borrowing.</p>`;
  }
  modalBody.innerHTML = detailHTML;
  bookModal.style.display = 'flex';
}

modalClose.addEventListener('click', () => {
  bookModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === bookModal) {
    bookModal.style.display = 'none';
  }
});

searchInput.addEventListener('input', filterBooks);
statusFilter.addEventListener('change', filterBooks);

// Initial render
filterBooks();
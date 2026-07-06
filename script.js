// Mock book data
const books = [
    {
        id: 1,
        title: '深入理解计算机系统',
        author: 'Randal E. Bryant',
        cover: '💻',
        status: 'available',
        description: '本书从程序员的视角详细阐述计算机系统的本质概念，并展示这些概念如何实实在在地影响应用程序的正确性、性能和实用性。',
        borrower: null,
        borrowDate: null,
        dueDate: null
    },
    {
        id: 2,
        title: '代码大全（第2版）',
        author: 'Steve McConnell',
        cover: '📘',
        status: 'borrowed',
        description: '被誉为“软件构建的圣经”，全面介绍了软件构建的各个方面，包括设计、编码、测试等。',
        borrower: '张三',
        borrowDate: '2025-01-15',
        dueDate: '2025-02-14'
    },
    {
        id: 3,
        title: '算法导论（第3版）',
        author: 'Thomas H. Cormen',
        cover: '📊',
        status: 'available',
        description: '经典算法教材，全面介绍了各种算法及其分析，适合计算机科学专业学生和从业者。',
        borrower: null,
        borrowDate: null,
        dueDate: null
    },
    {
        id: 4,
        title: '设计模式：可复用面向对象软件的基础',
        author: 'Erich Gamma',
        cover: '🎨',
        status: 'borrowed',
        description: '介绍了23种经典设计模式，是面向对象设计的必读经典。',
        borrower: '李四',
        borrowDate: '2025-02-01',
        dueDate: '2025-03-03'
    },
    {
        id: 5,
        title: '精通CSS：高级Web标准解决方案（第3版）',
        author: 'Andy Budd',
        cover: '🎨',
        status: 'available',
        description: '深入讲解CSS布局、响应式设计、动画等高级技术，提升前端开发技能。',
        borrower: null,
        borrowDate: null,
        dueDate: null
    },
    {
        id: 6,
        title: 'JavaScript高级程序设计（第4版）',
        author: 'Matt Frisbie',
        cover: '⚡',
        status: 'available',
        description: '全面介绍JavaScript语言核心概念、DOM、BOM、Ajax等，是前端开发者的必备参考。',
        borrower: null,
        borrowDate: null,
        dueDate: null
    }
];

// Render book grid
function renderBooks(filter = 'all') {
    const grid = document.getElementById('book-grid');
    grid.innerHTML = '';
    const filtered = filter === 'all' ? books : books.filter(b => b.status === filter);
    filtered.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.id = book.id;
        card.innerHTML = `
            <div class="book-cover">${book.cover}</div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <span class="book-status ${book.status}">${book.status === 'available' ? '可借' : '已借出'}</span>
            </div>
        `;
        card.addEventListener('click', () => showBookDetail(book.id));
        grid.appendChild(card);
    });
}

// Show book detail in modal
function showBookDetail(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    const modal = document.getElementById('book-modal');
    const body = document.getElementById('modal-body');
    const statusText = book.status === 'available' ? '可借' : '已借出';
    const borrowInfo = book.status === 'borrowed' 
        ? `<p><strong>借阅者：</strong>${book.borrower}</p>
           <p><strong>借阅日期：</strong>${book.borrowDate}</p>
           <p><strong>应还日期：</strong>${book.dueDate}</p>`
        : '<p><strong>状态：</strong>可借，欢迎借阅</p>';
    body.innerHTML = `
        <div class="book-detail-cover">${book.cover}</div>
        <h2>${book.title}</h2>
        <p><strong>作者：</strong>${book.author}</p>
        <p><strong>状态：</strong><span class="book-status ${book.status}">${statusText}</span></p>
        <div class="detail-info">
            <p><strong>简介：</strong>${book.description}</p>
            ${borrowInfo}
        </div>
    `;
    modal.style.display = 'block';
}

// Close modal
document.querySelector('.close-btn').addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('book-modal')) {
        closeModal();
    }
});
function closeModal() {
    document.getElementById('book-modal').style.display = 'none';
}

// Filter change
document.getElementById('status-filter').addEventListener('change', (e) => {
    renderBooks(e.target.value);
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
});
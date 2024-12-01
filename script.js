// Работа со звездами
const stars = document.querySelectorAll('.star');
const submitButton = document.querySelector('.review-form button');
let selectedStars = 0;
let reviews = JSON.parse(localStorage.getItem('reviews')) || []; // Загружаем отзывы из LocalStorage
let visibleReviews = parseInt(localStorage.getItem('visibleReviews')) || 5; // Загружаем количество видимых отзывов

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        selectedStars = index + 1;
        stars.forEach((s, i) => s.classList.toggle('selected', i < selectedStars));
        submitButton.disabled = false;
    });
});

// Добавление отзывов
const form = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');
const averageRating = document.getElementById('average-rating');
const loadMoreButton = document.getElementById('load-more');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    const newReview = {
        name,
        stars: selectedStars,
        comment,
        date: new Date().toLocaleString(),
    };

    reviews.unshift(newReview); // Добавляем в начало массива
    localStorage.setItem('reviews', JSON.stringify(reviews)); // Сохраняем отзывы в LocalStorage
    updateReviews();
    form.reset();
    stars.forEach(s => s.classList.remove('selected'));
    selectedStars = 0;
    submitButton.disabled = true;
});

// Обновление отзывов
function updateReviews() {
    reviewsList.innerHTML = reviews
        .slice(0, visibleReviews)
        .map(review => `
            <div class="review-item">
                <h3>${review.name} (${review.date})</h3>
                <p>reviews: ${'&#9733;'.repeat(review.stars)}</p>
                <p>${review.comment}</p>
            </div>
        `).join('');

    const totalStars = reviews.reduce((sum, r) => sum + r.stars, 0);
    averageRating.innerHTML = `
        Average rating: ${(totalStars / reviews.length || 0).toFixed(1)} (${reviews.length} reviews)
    `;

    loadMoreButton.style.display = reviews.length > visibleReviews ? 'block' : 'none';
}

// Кнопка "Показать ещё"
loadMoreButton.addEventListener('click', () => {
    visibleReviews += 5;
    localStorage.setItem('visibleReviews', visibleReviews); // Сохраняем количество видимых отзывов в LocalStorage
    updateReviews();
});

// Инициализация отзывов при загрузке страницы
updateReviews()
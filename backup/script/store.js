document.addEventListener('DOMContentLoaded', function () {
 var searchBox = document.getElementById('searchBox');
 searchBox.addEventListener('keyup', function () {
  var searchTerm = searchBox.value.toLowerCase();
  var cards = document.querySelectorAll('.card');
  cards.forEach(function (card) {
   var cardText = card.textContent.toLowerCase();
   if (cardText.includes(searchTerm)) {
    card.style.display = 'block';
   } else {
    card.style.display = 'none';
   }
  });
 });
});

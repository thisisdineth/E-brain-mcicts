const heroTitle = document.getElementById('hero-title');
const heroText = document.getElementById('hero-text');

const content = [
  {
    image: './img/banner1.jpeg',
    title: 'Welcome to E-brain Digital Magazine',
    text: 'Official Mahanama College ICT Socity'
  },
  {
    image: '../img/ebrain2.png',
    title: 'Discover the Latest Trends in Technology',
    text: 'Stay ahead of the curve with our deep dives into the world of tech innovation.'
  },
  {
    image: '../img/ebrain3.png',
    title: 'Unlock the Future of Digital Learning',
    text: 'Join the digital revolution with our insights on the latest educational advancements.'
  }
];

let currentIndex = 0;

function changeHeroContent() {
  currentIndex = (currentIndex + 1) % content.length;
  const { image, title, text } = content[currentIndex];

  document.querySelector('.hero').style.backgroundImage = `url(${image})`;
  heroTitle.textContent = title;
  heroText.textContent = text;
}

// Change content every 5 seconds to match the slideshow timing
setInterval(changeHeroContent, 5000);

// Initial call to set the content
changeHeroContent();

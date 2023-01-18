const quotes = [
  "The only way to do great work is to love what you do. If you haven’t found it yet, keep looking. Don’t settle. As with all matters of the heart, you’ll know when you find it. – Steve Jobs",
  "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. – Christian D. Larson",
  "You miss 100% of the shots you don’t take. – Wayne Gretzky",
  "The greatest glory in living lies not in never falling, but in rising every time we fall. – Nelson Mandela",
  "The only limit to our realization of tomorrow will be our doubts of today. – Franklin D. Roosevelt",
  "The most difficult thing is the decision to act, the rest is merely tenacity. – Amelia Earhart",
  "Every strike brings me closer to the next home run. – Babe Ruth",
  "Life is what happens when you’re busy making other plans. – John Lennon",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
  "If life were predictable it would cease to be life, and be without flavor. – Eleanor Roosevelt",
  "If you set your goals ridiculously high and it’s a failure, you will fail above everyone else’s success. – James Cameron",
  "When you reach the end of your rope, tie a knot in it and hang on. – Franklin D. Roosevelt",
  "Always remember that you are absolutely unique. Just like everyone else. – Margaret Mead",
  "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
  "Tell me and I forget. Teach me and I remember. Involve me and I learn. – Benjamin Franklin",
  "An unexamined life is not worth living. – Socrates",
  "Efficiency is doing things right; effectiveness is doing the right things. – Peter Drucker",
  "You can’t build a reputation on what you are going to do. – Henry Ford",
  "I find that the harder I work, the more luck I seem to have. – Thomas Jefferson",
];

const getQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

module.exports = { getQuote };

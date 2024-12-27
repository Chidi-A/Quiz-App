import './style.css'
import { db } from './firebase-config.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from "firebase/firestore";

class QuizApp {
  constructor() {
    this.currentPage = 'splash';
    this.selectedCategory = null;
    this.score = 0;
    this.currentQuestion = 0;
    this.userName = '';
    this.appContainer = document.getElementById('app');
    
    this.categoryColors = {
      design: '#FACB08',
      brand: '#91A6F2',
      marketing: '#319F93',
      development: '#F67150',
      strategy: '#FBCCB4'
    };

    this.questions = {
      design: [
        {
          question: "What does a UI wireframe represent?",
          options: [
            "Final design",
            "User flow",
            "Skeleton layout",
            "Development guide"
          ],
          correct: 2  // Index of correct answer (0-based)
        },
        {
          question: "Which file format supports transparency?",
          options: ["JPEG", "PDF", "PNG", "GIF"],
          correct: 2
        },
        {
          question: "What is the golden ratio in design?",
          options: ["3.141", "1.618", "2.71", "1.5"],
          correct: 1
        },
        {
          question: "Which design principle balances visuals?",
          options: ["Alignment", "Proportion", "Symmetry", "Proximity"],
          correct: 2
        },
        {
          question: "Which color system is used for screens?",
          options: ["CMYK", "RGB", "HEX", "Pantone"],
          correct: 1
        },
        {
          question: "Which typography style is best for print?",
          options: ["Sans-serif", "Script", "Display", "Serif"],
          correct: 3
        },
        {
          question: "What does \"negative space\" refer to?",
          options: ["White elements", "Empty areas", "Background", "Shadow"],
          correct: 1
        },
        {
          question: "Which tool is commonly used for vector design?",
          options: ["Photoshop", "Illustrator", "Lightroom", "Figma"],
          correct: 1
        },
        {
          question: "What does a responsive design adapt to?",
          options: ["Time zones", "Screen size", "Animation speed", "Languages"],
          correct: 1
        },
        {
          question: "Which term describes creating user emotions?",
          options: ["Emotion Map", "Micro-interactions", "Prototype", "Wireframe"],
          correct: 1
        }
      ],
      development: [
        {
          question: "What does 'async' in JavaScript mean?",
          options: [
            "Delays code",
            "Runs in sync",
            "Handles concurrency",
            "Blocks execution"
          ],
          correct: 2
        },
        {
          question: "Which HTTP method is used for updates?",
          options: ["GET", "POST", "PUT", "DELETE"],
          correct: 2
        },
        {
          question: "What is the default position in CSS?",
          options: ["Absolute", "Relative", "Static", "Fixed"],
          correct: 2
        },
        {
          question: "Which programming language is strongly typed?",
          options: ["Python", "JavaScript", "Java", "Ruby"],
          correct: 2
        },
        {
          question: "What's the purpose of a version control system?",
          options: ["Save files", "Monitor deployment", "Track code changes", "Debug issues"],
          correct: 2
        },
        {
          question: "What does SQL stand for?",
          options: ["Sequential Query Loop", "Structured Query Language", "Simple Query Line", "Standard Query Language"],
          correct: 1
        },
        {
          question: "Which is an example of a NoSQL database?",
          options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
          correct: 2
        },
        {
          question: "Which CSS property adjusts an element's order in flexbox?",
          options: ["Z-index", "Order", "Display", "Align"],
          correct: 1
        },
        {
          question: "What is the 'src' attribute used for?",
          options: ["Adding text", "Linking styles", "Loading resources", "Embedding scripts"],
          correct: 2
        },
        {
          question: "Which data structure uses LIFO?",
          options: ["Queue", "Stack", "Array", "Linked List"],
          correct: 1
        }
      ],
      brand: [
        {
          question: "What is the purpose of a brand logo?",
          options: [
            "Improve sales",
            "Represent identity",
            "Drive traffic",
            "Close deals"
          ],
          correct: 1
        },
        {
          question: "Which emotion is most associated with the color blue in branding?",
          options: ["Passion", "Excitement", "Trust", "Creativity"],
          correct: 2
        },
        {
          question: "What is a brand archetype?",
          options: ["Unique logo style", "Guideline for ads", "Personality framework", "Market segmentation"],
          correct: 2
        },
        {
          question: "What does brand consistency mean?",
          options: [
            "Same tagline on social media",
            "Uniform tone, design, and message across all platforms",
            "Using identical colors",
            "Increasing ad budgets"
          ],
          correct: 1
        },
        {
          question: "What is the goal of a brand story?",
          options: ["Boost web traffic", "Share a mission authentically", "Raise venture funds", "Build product catalogs"],
          correct: 1
        },
        {
          question: "Which is an example of a brand asset?",
          options: ["A patent", "A website button", "A company logo", "Competitor analysis"],
          correct: 2
        },
        {
          question: "What term describes a customer's emotional connection to a brand?",
          options: ["Affinity", "Retargeting", "ROI", "Top-of-mind"],
          correct: 0
        },
        {
          question: "What does a tagline aim to achieve?",
          options: ["Clarify product features", "Make campaigns trend", "Summarize the brand purpose", "Define strategy"],
          correct: 2
        },
        {
          question: "What is a rebranding strategy for?",
          options: [
            "Updating a website",
            "Overhauling identity to align with new goals or audience",
            "Launching new campaigns",
            "Acquiring new leads"
          ],
          correct: 1
        },
        {
          question: "Which is an example of brand awareness?",
          options: [
            "Logo redesign",
            "Market share growth",
            "Customer recognizing a product from its logo",
            "Opening new offices"
          ],
          correct: 2
        }
      ],
      marketing: [
        {
          question: "Which metric measures ad impressions divided by clicks?",
          options: [
            "Conversion Rate",
            "Bounce Rate",
            "Click-Through Rate",
            "Engagement Score"
          ],
          correct: 2
        },
        {
          question: "Which platform prioritizes video campaigns?",
          options: ["LinkedIn", "Twitter", "TikTok", "Medium"],
          correct: 2
        },
        {
          question: "What's a benefit of email marketing automation?",
          options: [
            "Increase ad spend",
            "Send timely, personalized emails at scale",
            "Create product ideas",
            "Analyze keywords"
          ],
          correct: 1
        },
        {
          question: "What's the key benefit of A/B testing?",
          options: [
            "Save time",
            "Optimize decisions based on audience behavior",
            "Increase cost-per-click",
            "Find new markets"
          ],
          correct: 1
        },
        {
          question: "Which campaign type boosts sales quickly?",
          options: [
            "Influencer strategy",
            "Seasonal sales or flash offers",
            "Social giveaways",
            "Web redesign"
          ],
          correct: 1
        },
        {
          question: "What's the focus of inbound marketing?",
          options: [
            "Interrupt user habits",
            "Attract customers with valuable content",
            "Rely on pay-per-click",
            "Use aggressive email promotions"
          ],
          correct: 1
        },
        {
          question: "What is a buyer persona?",
          options: [
            "Customer feedback tool",
            "A fictional representation of ideal customers",
            "Employee profile",
            "Business motto"
          ],
          correct: 1
        },
        {
          question: "Which strategy retains existing customers?",
          options: ["Lead generation", "Loyalty programs", "SEO", "Prospecting"],
          correct: 1
        },
        {
          question: "What's another name for SEM?",
          options: ["Affiliate Marketing", "Search Engine Marketing", "Email Drip Campaigns", "Product Launching"],
          correct: 1
        },
        {
          question: "Which is an example of social proof in marketing?",
          options: [
            "Product feature blog",
            "Influencer posts or user reviews",
            "Adding CTAs",
            "Campaign budget boost"
          ],
          correct: 1
        }
      ],
      strategy: [
        {
          question: "What is SWOT analysis used for?",
          options: [
            "Marketing automation",
            "Strategic planning",
            "Performance reviews",
            "Financial growth"
          ],
          correct: 1
        },
        {
          question: "Which term defines a business mission?",
          options: ["Strategy", "Vision", "Goal", "Purpose Statement"],
          correct: 3
        },
        {
          question: "What is a KPI?",
          options: ["Key Point Insight", "Key Performance Indicator", "Key Priority Initiative", "Knowledge Process"],
          correct: 1
        },
        {
          question: "Which is NOT a growth strategy?",
          options: ["Diversification", "Cost Leadership", "Downsizing", "Product Development"],
          correct: 2
        },
        {
          question: "What does SMART goals stand for?",
          options: [
            "Simple, Motivated, Accurate, Real, Targeted",
            "Specific, Measurable, Achievable, Relevant, Time-bound",
            "Scalable, Marketable, Alignable, Resilient, Time-defined",
            "Special, Measurable, Authentic, Reliable, Timeless"
          ],
          correct: 1
        },
        {
          question: "Which is an operational strategy example?",
          options: ["Factory layout optimization", "Audience segmentation", "Capital acquisition", "Stakeholder communication"],
          correct: 0
        },
        {
          question: "What is a value proposition?",
          options: ["Service costing", "Employee incentives", "Why customers choose you", "Financial model"],
          correct: 2
        },
        {
          question: "What does benchmarking involve?",
          options: ["Analyzing trends", "Setting product prices", "Comparing to competitors", "Measuring teams"],
          correct: 2
        },
        {
          question: "What is risk management aimed at?",
          options: ["Preventing profits", "Reducing threats", "Maximizing capital", "Creating reports"],
          correct: 1
        },
        {
          question: "Which factor is external in PESTLE analysis?",
          options: ["Talent pool", "Competitor pricing", "Production costs", "Marketing campaigns"],
          correct: 1
        }
      ]
    };
    
    this.initializeApp();
  }

  initializeApp() {
    this.renderPage(this.currentPage);
  }

  renderPage(page) {
    console.log(`Rendering page: ${page}, Category: ${this.selectedCategory}`);
    
    switch(page) {
      case 'splash':
        this.renderSplashScreen();
        break;
      case 'landing':
        this.renderLandingPage();
        break;
      case 'instructions':
        this.renderInstructionsPage();
        break;
      case 'quiz':
        this.renderQuizPage();
        break;
      case 'results':
        this.renderResultsPage();
        break;
    }
  }

  renderSplashScreen() {
    const splash = `
      <div class="splash-screen">
        <div class="splash-content">
          <div class="splash-animation">
            <lottie-player
              src="/public/lottie/intro.json"
              background="transparent"
              speed="1"
              style="width: 300px; height: 300px;"
              loop
              autoplay
            ></lottie-player>
          </div>
          <h1 class="splash-title">Welcome to the Product Quiz Challenge!</h1>
          <p class="splash-subtitle">Test Your Skills Across Design, Development, Brand, Marketing, and Strategy!</p>
          <div class="name-input-container">
            <input 
              type="text" 
              id="nameInput" 
              class="name-input" 
              placeholder="Enter your name"
              maxlength="20"
            >
            <button class="start-btn">
              Start
              <img src="/images/ArrowCircleRight.svg" alt="Start" class="continue-arrow">
            </button>
          </div>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = splash;

    const nameInput = document.getElementById('nameInput');
    const startButton = document.querySelector('.start-btn');

    // Enable/disable start button based on input
    nameInput.addEventListener('input', (e) => {
      startButton.disabled = !e.target.value.trim();
      if (e.target.value.trim()) {
        startButton.classList.add('visible');
      } else {
        startButton.classList.remove('visible');
      }
    });

    // Handle start button click
    startButton.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (name) {
        this.userName = name;
        this.currentPage = 'landing';
        this.renderPage('landing');
      }
    });

    // Handle enter key
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const name = nameInput.value.trim();
        if (name) {
          this.userName = name;
          this.currentPage = 'landing';
          this.renderPage('landing');
        }
      }
    });
  }

  renderLandingPage() {
    const landing = `
      <div class="landing-page">
        <div class="landing-page-header">
          <p class="landing-page-header-text">
            ${this.selectedCategory 
              ? `Category: ${this.selectedCategory.charAt(0).toUpperCase() + this.selectedCategory.slice(1)}`
              : 'Choose a category to start the quiz'}
          </p>
        </div>
        <div class="landing-page-content">
          <div class="categories-wrapper">
            <div class="categories-top">
              <button class="category-btn design" data-category="design">Design</button>
              <button class="category-btn brand" data-category="brand">Brand</button>
              <button class="category-btn marketing" data-category="marketing">Marketing</button>
            </div>
            <div class="categories-bottom">
              <button class="category-btn development" data-category="development">Development</button>
              <button class="category-btn strategy" data-category="strategy">Strategy</button>
            </div>
          </div>
          <button class="continue-btn">Continue <img src="/images/ArrowCircleRight.svg" alt="Continue" class="continue-arrow"></button>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = landing;

    const categoryButtons = document.querySelectorAll('.category-btn');
    const continueButton = document.querySelector('.continue-btn');

    // If there was a previously selected category, reactivate it and show continue button
    if (this.selectedCategory) {
      const previouslySelected = document.querySelector(`[data-category="${this.selectedCategory}"]`);
      if (previouslySelected) {
        previouslySelected.classList.add('active');
        continueButton.classList.add('visible');
      }
    }

    categoryButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.selectedCategory = button.dataset.category;
        document.querySelector('.landing-page-header-text').textContent = 
          `Category: ${this.selectedCategory.charAt(0).toUpperCase() + this.selectedCategory.slice(1)}`;
        continueButton.classList.add('visible');
        e.stopPropagation();
      });
    });

    continueButton.addEventListener('click', () => {
      if (this.selectedCategory) {
        this.currentPage = 'instructions';
        this.renderPage('instructions');
      }
    });
  }

  renderInstructionsPage() {
    console.log('Rendering instructions with category:', this.selectedCategory);
    
    const categoryColors = {
      design: '#FACB08',
      brand: '#91A6F2',
      marketing: '#319F93',
      development: '#F67150',
      strategy: '#FBCCB4'
    };

    const instructions = `
      <div class="instructions-page" style="background-color: ${categoryColors[this.selectedCategory]}">
        <div class="landing-page-header">
          <button class="back-btn">← Back</button>
          <p class="landing-page-header-text">Category: ${this.selectedCategory.charAt(0).toUpperCase() + this.selectedCategory.slice(1)}</p>
        </div>
        <div class="landing-page-content">
          <div class="instructions-content">
            <ul>
              <li>Please do not refresh the page or close the tab</li>
              <li>You will have 10 questions to answer</li>
              <li>Each question has a 10-second time limit</li>
              <li>You cannot change your answer once selected</li>
            </ul>
          </div>
          <button class="continue-btn visible">
            Start Quiz
            <img src="/images/ArrowCircleRight.svg" alt="Continue" class="continue-arrow">
          </button>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = instructions;

    document.querySelector('.back-btn').addEventListener('click', () => {
      this.currentPage = 'landing';
      this.renderPage('landing');
      document.querySelector('.landing-page-header-text').textContent = `Category: ${button.dataset.category.charAt(0).toUpperCase() + button.dataset.category.slice(1)}`;
    });

    document.querySelector('.continue-btn').addEventListener('click', () => {
      console.log('Starting quiz with category:', this.selectedCategory);
      this.currentPage = 'quiz';
      this.renderPage('quiz');
    });
  }

  renderQuizPage() {
    if (!this.selectedCategory) {
      console.error('No category selected');
      return;
    }

    const currentQuestion = this.questions[this.selectedCategory][this.currentQuestion];
    const totalQuestions = this.questions[this.selectedCategory].length;

    const quiz = `
      <div class="quiz-page" style="background-color: ${this.categoryColors[this.selectedCategory]}">
        <div class="landing-page-header">
          <div class="quiz-header-left">
            <p class="question-counter">${this.currentQuestion + 1}/${totalQuestions}</p>
          </div>
          <div class="quiz-header-center">
            <p class="category-text">${this.selectedCategory.charAt(0).toUpperCase() + this.selectedCategory.slice(1)}</p>
          </div>
          <div class="quiz-header-right">
            <div class="timer-container">
              <div class="timer-icon">
                <img src="/images/Timer.svg" alt="Continue" class="continue-arrow">
              </div>
              <span class="timer">15</span>
            </div>
          </div>
        </div>

        <div class="landing-page-content">
          <div class="mobile-score">Score: ${this.score}/${totalQuestions}</div>
          <div class="question-content">
            <h2 class="question-text">${currentQuestion.question}</h2>
            <div class="options-grid">
              ${currentQuestion.options.map((option, index) => `
                <button class="option-btn" data-index="${index}">${option}</button>
              `).join('')}
            </div>
          </div>
          
          <div class="quiz-footer">
            <div class="score-display">Score: ${this.score}/${totalQuestions}</div>
            <button class="next-btn" disabled>
              Next
              <img src="/images/ArrowCircleRight.svg" alt="Next" class="continue-arrow">
            </button>
          </div>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = quiz;

    // Timer logic
    let timeLeft = 15;
    const timerElement = document.querySelector('.timer');
    const nextButton = document.querySelector('.next-btn');
    const optionButtons = document.querySelectorAll('.option-btn');
    
    // Start countdown
    const timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = timeLeft;
      
      // When time runs out
      if (timeLeft === 0) {
        clearInterval(timer);
        // Disable all option buttons
        optionButtons.forEach(btn => btn.disabled = true);
        // Show correct answer
        optionButtons[currentQuestion.correct].classList.add('correct');
        // Enable next button
        nextButton.disabled = false;
      }
    }, 1000);

    // Add event listeners for options
    optionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Clear timer when answer is selected
        clearInterval(timer);
        
        // Disable all buttons
        optionButtons.forEach(btn => btn.disabled = true);
        
        const selectedIndex = parseInt(e.target.dataset.index);
        
        // Show correct/incorrect
        if (selectedIndex === currentQuestion.correct) {
          button.classList.add('correct');
          this.score++;
          document.querySelector('.score-display').textContent = `Score: ${this.score}/${totalQuestions}`;
        } else {
          button.classList.add('incorrect');
          optionButtons[currentQuestion.correct].classList.add('correct');
        }
        
        // Enable next button
        nextButton.disabled = false;
      });
    });

    // Add event listener for next button
    nextButton.addEventListener('click', () => {
      this.currentQuestion++;
      if (this.currentQuestion >= totalQuestions) {
        // Quiz complete, show results
        this.currentPage = 'results';
        this.renderPage('results');
      } else {
        this.renderQuizPage();
      }
    });
  }

  async renderResultsPage() {
    console.log('Rendering results page...');
    
    // Show loading state first
    const loadingScreen = `
      <div class="quiz-page" style="background-color: ${this.categoryColors[this.selectedCategory]}">
        <div class="landing-page-header">
          <p class="landing-page-header-text">Getting Results...</p>
        </div>
        <div class="landing-page-content">
          <div class="loading-content">
            <div class="lottie-container">
              <lottie-player
                src="https://assets2.lottiefiles.com/packages/lf20_p8bfn5to.json"
                background="transparent"
                speed="1"
                style="width: 200px; height: 200px;"
                loop
                autoplay
              ></lottie-player>
            </div>
          </div>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = loadingScreen;
    
    try {
        const savedResult = await this.saveQuizResult();
        console.log('Save result response:', savedResult);
        
        const scoreResult = this.getScoreMessage();
        const shareText = `I scored ${this.score}/10 as a ${scoreResult.title} in the ${this.selectedCategory} quiz! Think you can beat my score?`;
        const shareUrl = window.location.href;
        
        // Generate base64 image data for sharing
        const generateShareImage = async () => {
            const captureArea = document.querySelector('.results-content');
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const canvas = await html2canvas(captureArea, {
                    backgroundColor: this.categoryColors[this.selectedCategory],
                    scale: 2,
                    logging: false,
                    useCORS: true
                });
                return canvas.toDataURL('image/png');
            } catch (err) {
                console.error('Error generating image:', err);
                return null;
            }
        };

        const quiz = `
          <div class="quiz-page" style="background-color: ${this.categoryColors[this.selectedCategory]}">
            <div class="landing-page-header">
              <p class="landing-page-header-text">Quiz Complete!</p>
            </div>
            <div class="landing-page-content">
              <div class="results-content">
                <div class="lottie-container">
                  <lottie-player
                    src="${scoreResult.animation}"
                    background="transparent"
                    speed="1"
                    style="width: 200px; height: 200px;"
                    loop
                    autoplay
                  ></lottie-player>
                </div>
                <h2 class="final-score">Your Score: ${this.score}/10</h2>
                <h3 class="score-title">${scoreResult.title}</h3>
                <div class="score-message">
                  "${scoreResult.message}"
                </div>
              </div>
              <div class="results-buttons">
                <button class="new-quiz-btn">
                  Select New Category
                </button>
                <div class="share-buttons">
                  <button class="share-btn twitter" title="Share on Twitter">
                    <img src="/images/twitter.svg" alt="Twitter" class="share-icon">
                  </button>
                  <button class="share-btn linkedin" title="Share on LinkedIn">
                    <img src="/images/linkedin.svg" alt="LinkedIn" class="share-icon">
                  </button>
                  <button class="share-btn copy" title="Copy to Clipboard">
                    <img src="/images/copy.svg" alt="Copy" class="share-icon">
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

        this.appContainer.innerHTML = quiz;

        // Modified share buttons event listeners
        document.querySelector('.share-btn.twitter').addEventListener('click', async () => {
            const imageData = await generateShareImage();
            if (imageData) {
                // Download image first
                const link = document.createElement('a');
                link.href = imageData;
                link.download = `quiz-result-${this.selectedCategory}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Then open Twitter with text
                alert('Your result image has been downloaded. Please attach it to your tweet for sharing!');
            }
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            window.open(twitterUrl, '_blank');
        });

        document.querySelector('.share-btn.linkedin').addEventListener('click', async () => {
            const imageData = await generateShareImage();
            if (imageData) {
                // Download image first
                const link = document.createElement('a');
                link.href = imageData;
                link.download = `quiz-result-${this.selectedCategory}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                alert('Your result image has been downloaded. Please create a new post on LinkedIn and attach the image!');
                window.open('https://www.linkedin.com/post/new', '_blank');
            }
        });

        document.querySelector('.share-btn.copy').addEventListener('click', async () => {
            try {
                const imageData = await generateShareImage();
                if (imageData) {
                    const link = document.createElement('a');
                    link.href = imageData;
                    link.download = `quiz-result-${this.selectedCategory}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                const copyBtn = document.querySelector('.share-btn.copy');
                copyBtn.classList.add('copied');
                setTimeout(() => copyBtn.classList.remove('copied'), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });

        document.querySelector('.new-quiz-btn').addEventListener('click', () => {
            this.selectedCategory = null;
            this.currentQuestion = 0;
            this.score = 0;
            this.currentPage = 'landing';
            this.renderPage('landing');
        });
    } catch (error) {
        console.error('Error in renderResultsPage:', error);
    }
  }

  // Helper method to get score message
  getScoreMessage() {
    const messages = {
        design: [
            {
                range: [10],
                title: "Design Maestro!",
                message: "You're the Da Vinci of design!",
                animation: "/lottie/trophy.json"
            },
            {
                range: [8, 9],
                title: "Creative Guru!",
                message: "Your skills are sharp and your vision, sharper.",
                animation: "/lottie/eyestar.json"
            },
            {
                range: [5, 6, 7],
                title: "Emerging Designer!",
                message: "You've got the eye; now sharpen the craft.",
                animation: "/lottie/Thumbsup.json"
            },
            {
                range: [0, 1, 2, 3, 4],
                title: "Design Dreamer!",
                message: "Every master starts with a sketch. Keep growing!",
                animation: "/lottie/computer.json"
            }
        ],
        development: [
            {
                range: [10],
                title: "Code Wizard!",
                message: "You weave code like magic—absolute perfection!",
                animation: "/lottie/trophy.json"
            },
            {
                range: [8, 9],
                title: "Dev Prodigy!",
                message: "Logic and creativity combined; you're almost there.",
                animation: "/lottie/computer.json"
            },
            {
                range: [5, 6, 7],
                title: "Rising Developer!",
                message: "Your foundation is solid—time to debug those skills.",
                animation: "/lottie/Thumbsup.json"
            },
            {
                range: [0, 1, 2, 3, 4],
                title: "Code Learner!",
                message: "Every developer starts with Hello, World!—keep at it.",
                animation: "/lottie/pizza.json"
            }
        ],
        marketing: [
            {
                range: [10],
                title: "Marketing Maven!",
                message: "You're a marketing mastermind—pure brilliance!",
                animation: "/lottie/trophy.json"
            },
            {
                range: [8, 9],
                title: "Strategy Star!",
                message: "Your marketing instincts are razor-sharp!",
                animation: "/lottie/eyestar.json"
            },
            {
                range: [5, 6, 7],
                title: "Growth Explorer!",
                message: "You're on the right path to marketing excellence!",
                animation: "/lottie/Thumbsup.json"
            },
            {
                range: [0, 1, 2, 3, 4],
                title: "Marketing Enthusiast!",
                message: "Every campaign starts with one idea—keep learning!",
                animation: "/lottie/computer.json"
            }
        ],
        brand: [
            {
                range: [10],
                title: "Brand Virtuoso!",
                message: "You're a branding genius—simply outstanding!",
                animation: "/lottie/trophy.json"
            },
            {
                range: [8, 9],
                title: "Brand Architect!",
                message: "You build brand stories that resonate and inspire!",
                animation: "/lottie/eyestar.json"
            },
            {
                range: [5, 6, 7],
                title: "Brand Builder!",
                message: "You're crafting your way to brand mastery!",
                animation: "/lottie/Thumbsup.json"
            },
            {
                range: [0, 1, 2, 3, 4],
                title: "Brand Explorer!",
                message: "Every brand has a story—yours is just beginning!",
                animation: "/lottie/pizza.json"
            }
        ],
        strategy: [
            {
                range: [10],
                title: "Strategy Sage!",
                message: "Your strategic thinking is in a league of its own!",
                animation: "/lottie/trophy.json"
            },
            {
                range: [8, 9],
                title: "Strategic Visionary!",
                message: "You see the big picture with remarkable clarity!",
                animation: "/lottie/eyestar.json"
            },
            {
                range: [5, 6, 7],
                title: "Strategy Tactician!",
                message: "You're developing a keen strategic mind!",
                animation: "/lottie/Thumbsup.json"
            },
            {
                range: [0, 1, 2, 3, 4],
                title: "Strategy Apprentice!",
                message: "Every strategist starts somewhere—keep planning!",
                animation: "/lottie/computer.json"
            }
        ]
    };

    const categoryMessages = messages[this.selectedCategory] || messages.design;
    const result = categoryMessages.find(m => m.range.includes(this.score));
    return result;
  }

  reset() {
    this.score = 0;
    this.currentQuestion = 0;
    this.selectedCategory = null;
  }

  // Add method to safely update category
  setCategory(category) {
    this.selectedCategory = category;
    console.log('Category updated to:', this.selectedCategory);
  }

  // Save result to Firestore
  async saveQuizResult() {
    console.log('Attempting to save quiz result...'); // Debug log
    
    const result = {
        id: Date.now(),
        date: new Date().toISOString(),
        userName: this.userName,
        category: this.selectedCategory,
        score: this.score,
        title: this.getScoreMessage().title,
        message: this.getScoreMessage().message
    };

    console.log('Result object:', result); // Debug log

    try {
        const docRef = await addDoc(collection(db, "quizResults"), result);
        console.log("Document written with ID: ", docRef.id); // Debug log
        return result;
    } catch (error) {
        console.error('Error saving result:', error);
        return null;
    }
  }

  // Load user's quiz history
  async loadUserHistory(userName) {
    try {
      const q = query(
        collection(db, "quizResults"),
        where("userName", "==", userName)
      );
      
      const querySnapshot = await getDocs(q);
      const history = {};
      
      querySnapshot.forEach((doc) => {
        history[doc.id] = doc.data();
      });
      
      return history;
    } catch (error) {
      console.error('Error loading history:', error);
      return {};
    }
  }

  // Load category leaderboard
  async loadLeaderboard(category) {
    try {
      const q = query(
        collection(db, "quizResults"),
        where("category", "==", category),
        orderBy("score", "desc"),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      const leaderboard = [];
      
      querySnapshot.forEach((doc) => {
        leaderboard.push(doc.data());
      });
      
      return leaderboard;
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      return [];
    }
  }
}

// Initialize the app
const app = new QuizApp();

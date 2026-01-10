================================================================================
WEBPROG-IT241 HTML LESSONS - DOCUMENTATION
Personal Portfolio Website by Rodmina Jhoy Ibe
================================================================================

1. TECHNOLOGIES USED
--------------------------------------------------------------------------------
Core Stack: 
- HTML5
- CSS3 (with CSS Variables for theming)
- JavaScript (Vanilla ES6)
- Vue.js 3 (for contact form)

IDE/Editor: 
- Github Dev
- Visual Studio Code

Version Control: 
- Git / GitHub
- Repository: webprog-IT241-html-lessons
- Branch: feature/#3_RJI_customize_my_website


2. RESOURCES & ASSETS
--------------------------------------------------------------------------------

Images & Photography:
All personal photos are owned by Rodmina Jhoy Ibe:
- my-photo.png (Profile picture)
- arellano-best-in-research.jpg (Education section)
- speaking-in-hackathon.jpg (Goals section)
- tech-external-events.jpg (Experience section)
- gym-pic.jpg (Hobbies section)
- 18th-birthday-photoshoot.jpg (Gallery)
- 18th-green-dress.jpg (Gallery)
- jpcs-photoshoot.jpg (Gallery)
- picture-taken-by-goodcamera.jpg (Gallery)
- website-pic.png (Projects section)

No stock photos used for backgrounds.

Icons:
Theme Toggle Icons:
- Sun icon: Flaticon (https://cdn-icons-png.flaticon.com)
- Moon icon: Vecteezy (https://static.vecteezy.com)

Social Media Icons (Flaticon):
- LinkedIn icon: https://cdn-icons-png.flaticon.com/128/3536/3536505.png
- GitHub icon: https://cdn-icons-png.flaticon.com/128/733/733553.png
- Instagram icon: https://cdn-icons-png.flaticon.com/128/2111/2111463.png
- Facebook icon: https://cdn-icons-png.flaticon.com/128/733/733547.png

Typography:
- Arial (system font) - Used throughout the website
- Sans-serif as fallback


3. DESIGN & INSPIRATION
--------------------------------------------------------------------------------

Theme:
Light Mode (Default):
- Primary Background: #f5f0ff (Light lavender)
- Section Background: #e8dff5 (Purple tint)
- Card Background: #ffffff (White)
- Text Color: #2d1b4e (Dark purple)
- Accent Color: #9D65C9 (Purple)
- Border Color: #c8b6e2 (Light purple)

Dark Mode:
- Primary Background: #0a0a0a (Almost black)
- Section Background: #161616 (Dark gray)
- Card Background: #1e1e1e (Charcoal)
- Text Color: #f0f0f0 (Light gray)
- Accent Color: #b88dd9 (Lighter purple)
- Border Color: #3d3d3d (Medium gray)

Color palette and "Purple/Lavender" aesthetic inspired by various references 
on Microsoft Edge Images.

Layout:
- Card layout with hover animations
  (Reference: https://www.w3schools.com/howto/howto_css_cards.asp)
- Responsive grid system
- Modern portfolio design with sectioning
- Interactive dark/light theme toggle with localStorage persistence
- Mobile-responsive design (breakpoints at 768px and 480px)


4. FEATURES IMPLEMENTED
--------------------------------------------------------------------------------

Theme Toggle System:
- Light and Dark mode toggle button (top-right corner)
- CSS Variables for dynamic theming
- LocalStorage to persist user theme preference
- Animated icons (sun/moon) with smooth transitions
- Implemented in: theme-toggle.js

Mobile Responsiveness:
- Adaptive layouts for tablets (≤768px) and mobile phones (≤480px)
- Responsive typography scaling
- Flexible grid systems
- Touch-friendly navigation

Interactive Elements:
- Card hover effects with animations
- Smooth transitions throughout
- Contact form with Vue.js validation
- Social media links


5. ACKNOWLEDGEMENTS & AI ASSISTANCE
--------------------------------------------------------------------------------

AI Tools:
- Google Gemini & Microsoft Copilot: 
  * Code optimization and debugging
  * JavaScript logic assistance (contact-form.js, theme-toggle.js)
  * CSS responsive design guidance
  * Vue.js implementation for contact form
  * Content structure and organization
https://gemini.google.com/app/3a3bf4abf5249920 

References:
- W3Schools: HTML/CSS syntax reference and card animations
  (https://www.w3schools.com/howto/howto_css_cards.asp)
- MDN Web Docs: JavaScript and CSS documentation
- Flaticon: Icon resources for UI elements
- Vecteezy: Theme toggle moon icon
- Vue.js Documentation: Contact form implementation




The background color of section 1 (hero section) comes from the body element at line 77-85 in rwd.css:

The actual color value is defined in the CSS variable --bg-color at the top of the file (around line 4). Currently it's set to linear-gradient(135deg, #f5f0ff 0%, #e8dff5 50%, #f0e6ff 100%) for light mode.

The .hero-container itself doesn't have a background color specified - it's transparent, so it shows the body's background through it.


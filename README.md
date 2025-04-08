# Project: Web home budget manager
**demo: https://budgetapp.msliwowski.net**

Test login data: testuser123 / Testuser123!!

## Idea of the project
Main idea of this project was to create web application that allows to control user's household budget. Each registered member can add their own household (by enter the name, not sensitive information), invite other mates and take control of house finances.

## Functionality
Each user after register and log in have to add their own household. This is necessary to use Web home budget manager. Adding is done after entering the name of the house, application does not require sharing the sensitive information. When household is in the system, every functionality is available like:
- inviting new housemates,
- adding transactions (incomes and expenses),
- internal communnication between housemates,
- expanded statistics.

In addition, every host can manage housemates. What does it mean? Only host (user that add household) can delete every housemate.

## Tech stack / libraries
1. **Frontend:**
    1. React.js.
    2. TailwindCSS.
    3. Zustand.
    4. Framer Motion.
    5. i18next.
    6. socket.io-client.
    7. chart.js.

2. **Backend / API:**
    1. Express.js.
    2. Socket.io.
    3. Mysql2.
    4. multer.
    5. tesseract.js.
      
3. **DevOps:**
    1. Jenkins
    2. Docker
    3. NGINX
    4. phpMyAdmin
   
## Installation
   1. Clone repository
   2. Choose part of the project (backend or frontend) and install dependencies.
   3. Backend: type 'npm run start'.
   4. Frontend: type 'npm run dev' or 'npm run build'.

## Conclusion
This project was the second that I made using React.js. Application is much bigger than my portfolio I've maded recently and during work of this project I've learned a lot of new libraries and practises in work with framework like React.js.  

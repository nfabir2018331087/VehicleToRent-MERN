# VehicleToRent-MERN

This project name is **VehicleToRent Inc**. This website is about a car rental service. Here you can see what cars are available. Then on the reservation page, you can fill out all the information and see the total amount to pay. Also, you can download your reservation receipt.  This project was done in **MERN**.

## Instructions
* First of all, clone this repository to your local machine.
* Make sure you have Node installed on your computer.
* Then, go to the backend directory and install all the packages necessary.
* After installing all the packages you can now run the backend with 'npm run dev' which will run your backend with Nodemon.
* Then go to the frontend directory and here also install all the packages necessary.
* Run the frontend with 'npm start'. Make sure to keep your backend running.
* Hoping everything will work fine and you will be able to access this website and try out every functionality.

#### Environment Variables
* Add a .env file to your backend directory.
* Specify PORT=Number <any port number you like except 3000 (as react will use 3000 in default)>
* Go to MongoDB Atlas, create a cluster, and grab the connecting URL. It should look like this </br> mongodb+srv://(username):(password)@mernproject.s6c3c1b.mongodb.net/
* Then specify MONGO_URL=your_url

## Overview 
#### General Description
This is a website for a car rental service. Just for fun, I named it VehicleToRent Inc. On the homepage, you will be able to see the available cars. Then, on the reservation page
you will find a form where you can put your information, your reservation ID, start and end time, and the additional charges that can be applied.

Based on your start and end time, the system will calculate the duration. You can also see the available car types and cars associated with those types. Based on the car's rates your
total charges will be calculated.

Now, here is an interesting part, a car has an hourly rate of 20 dollars and a daily rate of 100 dollars. So, if someone takes a car for 6 hours he has to pay 120 dollars whereas if he would
take the car for a day he would have paid less than that. In this type of scenario, the system will detect these types of discrepancies then discount the additional charges, and provide the best payment.
In this case, the discount will be 20 dollars.

Lastly, there is a button to download your reservation information as a PDF.

Here are some [**screenshots**](screenshots) of the website.


#### Technologies
* For the frontend: **ReactJS**
* For the backend: **ExpressJS(Node)**
* For database: **MongoDB**
* Overall **MERN** stack
  
  
   

Inventory Management System Project
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Deployment (VISIT HERE): https://eginventorysystem.netlify.app/login

Frontend: https://github.com/Ethan-Gan/inventory-management-system-frontend

Backend: https://github.com/Ethan-Gan/inventory-management-system-backend/tree/main


As past student experience analyst co-op conducting research on Sedra Student Design Centre Teams for the University of Waterloo and now as a project lead of a robotics design team, a common issue arose in tracking the flow of inventory as well as purchase requests. 
The main problem is in subdivided teams such as project based teams, the organization of the team inventory and finances ended up becoming localized to the subteam leads. 
Eventually, some teams may find themselves without a consistent financial record of part orders or not even knowing that another division of their team already has the part they are looking for. 
Our team was recently offered a new designated design team space and I thought it would be a good opportunity to create a intrateam database to help collect and standardize our records before we mysteriously find parts going missing. 

On the selfish side, this fullstack project was a satisfying way to finally put my fragmented full-stack online course knowledge into one complete app which was represented through two separate applications for backend and frontend that call each other. The focus of this project was to learn backend development as I had previous experience with React in creating my personal website, which you can visit here: https://ethangan.netlify.app/

The backend is built to follow RESTful API rules and was built with **Node.js**, **Express**, **PostgresSQL**, and **Sequelize ORM**. The frontend was done in **React** with **CSS** for styling. 

**I learned a lot about (in chronological order):**
1. Creating a database from scratch on PostgresSQL with raw SQL and pgadmin and actually using it through the Sequelize ORM (which I chose to help reduce the load of the more menial crud commands after getting the hang of them).
2. The importance of designing your database beforehand which I thankfully did beforehand as it saved a lot of time moving forward in the project
3. Hosting services online: which in itself taught me the wonderful free services of Render (for my backend API), Supabase (for my PostgresSQL DB), and finally connecting the front end to Netlify to complete the loop
4. The importance of modularity in project design with the MVC architecture and the ease of debugging in Postman. I ended up merging service and controller files that you would traditionally see in MVC architecture because I found the majority of my service functions to just be one off usages and to keep it easy to read.  
5. The fact that the free option of hosting dbs, is more of you create a new db and you import your old schema (unless this is untrue - in which please share a solution if you end up meeting me)
6. Exporting a backend API for use in the front-end.
7. The power of Tantables in React.
8. Finally, the satisfaction of owning all facets of a project from the database, RESTful API, and the frontend. 

**Some improvements I would / still need to implement if I want it to be put in production:**
-  Removing the guest role and test entries currently in the app to showcase its functionality
-  Implementing Passport and Bcrypt for authentication, adding XSS protection. Currently the password_hash key in the database is being used as the direct password which is not very secure at all
-  Figure out how to continuously ping the Render server so it never goes to sleep to remove the annoying 30-60 second wait each session (because I don't login every 15 minutes)

**Fun improvements**
- Implement some cool stored procedures in raw SQL in the backend. Still finding an excuse for this.

Below are some of the process notes for creating my project design:
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**System Requirements Sketch**
A inventory management system for a University of Waterloo design team where users can sign up, post purchase requests, check into the SDC space, borrow, add equipment, set permissions, manage budget, and track suppliers. 

From the requirements, I originally planned to build a PostGresSQL with these tables
- User
- Purchase requests
- Budget (Transactions)
- Inventory
- Check-ins
- Supplier

While the initial schema I drafted out quickly spread out to 9 tables after I got high off of watching videos about database normal forms and tried to achieve the fabled 6F.
However in fear of scope creep and due to the local nature of the app, I decided to prune tables until I had the core functionalities I wanted: 
1. a user table for logins / identity tracking
2. a list of inventory items
3. a log of inventory check outs
4. a list of purchase requests with statuses
5. an additional table of suppliers to reference for part maintenance and future purchases.

In the end, these 5 objectives transpired to 5 tables. And my blind love for normalization was satieted in maintaining 3NF within these 5 tables. 
<img width="1390" height="1114" alt="image" src="https://github.com/user-attachments/assets/21ba0cee-2339-409d-a65a-a731f7dc2b85" />


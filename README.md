# Welcome to the IDF Front End Code Challenge

Congratulations on getting this far in the interview process! You've done a fantastic job. Now it's time to "let your fingers do the talking". We can't wait to see your code. 

This test is part of the technical interview. In the interview (done over Skype) we will ask you about some aspects of your code. We know that there are many ways to solve a problem and there is not one specific solution that we are looking for. Instead, we'll be evaluating your style of programming and the choices you make (with their pros and cons). In the interview, you can elaborate on your choices and specific aspects of your code. 

## Specification: Here is what we would like you to do

We would like you to make a simple app whereby you can add one or more colleagues to a company. 

The app's functionality will be pretty simple but enough for using good programming practices. 

### Definitions

**Potential colleague:** This is merely a visual row with two form fields: *name* and *email address*. It represents a colleague that will be added to the company.

**Existing colleague:** This is simply a person with a *name* and *email address*. It represents a colleague that is already added to the company.

### App Features

This is what your app should be able to do:

 - There should be 2 widgets: "Add colleagues to your company" and "Existing colleagues" (12).
 - "Add colleagues to your company" widget can add more than one colleague at a time.
 - A potential colleague has a name (5) and an email address (6). Both fields are **required**.
 - A potential colleague can be added to "Add colleagues to your company" widget using element (9).
 - A potential colleague can be removed from "Add colleagues to your company" widget using element (7).
 - Reset button (11) resets "Add colleagues to your company" widget to initial state without touching "Existing colleagues" widget.
 - An existing colleague can be added on form submit (10) only.
 - The company cannot have more than 10 colleagues (element (3)).
 - Colleague counters (2) and (4) should be updated after every change in "Existing colleagues" widget.
 - There should be some UI components:
     - Form steps (1). *No logic is required, it's just for styling.*
     - Custom checkbox (8). *No logic is required, it's just for styling.*
     
### Optional Features
 - An existing colleague can be removed (element (14) in "Existing colleagues" widget).
 - Every existing colleague should have a unique email address.
 - Sticky footer (15).
 
![image](https://user-images.githubusercontent.com/5278175/29818354-a27b6452-8cc4-11e7-8502-4c5a2f670a0b.png)
_Image 0: UI elements (App state with 5 existing colleagues)_

![image](https://user-images.githubusercontent.com/5278175/29817995-f5f1f710-8cc2-11e7-8f1f-c9a5c7ab8800.png)
_Image 1: Initial app state_

![image](https://user-images.githubusercontent.com/5278175/29818114-8806948a-8cc3-11e7-8c83-da9977e2ed21.png)
_Image 2: Adding colleagues to the company_

![image](https://user-images.githubusercontent.com/5278175/29818141-a850e376-8cc3-11e7-8364-a7b26f6cfa9f.png)
_Image 3: Colleagues successfully added_

## Technical requirements
 1. Please only use Vanilla JS (ES5/ES6/ES7) or jQuery. npm packages, tools, and other 3rd party libraries are **not allowed**.
 1. Please don't use a CSS framework (since we would like to evaluate your CSS skills). You can use [CSS normalizer](https://necolas.github.io/normalize.css/) or style reset if you like.
 1. CSS-only icons are preferred. Otherwise, you can use [Fontawesome icons](http://fontawesome.io/icons/).
 1. App should work in the latest versions of Chrome, Safari, Firefox, and Edge. Backward compatibility is **not required**. 
 1. Use Web Storage API to store data.
 1. Layout should be adaptive.


## What we will evaluate
We will be evaluating the following aspects:
 1. Your ability to design project architecture and consistent approach in implementation (frequent atomic commits are welcome!).
 1. Your ability to write readable and reusable code with clean API.
 1. Your ability to write well-structured, scalable, and maintainable CSS code with **smooth animations**.
 1. Your ability to **document** your code *(not all of it; just the gray areas)*.
 1. Your ability to use pros of native HTML elements.
 1. Accessibility of app.



## What we will NOT evaluate
 1. Usage of bleeding edge features that have bad support and that should be polyfilled.
 
 
## Recommendations
Since chasing the perfect is an endless journey, here are some recommendations for you:
 1. Show your strengths first hand (create perfect markup or focus on JS code with a great architecture).
 1. Add comments to code when you know how to improve.

## How to submit your solution
We expect to get your solution in a public git repository. You can use free hosted services like GitHub or Bitbucket. An ideal roadmap for you would be to make an initial commit with the files of this code challenge and then build upon that. When you're done with the solution, please send us the link of the repository.

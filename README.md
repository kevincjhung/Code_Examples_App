# Next App Code Examples
You're kind of just building this app. For now, just hard code a single user into the app. You will add user auth later.

https://www.slipshods.com/

This assignment is due Nov 10th at 11:59pm.
Push all of your code to github and deploy your app to vercel.
https://classroom.github.com/a/g3uvhqFW


# Progress
    🤔: completed, not tested.
    ✅: completed, tested
    ❌: incomplete/does not work



## 1) Prisma
✅ Setup all of the models and relationships for the entities in the README file.
<br><br>


## 2) Create a post
✅ Add a button to the home page that says "Create a post" and takes you to a page where you can create a post.

✅ When the user submits a post, it should send the data to the server and create a new post in the database.

Currently, it redirects to the homepage, make it redirect to the page of the code snippet after that
page is built
<br><br>


## 3) Get all posts on the home page
✅ When the user goes to the home page, it should fetch all of the posts from the database and display them on the page.

✅ We're going to assume that the posts are constantly changing and could take a while to load, so instead of doing SSR for the list of posts, do the following:

✅ When the page loads, show a loading indicator

✅ use swr, or useEffect to fetch the posts over an AJAX request and display them on the home page.



## 4) View a single post and comments
✅ When a user clicks on a single post, it should take them to a page that shows the post and all of the comments for that post.

✅ use getStaticProps to load the post

✅ use swr, or useEffect to fetch the comments for the post.


## 5) Create a comment
✅ Allow a user to create a new comment on a post. This will increment the comment count for that post.
    - the state updates but the number above the icon does not


## 6) Like/Unlike post
❌ ✅  Allow a user to like and unlike a post. This will increment or decrement the like count for that post.
    
❌ ✅ Clicking the like button will toggle the like on and off.


## 7) User Profile Page
✅ Create a profile page at /profile that shows the user's posts and comments.<br><br>
<br><br>


## 8) Add user auth (lab)
<b>Add user auth to the app using next auth.</b>

✅ 15% Add github login

❌ 15% Add google login (probably leave this until the end)
    Google Auth
    https://console.cloud.google.com/apis/

    Create the consent screen

    Create oauth credentials
    http://localhost:3000/api/auth/callback/google

✅ 15% Add the user auth nav bar functionality: Show the avatar in the nav bar
    Allow the user to sign out from the nav bar
    Allow the user to sign in from the nav bar

✅ 15% Don't allow a user to create a post unless they are logged in.

✅ 15% Create a logical flow for a user to sign in and then create a post. 
    (restrict access to the create post page, or have them sign in when they hit the submit button)

✅ 15% Save the logged in user to the database using the prisma adapter

✅ 10% Create a one-to-many relatioinship between the user and the other entities:
    post
    comment
    like


# Problems
❌ Add like and delete like is functional, but the state is not shown in the post component
❌ comment count is not shown in the post component




# Resources

https://www.sammeechward.com/prisma-and-nextjs

## commands
yarn migrate:dev --name init



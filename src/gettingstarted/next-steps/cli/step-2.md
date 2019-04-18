# Getting Started with the Platform.sh CLI

## Add your RSA key to your account

Now that we have the requirements out of the way, let's place your RSA key onto Platform.sh so that you can communicate with your projects from your computer.

1. **Move to Account Settings**

   From your previous project, move to the top right hand corner of the screen and click the dropdown menu to the left of the settings gear box icon.
   
   In the menu, click on `Account`.
   
   On the next page will be a list of all of your projects visible on the management console.
   
   Next, click on `Account Settings` link at the top of the page. 
   
2. **SSH key Settings**

   From your Account Settings in the management console, you can modify a number of different features of your account if you need to. 
   
   Click the `SSH keys` tab to the left of your account information.

3. **Add your RSA public key**

   At this point you won't see anything listed in the body of the page, because you don't have SSH configured with Platform.sh yet. Click the `+ Add public key` button in the top right hand corner of the screen. 
   
   This will open up another window with two fields. Name the key with something memorable, like `home-computer`, and in the field below that, paste the content of the RSA public key you created in the previous step.
   
   Click `Save` to save the key.
   
   ![SSH key add](/videos/ssh.gif)
   
That's it! Now Platform.sh can authenticate your computer and so you can interact with your projects from the command line. All that's left to do now is actually install the Platform.sh CLI.



<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/next-steps/cli/step-1.html" class="buttongen small">Back</a>
<a href="/gettingstarted/next-steps/cli/step-3.html" class="buttongen small">I have configured my SSH key on my Platform.sh account</a>

</center>

<br/><br/>


</body>
</html>

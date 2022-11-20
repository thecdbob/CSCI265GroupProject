

      //tomorrow fix the button to work in the module so you can use it

    //this is all firebase config stuff, it's loaded in a containerized module that's fairly
    //new to javascript, if you're looking at tutorial videos, the older v8 containers used
    //a different api than this that referred to a global firebase object, the reasons to go to this
    //is the behaviour of things like delaying loading of objects is done by default amoung other reasons
    
    //in addition, we are using a different approach, the default approach as the time of making this app
    //is to use npm to run javascript, however we can use a CDN (content delivery network) to get these modules
    //so if you're looking at a tutorial and you see them import objects from say 'firebase/auth', 
    //we are using webbased versions of those libraries
    //<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    //<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>


  //hopefully this is just for two buttons

  //test comment 




    //Firebase Libraries, we load all the things we need from firebase's CDN here

    //loads firebase
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
      
    //probably not needed but kept for now
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
      
    //import authentication from more libraries in firebase's website
            //not used 
                //connectAuthEmulator, //dev only, remove before pushing
                //signInWithEmailAndPassword, //probably dev only

    //auth libraries
    import { 
      getAuth, 
      onAuthStateChanged, 
      GithubAuthProvider, 
      signInWithPopup, 
      signOut
     } 
    from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js"
    //Firebase SDKs
    
    //import firestore library
    import { 
      getFirestore,
      collection,
      doc,
      addDoc,
      getDoc,
      deleteDoc,
      setDoc,
      onSnapshot,
      query,
      where,
      getDocs,
      orderBy,
      serverTimestamp,
      updateDoc,
      limit
     } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js"

    //bunch of functions for firestore

    //this particular server info is for the CSCI265Project
    //if you want to use your own, change these values
    const firebaseConfig = {
  
      apiKey: "AIzaSyBmD0bxA7V8prQmeOP8Wc1nBVRRks7v-AI",
      authDomain: "studybuddy-3fc87.firebaseapp.com",
      projectId: "studybuddy-3fc87",
      storageBucket: "studybuddy-3fc87.appspot.com",
      messagingSenderId: "896847456980",
      appId: "1:896847456980:web:414c07e255e499cf2a2941",
      measurementId: "G-FVGG9341EH"
  
    };



  //Firebase configs for firebase, auth and database

  //firebase config info
  const app = initializeApp(firebaseConfig);

  //firebase auth info
  const provider = new GithubAuthProvider();
  const auth = getAuth();
  //dev only
  //connectAuthEmulator(auth, "https://localhost:9099");

  //db related
  const db = getFirestore(app);
  


  //DB FUNCTIONS HERE

  //collections of objects in firebase
  //currently we have three collections, Groups, Tasks, Types
  const GroupCollection = collection(db, 'Groups');
  const TypeCollection = collection(db, 'Types');
  const TasksCollection = collection(db, 'Tasks');

  //used to get different items from database (Groups, Tasks, Types)
  //probably useful for when we create objects


  //commented out for now, but will be needed for dropdowns, saves writes

  
  getDocs(GroupCollection)
        //a promise    
        .then((snapshot) => {
          let groups_display_array = []
          snapshot.docs.forEach((doc) => {
            //the id could be useful for the buttons
            groups_display_array.push({...doc.data(), id: doc.id})
          })
          let dynamicTypesDropdown = document.getElementById("selectedGroup");
          //the element we need
  
          let groupNamesArray = [];
          for (let i = 0; i < groups_display_array.length; i++){
            groupNamesArray[i] = groups_display_array[i].Name;
          }
          
          groupNamesArray.forEach(item => {
            const option = document.createElement("option");
            option.textContent = item;
            dynamicTypesDropdown.appendChild(option);
          })
          //console.log(groupNamesArray);
          })
      
      .catch(err => {
        console.log(err.message)
      })
  
      //run to create array that's populates dropdown menu for user input on tasks
      //must be run within that function as well...
  
  
      getDocs(TypeCollection)
    //a promise    
    .then((snapshot) => {
        let types_display_array = []
        snapshot.docs.forEach((doc) => {
          //the id could be useful for the buttons
          types_display_array.push({...doc.data(), id: doc.id})
        })
        //var typesDropdownMenu = document.getElementById("selectedType");
        //dropdown[dropdown.length] = new Option(types_display_array[i].Name, types_display_array[i].Name);
        //let onlyTypesNamesArray = types_display_array[i].name;
        let dynamicTypesDropdown = document.getElementById("selectedType");
        //the element we need

        let typeNamesArray = [];
        for (let i = 0; i < types_display_array.length; i++){
          typeNamesArray[i] = types_display_array[i].Name;
        }
        
        typeNamesArray.forEach(item => {
          const option = document.createElement("option");
          option.textContent = item;
          dynamicTypesDropdown.appendChild(option);
        })
        
        //console.log(typeNamesArray);
        //console.log(types_display_array);
        })
    .catch(err => {
      console.log(err.message)
    })
    

    
    
    /*
  getDocs(TasksCollection)
    //a promise    
    .then((snapshot) => {
        let types_display_array = []
        snapshot.docs.forEach((doc) => {
          //the id could be useful for the buttons
          types_display_array.push({...doc.data(), id: doc.id})
        })
      console.log(types_display_array)
    })
    .catch(err => {
      console.log(err.message)
    })
    */

  //even # of elements, collection, doc (always even number)
  //const add_task_to_db

  //const add_task_to_db

    //NOT THE N FOLDER WE WANT

    //add items to database
    
    //add group
    const addGroupForm = document.querySelector('.create_group')
    addGroupForm.addEventListener('submit', (e) => {
        //prevents page refresh
        e.preventDefault()

        addDoc(GroupCollection, {
            Colour: addGroupForm.GroupColour.value,
            Name: addGroupForm.GroupName.value,
            time_created: serverTimestamp(),
            time_modified: serverTimestamp()     
        })
        .then(() => {
            //reset box for more input
            addGroupForm.reset()
        })
    })

    //add task
    const addTaskForm = document.querySelector('.create_task')
    addTaskForm.addEventListener('submit', (e) => {
        //prevents page refresh
        e.preventDefault()

        addDoc(TasksCollection, {
            Group: addTaskForm.selGroup.value,
            Name: addTaskForm.TaskName.value,
            Type: addTaskForm.selType.value,       
            date_due: addTaskForm.DateDue.value,
            time_created: serverTimestamp(),
            time_modified: serverTimestamp(),
            Completed: false
        })
        .then(() => {
            //reset box for more input
            addTaskForm.reset()
        })
    })

     //delete task
     const removeTaskForm = document.querySelector('.remove_task')
     removeTaskForm.addEventListener('submit', (e) => {
             //prevents page refresh
             e.preventDefault()
 
             const docRef = doc(db, 'Tasks', removeTaskForm.TaskID.value)
 
             deleteDoc(docRef)
             .then(() => {
             removeTaskForm.reset()
         })
     })
     

    //delete task
    //const removeTaskForm = document.querySelector('.remove_task');
    //const removeTask = document.querySelector('.create_task')
    /*
    removeTask.addEventListener("onclick", (e) => {
      
      var idKey = e.getAttribute("id");
      
      const docRef = doc(db, 'Tasks', idKey)
            //e.preventDefault();
            
            //deleteDoc(docRef)
            //.then(() => {
      //}

      
    })
    */
    
    /*
    export function removeTask(idKey) {
            //prevents page refresh
            //e.preventDefault()
            //var input = whatever button id we have
            //var idToRemove = varinput.substr(1);
            //this value will change
            
            //removeTaskForm.reset()
        })
    }
    */
    /*
    //delete task
    //const removeTaskForm = document.querySelector('.remove_task')
    removeTaskForm.addEventListener('onclick', (e) => {
            //prevents page refresh
            e.preventDefault()
            //var input = whatever button id we have
            var idToRemove = varinput.substr(1);
            //this value will change
            const docRef = doc(db, 'Tasks', removeTaskForm.TaskID.value)

            deleteDoc(docRef)
            .then(() => {
            removeTaskForm.reset()
        })
    })
    */
    
    
    //Realtime Data Collection
    //probably used for main screen, to display groups and tasks
    //what we see our tasks and groups as on the main page

    //Realtime Groups
    
    onSnapshot(GroupCollection, (snapshot) => {
    let groups_display_array_rt = []
    snapshot.docs.forEach((doc) => {
    //the id could be useful for the buttons
    groups_display_array_rt.push({...doc.data(), id: doc.id})
    })
    //document.getElementById("groupLegend").innerHTML = groups_display_array_rt
    document.getElementById("groupLegend").innerHTML = '';
    //document.getElementById("groupLegend").innerHTML = 'Group Legend';

    for (let i = 0; i < groups_display_array_rt.length; i++) {
      var gName = groups_display_array_rt[i].Name;
      var gColour = groups_display_array_rt[i].Colour;
      
      var display_groups = gName + ' ' + gColour + '\n';
      //var display_groups = document.createElement('li', gName + ' ' + gColour);
      //document.getElementById("groupLegend").appendChild(display_groups); 
      document.getElementById("groupLegend").innerHTML +='<li> ' + display_groups + ' </li>';


      
      /*
      data.forEach((item) => {
        let li = document.createElement("li");
        li.innerText = item;
        list.appendChild(li);
        */
      
      //this changed the style of the document
      //document.getElementById("groupLegend").innerHTML = groups_display_array_rt[i].Name + ' ' + groups_display_array_rt[i].Colour;
      //document.querySelector('.completeTask')
      
      //display_groups.parent('groupLegend');
      //console.log('hi');
      
    }
    })

    //document.getElementById("groupLegend").innerHTML = "I have changed!"; 

    //Realtime Tasks
    onSnapshot(TasksCollection, (snapshot) => {
    let task_display_array_rt = []
    snapshot.docs.forEach((doc) => {
    //the id could be useful for the buttons
    task_display_array_rt.push({...doc.data(), id: doc.id})
    })
    document.getElementById("taskDisplay").innerHTML = '';
    document.getElementById("completedTaskDisplay").innerHTML = '';
    //document.getElementById("taskDisplay").innerHTML = '<h2>Tasks</h2>';
    for (let i = 0; i < task_display_array_rt.length; i++) {
      var tCompleted = task_display_array_rt[i].Completed;
      var tName = task_display_array_rt[i].Name;
      var tGroup = task_display_array_rt[i].Group;
      var tType = task_display_array_rt[i].Type;
      var tDue = task_display_array_rt[i].date_due;
      //we use this in another place, but it works
      var tId = task_display_array_rt[i].id;

      var taskString = tCompleted + " " + tName + " " + tGroup + " " + tType + " " + tDue + " " + tId;
      //hi josh please change this
      if (tCompleted == false) {
        document.getElementById("taskDisplay").innerHTML +='<li>' + taskString + '</li>';
      } else {
        document.getElementById("completedTaskDisplay").innerHTML +='<li>' + taskString + '</li>';
      }
      //document.getElementById("taskDisplay").innerHTML +='<li><button id ="' + "m" + tId + '">Mark</button> ' + taskString + ' <button type="button" class="btn btn-primary" onclick="removeTask(' + tId + ');">Remove</button></li>';
      //document.getElementById("taskDisplay").innerHTML +='<script><script><li><button id ="' + "m" + tId + '">Mark</button> ' + taskString + ' <button type="button" class="btn btn-primary" onclick={() => removeTask(' + tId + ')}>Remove</button></li>';
      //we still need to add that doc.id element to this to be able to delete it
      //var display_tasks = document.createTextNode(tCompleted + ' ' + tName + ' ' + tGroup + ' ' + tType + ' ' + tDue + '\n');
      //var display_groups = document.createElement('li', gName + ' ' + gColour);
      //document.getElementById("taskDisplay").appendChild(display_tasks); 

      //I modified the code haha!
    }
    })
    
    



    //Querries (Searches the Database)
    //probably have to build index as well

    //I think we could link these to buttons to find certain things
    const group_query = query(GroupCollection, where("name", "==", "nametofind"))


    //or to order certain things by a certain field
    const task_time_query = query(TasksCollection, where("name", "==", "nametofind"), orderBy('Date Due', 'desc'))






    //Getting Single Document (Maybe for getting tasks?)
    
    //not sure how to get id of this kind of object
    //const docRef = doc(db, 'Types', 'ID')








    //Editing/Updating Items

    const completedTaskEdit = document.querySelector('.completeTask')
    completedTaskEdit.addEventListener('submit', (e) => {
        e.preventDefault()

        const docRef = doc(db, 'Tasks', completedTaskEdit.TaskID.value)

        updateDoc(docRef, {
            Completed: true,
            time_modified: serverTimestamp()
        })
        .then(() => {
            completedTaskEdit.reset()
        })
    })


    





  //AUTH FUNCTIONS BELOW HERE

  //testing only, email/pw auth methods
  //const loginEmailPassword = async () => {
  //const loginEmail = txtEmail.value;
  //const loginPassword = txtPassword.value;

    //const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginEmailPassword);
    //console.log(userCredential.user);
  



  /*
  function user_sign_in(){
      loginEmailPassword
      console.log("hi");
    }
    */

 // btnLogin.addEventListener("click", loginEmailPassword);

  //this eventually will be the Github authfunction we will use
  

    /*
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
    });
    */


    //login

    const loginButton = document.querySelector('.loginb')
    loginButton.addEventListener('click', (e) =>  {
        e.preventDefault()

        signInWithPopup(auth, provider)
            .then((result) => {
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            const credential = GithubAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            // The signed-in user info
            const user = result.user;
            
            
            // ...
            })
            .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GithubAuthProvider.credentialFromError(error);
            // ...
            })
        })

        //const userThing = auth.currentUser;
    //logout


    const logoutButton = document.querySelector('.logoutb')
    logoutButton.addEventListener('click', () =>  {
        signOut(auth)
            .then(() => {
                //console.log('Signed Out')
            })
            .catch((err) => {
                console.log(err.message)
            })
    
    })


    //auth state 

    const showApp = () => {
      const userThing = auth.currentUser.reloadUserInfo.screenName;
      document.getElementById("login").style.display = 'none'
      document.getElementById('app').style.display = 'block'
      document.getElementById('userName').innerHTML = "Hello " + userThing;
      //document.getElementById('userName').innerHTML += "Hello " + {user.displayName};
    }

    const showLoginForm = () => {
      document.getElementById('login').style.display = 'block'
      document.getElementById('app').style.display = 'none'  
      document.getElementById('userName').innerHTML += '';
    }

    const monitorAuthState = async () => {
      onAuthStateChanged(auth, (user) => {
        console.log('user status changed', user)
        if (user) {
          showApp()
      }
      else {
          showLoginForm()
      }
      });
    }

    monitorAuthState()

    
    

    


    //NON FIREBASE FUNCTIONS

    //addTaskPopup()

    /*
    const taskPopupButton = document.querySelector('.createTaskB')
      completedTaskEdit.addEventListener('click', () => {
        taskPopupButton.classList.toogle("create_task_popup")
    })
    */


    //things that should be in another file but aren't
    
    //our little thing to put in the top right corner to show the logged in user
    /*
    const showLoginState = (user) => {
      lblAuthState.innerHTML = `You're logged in as ${user.displayName}`
    }
    */



    /*
    const logout_button = document.querySelector('.logout')
    logout_button.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
            console.log('Sign out completed')
        })
        .catch((err) => {
        console.log(err.message)
        })
    })
*/

/*
    const monitor_auth_state = async () => {
    onAuthStateChanged(auth, user => {
        if(user) {
            console.log(user);
            ShowApp();

            hideLoginError();
        }
        else {
            showLoginForm();
            AuthState.innerHTML = "You're not logged in.";
        }
    });
    
    */

    //btnLogin.addEventListener("click", signInWithPopup)
    //btnLogOut.addEventListener("click", logout)
    //export default signInWithPopup;
    //export need things, unless using NPM is easier than this method
    //export {signInWithPopup(), errorCode, email, credential, errorCode, user, token, credential, auth
    //provider, userCredential, app};


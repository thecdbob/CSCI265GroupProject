

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
let grabbed_colour= '#111111';
let grabbed_name = 'notdefault';


let allgroups = [];

onSnapshot(GroupCollection,(snapshot) => {

  allgroups = [];
  snapshot.docs.forEach(doc => {
    allgroups.push({...doc.data(),id: doc.id})
  }
  )
  console.log(allgroups);
}
)


//add task
const addTaskForm = document.querySelector('.create_task')
addTaskForm.addEventListener('submit', (e) => {
  //prevents page refresh
  e.preventDefault()
  
  //two local variables to use for document


  /*
  const docRef = doc(db, 'Groups', addTaskForm.selGroup.value);
  console.log(docRef);
  console.log(addTaskForm.selGroup.value);
  getDoc(docRef) .then((doc) => {
    //console.log("running group insert stuff");
    console.log(doc.data(),doc.id);
    grabbed_colour = doc.data().Colour;
    grabbed_name = doc.data().Name;
    console.log(grabbed_name,grabbed_colour);

  }
  
    
  )
*/
  addDoc(TasksCollection, {
    //GroupID: addTaskForm.selGroup.value,
    //create query based on if of element
    Group: addTaskForm.selGroup.value,
    //Group: grabbed_name,
    //console.log(docRef);
    //getDoc(GroupID)
    //GroupColor: grabbed_colour,
    //Group:
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



//commented out for now, but will be needed for dropdowns, saves writes

let dynamicGroupsDropdown = document.getElementById("selectedGroup");
let removeGroupsDropdown = document.getElementById("selectedGroupR");


const updatePopupGroup = getDocs(GroupCollection)
  //a promise    
  .then((snapshot) => {
    //console.log("UPDATING");
    let groups_display_array = []
    snapshot.docs.forEach((doc) => {
      //the id could be useful for the buttons
      groups_display_array.push({ ...doc.data(), id: doc.id })
    })

    //the element we need
    /*
    let groupNamesArray = [];
    
    for (let i = 0; i < groups_display_array.length; i++){
      groupNamesArray[i] = groups_display_array[i].Name;
      
    }
    */
    groups_display_array.forEach(item => {
      const option = document.createElement("option");
      const optionR = document.createElement("option");
      option.textContent = item.Name;
      /*
      //if it's remove do this
      option.value = item.id;
      option.id = item.Name;
      //if it's add do this
      option.value = item.name;
      */
      if (item.Name != "default") {
        optionR.textContent = item.Name;
        optionR.value = item.id;
        removeGroupsDropdown.appendChild(optionR);
      }
      dynamicGroupsDropdown.appendChild(option);
    })
    //console.log(groupNamesArray);
  })

  .catch(err => {
    console.log(err.message)
  })

//run to create array that's populates dropdown menu for user input on tasks
//must be run within that function as well...

const addtaskbutton = document.querySelector('.addtaskbutton');
const removeBtn = document.querySelector('.removegroupbutton');

const refreshGroups = ()=>{
  //console.log("CALLED");
  getDocs(GroupCollection)
  //a promise    
  .then((snapshot) => {
    //console.log("UPDATING");
    let groups_display_array = []
    snapshot.docs.forEach((doc) => {
      //the id could be useful for the buttons
      groups_display_array.push({ ...doc.data(), id: doc.id })
    })

    //the element we need
    /*
    let groupNamesArray = [];
    
    for (let i = 0; i < groups_display_array.length; i++){
      groupNamesArray[i] = groups_display_array[i].Name;
    }
    */

    // remove everything in the dropdown
   while (dynamicGroupsDropdown.length > 0) {
    dynamicGroupsDropdown.remove(0);  
   }

    // remove everything in the dropdown
    while (removeGroupsDropdown.length > 0) {
      removeGroupsDropdown.remove(0);  
    }

    groups_display_array.forEach(item => {
      const option = document.createElement("option");
      const optionR = document.createElement("option");
      option.textContent = item.Name;
      //option.value = item.id; #267 for dynamic id for group
      /*
      //if it's remove do this
      option.value = item.id;
      option.id = item.Name;
      //if it's add do this
      option.value = item.name;
      */
      if (item.Name != "default") {
        optionR.textContent = item.Name;
        optionR.value = item.id;
        removeGroupsDropdown.appendChild(optionR);
      }
      dynamicGroupsDropdown.appendChild(option);
    })
    //console.log(groupNamesArray);
  })

  .catch(err => {
    console.log(err.message)
  })
}

addtaskbutton.addEventListener('click', refreshGroups);
removeBtn.addEventListener('click',refreshGroups);




getDocs(TypeCollection)
  //a promise    
  .then((snapshot) => {
    let types_display_array = []
    snapshot.docs.forEach((doc) => {
      //the id could be useful for the buttons
      types_display_array.push({ ...doc.data(), id: doc.id })
    })
    //var typesDropdownMenu = document.getElementById("selectedType");
    //dropdown[dropdown.length] = new Option(types_display_array[i].Name, types_display_array[i].Name);
    //let onlyTypesNamesArray = types_display_array[i].name;
    let dynamicTypesDropdown = document.getElementById("selectedType");
    //the element we need

    let typeNamesArray = [];
    for (let i = 0; i < types_display_array.length; i++) {
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





getDocs(TasksCollection)
  //a promise    
  .then((snapshot) => {
    let task_display_array = []
    snapshot.docs.forEach((doc) => {
      //the id could be useful for the buttons
      task_display_array.push({ ...doc.data(), id: doc.id })
    })
    //console.log(types_display_array)
    let dynamicTasksRDropdown = document.getElementById("selectedTaskR");

    task_display_array.forEach(item => {
      const option = document.createElement("option");
      option.textContent = item.Name;
      option.value = item.id;
      dynamicTasksRDropdown.appendChild(option);
    })

  })
  .catch(err => {
    console.log(err.message)
  })


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




//not defined, but may be used if the HTML solultion doesn't work

/*
//add task but only name
const addTaskFormName = document.querySelector('.create_task')
addTaskFormName.addEventListener('submit', (e) => {
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
*/


//delete task
const removeTaskForm = document.querySelector('.remove_task')
removeTaskForm.addEventListener('submit', (e) => {
  //prevents page refresh
  e.preventDefault()

  const docRef = doc(db, 'Tasks', removeTaskForm.selTaskR.value)

  deleteDoc(docRef)
    .then(() => {
      removeTaskForm.reset()
    })
})

//delete group
const removeGroupForm = document.querySelector('.remove_group')
removeGroupForm.addEventListener('submit', (e) => {
  //prevents page refresh
  e.preventDefault()

  const docRef = doc(db, 'Groups', removeGroupForm.selGroupR.value)

  //update all tasks that had that value
  
  // const removedGroupQuery = query(TasksCollection, where("GroupID", "==", removeGroupForm.selGroupR.value))
  
  
  //   getDocs(removedGroupQuery)
  // //a promise    
  // .then((snapshot) => {
  //   let remove_groups_array = []
  //   snapshot.docs.forEach((doc) => {
  //     //the id could be useful for the buttons
  //     remove_groups_array.push({id: doc.id })
  //   })
  //     //change values to default
  //   task_display_array.forEach(item => {

  //     updateDoc(item.id, {
  //     Group: "default",
  //     GroupID: "default_group",
  //     GroupColour: "#000000",
  //     time_modified: serverTimestamp()
  //     })

  //   })

  // })
  // .catch(err => {
  //   console.log(err.message)
  // })


  
  

  deleteDoc(docRef)
    .then(() => {
      removeGroupForm.reset()
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
    groups_display_array_rt.push({ ...doc.data(), id: doc.id })
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
    document.getElementById("groupLegend").innerHTML += '<li><span style="color:' + gColour + '">' + gName + '</span></li>';



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

const taskTable = document.querySelector(".task-table");
const completedtaskTable = document.querySelector(".completed-task-table");

//Realtime Tasks
onSnapshot(TasksCollection, (snapshot) => {
  let task_display_array_rt = []
  snapshot.docs.forEach((doc) => {
    //the id could be useful for the buttons
    task_display_array_rt.push({ ...doc.data(), id: doc.id })
  })
  // document.getElementById("taskDisplay").innerHTML = '';
  // document.getElementById("completedTaskDisplay").innerHTML = '';
  taskTable.innerHTML = '';
  completedtaskTable.innerHTML = '';

  //document.getElementById("taskDisplay").innerHTML = '<h2>Tasks</h2>';
  for (let i = 0; i < task_display_array_rt.length; i++) {
    var tCompleted = task_display_array_rt[i].Completed;
    var tName = task_display_array_rt[i].Name;
    var tGroup = task_display_array_rt[i].Group;
    var tType = task_display_array_rt[i].Type;
    var tDue = task_display_array_rt[i].date_due;
    let tcolors = "#000";

    for (let index = 0; index < allgroups.length; index++) {
      if(allgroups[index].Name === tGroup){
        console.log("FOUND COLOR for group " + tGroup + " task " +tName );
        tcolors = allgroups[index].Colour;
        console.log(tcolors,tGroup);
      }
    }
   
    //we use this in another place, but it works
    var tId = task_display_array_rt[i].id;

    let tr = document.createElement('tr');
    let taskstr = `<td>${tName}</td><td>
    
    <div class = "groupIcon" style = "background-color : ${tcolors}"></div>
    
    ${tGroup}</td>
    
    <td>${tType}</td><td>${tDue}</td>`;
    // tr.style.backgroundColor = tcolors;
    tr.innerHTML = taskstr;
    //console.log(colorq);
    // console.log(tGroup);
    tr.classList.add('color-row');
    


    //hi josh please change this
    if (tCompleted == false) {
      taskTable.appendChild(tr);
    } else {
      
      completedtaskTable.appendChild(tr);
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

//Mark Task Drop Down Function
const group_query = query(GroupCollection, where("name", "==", "nametofind"))

const markedTaskQuery = query(TasksCollection, where("Completed", "==", false))

/*
const MarkedTaskQueryFunc = await getDocs(markedTaskQuery);
MarkedTaskQueryFunc.forEach((doc) => {
  console.log(doc.id, " =>", doc.data().Name);
});
*/




getDocs(markedTaskQuery)
  //a promise    
  .then((snapshot) => {
    let task_display_array_m = []
    snapshot.docs.forEach((doc) => {
      //the id could be useful for the buttons
      task_display_array_m.push({ ...doc.data(), id: doc.id })
    })
    //console.log(types_display_array)
    let dynamicTasksMDropdown = document.getElementById("selectedTaskM");

    task_display_array_m.forEach(item => {
      const option = document.createElement("option");
      option.textContent = item.Name;
      option.value = item.id;
      dynamicTasksMDropdown.appendChild(option);
      //console.log(doc.id, " =>", doc.data().Name);

    })

  })
  .catch(err => {
    console.log(err.message)
  })

  const refreshCompletedTasks = function (){

    //console.log("Refereshed completed tasks");

    getDocs(markedTaskQuery)
  //a promise    
  .then((snapshot) => {
    let task_display_array_m = []
    snapshot.docs.forEach((doc) => {
      //the id could be useful for the buttons
      task_display_array_m.push({ ...doc.data(), id: doc.id })
    })
    //console.log(types_display_array)
    let dynamicTasksMDropdown = document.getElementById("selectedTaskM");

    // remove everything in the dropdown
    while (dynamicTasksMDropdown.length > 0) {
      dynamicTasksMDropdown.remove(0);  
    }

    task_display_array_m.forEach(item => {
      const option = document.createElement("option");
      option.textContent = item.Name;
      option.value = item.id;
      dynamicTasksMDropdown.appendChild(option);
      //console.log(doc.id, " =>", doc.data().Name);

    })

  })
  .catch(err => {
    console.log(err.message)
  })
  }

  const refreshRemoveDropdown = function(){
    //console.log("REFRESH remove dropdown");

    getDocs(TasksCollection)
  //a promise    
  .then((snapshot) => {
    let task_display_array = []
    snapshot.docs.forEach((doc) => {
      //the id could be useful for the buttons
      task_display_array.push({ ...doc.data(), id: doc.id })
    })
    //console.log(types_display_array)
    let dynamicTasksRDropdown = document.getElementById("selectedTaskR");

    // remove everything in the dropdown
    while (dynamicTasksRDropdown.length > 0) {
      dynamicTasksRDropdown.remove(0);  
    }

    task_display_array.forEach(item => {
      const option = document.createElement("option");
      option.textContent = item.Name;
      option.value = item.id;
      dynamicTasksRDropdown.appendChild(option);
    })

  })
  .catch(err => {
    console.log(err.message)
  })

  }

  const completedBtn = document.querySelector('.completetaskbutton');
  const removeTaskBtn = document.querySelector('.removetaskbutton');


  completedBtn.addEventListener('click',refreshCompletedTasks);
  removeTaskBtn.addEventListener('click',refreshRemoveDropdown);







/*
getDocs(markedTaskQuery)
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
    let dynamicTaskDropdownM = document.getElementById("selectedType");
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
*/

//marked_task_query(forEach)


//or to order certain things by a certain field
const task_time_query = query(TasksCollection, where("name", "==", "nametofind"), orderBy('Date Due', 'desc'))





//Getting Single Document (Maybe for getting tasks?)

//not sure how to get id of this kind of object
//const docRef = doc(db, 'Types', 'ID')








//Editing/Updating Items

const completedTaskEdit = document.querySelector('.completeTask')
completedTaskEdit.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'Tasks', completedTaskEdit.selTaskM.value)

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
//console.log(loginButton);

loginButton.addEventListener('click', (e) => {
  e.preventDefault()

  //console.log("Login screen clearing")

  //console.log("Login screen clearing")
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info
      const user = result.user;

      location.reload();

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
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      //console.log('Signed Out')
      location.reload();
    })
    .catch((err) => {
      console.log(err.message)
    })

})


//auth state 

//application page
const showApp = () => {
  const userThing = auth.currentUser.reloadUserInfo.screenName;
  const userPic = auth.currentUser.reloadUserInfo.photoUrl;

  document.getElementById("login").style.display = 'none'
  document.querySelector(".login-screen").style.height = '0';
  document.getElementById('app').style.display = 'block';

  document.getElementById('userName').innerHTML = "Hello " + userThing;
  //document.getElementById('userPic').innerHTML = '<img src="' + userPic + '">';
  //document.getElementById('userName').innerHTML += "Hello " + {user.displayName};
}

//LOGIN PAGE
const showLoginForm = () => {
  document.getElementById('login').style.display = 'block'
  document.querySelector(".login-screen").style.height = '100hv';
  document.getElementById('app').style.display = 'none'
  document.getElementById('userName').innerHTML += '';
}

const monitorAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    //console.log("hi everyone, I'm logged in")
    //console.log('user status changedddddddddddd', user)
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


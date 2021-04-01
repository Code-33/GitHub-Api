import React from 'react';
import "./App.css";

let apiToken = '';//token user inputs
let userName = '';//login name for github user


//Getting rid of hidden status of optios div
//Adding access token and userName to window
function hiddenChg(){
  const opt = document.getElementById('options');
  const before = document.getElementById('app');
  opt.hidden = false;
  const heading1 = document.createElement('p');
  const heading2 = document.createElement('p');
  heading1.innerHTML = `Access Token: ${apiToken}`;
  heading2.innerHTML = `<strong>Welcome, ${userName}</strong>`
  before.insertBefore(heading2, opt) //Adds before options div
  before.insertBefore(heading1, heading2) //Adds before userName
}


//Recieves token entered and hides the field to prevent any 
//other token inputs when button is pressed.
function GetToken(){
  const [token, setToken] = React.useState('');
  const handleChange = event=> setToken(event.target.value);

  const handleSubmit = (event=> {
    event.preventDefault();
    apiToken = token;
    document.getElementById('firstSub').hidden = true;
    const fetchData = async ()=>{
      const response = await fetch('https://api.github.com/user',{
        headers:{
          "Content-Type": "application/json",
          "Authorization": `token ${apiToken}`,
        }
      });
      const data = await response.json();
      userName = data.login;
      hiddenChg();
    }
    fetchData();
  });

  return (
    <form id="firstSub" onSubmit={handleSubmit}>
     <input value={token} onChange={handleChange} type="text" />
     <input type="submit" placeholder="Access Token" value="Submit" />
  </form>
  )
}

//Prints all current user'e public repositories on window 
function ShowRepos({ repos, setRepos}){

  const handleClick = (event=> {
   // const liSpot = document.getElementById('placeforRepos');
    const fetchRepos = async ()=>{
      const response = await fetch(`https://api.github.com/users/${userName}/repos`);
      const data = await response.json();
      setRepos(data)
      // liSpot.innerHTML = printUrls(data);//Gotta learn how to do map version
    } 
    fetchRepos();
  });

   return(
    <div id="show-repos" className="third">
    <button onClick={handleClick}>Get My Repos</button>
    <ul id="placeforRepos">
    {repos.length > 0 ? repos.map(repo => <li key={repo.id}>{repo.name}</li>) : <li>No repos yet</li>}
    </ul>
  </div>
   );
}

//Makes a repository in users github
//Also updates list in real time
function MakeRepo({ setRepos, repos }){
  const [repoName, setRepoName] = React.useState('');
  const [repoDesc, setRepoDesc] = React.useState('');
  const handleChangeName = event=> setRepoName(event.target.value);
  const handleChangeDesc = event=> setRepoDesc(event.target.value);

  const handleSubmit = async event => {
    event.preventDefault()

    try{
      const response = await fetch(`https://api.github.com/user/repos`,{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
          "Authorization": `token ${apiToken}`,
        },
        body: JSON.stringify({
          name: repoName,
          description: repoDesc
        }),
      })

      if(!response.ok){
        throw response;
      }

      const data = await response.json();

      setRepos([...repos, data])
    }catch(err){
        alert("An error has occured. The repository has not been added");
    }
    document.getElementById('addName').value='';//Making the input box blanksetRepoName('');
    document.getElementById('addDesc').value='';//Making the input box blank
    //setRepoName('') <= this doesn't work for ^
  };
   
  return (
    <div id="make-repo" className="third">
    <form onSubmit={handleSubmit}>
      <input id="addName" type="text" onChange={handleChangeName} placeholder="Repo name" />
      <br />
      <input id="addDesc" type="text" onChange={handleChangeDesc} placeholder="Repo description" />
      <br />
      <input type="Submit" readOnly value="Create a Repo" />
    </form>
  </div>
  );
}

//Deletes repository from users github
function DeleteRepo({ setRepos, repos }){
  const [repoName, setRepoName] = React.useState('');
  const handleChangeName = event=> setRepoName(event.target.value);

  const handleSubmit = async event=>{
    event.preventDefault();
    
      try{
      const response = await fetch(`https://api.github.com/repos/${userName}/${repoName}`,{
         method: "DELETE",
         headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${apiToken}`,
         }
      })

        //Filters out names of repos if they are not in json data retireved from fetch
        setRepos(repos.filter(element=> element.name !== repoName))

      if(!response.ok){
        throw response

       
      }else{
        alert('Repository has been deleted')
      }
    }catch (err){
      alert(`Repository deletion has failed` )
    }
  
  document.getElementById('deleteInput').value='';//Making the input box blank
  }
  
  return(
    <div id="delete-repo" className="third">
        <form onSubmit={handleSubmit}>
          <input id="deleteInput" type="text" onChange={handleChangeName} placeholder="Name of repo to delete" />
          <br />
          <input type="Submit" readOnly value="Delete Repo" />
        </form>
      </div>
  );
}

//Main function that puts all other functions on the window to interact with
function App() {
  const [repos, setRepos] = React.useState([])

  return (
    <div id="app" className="App">
      <GetToken />
     <div hidden id="options">   
        <ShowRepos repos={repos} setRepos={setRepos} />
        <MakeRepo  repos={repos} setRepos={setRepos} />
        <DeleteRepo repos={repos} setRepos={setRepos}/>
      </div>
      
     {/* <p>
        Write Your logic here. Don't worry about splitting up components at
        first, just focus on getting the logic right. Afterwards you can split
        your logic up. For an extra challenge, show the user loading states
        whenever they perform an async action. Afterwards, feel free to style it
        up (BUT ONLY AFTER YOU COMPLETE THE APP IN ENTIRETY)
     </p>*/}
    </div>
  );
}

export default App;

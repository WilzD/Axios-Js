//Axios Globals
//now the users login token will be global (we are having an random token from jwt.io)
//this will automaticaly added to headers in congig
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'



// GET REQUEST
function getTodos() {
  console.log('GET Request');
  // axios({
  //   method:'GET',
  //   url:'https://jsonplaceholder.typicode.com/todos',
  //   params:{
  //     _limit:5    //it will show the first five id's data
  //   }
  // })
  // .then(res=>showOutput(res))  //passing the result to the showdata function
  // .catch(err=>console.log(err))

  // another way of doing the get request data 
  axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5',{timeout:5000}) //we give the params in the url itself , and set max to fetch data to 5sec if exceed error shows
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}

// POST REQUEST
function addTodo() {
  console.log('POST Request');
  // axios({
  //   method:"POST",
  //   url:"https://jsonplaceholder.typicode.com/todos",
  //   data:{
  //     title:"wilson's todo",
  //     completed:false
  //   }

  // })
  // .then(res=>showOutput(res))
  // .catch(er=>console.log(err))

  // anotehr way of sending data to api 
  axios.post('https://jsonplaceholder.typicode.com/todos', {
    title: "wilson's todo",
    completed: false
  })
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}

// PUT/PATCH REQUEST
function updateTodo() {
  console.log('PUT/PATCH Request');
  //put will replace the data with the data sended during update , rest will be gone
  // axios.put('https://jsonplaceholder.typicode.com/todos/1',{
  //   title:"updated wilson's todo",
  //   completed:true
  // })
  // .then(res=>showOutput(res))
  // .catch(err=>console.log(err))

  //where as patch only update the data which we are sended , rest will be there as it is 
  axios.patch('https://jsonplaceholder.typicode.com/todos/1', {
    title: "updated wilson's todo",
    completed: true
  })
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}

// DELETE REQUEST
function removeTodo() {
  console.log('DELETE Request');
  axios.delete('https://jsonplaceholder.typicode.com/todos/1')
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}

// SIMULTANEOUS DATA
function getData() {
  console.log('Simultaneous Request');
  //here we are getting data from two api's SIMULTANEOUSLY
  // axios.all([
  //     axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5"),
  //     axios.get("https://jsonplaceholder.typicode.com/posts?_limit=5")
  // ])
  // .then(res=>{
  //   console.log(res[0])
  //   console.log(res[1])
  //   showOutput(res[1])
  // })
  // .catch(err=>console.log(err))

  //another way using spread()
  axios.all([
    axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5"),
    axios.get("https://jsonplaceholder.typicode.com/posts?_limit=5")
  ])
    .then(axios.spread((todos, posts) => showOutput(posts)))
    .catch(err => console.log(err))

}

// CUSTOM HEADERS
function customHeaders() {
  console.log('Custom Headers');
  // having the token at the backend with custom headres , we are cusomizing our headers
  const config = {
    headers: {
      'Content-Type': "application/json",
      Authorization: 'Sometoken'
    }
  }

  axios.post('https://jsonplaceholder.typicode.com/todos', {
    title: "wilson's todo",
    completed: false
  }, config    // sending config as the second parameter at the backend
  )
    .then(res => showOutput(res))
    .catch(err => console.log(err))

}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  console.log('Transform Response');
  //we are transforming data from lower (from database) to uppercase(to our html page) 
  const options = {
    method: 'post',
    url: "https://jsonplaceholder.typicode.com/todos",
    data: {
      title: "hello world"
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    })
  }
  axios(options).then(res => showOutput(res))
}

// ERROR HANDLING
function errorHandling() {
  console.log('Error Handling');
  //here we are handling our errors , we are passing the wrong api address for generating erro
  axios.get('https://jsonplaceholder.typicode.com/todos/ss')
    .then(res => showOutput(res))
    .catch(err => {
      if (err.response) {
        //server responds with a status other than 200 range
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)

        if(err.response.status===404){
          alert("Error : page not found")
        }
      }
      else if(err.request){
        //request was made but no response
        console.error(err.request)
      }
      else{
        console.error(err.message)
      }

    })

}

// CANCEL TOKEN
function cancelToken() {
  console.log('Cancel Token');
  //cancel request on fly or on mid way
  const source=axios.CancelToken.source()

  axios.get('https://jsonplaceholder.typicode.com/todos',{
    cancelToken:source.token
  })
  .then(res=>showOutput(res))
  .catch(thrown=>{
    if(axios.isCancel(thrown)){
      console.log('request canceled', thrown.message)
    }
  })
   
  if(true){
    source.cancel(' request cancelled')
  }
}

// INTERCEPTING REQUESTS & RESPONSES
//we are having some convo with the method which is config here ,so we can do tha with interceptors
axios.interceptors.request.use(
  config => {
    console.log(`${config.method.toUpperCase()} request sent to ${config.url}`)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// AXIOS INSTANCES

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);

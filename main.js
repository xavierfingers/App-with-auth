import PocketBase from 'https://unpkg.com/pocketbase@0.14.0/dist/pocketbase.es.mjs';
    const pb = new PocketBase('http://127.0.0.1:8090');

    // Sign up function
    async function signup(email, password, name) {
      try {
        const user = await pb.collection('users').create({
          email,
          password,
          passwordConfirm: password,
          name
        });
        alert('User signed up!');
      } catch(e) { console.error(e); alert('Signup failed'); }
    }

    // Login function
    async function login(email, password) {
      try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        alert('Logged in as ' + authData.model.name);
        loadTasks();
      } catch(e) { console.error(e); alert('Login failed'); }
    }

    // Load user tasks
    async function loadTasks() {
      try {
        const tasks = await pb.collection('tasks').getFullList(200, {
          filter: `owner="${pb.authStore.model.id}"`
        });
        console.log('Tasks:', tasks);
        const taskList = document.getElementById('tasks');
        taskList.innerHTML = tasks.map(t => `<li>${t.title} - ${t.completed ? '?' : '?'}</li>`).join('');
      } catch(e) { console.error(e); }
    }

    // Add new task
    async function addTask(title, description) {
      try {
        await pb.collection('tasks').create({
          title,
          description,
          owner: pb.authStore.model.id
        });
        loadTasks();
      } catch(e) { console.error(e); }
    }


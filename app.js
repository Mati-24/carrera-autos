// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDJySLw1aIjUTEgFpWhZX-JkLBfMlJTcjU",
    authDomain: "inscripcion-carrera.firebaseapp.com",
    projectId: "inscripcion-carrera",
    storageBucket: "inscripcion-carrera.appspot.com",
    messagingSenderId: "756525780920",
    appId: "1:756525780920:web:62146c2291fcdc88edc94d"
  };
  
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Función para guardar datos en Firestore
  function saveData() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const carModel = document.getElementById('carModel').value;
    const dob = document.getElementById('dob').value;
    const category = document.getElementById('category').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const licenseNumber = document.getElementById('licenseNumber').value;
  
    // Validar que el número de licencia sea único
    db.collection('participants').where('licenseNumber', '==', licenseNumber).get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        Swal.fire('Error', 'El número de licencia ya está registrado', 'error');
      } else {
        // Agregar los datos a Firestore
        db.collection('participants').add({
          name,
          email,
          carModel,
          dob,
          category,
          gender,
          licenseNumber
        }).then(() => {
          Swal.fire('Éxito', 'Datos guardados exitosamente', 'success');
          loadData();  // Recargar los datos
          document.getElementById('carForm').reset();
        }).catch((error) => {
          Swal.fire('Error', 'Hubo un problema al guardar los datos', 'error');
          console.error('Error adding document: ', error);
        });
      }
    }).catch((error) => {
      console.error('Error checking license number: ', error);
    });
  }
  
  // Función para cargar y mostrar datos
  function loadData() {
    const participantsTable = document.getElementById('participantsTable');
    participantsTable.innerHTML = '';  // Limpiar la tabla
    db.collection('participants').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = `<tr>
          <td>${data.name}</td>
          <td>${data.email}</td>
          <td>${data.carModel}</td>
          <td>${data.dob}</td>
          <td>${data.category}</td>
          <td>${data.gender}</td>
          <td>${data.licenseNumber}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editData('${doc.id}', '${data.name}', '${data.email}', '${data.carModel}', '${data.dob}', '${data.category}', '${data.gender}', '${data.licenseNumber}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteData('${doc.id}')">Eliminar</button>
          </td>
        </tr>`;
        participantsTable.insertAdjacentHTML('beforeend', row);
      });
    });
  }
  
  // Función para eliminar datos
  function deleteData(id) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        db.collection('participants').doc(id).delete().then(() => {
          Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
          loadData();  // Recargar los datos
        }).catch((error) => {
          Swal.fire('Error', 'Hubo un problema al eliminar el registro', 'error');
          console.error('Error removing document: ', error);
        });
      }
    });
  }
  
  // Función para editar datos
  function editData(id, name, email, carModel, dob, category, gender, licenseNumber) {
    // Prefill the form
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('carModel').value = carModel;
    document.getElementById('dob').value = dob;
    document.getElementById('category').value = category;
    document.querySelector(`input[name="gender"][value="${gender}"]`).checked = true;
    document.getElementById('licenseNumber').value = licenseNumber;
  
    // Change save button to update button
    const saveButton = document.querySelector('button[onclick="saveData()"]');
    saveButton.textContent = 'Actualizar';
    saveButton.onclick = function() {
      updateData(id);
    };
  }
  
  // Función para actualizar datos
  function updateData(id) {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const carModel = document.getElementById('carModel').value;
    const dob = document.getElementById('dob').value;
    const category = document.getElementById('category').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const licenseNumber = document.getElementById('licenseNumber').value;
  
    db.collection('participants').doc(id).update({
      name,
      email,
      carModel,
      dob,
      category,
      gender,
      licenseNumber
    }).then(() => {
      Swal.fire('Éxito', 'Datos actualizados exitosamente', 'success');
      loadData();  // Recargar los datos
      document.getElementById('carForm').reset();
  
      // Reset save button
      const saveButton = document.querySelector('button[onclick="updateData()"]');
      saveButton.textContent = 'Guardar';
      saveButton.onclick = function() {
        saveData();
      };
    }).catch((error) => {
      Swal.fire('Error', 'Hubo un problema al actualizar los datos', 'error');
      console.error('Error updating document: ', error);
    });
  }
  
  // Cargar datos al inicio
  loadData();
  
const texto = document.querySelector('input')
const btnInsert = document.querySelector('.divInsert button')
const btnDeleteAll = document.querySelector('.header button')
const ul = document.querySelector('ul')
const progressBar = document.querySelector('.progress-bar')
const nivelElement = document.getElementById('nivel');

let itensDB = [];
let xp = 0;
let level = 1;

const xpPerDifficulty = {
  '1': 10, // Fácil
  '2': 20, // Médio
  '3': 30  // Difícil
};

btnDeleteAll.onclick = () => {
  itensDB = [];
  updateDB();
}

texto.addEventListener('keypress', e => {
  if (e.key == 'Enter' && texto.value != '') {
    setItemDB();
  }
})

btnInsert.onclick = () => {
  if (texto.value != '') {
    setItemDB();
  }
}

function setItemDB() {
  if (itensDB.length >= 20) {
    alert('Limite máximo de 20 itens atingido!');
    return;
  }

  let resultadoDificuldade = prompt('Digite a dificuldade (1 = fácil, 2 = médio, 3 = difícil)');
  
  // Se o usuário não inserir nada ou inserir um valor inválido, consideramos como "fácil"
  if (!resultadoDificuldade || !['1', '2', '3'].includes(resultadoDificuldade)) {
    resultadoDificuldade = '1'; // Considera como fácil (código 1)
  }

  let backgroundColor;

  switch (resultadoDificuldade) {
    case '1':
      backgroundColor = 'lightgreen';
      break;
    case '2':
      backgroundColor = 'lightyellow';
      break;
    case '3':
      backgroundColor = 'lightcoral';
      break;
    default:
      backgroundColor = 'lightgreen'; // Se o valor especificado não for válido, considera como fácil (1)
      break;
  }

  const difficultyXP = xpPerDifficulty[resultadoDificuldade];
  xp += difficultyXP;
  if (xp >= 100) {
    level++;
    xp = 0;
    updateProgressBar();
    alert(`Parabéns! Você subiu para o nível ${level}!`);
  } else {
    updateProgressBar();
  }

  itensDB.push({ 'item': texto.value, 'status': '', 'backgroundColor': backgroundColor });
  updateDB();
}



function updateDB() {
  localStorage.setItem('todolist', JSON.stringify(itensDB));
  loadItens();
}

function loadItens() {
  ul.innerHTML = "";
  itensDB = JSON.parse(localStorage.getItem('todolist')) || [];
  itensDB.forEach((item, i) => {
    insertItemTela(item.item, item.status, i);
  });
}

function insertItemTela(text, status, i) {
  const li = document.createElement('li');
  const backgroundColor = itensDB[i].backgroundColor ? itensDB[i].backgroundColor : '';

  li.innerHTML = `
    <div class="divLi" style="background-color: ${backgroundColor}">
      <input type="checkbox" ${status} data-i=${i} onchange="done(this, ${i});" />
      <span data-si=${i}>${text}</span>
      <button onclick="removeItem(${i})" data-i=${i}><i class='bx bx-trash'></i></button>
    </div>
  `;

  ul.appendChild(li);

  if (status) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through');
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through');
  }

  texto.value = '';
}

function done(chk, i) {
  if (chk.checked) {
    itensDB[i].status = 'checked' 
  } else {
    itensDB[i].status = '' 
  }

  updateDB()
}

function removeItem(i) {
  itensDB.splice(i, 1)
  updateDB()
}

function updateProgressBar() {
  progressBar.style.width = `${xp}%`;
}

loadItens();
updateProgressBar();

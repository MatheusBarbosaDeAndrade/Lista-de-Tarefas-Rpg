const texto = document.querySelector('input');
const btnInsert = document.querySelector('.divInsert button');
const btnDeleteAll = document.querySelector('.header button');
const centralUl = document.getElementById('teste');
const progressBar = document.querySelector('.progress-bar');
const nivelElement = document.getElementById('nivel');

let itensDB = [];
let xp = 0;
let level = parseInt(localStorage.getItem('level')) || 1;

const XP_TO_LEVEL_UP = 100;
const MAX_LEVEL = 10;

const xpPerDifficulty = {
  '1': 10,
  '2': 20,
  '3': 30
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
  
  if (!resultadoDificuldade || !['1', '2', '3'].includes(resultadoDificuldade)) {
    resultadoDificuldade = '1';
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
      backgroundColor = 'lightgreen';
      break;
  }

  itensDB.push({ 'item': texto.value, 'status': '', 'backgroundColor': backgroundColor, 'difficulty': resultadoDificuldade });
  updateDB();
}

function updateDB() {
  localStorage.setItem('todolist', JSON.stringify(itensDB));
  localStorage.setItem('level', level); 
  loadItemsAndLevel();
}


function loadItemsAndLevel() {
  loadItens();
  loadLevel();
}

function loadLevel() {
  
  level = parseInt(localStorage.getItem('level')) || level;
  nivelElement.textContent = level;
}


window.addEventListener('load', loadLevel);

function loadItens() {
  centralUl.innerHTML = "";
  itensDB = JSON.parse(localStorage.getItem('todolist')) || [];
  itensDB.forEach((item, i) => {
    insertItemTela(item, i);
  });
}

function insertItemTela(item, index) {
  const li = document.createElement('li');
  const backgroundColor = item.backgroundColor || '';

  li.innerHTML = `
    <div class="divLi" style="background-color: ${backgroundColor}">
      <input type="checkbox" ${item.status} onchange="done(this, ${index});" />
      <span>${item.item}</span>
      <button style="width: 50px" onclick="missTask(${index})"><i class='bx bx-x-circle'></i></button>
      <button onclick="removeItem(${index})"><i class='bx bx-trash'></i></button>
  `;

  centralUl.appendChild(li);
  texto.value = '';
}

function missTask(index) {
  const item = itensDB[index];
  const difficultyXP = xpPerDifficulty[item.difficulty];
  xp -= difficultyXP;
  if (xp < 0) {
    xp = 0;
    if (level > 1) {
      level--;
    }
    alert(`Você não concluiu a tarefa "${item.item}"! Seu XP foi reduzido e você desceu para o nível ${level}.`);
  }
  nivelElement.textContent = level;
  updateProgressBar();
  itensDB.splice(index, 1); 
  updateDB(); 
}

function done(chk, i) {
  if (chk.checked) {
    const item = itensDB[i];
    itensDB.splice(i, 1); 
    updateDB(); 
    const difficultyXP = xpPerDifficulty[item.difficulty];
    xp += difficultyXP;
    if (xp >= XP_TO_LEVEL_UP) {
      level++;
      xp = 0;
      nivelElement.textContent = level;
      alert(`Parabéns! Você subiu para o nível ${level}!`);
    }
    updateProgressBar();
  } else {
    itensDB[i].status = ''; 
    updateProgressBar();
    updateDB(); 
  }
}

function removeItem(i) {
  itensDB.splice(i, 1);
  updateDB();
}

function updateProgressBar() {
  const percentage = (xp / XP_TO_LEVEL_UP) * 100;
  progressBar.style.width = `${percentage}%`;
}

loadItens();
updateProgressBar();

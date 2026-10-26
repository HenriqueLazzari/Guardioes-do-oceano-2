
'use strict';

const initialState = () => ({
  scene: 'prologue',
  ocean: 64,
  trust: 50,
  data: 0,
  inventory: [],
  rescuedTurtle: false,
  askedForHelp: false,
  foundCore: false,
  stabilizedReactor: false,
  endingReached: false
});

let state = initialState();
let toastTimer;

const el = id => document.getElementById(id);
const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

const scenes = {
  prologue: {
    chapter: 'PRÓLOGO',
    tag: 'REGISTRO 001 · ATLÂNTICO SUL',
    count: '01 / 08',
    art: 'ATLÂNTICO SUL · 2047',
    title: 'O chamado das profundezas',
    text: 'Ano de 2047. Uma luz desconhecida corta o céu e desaparece no oceano Atlântico. Minutos depois, sensores costeiros detectam uma substância azul-esverdeada se espalhando pela água. Você integra a equipe de resposta enviada para investigar o local — e impedir que o desastre se torne irreversível.',
    extra: 'O rádio chia. Uma voz desconhecida pede ajuda de dentro dos destroços.',
    choices: [
      {
        title: 'Investigar os destroços',
        desc: 'Aproxime-se da nave para descobrir o que aconteceu.',
        next: 'meetNeri',
        effects: { data: 1 },
        toast: 'Você registrou os primeiros dados da nave.'
      },
      {
        title: 'Conter a substância primeiro',
        desc: 'Priorize a proteção da vida marinha.',
        next: 'containment',
        effects: { ocean: 8, data: 1 },
        toast: 'A contenção inicial reduziu a contaminação.'
      }
    ]
  },

  meetNeri: {
    chapter: 'CAPÍTULO 01 · PRIMEIRO CONTATO',
    tag: 'REGISTRO 002 · NAVE ALIENÍGENA',
    count: '02 / 08',
    art: 'SINAL DE VIDA DETECTADO',
    title: 'Uma voz entre os destroços',
    text: 'Dentro da nave, você encontra Neri, um ser extraterrestre ferido. Ele explica que a substância foi criada para purificar ambientes contaminados. Um meteorito danificou o reator, que agora libera uma versão instável do composto. Três componentes do sistema foram espalhados pelo fundo do mar.',
    extra: 'Neri oferece ajuda, mas você ainda não sabe se pode confiar nele.',
    choices: [
      {
        title: 'Confiar em Neri',
        desc: 'Ouvir o plano de quem conhece a tecnologia.',
        next: 'plan',
        effects: { trust: 20, data: 1 },
        toast: 'Neri compartilhou informações importantes.'
      },
      {
        title: 'Manter Neri sob supervisão',
        desc: 'Exigir provas antes de confiar na nave.',
        next: 'plan',
        effects: { trust: -8, data: 2 },
        toast: 'Você coletou dados, mas Neri ficou desconfiado.'
      }
    ]
  },

  containment: {
    chapter: 'CAPÍTULO 01 · RESPOSTA EMERGENCIAL',
    tag: 'REGISTRO 002 · ÁREA DE CONTENÇÃO',
    count: '02 / 08',
    art: 'CONTENÇÃO PROVISÓRIA ATIVA',
    title: 'Ganhar tempo',
    text: 'Sua equipe instala barreiras flutuantes e recolhe amostras da substância. A contaminação diminui perto da costa, mas os sensores mostram que a fonte continua ativa. Um sinal de socorro vem da nave caída. Sem entender a tecnologia alienígena, a contenção não vai durar para sempre.',
    extra: 'Você precisa decidir se aceita a ajuda de quem conhece o reator.',
    choices: [
      {
        title: 'Resgatar quem está na nave',
        desc: 'A voz no rádio pode ter as respostas.',
        next: 'meetNeri',
        effects: { trust: 5, data: 1 },
        toast: 'Você abriu um canal de comunicação com a nave.'
      },
      {
        title: 'Enviar os dados às autoridades',
        desc: 'Solicitar apoio científico antes de entrar.',
        next: 'plan',
        effects: { askedForHelp: true, data: 2, ocean: 2 },
        toast: 'Os dados foram enviados às equipes científicas.'
      }
    ]
  },

  plan: {
    chapter: 'CAPÍTULO 02 · MISSÃO SUBMERSA',
    tag: 'REGISTRO 003 · ROTA DE BUSCA',
    count: '03 / 08',
    art: 'TRÊS SINAIS NO SONAR',
    title: 'O preço de cada minuto',
    text: 'O mapa do sonar marca três áreas onde os componentes do reator podem estar. Neri avisa que, sem eles, o sistema continuará instável. No caminho, sua equipe avista uma tartaruga-marinha presa entre resíduos e cabos perto de uma corrente contaminada.',
    extra: 'Salvar a tartaruga leva tempo; ignorá-la permite chegar mais rápido à próxima área.',
    choices: [
      {
        title: 'Salvar a tartaruga-marinha',
        desc: 'Libertar o animal antes de continuar a busca.',
        next: 'turtleSaved',
        effects: { ocean: 7, rescuedTurtle: true, data: 1 },
        toast: 'A tartaruga está livre!'
      },
      {
        title: 'Seguir direto para os componentes',
        desc: 'Cada minuto conta para conter o vazamento.',
        next: 'turtleIgnored',
        effects: { ocean: -5 },
        toast: 'Você avançou, mas a vida marinha continua em risco.'
      }
    ]
  },

  turtleSaved: {
    chapter: 'CAPÍTULO 02 · VIDA MARINHA',
    tag: 'REGISTRO 004 · RESGATE',
    count: '04 / 08',
    art: 'RESGATE REGISTRADO',
    title: 'Uma vida importa',
    text: 'A equipe corta os cabos e guia a tartaruga para uma área segura. O resgate consome tempo, mas revela algo útil: a correnteza carrega a substância para uma estrutura antiga no fundo do mar. O sonar mostra uma entrada entre ruínas submersas, próxima ao primeiro sinal do reator.',
    extra: 'Neri reconhece os símbolos nas ruínas: eles indicam uma câmara de energia.',
    choices: [
      {
        title: 'Explorar as ruínas com Neri',
        desc: 'Investigar a estrutura e procurar informações.',
        next: 'city',
        effects: { trust: 5, data: 2 },
        toast: 'Você descobriu registros antigos.'
      },
      {
        title: 'Recolher o componente rapidamente',
        desc: 'Localizar a peça sem explorar toda a estrutura.',
        next: 'core',
        effects: { data: 1, ocean: -2 },
        toast: 'O componente foi localizado.'
      }
    ]
  },

  turtleIgnored: {
    chapter: 'CAPÍTULO 02 · VIDA MARINHA',
    tag: 'REGISTRO 004 · CORRENTE CONTAMINADA',
    count: '04 / 08',
    art: 'SINAL BIOLÓGICO DETECTADO',
    title: 'O que fica para trás',
    text: 'Você segue para o próximo sinal. A equipe chega antes à área indicada, mas os sensores registram mais organismos expostos à substância. A crise não é apenas uma máquina quebrada: ela também afeta seres vivos que não podem pedir ajuda.',
    extra: 'O sonar detecta uma estrutura antiga ao lado do componente do reator.',
    choices: [
      {
        title: 'Investigar a estrutura submersa',
        desc: 'Os registros podem ajudar a impedir outro acidente.',
        next: 'city',
        effects: { data: 2 },
        toast: 'Os registros podem explicar como estabilizar o reator.'
      },
      {
        title: 'Recolher o componente imediatamente',
        desc: 'Priorizar a peça e deixar a exploração para depois.',
        next: 'core',
        effects: { ocean: -2, data: 1 },
        toast: 'Você encontrou a peça, mas faltam informações.'
      }
    ]
  },

  city: {
    chapter: 'CAPÍTULO 03 · A CIDADE SUBMERSA',
    tag: 'REGISTRO 005 · RUÍNAS DESCONHECIDAS',
    count: '05 / 08',
    art: 'ARQUIVO ANTIGO DESBLOQUEADO',
    title: 'A memória do oceano',
    text: 'As ruínas são um antigo posto de pesquisa construído por visitantes que estudaram os oceanos séculos atrás. Um arquivo holográfico revela que o composto só é seguro quando o reator opera em equilíbrio. Forçar a máquina pode limpar a água rapidamente, mas também destruir ecossistemas inteiros.',
    extra: 'O arquivo aponta duas opções: reparar o sistema com cuidado ou tentar uma ativação de emergência.',
    choices: [
      {
        title: 'Estudar o arquivo antes de agir',
        desc: 'Cruzar os dados antigos com as amostras coletadas.',
        next: 'core',
        effects: { data: 3, trust: 4 },
        toast: 'Os dados científicos estão mais completos.'
      },
      {
        title: 'Usar a ativação de emergência',
        desc: 'Acelerar o processo, aceitando um risco maior.',
        next: 'core',
        effects: { ocean: -7, data: 1 },
        toast: 'A ativação apressada tornou o sistema instável.'
      }
    ]
  },

  core: {
    chapter: 'CAPÍTULO 04 · O REATOR',
    tag: 'REGISTRO 006 · CÂMARA CENTRAL',
    count: '06 / 08',
    art: 'COMPONENTE CENTRAL LOCALIZADO',
    title: 'O coração da nave',
    text: 'Você encontra o componente central protegido por um campo de energia. Neri explica que o sistema pode ser estabilizado se os dados forem suficientes e os componentes forem instalados na ordem correta. Há também um cristal de energia que permitiria controlar a máquina sem repará-la por completo — uma solução rápida, mas perigosa.',
    extra: 'A equipe se prepara para a decisão final. O oceano não pode esperar muito mais.',
    choices: [
      {
        title: 'Reparar o reator com cuidado',
        desc: 'Usar os dados e estabilizar a reação.',
        next: 'finalChoice',
        effects: { foundCore: true, stabilizedReactor: true, ocean: 8, data: 1 },
        toast: 'O reator começou a estabilizar.'
      },
      {
        title: 'Tomar o cristal e forçar o controle',
        desc: 'Uma solução rápida, mas com maior risco.',
        next: 'finalChoice',
        effects: { foundCore: true, ocean: -10, trust: -5 },
        toast: 'A energia ficou instável.'
      }
    ]
  },

  finalChoice: {
    chapter: 'CAPÍTULO 05 · DECISÃO FINAL',
    tag: 'REGISTRO 007 · ÚLTIMA TRANSMISSÃO',
    count: '07 / 08',
    art: 'PROTOCOLO FINAL DISPONÍVEL',
    title: 'O futuro está em suas mãos',
    text: 'O reator responde às suas ações, e as equipes na superfície aguardam sua decisão. Você pode compartilhar a tecnologia e permitir que cientistas de vários países acompanhem o processo, manter o controle para agir mais rápido ou destruir o núcleo para impedir que alguém use aquela energia de forma irresponsável.',
    extra: 'Não existe uma escolha sem consequências. Pense no oceano, nas pessoas e no que acontecerá depois que a missão terminar.',
    choices: [
      {
        title: 'Compartilhar a tecnologia e cooperar',
        desc: 'Permitir que uma equipe internacional acompanhe a recuperação.',
        next: 'endingCooperation',
        effects: { askedForHelp: true, trust: 8, ocean: 8 },
        toast: 'Uma aliança científica começa a se formar.'
      },
      {
        title: 'Manter o controle do reator',
        desc: 'Assumir a responsabilidade direta pelo sistema.',
        next: 'endingControl',
        effects: { trust: -8, ocean: -2 },
        toast: 'Você manteve o controle, mas a confiança diminuiu.'
      },
      {
        title: 'Destruir o núcleo de energia',
        desc: 'Eliminar o risco tecnológico, mesmo que a recuperação fique mais difícil.',
        next: 'endingDestroy',
        effects: { ocean: -5 },
        toast: 'O núcleo foi desativado.'
      }
    ]
  },

  endingCooperation: {
    chapter: 'EPÍLOGO · NOVA ALIANÇA',
    tag: 'REGISTRO FINAL · COOPERAÇÃO',
    count: '08 / 08',
    art: 'NOVA ALIANÇA',
    ending: true,
    title: 'Uma nova aliança',
    text: 'A tecnologia é colocada sob supervisão científica internacional. Com Neri como colaborador, equipes de diferentes países conseguem reparar o sistema e monitorar a água. A recuperação exige tempo, mas o conhecimento deixa de pertencer a uma única pessoa ou governo.',
    extra: 'Final de cooperação: o futuro do oceano passa a ser uma responsabilidade compartilhada.',
    choices: [
      {
        title: 'Ver o resultado da missão',
        desc: 'Consultar o relatório final de suas escolhas.',
        next: 'report',
        effects: {}
      }
    ]
  },

  endingControl: {
    chapter: 'EPÍLOGO · CONTROLE CENTRALIZADO',
    tag: 'REGISTRO FINAL · RESPONSABILIDADE',
    count: '08 / 08',
    art: 'VITÓRIA COM RESSALVAS',
    ending: true,
    title: 'Vitória com ressalvas',
    text: 'Você consegue impedir que o reator caia nas mãos erradas, mas manter a tecnologia sob controle restrito provoca desconfiança. A equipe contém a crise, embora a recuperação seja mais lenta e dependa das informações compartilhadas.',
    extra: 'Final de controle: o desastre foi contido, mas a cooperação precisa ser reconstruída.',
    choices: [
      {
        title: 'Ver o resultado da missão',
        desc: 'Consultar o relatório final de suas escolhas.',
        next: 'report',
        effects: {}
      }
    ]
  },

  endingDestroy: {
    chapter: 'EPÍLOGO · NÚCLEO DESATIVADO',
    tag: 'REGISTRO FINAL · SACRIFÍCIO',
    count: '08 / 08',
    art: 'TECNOLOGIA DESATIVADA',
    ending: true,
    title: 'O risco foi encerrado',
    text: 'O núcleo é destruído e a tecnologia deixa de representar uma ameaça imediata. Sem o sistema de purificação, porém, a recuperação do oceano será mais lenta. A equipe inicia um esforço ambiental de longo prazo para restaurar os habitats afetados.',
    extra: 'Final de sacrifício: a ameaça tecnológica terminou, mas o trabalho de recuperação está apenas começando.',
    choices: [
      {
        title: 'Ver o resultado da missão',
        desc: 'Consultar o relatório final de suas escolhas.',
        next: 'report',
        effects: {}
      }
    ]
  },

  report: {
    chapter: 'RELATÓRIO · MISSÃO CONCLUÍDA',
    tag: 'RELATÓRIO DE IMPACTO',
    count: 'FINAL',
    art: 'MISSÃO CONCLUÍDA',
    ending: true,
    title: 'O oceano guarda suas escolhas',
    text: '',
    extra: '',
    choices: []
  }
};

function applyEffects(effects = {}) {
  for (const [key, value] of Object.entries(effects)) {
    if (key === 'ocean' || key === 'trust' || key === 'data') {
      state[key] = clamp(
        state[key] + value,
        0,
        key === 'data' ? 10 : 100
      );
    } else if (typeof value === 'boolean') {
      state[key] = value;
    }
  }
}

function addInventory(item) {
  if (!state.inventory.includes(item)) {
    state.inventory.push(item);
  }
}

function showToast(message) {
  const toast = el('toast');
  toast.textContent = message;
  toast.classList.add('show');

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function updateStatus() {
  el('oceanValue').textContent = `${state.ocean}%`;
  el('trustValue').textContent = `${state.trust}%`;
  el('dataValue').textContent = String(state.data);

  el('oceanMeter').style.width = `${state.ocean}%`;
  el('trustMeter').style.width = `${state.trust}%`;
  el('dataMeter').style.width = `${Math.min(100, state.data * 10)}%`;

  if (state.endingReached) {
    el('statusText').textContent = 'Missão concluída';
  } else if (state.ocean < 30) {
    el('statusText').textContent = 'Risco ambiental alto';
  } else {
    el('statusText').textContent = 'Missão em andamento';
  }

  const list = el('inventoryList');
  list.replaceChildren();

  if (state.inventory.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-inventory';
    li.textContent = 'Nenhum item encontrado.';
    list.appendChild(li);
  } else {
    state.inventory.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  }
}

function makeReport() {
  const oceanText = state.ocean >= 75
    ? 'A saúde do oceano está em recuperação promissora.'
    : state.ocean >= 45
      ? 'O oceano foi parcialmente protegido, mas a recuperação precisa continuar.'
      : 'O oceano permanece em situação crítica e precisará de um plano de recuperação prolongado.';

  const trustText = state.trust >= 65
    ? 'A confiança entre você e Neri permitiu uma cooperação sólida.'
    : state.trust >= 40
      ? 'A relação com Neri foi cautelosa, mas ainda houve espaço para colaboração.'
      : 'A falta de confiança dificultou a cooperação durante a missão.';

  const dataText = state.data >= 6
    ? 'Os dados coletados oferecem uma base científica consistente para ações futuras.'
    : 'A equipe terminou com informações limitadas; novas pesquisas serão necessárias.';

  const turtleText = state.rescuedTurtle
    ? 'A tartaruga-marinha foi resgatada e encaminhada para cuidados.'
    : 'O resgate da tartaruga não foi realizado durante a missão.';

  const helpText = state.askedForHelp
    ? 'O apoio externo foi acionado para acompanhar a resposta ambiental.'
    : 'A cooperação internacional ainda poderá ser ampliada na recuperação.';

  return `${oceanText} ${trustText} ${dataText} ${turtleText} ${helpText}`;
}

function renderScene(sceneId) {
  const scene = scenes[sceneId];

  if (!scene) {
    console.error(`Cena inexistente: ${sceneId}`);
    return;
  }

  state.scene = sceneId;

  if (sceneId.startsWith('ending')) {
    state.endingReached = true;
  }

  if (sceneId === 'meetNeri') {
    addInventory('Comunicador de Neri');
  }

  if (sceneId === 'city') {
    addInventory('Arquivo das ruínas');
  }

  if (sceneId === 'core') {
    addInventory('Componente do reator');
  }

  if (sceneId === 'finalChoice') {
    addInventory('Mapa do núcleo');
  }

  if (sceneId === 'report') {
    el('storyText').textContent = makeReport();
    el('storyExtra').textContent =
      `Saúde do oceano: ${state.ocean}% · ` +
      `Confiança em Neri: ${state.trust}% · ` +
      `Dados científicos: ${state.data}`;
  } else {
    el('storyText').textContent = scene.text;
    el('storyExtra').textContent = scene.extra;
  }

  el('chapterLabel').textContent = scene.chapter;
  el('sceneTag').textContent = scene.tag;
  el('sceneCount').textContent = scene.count;
  el('storyTitle').textContent = scene.title;
  el('artCaption').textContent = scene.art;

  const art = el('heroArt');

  if (sceneId.startsWith('ending') || sceneId === 'report') {
    art.dataset.scene = 'ending';
  } else if (sceneId === 'city') {
    art.dataset.scene = 'city';
  } else {
    art.dataset.scene = 'ocean';
  }

  el('footerHint').textContent =
    scene.ending ? 'Missão registrada' : 'Escolha com atenção';

  const choices = el('choices');
  choices.replaceChildren();

  if (sceneId === 'report') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice-button';

    button.innerHTML = `
      <span class="choice-number">↻</span>
      <span class="choice-content">
        <strong>Jogar novamente</strong>
        <small>Tente outro caminho e descubra como suas decisões mudam o resultado.</small>
      </span>
      <span class="choice-arrow">↗</span>
    `;

    button.addEventListener('click', restartGame);
    choices.appendChild(button);
  } else {
    scene.choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className =
        `choice-button${index > 0 ? ' secondary-choice' : ''}`;

      const number = String(index + 1).padStart(2, '0');

      button.innerHTML = `
        <span class="choice-number">${number}</span>
        <span class="choice-content">
          <strong></strong>
          <small></small>
        </span>
        <span class="choice-arrow">↗</span>
      `;

      button.querySelector('strong').textContent = choice.title;
      button.querySelector('small').textContent = choice.desc;

      button.addEventListener('click', () => choose(choice));
      choices.appendChild(button);
    });
  }

  updateStatus();
}

function choose(choice) {
  applyEffects(choice.effects);

  if (choice.toast) {
    showToast(choice.toast);
  }

  renderScene(choice.next);
}

function restartGame() {
  state = initialState();
  renderScene('prologue');
  showToast('Nova missão iniciada. Boa sorte, Guardião!');
}

el('restartTop').addEventListener('click', restartGame);

el('brandHome').addEventListener('click', event => {
  event.preventDefault();
  restartGame();
});

renderScene('prologue');

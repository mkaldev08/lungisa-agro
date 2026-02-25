export const soilQuestions = [
  {
    id: 'soil-color',
    text: 'Cor do solo na sua area',
    options: [
      {
        id: 'red',
        label: 'Vermelho',
        score: { acidic: 2, sandy: 0, medium: 0 },
      },
      {
        id: 'light',
        label: 'Claro/areia',
        score: { acidic: 0, sandy: 2, medium: 0 },
      },
      {
        id: 'dark',
        label: 'Escuro',
        score: { acidic: 0, sandy: 0, medium: 2 },
      },
    ],
  },
  {
    id: 'soil-texture',
    text: 'Textura ao toque',
    options: [
      {
        id: 'gritty',
        label: 'Gritosa (areia)',
        score: { acidic: 0, sandy: 2, medium: 0 },
      },
      {
        id: 'sticky',
        label: 'Pegajosa (barro)',
        score: { acidic: 1, sandy: 0, medium: 1 },
      },
      {
        id: 'balanced',
        label: 'Equilibrada',
        score: { acidic: 0, sandy: 0, medium: 2 },
      },
    ],
  },
  {
    id: 'drainage',
    text: 'Depois da chuva, a agua',
    options: [
      {
        id: 'fast',
        label: 'Some rapido',
        score: { acidic: 0, sandy: 2, medium: 0 },
      },
      {
        id: 'ponds',
        label: 'Fica empossada',
        score: { acidic: 1, sandy: 0, medium: 1 },
      },
      {
        id: 'normal',
        label: 'Equilibrada',
        score: { acidic: 0, sandy: 0, medium: 2 },
      },
    ],
  },
  {
    id: 'last-harvest',
    text: 'A ultima colheita na area foi',
    options: [
      {
        id: 'poor',
        label: 'Fraca',
        score: { acidic: 1, sandy: 1, medium: 0 },
      },
      {
        id: 'average',
        label: 'Media',
        score: { acidic: 0, sandy: 0, medium: 1 },
      },
      {
        id: 'good',
        label: 'Boa',
        score: { acidic: 0, sandy: 0, medium: 2 },
      },
    ],
  },
];

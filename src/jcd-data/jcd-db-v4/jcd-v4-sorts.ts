
import { JcdV4ProjectKey } from './jcd-v4-projects';

export type JcdProjectSortDef = [ JcdV4ProjectKey, number ];

let jcdProjectSortBase: JcdV4ProjectKey[] = [
  'THE_TALES_OF_HOFFMANN',
  'LARAMIE_PROJECT',
  'MY_BROTHER_WAS_A_VAMPIRE',
  'BALTHAZAR',
  'URINETOWN',
  'LA_BOHEME',
  'SWEENEY_TODD',
  'AFTERSHOCK',
  'THE_TEMPEST',
  'JAMES_AND_THE_GIANT_PEACH',
  // 'O_DEAR_BLOSSOM',
  'THE_DIARY_OF_ANNE_FRANK',
  'THE_CLEAN_UP_PROJECT',
  'THE_DRAG',
  'AGAMEMNON',
  'GO_HOME_COME_BACK',
  'TRIBES',
  'NEXT_FALL',
  'CINDERELLA_EATS_RICE_AND_BEANS',
];

const jcdProjectSortDefs: JcdProjectSortDef[] = jcdProjectSortBase
  .map((baseVal, idx) => {
    return [ baseVal, idx ];
  });

export {
  jcdProjectSortDefs,
};

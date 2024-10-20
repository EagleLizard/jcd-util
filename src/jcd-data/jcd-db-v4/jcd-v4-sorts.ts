
import { JcdV4ProjectKey } from './jcd-v4-projects';

export type JcdProjectSortDef = [ JcdV4ProjectKey, number ];

const jcdProjectSortDefs: JcdProjectSortDef[] = [
  [ 'THE_TALES_OF_HOFFMANN', 0 ],
  [ 'LARAMIE_PROJECT', 1 ],
  [ 'MY_BROTHER_WAS_A_VAMPIRE', 2 ],
  [ 'BALTHAZAR', 3 ],
  [ 'URINETOWN', 4 ],
  [ 'LA_BOHEME', 5 ],
  [ 'AFTERSHOCK', 6 ],
  [ 'SWEENEY_TODD', 7 ],
  [ 'THE_TEMPEST', 8 ],
  [ 'JAMES_AND_THE_GIANT_PEACH', 9 ],
  [ 'O_DEAR_BLOSSOM', 10 ],
  [ 'THE_DIARY_OF_ANNE_FRANK', 11 ],
  [ 'THE_CLEAN_UP_PROJECT', 12 ],
  [ 'THE_DRAG', 13 ],
  [ 'AGAMEMNON', 14 ],
  [ 'GO_HOME_COME_BACK', 15 ],
  [ 'TRIBES', 16 ],
  [ 'NEXT_FALL', 17 ],
  [ 'CINDERELLA_EATS_RICE_AND_BEANS', 18 ],
];

export {
  jcdProjectSortDefs,
};

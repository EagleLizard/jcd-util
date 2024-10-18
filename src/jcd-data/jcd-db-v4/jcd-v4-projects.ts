
// export const JCD_V4_ART_PROJECT_KEY = 'ART';

export enum JCD_V4_PROJECT_ENUM {
  /*
    Mar 2024
  */
  BALTHAZAR = 'BALTHAZAR',
  THE_DIARY_OF_ANNE_FRANK = 'THE_DIARY_OF_ANNE_FRANK',
  GO_HOME_COME_BACK = 'GO_HOME_COME_BACK',

  /*
    Dec 2022
  */
  THE_TALES_OF_HOFFMANN = 'THE_TALES_OF_HOFFMANN',
  LARAMIE_PROJECT = 'LARAMIE_PROJECT',
  MY_BROTHER_WAS_A_VAMPIRE = 'MY_BROTHER_WAS_A_VAMPIRE',
  LA_BOHEME = 'LA_BOHEME',
  URINETOWN = 'URINETOWN',
  THE_TEMPEST = 'THE_TEMPEST',
  AFTERSHOCK = 'AFTERSHOCK',
  SWEENEY_TODD = 'SWEENEY_TODD',
  O_DEAR_BLOSSOM = 'O_DEAR_BLOSSOM',
  JAMES_AND_THE_GIANT_PEACH = 'JAMES_AND_THE_GIANT_PEACH',
  THE_DRAG = 'THE_DRAG',
  AGAMEMNON = 'AGAMEMNON',
  CINDERELLA_EATS_RICE_AND_BEANS = 'CINDERELLA_EATS_RICE_AND_BEANS',
  THE_CLEAN_UP_PROJECT = 'THE_CLEAN_UP_PROJECT',
  NEXT_FALL = 'NEXT_FALL',
  TRIBES = 'TRIBES',

  // TAMINGOFTHESHREW = 'TAMINGOFTHESHREW',
  // MRBURNS = 'MRBURNS',
  // FAT_PIG = 'FAT_PIG',
  // A_YEAR_WITH_FROG_AND_TOAD = 'A_YEAR_WITH_FROG_AND_TOAD', // Formerly UVU
  // SUNDANCE_TECHNICOLOR_DREAMCOAT = 'SUNDANCE_TECHNICOLOR_DREAMCOAT',
  // CABARET = 'CABARET',

  // RENAISSANCE_NOW = 'RENAISSANCE_NOW',
  // BYU = 'BYU',
  // RENAISSANCE_FAIRE = 'RENAISSANCE_FAIRE',
}

export type JcdV4ProjectKey = keyof typeof JCD_V4_PROJECT_ENUM;

export type JcdProjectDef = {
  project_key: JcdV4ProjectKey;
  active: boolean;
  route: string;
  title: string;
  venue: VenueDef,
  project_date: Date; // yyyy-mm-dd
  producer: JcdContribDef[];
  description: string[];
  credits: JcdCreditDef[];
  prod_credits: JcdCreditDef[];
  press: PressDef[];
  images: JcdImageDef[];
};
type VenueDef = string;
export type JcdContribDefKind = 'p' | 'o';
export type JcdContribDef = [ JcdContribDefKind, string ];
export type JcdCreditDef = {
  label: string;
  contribs: JcdContribDef[];
};
// type CreditDef = [ label: string, contribs: ContribDef[] ];
type PressDef = {
  publication: string;
  description?: string;
  link: LinkDef;
};
type LinkDef = {
  label: string;
  url: string;
};

export type JcdImageDefKind = 't' | 'g';
export type JcdImageDef = [ JcdImageDefKind, string ];

const GO_HOME_COME_BACK: JcdProjectDef = {
  project_key: 'GO_HOME_COME_BACK',
  active: true,
  route: 'go-home-come-back',
  title: 'Go Home Come Back',
  venue: 'Rose Wagner Performing Arts Center',
  project_date: new Date('2023-02-15'),
  producer: [
    [ 'o', 'Plan-B Theatre Company' ]
  ],
  description: [
    'Creating the world of a playful, contemporary, and non-traditional limbo called for a set that enhanced the dreamlike, distorted, and bizarre adventure that is the moment caught between death and the afterlife. The design was inspired by the Surrealist movement to produce an eye-catching, vibrant, and trippy experience.',
  ],
  credits: [
    {
      label: 'World Premiere by',
      contribs: [
        [ 'p', 'Darryl Stamp' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Cheryl Ann Cluff' ],
      ],
    },
    {
      label: 'Scenic Design by',
      contribs: [
        [ 'p', 'Janice Chan' ]
      ],
    },
    {
      label: 'Props Design by',
      contribs: [
        [ 'p', 'Arika Schockmel' ]
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Pilar I. Davis', ]
      ],
    },
    {
      label: 'Sound Design by',
      contribs: [
        [ 'p', 'Cheryl Ann Cluff', ]
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Derek Williamson', ]
      ],
    },
    {
      label: 'Scenic Construction by',
      contribs: [
        [ 'p', 'Grey Rung', ]
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Sharah Meservy', ]
      ],
    },
  ],
  press: [
    {
      publication: 'QSaltlake Magazine',
      link: {
        label: '‘Go Home Come Back’ is Heartfelt, Thought-Provoking, and Personal',
        url: 'https://www.qsaltlake.com/news/2023/01/18/go-home-come-back-is-heartfelt-thought-provoking-and-personal/',
      }
    },
    {
      publication: 'Gephardt Daily',
      link: {
        label: 'Plan-B Theatre Continues its Season with a World Premiere about First Impressions, Second Chances',
        url: 'https://gephardtdaily.com/local/plan-b-theatre-continues-its-season-with-a-world-premiere-about-first-impressions-second-chances/',
      }
    },
    {
      publication: 'The Utah Review',
      link: {
        label: 'Nourishing the Soul: Matchstick Girl by Jennifer Kokai and Kenneth Plain at Weber State Theatre, Go Home Come Back by Darryl Stamp at Plan-B Theatre',
        url: 'https://www.theutahreview.com/nourishing-the-soul-matchstick-girl-by-jennifer-kokai-and-kenneth-plain-at-weber-state-theatre-go-home-come-back-by-darryl-stamp-at-plan-b-theatre/',
      }
    },
  ],
  images: [
    [ 't', 'go-home/00-Go-Home.jpg' ],
    [ 'g', 'go-home/01-Go-Home.jpg' ],
    [ 'g', 'go-home/02-Go-Home.jpg' ],
    [ 'g', 'go-home/03-Go-Home.jpg' ],
    [ 'g', 'go-home/04-Go-Home.jpg' ],
    [ 'g', 'go-home/05-Go-Home.jpg' ],
    [ 'g', 'go-home/06-Go-Home.jpg' ],
    [ 'g', 'go-home/07-Go-Home.jpg' ],
  ]
};

const THE_DIARY_OF_ANNE_FRANK: JcdProjectDef = {
  project_key: 'THE_DIARY_OF_ANNE_FRANK',
  active: true,
  route: 'the-diary-of-anne-frank',
  title: 'The Diary of Anne Frank',
  venue: 'Bastian Theatre',
  project_date: new Date('2023-10-15'),
  producer: [
    [ 'o', 'The Noorda Center for the Performing Arts' ],
  ],
  description: [
    'Grounded in historical authenticity, the design approach considered Anne Frank’s worldview, which was one of colour, and vibrancy, yet steeped in fear at this moment in her life. The scenic design was a visual representation of her diary entries, highlighting every conflict, hope, fear, and dream. Every design detail was inspired by the Secret Annex.',
  ],
  credits: [
    {
      label: 'Written by',
      contribs: [
        [ 'p', 'Albert Hackett' ],
        [ 'p', 'Frances Goodrich' ],
      ],
    }
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'John Newman' ],
      ],
    },
    {
      label: 'Technical Direction by',
      contribs: [
        [ 'p', 'Eric Kiekhaefer' ],
      ],
    },
    {
      label: 'Scenic Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Props Design by',
      contribs: [
        [ 'p', 'Maisie Bunker Nelson' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'David McKain' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Kaely Hope' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Beau Pearson' ],
      ],
    },
  ],
  press: [
    {
      publication: 'UVU Review',
      description: 'This play amazingly did what every artist strives to do: it left a lasting impact.',
      link: {
        label: '“The Diary of Anne Frank:” A Story of Joy and Pain',
        url: 'https://www.uvureview.com/valley-life/the-diary-of-anne-frank-a-story-of-joy-and-pain/',
      }
    }
  ],
  images: [
    [ 't', 'anne-frank/00-Anne-Frank.jpg' ],
    [ 'g', 'anne-frank/01-Anne-Frank.jpg' ],
    [ 'g', 'anne-frank/02-Anne-Frank.jpg' ],
    [ 'g', 'anne-frank/03-Anne-Frank.jpg' ],
    [ 'g', 'anne-frank/04-Anne-Frank.jpg' ],
    [ 'g', 'anne-frank/05-Anne-Frank.jpg' ],
    [ 'g', 'anne-frank/06-Anne-Frank.jpg' ],
    [ 'g', 'anne-frank/07-Anne-Frank.jpg' ],
    [ 'g', 'anne-frank/08-Anne-Frank.jpg' ],
    [ 'g', 'anne-frank/09-Anne-Frank.jpg' ],
    [ 'g', 'anne-frank/10-Anne-Frank.jpg' ],
    [ 'g', 'anne-frank/11-Anne-Frank.jpg' ],
  ],
};

const BALTHAZAR: JcdProjectDef = {
  project_key: 'BALTHAZAR',
  active: true,
  route: 'balthazar',
  title: 'Balthazar',
  venue: 'Rose Wagner Performing Arts Center',
  project_date: new Date('2024-02-15'),
  producer: [
    [ 'o', 'Plan-B Theatre Company' ],
  ],
  description: [
    'Set in the Late Renaissance Venetian study of a respected lawyer, the compact black box stage design aimed to provide a backdrop that mirrored the themes of the piece: social values and expectations, gender roles, and the desire to change the rules of the game.',
  ],
  credits: [
    {
      label: 'World Premiere by',
      contribs: [
        [ 'p', 'Debora Threedy' ],
      ]
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Cheryl Ann Cluff' ],
      ],
    },
    {
      label: 'Scenic Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Props Design by',
      contribs: [
        [ 'p', 'Arika Schockmel' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Marley Keith' ],
      ],
    },
    {
      label: 'Sound Design by',
      contribs: [
        [ 'p', 'Cheryl Ann Cluff' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Aaron Asano Swenson' ],
      ],
    },
    {
      label: 'Scenic Construction by',
      contribs: [
        [ 'p', 'David Knoell' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Sharah Meservy' ],
      ],
    },
  ],
  press: [
    {
      publication: 'Front Row Reviewers',
      description: 'The scenic design by Janice Chan is a showstopper, evoking the artistic opulence of Venetian style with floating works of art and red drapes creating a backdrop for the scene.',
      link: {
        label: 'Plan-B Theatre’s Balthazar in Salt Lake City, Utah: A Heartwarming Study of Love and Drag',
        url: 'https://frontrowreviewers.com/?p=22422',
      },
    },
    {
      publication: 'The Utah Review',
      description: 'The outstanding sensory effects of Janice Chan’s Venetian set design and Cluff’s selection of music to convey the Elizabethan Age in its finest humanistic splendor.',
      link: {
        label: ' Plan-B Theatre’s World Premiere of Debora Threedy’s Balthazar is a Crown Jewel of Intimate Chamber Theater',
        url: 'https://www.theutahreview.com/plan-b-theatres-world-premiere-of-debora-threedys-balthazar-is-a-crown-jewel-of-intimate-chamber-theater/',
      },
    },
    {
      publication: 'Gephardt Daily',
      description: 'The production values too are exciting and innovative.',
      link: {
        label: ' Review: Plan-B’s world premiere ‘Balthazar’ presents a timely riff on Shakespeare’s ‘Merchant of Venice’',
        url: 'https://gephardtdaily.com/local/review-plan-bs-world-premiere-balthazar-presents-a-timely-riff-on-shakespeares-merchant-of-venice/',
      },
    },
    {
      publication: 'Independent Review Crew',
      link: {
        label: 'Plan‑B Brings Shakespearean Gender Fluidity To The Stage',
        url: 'https://reviews.newhavenindependent.org/reviews/plan_b_brings_shakespearean_gender_fluidity_to_the_stage',
      },
    },
    {
      publication: 'Rhetorical Review',
      link: {
        label: 'Reshaping Shakespeare for the Better: The World Premiere of Balthazar by Debora Threedy',
        url: 'https://rhetoricalreview.com/2024/02/15/reshaping-shakespeare-for-the-better-the-world-premiere-of-balthazar-by-debora-threedy/',
      },
    },
    {
      publication: '15 Bytes',
      link: {
        label: 'Debora Threedy’s “Balthazar” is a Lively and Fun Piece of Shakespearean Fan Fiction',
        url: 'https://artistsofutah.org/15Bytes/index.php/debora-threedys-balthazar-is-a-lively-and-fun-piece-of-shakespearean-fan-fiction/',
      },
    },
    {
      publication: 'Salt Lake Magazine',
      link: {
        label: 'Review: Balthazar at Plan-B Theatre',
        url: 'https://www.saltlakemagazine.com/balthazar-plan-b-theatre/',
      },
    },
    {
      publication: 'SLUG Mag',
      link: {
        label: 'Queer Shakespeare: Plan-B Theatre’s Balthazar Reads Between the Scenes',
        url: 'https://www.slugmag.com/arts/art/interviews-features/queer-shakespeare-plan-b-theatres-balthazar-reads-between-the-scenes/',
      },
    },
  ],
  images: [
    [ 't', 'balthazar/00-Balthazar.jpg' ],
    [ 'g', 'balthazar/01-Balthazar.jpg' ],
    [ 'g', 'balthazar/02-Balthazar.jpg' ],
    [ 'g', 'balthazar/03-Balthazar.jpg' ],
    [ 'g', 'balthazar/04-Balthazar.jpg' ],
    [ 'g', 'balthazar/05-Balthazar.jpg' ],
    [ 'g', 'balthazar/06-Balthazar.jpg' ],
    [ 'g', 'balthazar/07-Balthazar.jpg' ],
    [ 'g', 'balthazar/08-Balthazar.jpg' ],
  ],
};

const THE_TALES_OF_HOFFMANN: JcdProjectDef = {
  project_key: 'THE_TALES_OF_HOFFMANN',
  active: true,
  route: 'the-tales-of-hoffmann',
  title: 'Les contes d’Hoffmann',
  venue: 'Smith Theatre',
  project_date: new Date('2022-11-15'),
  producer: [
    [ 'o', 'The Noorda Center for the Performing Arts' ],
  ],
  description: [
    'The scenic design for The Tales of Hoffmann showcased the themes of perception and distortion, with recurring circular motifs. Rooted in fantasy, each story presented in the opera was stylistically heightened through the strong use of colour. Fragments of realism and time periods were shown through the presentation of props and set dressing. Several weeks prior to load-in, the design budget was reduced by 75%, resulting in the loss of significant set pieces.',
  ],
  credits: [
    {
      label: 'Opéra Fantastique by',
      contribs: [
        [ 'p', 'Jacques Offenbach' ],
      ]
    }
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Isaac Hurtado' ],
      ],
    },
    {
      label: 'Conducted by',
      contribs: [
        [ 'p', 'Nicolas Giusti' ],
      ],
    },
    {
      label: 'Technical Direction by',
      contribs: [
        [ 'p', 'Eric Kiekhaefer' ],
      ],
    },
    {
      label: 'Scenic & Props Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Peter D. Leonard' ],
      ],
    },
    {
      label: 'Costume, Hair, & Makeup Design by',
      contribs: [
        [ 'p', 'Jennessa Law' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Michelle Fitzwater' ],
      ],
    },
  ],
  press: [],
  images: [
    [ 't', '1-hoffman/00-hoffmann-title.jpg' ],
    [ 'g', '1-hoffman/01-hoffmann.jpg' ],
    [ 'g', '1-hoffman/02-hoffmann.jpg' ],
    [ 'g', '1-hoffman/03-hoffmann.jpg' ],
    [ 'g', '1-hoffman/04-hoffmann.jpg' ],
    [ 'g', '1-hoffman/05-hoffmann.jpg' ],
    [ 'g', '1-hoffman/06-hoffmann.jpg' ],
    [ 'g', '1-hoffman/07-hoffmann.jpg' ],
    [ 'g', '1-hoffman/08-hoffmann.jpg' ],
    [ 'g', '1-hoffman/09-hoffmann.jpg' ],
    [ 'g', '1-hoffman/10-hoffmann.jpg' ],
    [ 'g', '1-hoffman/11-hoffmann.jpg' ],
    [ 'g', '1-hoffman/12-hoffmann.jpg' ],
  ],
};

const LARAMIE_PROJECT: JcdProjectDef = {
  project_key: 'LARAMIE_PROJECT',
  active: true,
  route: 'the-laramie-project',
  title: 'The Laramie Project',
  venue: 'Bastian Theatre',
  project_date: new Date('2019-01-15'),
  producer: [
    [ 'o', 'The Noorda Center for the Performing Arts' ],
  ],
  description: [
    'This unique production featured an immersive audience experience as viewers travelled across the entire set, led by the cast. Immersed in the action and events of the play, audience members were confronted with the true retelling of the tragic death of Matthew Shepard. Surrounded by the stylised and unconventional design, themes of reflection, isolation, community, and hope were presented in each room.',
    'Janice’s scenic design was awarded Best Scenic Design by the Theatre Arts Guild at Utah Valley University in 2019. Her concept and show design were presented at the BFA Theatrical Design Student Showcase in 2019. In the same year, she presented a panel at the Conference on Writing for Social Change at Utah Valley University alongside the production assistant director, Shelby Gist, and dramaturg, Matthew Oviatt.',
  ],
  credits: [
    {
      label: 'Written by',
      contribs: [
        [ 'p', 'Moisés Kaufman' ],
        [ 'o', 'the members of the Tectonic Theater Project' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Laurie Harrop-Purser' ],
      ],
    },
    {
      label: 'Technical Direction by',
      contribs: [
        [ 'p', 'Cristian Bell' ],
      ],
    },
    {
      label: 'Scenic & Props Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Colin Skip Wilson' ],
      ],
    },
    {
      label: 'Projection Design by',
      contribs: [
        [ 'p', 'Emma Eugenia Belnap' ],
      ],
    },
    {
      label: 'Sound Design by',
      contribs: [
        [ 'p', 'Nathan Lowry' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Rae Sip' ],
        [ 'p', 'Kate Backman' ],
      ],
    },
    {
      label: 'Makeup Design by',
      contribs: [
        [ 'p', 'Alanna Cottam' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Suzy Oliveira' ],
      ],
    },
  ],
  press: [
    {
      publication: 'The Utah Review',
      link: {
        label: 'Plan-B Theatre Sets World Premiere in Nov. 3-13 Run of Morag Shepherd’s My Brother was a Vampire',
        url: 'https://www.theutahreview.com/plan-b-theatre-sets-world-premiere-in-nov-3-13-run-of-morag-shepherds-my-brother-was-a-vampire/',
      },
    },
    {
      publication: 'QSaltLake Magazine',
      link: {
        label: 'Plan-B to Premiere Horror Comedy ‘My Brother was a Vampire’ by Morag Shepherd',
        url: 'https://www.qsaltlake.com/news/2022/09/24/plan-b-to-premiere-horror-comedy-my-brother-was-a-vampire-by-morag-shepherd/',
      },
    },
    {
      publication: 'Gephardt Daily',
      link: {
        label: 'Review: Plan-B’s ‘My Brother was a Vampire’ is Bloody, Brilliant',
        url: 'https://gephardtdaily.com/local/review-plan-bs-my-brother-was-a-vampire-is-bloody-brilliant/',
      },
    },
    {
      publication: '15 Bytes',
      link: {
        label: 'Morag Shepherd Avoids the Realist Trap with a Play of Sudden Shifts and Strange Powers',
        url: 'http://artistsofutah.org/15Bytes/index.php/morag-shepherd-avoids-the-realist-trap-with-a-play-of-sudden-shifts-and-strange-powers/',
      },
    },
  ],
  images: [
    [ 't', '2-laramie/00-laramie-title.jpg' ],
    [ 'g', '2-laramie/01-laramie.jpg' ],
    [ 'g', '2-laramie/02-laramie.jpg' ],
    [ 'g', '2-laramie/03-laramie.jpg' ],
    [ 'g', '2-laramie/04-laramie.jpg' ],
    [ 'g', '2-laramie/05-laramie.jpg' ],
    [ 'g', '2-laramie/06-laramie.jpg' ],
    [ 'g', '2-laramie/07-laramie.jpg' ],
    [ 'g', '2-laramie/08-laramie.jpg' ],
    [ 'g', '2-laramie/09-laramie.jpg' ],
    [ 'g', '2-laramie/10-laramie.jpg' ],
    [ 'g', '2-laramie/11-laramie.jpg' ],
    [ 'g', '2-laramie/12-laramie.jpg' ],
    [ 'g', '2-laramie/13-laramie.jpg' ],
    [ 'g', '2-laramie/14-laramie.jpg' ],
  ],
};

const MY_BROTHER_WAS_A_VAMPIRE: JcdProjectDef = {
  project_key: 'MY_BROTHER_WAS_A_VAMPIRE',
  active: true,
  route: 'my-brother-was-a-vampire',
  title: 'My Brother was a Vampire',
  venue: 'Rose Wagner Performing Arts Center',
  project_date: new Date('2022-11-15'),
  producer: [
    [ 'o', 'Plan-B Theatre Company' ],
  ],
  description: [
    'Inspired by Let The Right One In (2008), the scenic design for the horror comedy by Morag Shepherd was grounded in childhood trauma, abuse, terror, death, and love. The concept inspired the use of Scandinavian household furnishings, achieving a chaotic backdrop against the ghostly drapery that framed the two-person cast in a blanket-fort silhouette.',
  ],
  credits: [
    {
      label: 'World Premiere by',
      contribs: [
        [ 'p', 'Morag Shepherd' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Cheryl Ann Cluff' ],
      ],
    },
    {
      label: 'Scenic & Props Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Emma Eugenia Belnap' ],
      ],
    },
    {
      label: 'Sound Design by',
      contribs: [
        [ 'p', 'Cheryl Ann Cluff' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Victoria Bird' ],
      ],
    },
    {
      label: 'Scenic Construction by',
      contribs: [
        [ 'p', 'Grey Rung' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Sharah Meservy' ],
      ],
    },
  ],
  press: [
    {
      publication: 'The Utah Review',
      link: {
        label: 'Plan-B Theatre Sets World Premiere in Nov. 3-13 Run of Morag Shepherd’s My Brother was a Vampire',
        url: 'https://www.theutahreview.com/plan-b-theatre-sets-world-premiere-in-nov-3-13-run-of-morag-shepherds-my-brother-was-a-vampire/',
      },
    },
    {
      publication: 'QSaltLake Magazine',
      link: {
        label: 'Plan-B to Premiere Horror Comedy ‘My Brother was a Vampire’ by Morag Shepherd',
        url: 'https://www.qsaltlake.com/news/2022/09/24/plan-b-to-premiere-horror-comedy-my-brother-was-a-vampire-by-morag-shepherd/',
      },
    },
    {
      publication: 'Gephardt Daily',
      link: {
        label: 'Review: Plan-B’s ‘My Brother was a Vampire’ is Bloody, Brilliant',
        url: 'https://gephardtdaily.com/local/review-plan-bs-my-brother-was-a-vampire-is-bloody-brilliant/',
      },
    },
    {
      publication: '15 Bytes',
      link: {
        label: 'Morag Shepherd Avoids the Realist Trap with a Play of Sudden Shifts and Strange Powers',
        url: 'http://artistsofutah.org/15Bytes/index.php/morag-shepherd-avoids-the-realist-trap-with-a-play-of-sudden-shifts-and-strange-powers/',
      },
    },
  ],
  images: [
    [ 't', '3-vampire/00-vampire-title.jpg' ],
    [ 'g', '3-vampire/01-vampire.jpg' ],
    [ 'g', '3-vampire/02-vampire.jpg' ],
    [ 'g', '3-vampire/03-vampire.jpg' ],
    [ 'g', '3-vampire/04-vampire.jpg' ],
    [ 'g', '3-vampire/05-vampire.jpg' ],
    [ 'g', '3-vampire/06-vampire.jpg' ],
    [ 'g', '3-vampire/07-vampire.jpg' ],
    [ 'g', '3-vampire/08-vampire.jpg' ],
    [ 'g', '3-vampire/09-vampire.jpg' ],
    [ 'g', '3-vampire/10-vampire.jpg' ],
    [ 'g', '3-vampire/11-vampire.jpg' ],
    [ 'g', '3-vampire/12-vampire.jpg' ],
  ],
};

const LA_BOHEME: JcdProjectDef = {
  project_key: 'LA_BOHEME',
  active: true,
  route: 'la-boheme',
  title: 'La Bohème',
  venue: 'Smith Theatre',
  project_date: new Date('2022-01-15'),
  producer: [
    [ 'o', 'The Noorda Center for the Performing Arts' ],
  ],
  description: [
    'Janice’s opera debut, and a first time designing on a rental set created by Peter Dean Peck, La Bohème was anything but a traditional opera production. Visionary and broadway director, Matt August, brought together an ensemble of professional performers, starring Marina Costa-Jackson (Utah Opera, MET Opera) and Isaac Hurtado (Utah Opera, Opera San Jose).',
  ],
  credits: [
    {
      label: 'Opera by',
      contribs: [
        [ 'p', 'Giacomo Puccini' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Matt August' ],
      ],
    },
    {
      label: 'Conducted by',
      contribs: [
        [ 'p', 'Nicolas Giusti' ],
      ],
    },
    {
      label: 'Technical Direction by',
      contribs: [
        [ 'p', 'Nat Reed' ],
      ],
    },
    {
      label: 'Scenic Design by',
      contribs: [
        [ 'p', 'Peter Dean Beck' ],
      ],
    },
    {
      label: 'Production Scenic & Props Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Peter D. Leonard' ],
      ],
    },
    {
      label: 'Costume, Hair, & Makeup Design by',
      contribs: [
        [ 'p', 'Cee-Cee Swalling' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'o', 'UVU Broadcast Services' ],
      ],
    },
  ],
  press: [
    {
      publication: 'PBS',
      description: '“This is a set that has travelled around the country to major opera houses…Janice Chan…has redesigned this set and redressed it, so that it’s gonna get a fresh look and a fresh take on this story.”',
      link: {
        label: 'Contact: The Noorda La Bohème Interview with Director Matt August',
        url: 'https://www.pbs.org/video/the-noorda-la-boheme-noaot2/',
      },
    },
  ],
  images: [
    [ 't', '4-boheme/00-boheme-title.jpg' ],
    [ 'g', '4-boheme/01-boheme.jpg' ],
    [ 'g', '4-boheme/02-boheme.jpg' ],
    [ 'g', '4-boheme/03-boheme.jpg' ],
    [ 'g', '4-boheme/04-boheme.jpg' ],
    [ 'g', '4-boheme/05-boheme.jpg' ],
    [ 'g', '4-boheme/06-boheme.jpg' ],
    [ 'g', '4-boheme/07-boheme.jpg' ],
    [ 'g', '4-boheme/08-boheme.jpg' ],
    [ 'g', '4-boheme/09-boheme.jpg' ],
    [ 'g', '4-boheme/10-boheme.jpg' ],
    [ 'g', '4-boheme/11-boheme.jpg' ],
    [ 'g', '4-boheme/12-boheme.jpg' ],
    [ 'g', '4-boheme/13-boheme.jpg' ],
  ],
};

const URINETOWN: JcdProjectDef = {
  project_key: 'URINETOWN',
  active: true,
  route: 'urinetown-the-musical',
  title: 'Urinetown: The Musical',
  venue: 'Bastian Theatre',
  project_date: new Date('2019-09-15'),
  producer: [
    [ 'o', 'The Noorda Center for the Performing Arts' ],
  ],
  description: [
    'As her final undergraduate mainstage design and senior project, Janice’s scenic design drew rave reviews as a refreshing take on the critically acclaimed musical. Centred on satire and politics, the design was approached from the lens of the anti-art art movement: dadaism. The design featured a set of playground-inspired, shape-shifting structures that created an array of compositions. Her senior project presentation received enthusiastic and supportive reviews from the panel of faculty members at Utah Valley University.',
    'The scenic design process was presented at the Kennedy Center American College Theater Festival Region 8 Showcase at California State University, Fullerton in early 2020.',
  ],
  credits: [
    {
      label: 'Book by',
      contribs: [
        [ 'p', 'Greg Kotis' ],
      ],
    },
    {
      label: 'Music & Lyrics by',
      contribs: [
        [ 'p', 'Mark Hollmann' ],
        [ 'p', 'Greg Kotis' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Matthew Herrick' ],
      ],
    },
    {
      label: 'Technical Direction by',
      contribs: [
        [ 'p', 'Glenn Pepe' ],
      ],
    },
    {
      label: 'Scenic & Props Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Assistant Scenic & Props Design by',
      contribs: [
        [ 'p', 'Gavin Henry' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Colin Skip Wilson' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Mallory Goodman' ],
      ],
    },
    {
      label: 'Hair & Makeup Design by',
      contribs: [
        [ 'p', 'Kate Backman' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Jeremy Hall' ],
      ],
    },
  ],
  press: [
    {
      publication: 'Front Row Reviewers',
      description: '“The set, by Janice Chan, is hewn in rough scaffolding in browns and oranges and is cleverly constructed to break apart and accommodate the different scenes from the corporate suite to the sewer.”',
      link: {
        label: 'Urinetown at UVU is Streaming with Great Talent and Dark Humor',
        url: 'https://frontrowreviewersutah.com/?p=13681',
      },
    },
  ],
  images: [
    [ 't', '5-urinetown/00-urinetown-title.jpg' ],
    [ 'g', '5-urinetown/01-urinetown.jpg' ],
    [ 'g', '5-urinetown/02-urinetown.jpg' ],
    [ 'g', '5-urinetown/03-urinetown.jpg' ],
    [ 'g', '5-urinetown/04-urinetown.jpg' ],
    [ 'g', '5-urinetown/05-urinetown.jpg' ],
    [ 'g', '5-urinetown/06-urinetown.jpg' ],
    [ 'g', '5-urinetown/07-urinetown.jpg' ],
    [ 'g', '5-urinetown/08-urinetown.jpg' ],
    [ 'g', '5-urinetown/09-urinetown.jpg' ],
    [ 'g', '5-urinetown/10-urinetown.jpg' ],
    [ 'g', '5-urinetown/11-urinetown.jpg' ],
    [ 'g', '5-urinetown/12-urinetown.jpg' ],
    [ 'g', '5-urinetown/13-urinetown.jpg' ],
    [ 'g', '5-urinetown/14-urinetown.jpg' ],
    [ 'g', '5-urinetown/15-urinetown.jpg' ],
    [ 'g', '5-urinetown/16-urinetown.jpg' ],
  ],
};

const THE_TEMPEST: JcdProjectDef = {
  project_key: 'THE_TEMPEST',
  active: true,
  route: 'the-tempest',
  title: 'The Tempest',
  venue: 'Rock Canyon Trailhead Amphitheater',
  project_date: new Date('2021-08-15'),
  producer: [
    [ 'o', 'Renaissance Now Theatre & Film' ],
  ],
  description: [
    'Produced as part of the annual Summer Shakespeare Festival hosted by Renaissance Now Theatre & Film, The Tempest was reimagined as a heartfelt outdoor show featuring original music developed for this adaptation of Shakespeare. Against the iconic Utah mountain backdrop and the setting sun, the small cement slab stage was transformed into a cozy, fireside tavern.',
  ],
  credits: [
    {
      label: 'Written by',
      contribs: [
        [ 'p', 'William Shakespeare' ],
      ],
    },
    {
      label: 'Adapted by',
      contribs: [
        [ 'p', 'Cleveland McKay Nicoll' ],
      ],
    },
    {
      label: 'Original Music & Lyrics by',
      contribs: [
        [ 'p', 'McKell Peterson' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Cleveland McKay Nicoll' ],
      ],
    },
    {
      label: 'Scenic Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Scenic Painting by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Tawnie Robinson' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Maryann Hill' ],
      ],
    },
    {
      label: 'Production Photography & Videography by',
      contribs: [
        [ 'p', 'Dave Biesinger' ],
      ],
    },
  ],
  press: [],
  images: [
    [ 't', '6-tempest/00-tempest-title.jpg' ],
    [ 'g', '6-tempest/01-tempest.jpg' ],
    [ 'g', '6-tempest/02-tempest.jpg' ],
    [ 'g', '6-tempest/03-tempest.jpg' ],
    [ 'g', '6-tempest/04-tempest.jpg' ],
    [ 'g', '6-tempest/05-tempest.jpg' ],
    [ 'g', '6-tempest/06-tempest.jpg' ],
    [ 'g', '6-tempest/07-tempest.jpg' ],
  ],
};

const AFTERSHOCK: JcdProjectDef = {
  project_key: 'AFTERSHOCK',
  active: true,
  route: 'aftershock',
  title: 'Aftershock',
  venue: 'Rose Wagner Performing Arts Center',
  project_date: new Date('2022-04-15'),
  producer: [
    [ 'o', 'Plan-B Theatre Company' ],
  ],
  description: [
    'Set in a dating game show dream following the 2020 Salt Lake City earthquake, aftershocks were presented both metaphorically and realistically. Memories and significant moments in time were recalled in a dream state. The presentational stage design highlighted the memories recalled and the effects of the earthquake.',
  ],
  credits: [
    {
      label: 'World Premiere by',
      contribs: [
        [ 'p', 'Iris Salazar' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Cheryl Ann Cluff' ],
      ],
    },
    {
      label: 'Scenic Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Props Design by',
      contribs: [
        [ 'p', 'Arika Schockmel' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Emma Eugenia Belnap' ],
      ],
    },
    {
      label: 'Sound Design by',
      contribs: [
        [ 'p', 'Cheryl Ann Cluff' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Maddiey Howell' ],
      ],
    },
    {
      label: 'Scenic Construction by',
      contribs: [
        [ 'p', 'Sydney Shoell' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Sharah Meservy' ],
      ],
    },
  ],
  press: [
    {
      publication: 'Front Row Reviewers',
      description: '“Janice Chan—scenic director—and the lighting designer Emma Eugenia Belnap harness that possibility with the perfect blend of opulence and ruin that draws the audience in while giving plenty of playing space and hiding spots for props and actors alike...Truly, the design team uses the space given to get the audience curious, keep them engaged, and enhance the performance of the actors.”',
      link: {
        label: 'Plan-B Theatre’s World Premiere of Aftershock Shakes Up Salt Lake City Asking: What’s Coming to the Surface?',
        url: 'https://frontrowreviewersutah.com/?p=17185&utm_source=rss&utm_medium=rss&utm_campaign=plan-b-theatres-world-premiere-of-aftershock-shakes-up-salt-lake-city-asking-whats-coming-to-the-surface',
      },
    },
  ],
  images: [
    [ 't', '7-aftershock/00-aftershock-title.jpg' ],
    [ 'g', '7-aftershock/01-aftershock.jpg' ],
    [ 'g', '7-aftershock/02-aftershock.jpg' ],
    [ 'g', '7-aftershock/03-aftershock.jpg' ],
    [ 'g', '7-aftershock/04-aftershock.jpg' ],
    [ 'g', '7-aftershock/05-aftershock.jpg' ],
    [ 'g', '7-aftershock/06-aftershock.jpg' ],
    [ 'g', '7-aftershock/07-aftershock.jpg' ],
    [ 'g', '7-aftershock/08-aftershock.jpg' ],
    [ 'g', '7-aftershock/09-aftershock.jpg' ],
    [ 'g', '7-aftershock/10-aftershock.jpg' ],
    [ 'g', '7-aftershock/11-aftershock.jpg' ],
    [ 'g', '7-aftershock/12-aftershock.jpg' ],
    [ 'g', '7-aftershock/13-aftershock.jpg' ],
    [ 'g', '7-aftershock/14-aftershock.jpg' ],
    [ 'g', '7-aftershock/15-aftershock.jpg' ],
    [ 'g', '7-aftershock/16-aftershock.jpg' ],
    [ 'g', '7-aftershock/17-aftershock.jpg' ],
    [ 'g', '7-aftershock/18-aftershock.jpg' ],
    [ 'g', '7-aftershock/19-aftershock.jpg' ],
  ],
};

const SWEENEY_TODD: JcdProjectDef = {
  project_key: 'SWEENEY_TODD',
  active: true,
  route: 'sweeney-todd',
  title: 'Sweeney Todd: The Demon Barber of Fleet Street',
  venue: 'Smith Theatre',
  project_date: new Date('2019-10-15'),
  producer: [
    [ 'o', 'The Noorda Center for the Performing Arts' ],
    [ 'o', 'Utah Repertory Theater Company' ],
  ],
  description: [
    'As part of the inaugural season at The Noorda, the chilling macabre production starred Jeff McCarthy (Tony Award-nominee) and Jacquelyne Jones.',
    'Janice’s contributions to this production began as an assistant designer, supporting the research efforts of the set designer, Josh Steadman, and producing design draftings for build. As associate designer, her scenic direction and management helped shape the outcome of the design and concept, including putting her scenic painting background to use in the days leading up to Opening Night.',
  ],
  credits: [
    {
      label: 'Book by',
      contribs: [
        [ 'p', 'Hugh Wheeler' ],
      ],
    },
    {
      label: 'Music & Lyrics by',
      contribs: [
        [ 'p', 'Stephen Sondheim' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Tim Threlfall' ],
      ],
    },
    {
      label: 'Technical Direction & Set Construction by',
      contribs: [
        [ 'p', 'Nat Reed' ],
      ],
    },
    {
      label: 'Set Design by',
      contribs: [
        [ 'p', 'Josh Steadman' ],
      ],
    },
    {
      label: 'Associate Set Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Props Design by',
      contribs: [
        [ 'p', 'Rachel Summerhalder' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Jaron Kent Hermansen' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Nancy Cannon' ],
      ],
    },
    {
      label: 'Hair & Makeup Design by',
      contribs: [
        [ 'p', 'Samantha Lambson' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Jay Drowns' ],
      ],
    },
    {
      label: 'BTS Photography by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
  ],
  press: [
    {
      publication: 'Front Row Reviewers',
      link: {
        label: 'Sweeney Todd: The Demon Barber of Fleet Street at Utah Valley University is Bloody Superb',
        url: 'https://frontrowreviewersutah.com/?p=13952',
      },
    },
    {
      publication: 'BroadwayWorld Review',
      link: {
        label: 'Utah Repertory Theater’s SWEENEY TODD Is A Reminder Of What Happens When A Person’s Heart Is Guided Completely By Revenge',
        url: 'https://www.broadwayworld.com/salt-lake-city/article/BWW-Review-Utah-Repertory-Theaters-SWEENEY-TODD-Is-A-Reminder-Of-What-Happens-When-A-Persons-Heart-Is-Guided-Completely-By-Revenge-20191029',
      },
    },
    {
      publication: 'BroadwayWorld Feature',
      link: {
        label: 'Sweeney Todd, a Utah Rep and Noorda Center Co-Production, Wildly Heralded',
        url: 'https://www.broadwayworld.com/salt-lake-city/article/BWW-Feature-SWEENEY-TODD-a-Utah-Rep-and-Noorda-Center-Co-Production-Wildly-Heralded-20191115',
      },
    },
    {
      publication: 'UVU Review',
      link: {
        label: 'Utah Repertory Theater’s Sweeney Todd is a Bloody Good Time ',
        url: 'https://www.uvureview.com/valley-life/artsculture/utah-repertory-theaters-sweeney-todd-is-a-bloody-good-time/',
      },
    },
  ],
  images: [
    [ 't', '8-sweeney/00-sweeney-title.jpg' ],
    [ 'g', '8-sweeney/01-sweeney.jpg' ],
    [ 'g', '8-sweeney/02-sweeney.jpg' ],
    [ 'g', '8-sweeney/03-sweeney.jpg' ],
    [ 'g', '8-sweeney/04-sweeney.jpg' ],
    [ 'g', '8-sweeney/05-sweeney.jpg' ],
    [ 'g', '8-sweeney/06-sweeney.jpg' ],
    [ 'g', '8-sweeney/07-sweeney.jpg' ],
    [ 'g', '8-sweeney/08-sweeney.jpg' ],
    [ 'g', '8-sweeney/09-sweeney.jpg' ],
    [ 'g', '8-sweeney/10-sweeney.jpg' ],
    [ 'g', '8-sweeney/11-sweeney.jpg' ],
    [ 'g', '8-sweeney/12-sweeney.jpg' ],
    [ 'g', '8-sweeney/13-sweeney.jpg' ],
    [ 'g', '8-sweeney/14-sweeney.jpg' ],
    [ 'g', '8-sweeney/15-sweeney.jpg' ],
    [ 'g', '8-sweeney/16-sweeney.jpg' ],
    [ 'g', '8-sweeney/17-sweeney.jpg' ],
    [ 'g', '8-sweeney/18-sweeney.jpg' ],
  ],
};

const JAMES_AND_THE_GIANT_PEACH: JcdProjectDef = {
  project_key: 'JAMES_AND_THE_GIANT_PEACH',
  active: true,
  route: 'james-and-the-giant-peach',
  title: 'James and the Giant Peach',
  venue: 'Bastian Theatre',
  project_date: new Date('2021-11-15'),
  producer: [
    [ 'o', 'The Noorda Center for the Performing Arts' ],
  ],
  description: [
    'Performed in a black box theatre with minimal backstage space and without a fly system, this production was envisioned with the use of negative space in mind. The famous giant peach was presented as a portal, where the peach silhouette was adorned with marquee lights. The strong use of colour set the tone for a vibrant, magical, and lively production.',
  ],
  credits: [
    {
      label: 'Book by',
      contribs: [
        [ 'p', 'Timothy Allen McDonald' ],
      ],
    },
    {
      label: 'Music & Lyrics by',
      contribs: [
        [ 'p', 'Benj Pasek' ],
        [ 'p', 'Justin Paul' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Lisa Hall' ],
      ],
    },
    {
      label: 'Choreography by',
      contribs: [
        [ 'p', 'Chantelle Wells' ],
      ],
    },
    {
      label: 'Technical Direction by',
      contribs: [
        [ 'p', 'Cristian Bell' ],
        [ 'p', 'Glenn Pepe' ],
      ],
    },
    {
      label: 'Scenic & Props Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Colin Skip Wilson' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Dayna Kay Gomar' ],
      ],
    },
    {
      label: 'Hair & Makeup Design by',
      contribs: [
        [ 'p', 'Kate Backman' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Suzy Oliveira' ],
      ],
    },
  ],
  press: [
    {
      publication: 'UVU Review',
      description: '“The set and costume design created a mesmerizing and immersive atmosphere. It had a cutout of the titular peach artfully inlaid with flowers which acted as the center of the production, but there were further elements with clouds above and the city skyline in the background which gave it a sense of depth and variety.”',
      link: {
        label: '"James and the Giant Peach” - A Fun, Whimsical Story About Finding One’s Home',
        url: 'https://www.uvureview.com/valley-life/artsculture/james-and-the-giant-peach-a-fun-whimsical-story-about-finding-ones-home/',
      },
    },
  ],
  images: [
    [ 't', '10-james-and-the-giant-peach/00-james-title.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/01-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/02-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/03-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/04-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/05-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/06-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/07-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/08-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/09-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/10-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/11-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/12-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/13-james.jpg' ],
    [ 'g', '10-james-and-the-giant-peach/14-james.jpg' ],
  ],
};

const THE_DRAG: JcdProjectDef = {
  project_key: 'THE_DRAG',
  active: true,
  route: 'the-drag',
  title: 'The Drag',
  venue: 'Provo Towne Center',
  project_date: new Date('2018-07-15'),
  producer: [
    [ 'o', 'An Other Theater Company' ],
  ],
  description: [
    '“Too much of a good thing can be wonderful.” - Mae West',
    'Drama, comedy, and tragedy all wrapped in one iconic Mae West production, performed in none other than the former found-space theater that used to be a RadioShack. AOTC’s mission is to create LGBTQIA+-focused productions that support and serve under-represented communities in the heart of Utah County.',
  ],
  credits: [
    {
      label: 'Written by',
      contribs: [
        [ 'p', 'Mae West' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Taylor Jack Nelson' ],
      ],
    },
    {
      label: 'Scenic & Props Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Scenic Painting by',
      contribs: [
        [ 'p', 'Janice Chan' ],
        [ 'p', 'Tyler Whited' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Aimee Findley Moore' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Ash Knowles' ],
      ],
    },
    {
      label: 'Hair & Makeup Design by',
      contribs: [
        [ 'p', 'Christopher-Alan Pederson' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Laura Chapman' ],
      ],
    },
  ],
  press: [
    {
      publication: 'Front Row Reviewers',
      description: '“Janice Chan\'s set and props create the perfect atmosphere for a jazz-age romp.”',
      link: {
        label: 'Is that The Drag at An Other Theater Company in Provo, or Are You Just Happy to See Me?',
        url: 'https://frontrowreviewersutah.com/?p=8462',
      },
    },
  ],
  images: [
    [ 't', '11-the-drag/00-drag-title.jpg' ],
    [ 'g', '11-the-drag/01-drag.jpg' ],
    [ 'g', '11-the-drag/02-drag.jpg' ],
    [ 'g', '11-the-drag/03-drag.jpg' ],
    [ 'g', '11-the-drag/04-drag.jpg' ],
    [ 'g', '11-the-drag/05-drag.jpg' ],
    [ 'g', '11-the-drag/06-drag.jpg' ],
    [ 'g', '11-the-drag/07-drag.jpg' ],
    [ 'g', '11-the-drag/08-drag.jpg' ],
    [ 'g', '11-the-drag/09-drag.jpg' ],
    [ 'g', '11-the-drag/10-drag.jpg' ],
  ],
};

const AGAMEMNON: JcdProjectDef = {
  project_key: 'AGAMEMNON',
  active: true,
  route: 'agamemnon',
  title: 'Agamemnon: Oresteia Part One',
  venue: 'eXBox Theater',
  project_date: new Date('2018-04-15'),
  producer: [
    [ 'o', 'The Noorda Center for the Performing Arts' ],
  ],
  description: [
    'This production was directed and mentored by Christopher Clark, a prominent, award-winning theatre arts educator and admired community member, who passed away from a five-year battle with ALS in 2020. As a newbie in the undergraduate program and having freshly discovered a design career path, Chris offered me the opportunity to realise his mid-century modern Brechtian concept for the first part of the Oresteia trilogy. What was initially an acting-block-only show transformed into a Dogville-esque set from the 1950s.',
  ],
  credits: [
    {
      label: 'Written by',
      contribs: [
        [ 'p', 'Aeschylus' ],
      ],
    },
    {
      label: 'Adapted by',
      contribs: [
        [ 'p', 'Robert Icke' ],
      ],
    },
    {
      label: 'Composed & Arranged by',
      contribs: [
        [ 'p', 'Spicer Carr' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Christopher Clark' ],
      ],
    },
    {
      label: 'Props Design by',
      contribs: [
        [ 'p', 'Aimee Findley Moore' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Aaron Gubler' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Mallory Goodman' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Deric Lambdin' ],
      ],
    },
  ],
  press: [],
  images: [
    [ 't', '12-agamemnon/00-agamemnon-title.jpg' ],
    [ 'g', '12-agamemnon/01-agamemnon.jpg' ],
    [ 'g', '12-agamemnon/02-agamemnon.jpg' ],
    [ 'g', '12-agamemnon/03-agamemnon.jpg' ],
    [ 'g', '12-agamemnon/04-agamemnon.jpg' ],
    [ 'g', '12-agamemnon/05-agamemnon.jpg' ],
    [ 'g', '12-agamemnon/06-agamemnon.jpg' ],
    [ 'g', '12-agamemnon/07-agamemnon.jpg' ],
    [ 'g', '12-agamemnon/08-agamemnon.jpg' ],
  ],
};

const CINDERELLA_EATS_RICE_AND_BEANS: JcdProjectDef = {
  project_key: 'CINDERELLA_EATS_RICE_AND_BEANS',
  active: true,
  route: 'cinderella-eats-rice-and-beans',
  title: 'Cinderella Eats Rice and Beans: A Salsa Fairytale',
  venue: 'Theatre for Youth and Education Center',
  project_date: new Date('2021-02-15'),
  producer: [
    [ 'o', 'The Noorda Center for the Performing Arts' ],
  ],
  description: [
    'In the height of the COVID-19 pandemic, what was traditionally a touring children’s production was adapted into a filmed production. The production was filmed on a double-sided set, where the actors were seen travelling between the staged spaces, keeping the traditional live performance experience of seeing actors enter and exit the playing space. The scenic design was inspired by a combination of the classic 1950 animated film and the vibrant Puerto Rican architecture style. With the younger audience in mind, the props design offered a modern take on the original fairytale imagery.',
  ],
  credits: [
    {
      label: 'Book & Lyrics by',
      contribs: [
        [ 'p', 'Karen Zacarías' ],
      ]
    },
    {
      label: 'Music by',
      contribs: [
        [ 'p', 'Deborah Wicks La Puma' ],
      ]
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Megan Ann Rasmussen' ],
      ]
    },
    {
      label: 'Technical Direction by',
      contribs: [
        [ 'p', 'Glenn Pepe' ],
      ]
    },
    {
      label: 'Scenic & Props Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ]
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Michelle Walling' ],
      ]
    },
    {
      label: 'Hair & Makeup Design by',
      contribs: [
        [ 'p', 'Kiyomi Coronado' ],
      ]
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Suzy Oliveira' ],
      ]
    },
  ],
  press: [
    {
      publication: 'UVU Digital Media Department',
      link: {
        label: 'Joint Venture: UVU Digital Cinema Production and Theater Programs',
        url: 'https://www.uvu.edu/dgm/blog/cinderella.html',
      },
    },
    {
      publication: 'UVU Review',
      link: {
        label: 'Bilingual Theater for Youth Revives Old Tales with New World Issues',
        url: 'https://www.uvureview.com/valley-life/bilingual-theater-for-youth-revives-old-tales-with-new-world-issues/?amp_markup=1',
      },
    },
  ],
  images: [
    [ 't', '13-cinderella-eats-rice-and-beans/00-cinderella-title.jpg' ],
    [ 'g', '13-cinderella-eats-rice-and-beans/01-cinderella.jpg' ],
    [ 'g', '13-cinderella-eats-rice-and-beans/02-cinderella.jpg' ],
    [ 'g', '13-cinderella-eats-rice-and-beans/03-cinderella.jpg' ],
    [ 'g', '13-cinderella-eats-rice-and-beans/04-cinderella.jpg' ],
    [ 'g', '13-cinderella-eats-rice-and-beans/05-cinderella.jpg' ],
    [ 'g', '13-cinderella-eats-rice-and-beans/06-cinderella.jpg' ],
    [ 'g', '13-cinderella-eats-rice-and-beans/07-cinderella.jpg' ],
  ],
};

const THE_CLEAN_UP_PROJECT: JcdProjectDef = {
  project_key: 'THE_CLEAN_UP_PROJECT',
  active: true,
  route: 'the-clean-up-project',
  title: 'The Clean-Up Project',
  venue: 'Rose Wagner Performing Arts Center',
  project_date: new Date('2022-02-15'),
  producer: [
    [ 'o', 'Plan-B Theatre Company' ],
  ],
  description: [
    'Staying true to the script by Carleton Bluford, a minimal design was created to achieve a walls-down, open, and honest reality of racial issues faced in the United States. Following the murder of George Floyd in 2020, this production shed a new perspective during one of the most politically charged times in recent years. Presented in a dystopian and minimalist setting, dialogue and interactive elements became the focal point that begged the question of what it takes to be an enemy or an ally.',
  ],
  credits: [
    {
      label: 'World Premiere by',
      contribs: [
        [ 'p', 'Carleton Bluford' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Jerry Rapier' ],
      ],
    },
    {
      label: 'Scenic Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Props Design by',
      contribs: [
        [ 'p', 'Arika Schockmel' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Emma Eugenia Belnap' ],
      ],
    },
    {
      label: 'Sound Design by',
      contribs: [
        [ 'p', 'Cheryl Ann Cluff' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Derek Williamson' ],
      ],
    },
    {
      label: 'Scenic Construction by',
      contribs: [
        [ 'p', 'Sydney Shoell' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Sharah Meservy' ],
      ],
    },
  ],
  press: [
    {
      publication: 'Front Row Reviewers',
      description: '“While the designs were simple, each element is used to utter perfection…Janice Chan’s set design is simple but effective, allowing the acting and directing by Jerry Rapier to take the audience’s focus.”',
      link: {
        label: 'Plan-B Theatre’s World-Premiere of THE CLEAN-UP PROJECT is Harsh, Raw, and Utterly Necessary',
        url: 'https://frontrowreviewersutah.com/?p=17052',
      },
    },
    {
      publication: 'The Utah Review',
      description: '“The minimalism amplifies one of many thematic metaphors in the play relating to unsatisfied expectations for relief, reform and reconciliation.”',
      link: {
        label: 'Plan-B Theatre Set to Open 2022 Season In Person. In Color. with World Premiere of Carleton Bluford’s The Clean-Up Project',
        url: 'https://www.theutahreview.com/plan-b-theatre-set-to-open-2022-season-in-person-in-color-with-world-premiere-of-carleton-blufords-the-clean-up-project/',
      },
    },
    {
      publication: 'The Daily Utah Chronicle',
      description: '“Especially during Black History Month, a play whose dialogue centers on justice, retribution, power and oppression like this is so captivating. The dissection of the characters’ opposing philosophies is heightened by the air of violence and chaos that surrounds this world. It is gritty, ugly, exposing, but truthful and impactful.”',
      link: {
        label: 'Plan-B Theatre’s Premiere of ‘The Clean-Up Project’ is a Shocking Conversation about Race',
        url: 'https://dailyutahchronicle.com/2022/02/17/plan-b-theatre-premiere-the-clean-up-project/',
      },
    },
    {
      publication: 'The Utah Review',
      link: {
        label: 'An Unsurpassed, Extraordinary Opening Night Performance for the Premiere of Carleton Bluford’s The Clean-Up Project, Plan-B Theatre’s Newest Production',
        url: 'https://www.theutahreview.com/an-unsurpassed-extraordinary-opening-night-performance-for-the-premiere-of-carleton-blufords-the-clean-up-project-plan-b-theatres-newest-production/',
      },
    },
    {
      publication: 'Salt Lake Magazine',
      link: {
        label: 'Review: ‘The Clean-Up Project’ at Plan-B Theatre',
        url: 'https://www.saltlakemagazine.com/review-the-clean-up-project-at-plan-b-theatre/',
      },
    },
    {
      publication: '15 Bytes',
      link: {
        label: 'Carleton Bluford and the Process of Cleaning Up',
        url: 'http://artistsofutah.org/15Bytes/index.php/carleton-bluford-and-the-process-of-cleaning-up/',
      },
    },
  ],
  images: [
    [ 't', '14-the-clean-up-project/00-clean-up-title.jpg' ],
    [ 'g', '14-the-clean-up-project/01-clean-up.jpg' ],
    [ 'g', '14-the-clean-up-project/02-clean-up.jpg' ],
    [ 'g', '14-the-clean-up-project/03-clean-up.jpg' ],
    [ 'g', '14-the-clean-up-project/04-clean-up.jpg' ],
    [ 'g', '14-the-clean-up-project/05-clean-up.jpg' ],
    [ 'g', '14-the-clean-up-project/06-clean-up.jpg' ],
    [ 'g', '14-the-clean-up-project/07-clean-up.jpg' ],
    [ 'g', '14-the-clean-up-project/08-clean-up.jpg' ],
  ],
};

const NEXT_FALL: JcdProjectDef = {
  project_key: 'NEXT_FALL',
  active: true,
  route: 'next-fall',
  title: 'Next Fall',
  venue: 'Provo Towne Center',
  project_date: new Date('2018-05-15'),
  producer: [
    [ 'o', 'An Other Theater Company' ],
  ],
  description: [
    'In a former RadioShack storefront in an echo-y shopping mall, the design concept aimed for creating an atmosphere of warmth to contrast the script’s tragic premise. The geometric backdrop was designed and painted to offer a one-look background for both hospital scenes and to serve as an accent wall in a modern apartment.',
  ],
  credits: [
    {
      label: 'Written by',
      contribs: [
        [ 'p', 'Geoffrey Nauffts' ],
      ]
    }
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Kacey Spadafora' ],
      ],
    },
    {
      label: 'Scenic & Props Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Scenic Painting by',
      contribs: [
        [ 'p', 'Janice Chan' ],
        [ 'p', 'Cynthia Chan' ],
      ],
    },
    {
      label: 'Lighting Design by',
      contribs: [
        [ 'p', 'Paige Porter' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Ash Knowles' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Laura Chapman' ],
      ],
    },
  ],
  press: [
    {
      publication: 'Front Row Reviewers',
      description: '“Janice Chan’s set design is also simple, but beautiful. Various locations are specified by changing the paintings on the wall and rearranging the furniture. Large geometric patterns in rich colors cover the back wall, creating a pleasing backdrop for the action.”',
      link: {
        label: 'Humor and Heartbreak in An Other Theater Company\'s Next Fall',
        url: 'https://frontrowreviewersutah.com/?p=7596',
      },
    },
  ],
  images: [
    [ 't', '15-next-fall/00-next-fall-title.jpg' ],
    [ 'g', '15-next-fall/01-next-fall.jpg' ],
    [ 'g', '15-next-fall/02-next-fall.jpg' ],
    [ 'g', '15-next-fall/03-next-fall.jpg' ],
    [ 'g', '15-next-fall/04-next-fall.jpg' ],
    [ 'g', '15-next-fall/05-next-fall.jpg' ],
    [ 'g', '15-next-fall/06-next-fall.jpg' ],
    [ 'g', '15-next-fall/07-next-fall.jpg' ],
    [ 'g', '15-next-fall/08-next-fall.jpg' ],
    [ 'g', '15-next-fall/09-next-fall.jpg' ],
    [ 'g', '15-next-fall/10-next-fall.jpg' ],
  ],
};

const TRIBES: JcdProjectDef = {
  project_key: 'TRIBES',
  active: true,
  route: 'tribes',
  title: 'Tribes',
  venue: 'eXBox Theater',
  project_date: new Date('2018-01-15'),
  producer: [
    [ 'o', 'The Noorda Center for the Performing Arts' ],
  ],
  description: [
    'One of Janice’s debut designs as a first-year theatre design student, Tribes featured an eclectic familial setting. Fully financed and fundraised by the student-director, the scenic design relied on the curation of borrowed and rented resources. Supporting the senior directing project of Hayley Lambdin, the fully student-production team successfully collaborated and delivered a completely sold-out run.',
  ],
  credits: [
    {
      label: 'Written by',
      contribs: [
        [ 'p', 'Nina Raine' ],
      ],
    },
  ],
  prod_credits: [
    {
      label: 'Directed by',
      contribs: [
        [ 'p', 'Hayley Lambdin' ],
      ],
    },
    {
      label: 'Scenic Design by',
      contribs: [
        [ 'p', 'Janice Chan' ],
      ],
    },
    {
      label: 'Props Design by',
      contribs: [
        [ 'p', 'McKenzie Kiser' ],
      ],
    },
    {
      label: 'Lighting & Projection Design by',
      contribs: [
        [ 'p', 'Aaron Gubler' ],
      ],
    },
    {
      label: 'Costume Design by',
      contribs: [
        [ 'p', 'Molly Pack' ],
      ],
    },
    {
      label: 'Production Photography by',
      contribs: [
        [ 'p', 'Deric Lambdin' ],
      ],
    },
  ],
  press: [
    {
      publication: 'Front Row Reviewers',
      link: {
        label: 'Tribes at UVU in Orem is a Roller Coaster of Emotions',
        url: 'https://frontrowreviewersutah.com/?p=6352',
      },
    },
  ],
  images: [
    [ 't', '16-tribes/00-tribes-title.jpg' ],
    [ 'g', '16-tribes/01-tribes.jpg' ],
    [ 'g', '16-tribes/02-tribes.jpg' ],
    [ 'g', '16-tribes/03-tribes.jpg' ],
    [ 'g', '16-tribes/04-tribes.jpg' ],
    [ 'g', '16-tribes/05-tribes.jpg' ],
    [ 'g', '16-tribes/06-tribes.jpg' ],
    [ 'g', '16-tribes/07-tribes.jpg' ],
  ],
};

const JcdV4Projects: JcdProjectDef[] = [
  GO_HOME_COME_BACK,
  THE_DIARY_OF_ANNE_FRANK,
  BALTHAZAR,
  THE_TALES_OF_HOFFMANN,
  LARAMIE_PROJECT,
  MY_BROTHER_WAS_A_VAMPIRE,
  LA_BOHEME,
  URINETOWN,
  THE_TEMPEST,
  AFTERSHOCK,
  SWEENEY_TODD,
  JAMES_AND_THE_GIANT_PEACH,
  THE_DRAG,
  AGAMEMNON,
  CINDERELLA_EATS_RICE_AND_BEANS,
  THE_CLEAN_UP_PROJECT,
  NEXT_FALL,
  TRIBES,
];

export {
  JcdV4Projects
};

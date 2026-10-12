// Decks for Who Be This. Edit the lists to add or remove cards. Commas separate cards.
// Stars deck: well known entertainers, writers and athletes only.

export type Deck = {
  id: string;
  name: string;
  blurb: string;
  bg: string; // card color while playing
  fg: string; // text color on that card
  words: string[];
};

function list(str: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((w) => {
      const k = w.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        out.push(w);
      }
    });
  return out;
}

export const DECKS: Deck[] = [
  {
    id: 'world',
    name: 'World Stars',
    blurb: 'Global musicians, actors, athletes and public figures.',
    bg: '#1D4ED8',
    fg: '#FFFFFF',
    words: list(`
      Beyonce, Rihanna, Taylor Swift, Drake, Kanye West, Jay-Z, Ed Sheeran, Adele, Bruno Mars, Billie Eilish, Ariana Grande,
      Justin Bieber, Eminem, Shakira, Lady Gaga, The Weeknd, Cardi B, Nicki Minaj, Bad Bunny, Dua Lipa, Michael Jackson,
      Bob Marley, Whitney Houston, Prince, Elvis Presley, Snoop Dogg, Kendrick Lamar, Travis Scott, Post Malone, Harry Styles,
      Will Smith, Dwayne Johnson, Tom Cruise, Leonardo DiCaprio, Denzel Washington, Idris Elba, Zendaya, Margot Robbie,
      Jennifer Lawrence, Angelina Jolie, Brad Pitt, Keanu Reeves, Robert Downey Jr, Chris Hemsworth, Ryan Reynolds,
      Scarlett Johansson, Morgan Freeman, Samuel L Jackson, Viola Davis, Lupita Nyong'o, Chadwick Boseman, Kevin Hart,
      Trevor Noah, Dave Chappelle, Oprah Winfrey, Ellen DeGeneres, Jimmy Fallon, Michelle Obama, Barack Obama,
      Nelson Mandela, Elon Musk, Bill Gates, Mark Zuckerberg, Jeff Bezos, Steve Jobs, Kim Kardashian, Kylie Jenner,
      Lionel Messi, Cristiano Ronaldo, Neymar, Kylian Mbappe, Erling Haaland, Mohamed Salah, Pele, Diego Maradona,
      LeBron James, Michael Jordan, Stephen Curry, Kobe Bryant, Serena Williams, Venus Williams, Roger Federer,
      Rafael Nadal, Novak Djokovic, Usain Bolt, Simone Biles, Tiger Woods, Lewis Hamilton, Conor McGregor, Mike Tyson,
      Muhammad Ali, Floyd Mayweather, Tom Brady, David Beckham, Naomi Osaka
    `),
  },
  {
    id: 'stars',
    name: 'Naija Stars',
    blurb: 'Musicians, actors, comedians, writers and athletes.',
    bg: '#0B7A45',
    fg: '#FFFFFF',
    words: list(`
      Burna Boy, Wizkid, Davido, Tiwa Savage, Tems, Rema, Asake, Ayra Starr, Fireboy DML, Olamide, Don Jazzy, 2Baba, Flavour,
      Yemi Alade, Simi, Mr Eazi, Kizz Daniel, CKay, Omah Lay, Adekunle Gold, Falz, Phyno, D'banj, Timaya, Teni, Mayorkun,
      Oxlade, Victony, Fela Kuti, King Sunny Ade, Sade Adu, Wande Coal, Johnny Drille, Zlatan, P-Square,
      Funke Akindele, Genevieve Nnaji, Omotola Jalade, Mercy Johnson, Ramsey Nouah, Richard Mofe-Damijo, Nkem Owoh,
      Osita Iheme, Pete Edochie, Kate Henshaw, Rita Dominic, Nse Ikpe-Etim, Toyin Abraham, Bimbo Ademoye, Kunle Afolayan,
      John Boyega, Chiwetel Ejiofor, David Oyelowo, Uzo Aduba,
      Mr Macaroni, Broda Shaggi, Basketmouth, AY Makun, Bovi, Seyi Law, Julius Agwu,
      Jay-Jay Okocha, Nwankwo Kanu, Victor Osimhen, Mikel Obi, Asisat Oshoala, Hakeem Olajuwon, Anthony Joshua,
      Israel Adesanya, Kamaru Usman, Tobi Amusan, Chioma Ajunwa, Rashidi Yekini, Alex Iwobi, Ademola Lookman,
      Wilfred Ndidi, Kelechi Iheanacho,
      Chimamanda Ngozi Adichie, Wole Soyinka, Chinua Achebe, Ben Okri, Nnedi Okorafor, Tomi Adeyemi, Aliko Dangote,
      Mo Abudu, Linda Ikeji, Hilda Baci, Ebuka Obi-Uchendu
    `),
  },
  {
    id: 'food',
    name: 'Naija Food',
    blurb: 'Soups, snacks, street food and drinks.',
    bg: '#C2410C',
    fg: '#FFFFFF',
    words: list(`
      Jollof Rice, Suya, Amala, Egusi Soup, Pounded Yam, Akara, Moin Moin, Puff Puff, Chin Chin, Ofada Rice, Garri, Eba,
      Fufu, Ogbono Soup, Okra Soup, Nkwobi, Asun, Boli, Dodo, Zobo, Kunu, Palm Wine, Chapman, Agege Bread, Shawarma,
      Meat Pie, Pepper Soup, Kilishi, Tuwo Shinkafa, Efo Riro, Ewa Agoyin, Fried Rice, Fish Roll, Gala, Pure Water,
      Ponmo, Banga Soup, Abacha, Ukwa, Edikang Ikong, Egg Roll, Yam and Egg, Noodles and Egg, Beans and Plantain,
      Roasted Corn, Groundnut, Kuli Kuli, Ogi, Isi Ewu
    `),
  },
  {
    id: 'lagos',
    name: 'Lagos Life',
    blurb: 'Places, transport and everyday scenes.',
    bg: '#3B3F9E',
    fg: '#FFFFFF',
    words: list(`
      Danfo, Okada, Keke, Molue, Third Mainland Bridge, Lekki Toll Gate, Computer Village, Balogun Market, Oshodi,
      Obalende, Go Slow, Traffic, Generator, NEPA, Prepaid Meter, Borehole, Landlord, Agbero, Area Boy, Owambe, Aso Ebi,
      Detty December, Tarkwa Bay, Eko Atlantic, Victoria Island, Ikoyi, Lagos Island, Ajegunle, Festac, Surulere,
      Mile 12 Market, Fuel Queue, Flooding, Lagos Ferry, Bar Beach, Freedom Park, Nike Art Gallery, Eyo Festival,
      Bus Conductor, Gateman, Mama Put, Suya Spot, Pothole, Rainy Season, Wedding Party, Church Service
    `),
  },
  {
    id: 'slang',
    name: 'Slang and Sayings',
    blurb: 'Explain the word without saying it.',
    bg: '#F5B700',
    fg: '#151208',
    words: list(`
      Wahala, Japa, Sapa, Gist, Oga, Abeg, Wetin, Shege, Yawa, Vex, Jara, Ajebutter, Ajepako, Oyibo, Kolo, Gbas Gbos,
      Pepper Dem, Sabi, Nawa, Chai, How Far, Na Wa O, Dey Play, Hustle, Aje, Ehen, Odogwu, Baddest, Jaga Jaga, Shakara,
      Ogbonge, Awoof, Gbese, Kata Kata, Wayo, Tokunbo, Sharp Sharp, No Wahala
    `),
  },
  {
    id: 'movies',
    name: 'Movies and Shows',
    blurb: 'Nollywood films and Naija TV.',
    bg: '#9D2C6B',
    fg: '#FFFFFF',
    words: list(`
      Living in Bondage, The Wedding Party, King of Boys, Lionheart, Chief Daddy, Jenifa, Omo Ghetto, Anikulapo,
      Gangs of Lagos, Brotherhood, A Tribe Called Judah, Blood Sisters, Osuofia in London, Big Brother Naija,
      Papa Ajasco, Basi and Company, The New Masquerade, Tinsel, Sons of the Caliphate, Half of a Yellow Sun,
      October 1, Merry Men, Phone Swap, Mirror Boy, Alakada, The Johnsons, Isoken, 93 Days, Jagun Jagun, Citation,
      Elesin Oba, Ije
    `),
  },
  {
    id: 'songs',
    name: 'Songs',
    blurb: 'Naija hits. Hum it, describe it, act it out.',
    bg: '#0F766E',
    fg: '#FFFFFF',
    words: list(`
      Essence, Last Last, Calm Down, Ku Lo Sa, Soco, Ginger, Joro, Fall, Unavailable, Peru, Love Nwantiti, Buga, Rush,
      Free Mind, Monalisa, Organise, Terminator, Sungba, Ojuelegba, Pana, Shoki, Shaku Shaku, Skelewu, Dorobucci,
      Oleku, Johnny, African Queen, Woju, Jealous, Mad Over You, Joha, Lonely at the Top, City Boys, Common Person,
      Bloody Samaritan, Eminado, Kele Kele Love
    `),
  },
];

export const MIX: Deck = {
  id: 'mix',
  name: 'Everything',
  blurb: 'A bit of every deck.',
  bg: '#151208',
  fg: '#FFFFFF',
  words: list(DECKS.map((d) => d.words.join(',')).join(',')),
};

export const ALL_DECKS: Deck[] = [...DECKS, MIX];

export function deckById(id: string): Deck {
  return ALL_DECKS.find((d) => d.id === id) ?? DECKS[0];
}

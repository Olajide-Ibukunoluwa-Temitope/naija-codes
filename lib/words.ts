// Word packs. To add or remove words, edit the lists below. Commas separate words.
// Keep single words to 9 letters or fewer so they fit on a card on small phones.
// Everyone playing must use the same deployed version, or the boards will not match.

export function parseWords(str: string): string[] {
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

export const NAIJA = parseWords(`
  Jollof, Suya, Amala, Ewedu, Gbegiri, Egusi, Akara, Moin Moin, Puff Puff, Chin Chin, Ofada, Pounded Yam, Garri, Eba, Fufu,
  Ogbono, Okra, Nkwobi, Asun, Boli, Dodo, Zobo, Kunu, Palm Wine, Chapman, Agege Bread, Shawarma, Meat Pie, Pepper Soup,
  Mama Put, Bukka, Beans, Kilishi, Tuwo, Stew, Gala, Pure Water, Noodles, Ata Rodo, Crayfish, Kola Nut, Cassava, Groundnut,
  Coconut, Sugarcane, Pawpaw, Agbalumo, Fried Rice, Fish Roll, Doughnut, Cashew, Cocoa, Ogi, Akamu, Abacha, Afang, Oha,
  Ayamase, Ikokore, Masa, Fura, Kuli Kuli, Ogogoro, Burukutu, Okpa, Ewa Agoyin, Efo Riro, Isi Ewu, Ponmo, Banga, Edikang Ikong,
  Lagos, Abuja, Kano, Ibadan, Enugu, Calabar, Jos, Warri, Owerri, Kaduna, Abeokuta, Ilorin, Akure, Uyo, Badagry, Lekki, Ikeja,
  Yaba, Surulere, Ikoyi, Ajah, Oshodi, Obalende, Mushin, Third Mainland, Eko Bridge, Computer Village, Balogun, Tarkwa Bay,
  Olumo Rock, Zuma Rock, Niger, Lagoon, Festac, Marina, Victoria Island, Port Harcourt, Delta, Aba, Onitsha, Sokoto, Asaba,
  Ife, Ikorodu, Epe, Apapa, Ketu, Mile 12, Ojuelegba, Ajegunle, Benin City, Yankari, Obudu, Idanre, Erin Ijesha, Bar Beach,
  Freedom Park,
  Danfo, Okada, Keke, Molue, BRT, Go Slow, Traffic, Conductor, Agbero, Bus Stop, Generator, NEPA, Prepaid, Inverter, Borehole,
  Tanker, Petrol, Queue, Junction, Toll Gate, Flyover, Ferry, Jetty, Pothole, Gutter, Estate, Gateman, Landlord, Agent, Rent,
  Hustle, POS, Naira, Kobo, Transfer, Alert, Sapa, Japa, Wahala, Gist, Oga, Abeg, Pidgin, Chop, Vex, Shege, Yawa, Vibes,
  Ginger, Kiosk, Market, Mallam, Okirika, Bolekaja, Area Boy, Tokunbo, Ajebutter, Jara, Wetin, Sabi, Biko, Bureau, Dollar,
  Sachet, Omo Onile, LASTMA, Burglar Proof, Zinc, Mosquito Net,
  Owambe, Aso Ebi, Gele, Agbada, Ankara, Adire, Aso Oke, Buba, Fila, Wrapper, Beads, Spray, Detty December, Naming Ceremony,
  Wedding, Talking Drum, Dundun, Shekere, Calabash, Mortar, Pestle, Cutlass, Bucket, Mat, Stool, Slippers, Kerosene, Lantern,
  Fan, Umbrella, Tailor, Barber, Salon, Braids, Wig, Perfume, Coral, Durbar, Carnival, Mask, Raffia, Egungun, Eyo, Nok, Oba,
  Chief, Kaftan, Lace, Isiagu, Gangan, Bata, Udu, New Yam,
  Afrobeats, Nollywood, Highlife, Fuji, Juju, Apala, Amapiano, Gbedu, DJ, Concert, Playlist, Skit, Comedy, Soap Opera,
  Reality TV, Shaku Shaku, Zanku, Football, Super Eagles, Falcons, Jersey, Penalty, Referee, Stadium, Ludo, Whot, Ayo,
  Betting, Radio, Drummer, Choir, Gospel, Alte,
  JAMB, WAEC, NYSC, Corper, Hostel, Lecturer, Strike, Campus, Uniform, Assembly, Prefect, Exams, Common Entrance, Bursary,
  Airtime, Recharge,
  Harmattan, Baobab, Rain, Savannah, Mangrove, Goat, Ram, Chicken, Snail, Agama, Cow,
  Christmas, Sallah, Easter, Vigil, Church, Mosque, Crusade, Harvest
`);

export const CLASSIC = parseWords(`
  Anchor, Apple, Arrow, Attic, Axe, Badge, Bakery, Balloon, Banana, Barrel, Basket, Beach, Beard, Bench, Bicycle, Bishop,
  Blanket, Boat, Bottle, Bowl, Brain, Branch, Brick, Bridge, Broom, Bubble, Bucket, Cabin, Cactus, Camel, Camera, Candle,
  Canyon, Captain, Carpet, Castle, Cave, Chair, Cheese, Cherry, Chimney, Circus, Clock, Cloud, Clown, Coast, Comet, Compass,
  Cookie, Cork, Cowboy, Crab, Crane, Crystal, Curtain, Desert, Diamond, Dragon, Dream, Drill, Eagle, Engine, Fabric, Factory,
  Feather, Fence, Flute, Forest, Fountain, Fox, Garden, Giant, Glacier, Glove, Guitar, Hammer, Harbor, Helmet, Hero, Hotel,
  Jacket, Jungle, Kettle, Kitchen, Kite, Knight, Ladder, Lantern, Lemon, Library, Magnet, Mammoth, Marble, Medal, Meteor,
  Mirror, Monster, Mountain, Museum, Mustard, Needle, Notebook, Ocean, Orange, Painter, Palace, Pancake, Parade, Passport,
  Pebble, Penguin, Pepper, Piano, Pilot, Pirate, Planet, Pocket, Pottery, Pyramid, Rabbit, Radar, Rainbow, Ribbon, Robot,
  Rocket, Saddle, Sailor, Sandwich, Scarf, School, Scooter, Shield, Skeleton, Soldier, Spider, Statue, Sunrise, Sword,
  Temple, Theater, Ticket, Tiger, Tornado, Tractor, Trumpet, Tunnel, Turtle, Valley, Vampire, Violin, Volcano, Wagon, Whale,
  Window, Wizard, Zebra, Zipper, Crown, Bell, Moon, Sun, Star, River, Gold, Silver, Copper, Chain, Fire, Smoke, Shadow,
  Whistle, Thunder, Rope, Lock, Key, Bank, Ghost, Agent, Spy, Code, Net, Ship, Train, Plane, Truck, Island, Ice, Snow, Storm,
  Bat, Bear, Bolt, Boot, Bark, Beat, Bond, Bow, Box, Bug, Cap, Card, Cast, Cell, Check, Club, Comb, Cook, Date, Dice, Dive,
  Draft, Dress, Duck, Fair, Fall, Field, File, Film, Fish, Flat, Fly, Game, Gas, Hawk, Horn, Jam, Jet, Judge, Lab, Lead,
  Leaf, Light, Line, Link, Lion, Log, Mail, Match, Mint, Mole, Mouse, Nail, Nurse, Nut, Oil, Pad, Pan, Park, Pass, Pen,
  Pit, Pool, Press, Pump, Punch, Queen, Quiz, Race, Ray, Ring, Roll, Root, Row, Rush, Salt, Sand, Saw, Seal, Shot, Sink,
  Slip, Sock, Soul, Spring, Staff, Stamp, Stick, Stock, Strike, Suit, Swing, Tag, Tap, Tick, Tie, Tooth, Track, Trip, Wave,
  Web, Well, Wind, Wing, Witch, Worm
`);

export type PackKey = 'N' | 'M' | 'C';

export const PACKS: Record<PackKey, { name: string; blurb: string; words: string[] }> = {
  N: { name: 'Naija', blurb: 'Only Nigerian words.', words: NAIJA },
  M: { name: 'Mixed', blurb: 'Nigerian and everyday words together.', words: parseWords(NAIJA.concat(CLASSIC).join(',')) },
  C: { name: 'Classic', blurb: 'Everyday English words.', words: CLASSIC },
};

export const PACK_ORDER: PackKey[] = ['N', 'M', 'C'];

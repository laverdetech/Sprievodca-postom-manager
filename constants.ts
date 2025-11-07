import { Protocol, Frequency, DayOfWeek } from './types';

export const PROTOCOLS: Protocol[] = [12, 16, 24, 36, 48, 72];

export const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'daily', label: 'Denne' },
  { value: 'everyOtherDay', label: 'Každý druhý deň' },
  { value: 'weekly', label: 'Raz týždenne (v pondelok)' },
  { value: 'custom', label: 'Vlastné dni' },
];

export const DAYS_OF_WEEK: DayOfWeek[] = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'];

export const GOALS: Record<Protocol, string> = {
  12: 'Podpora cirkadiánneho rytmu',
  16: 'Zlepšenie inzulínovej citlivosti',
  24: 'Aktivácia autofágie a bunkovej opravy',
  36: 'Hlboký metabolický reštart',
  48: 'Intenzívna regenerácia buniek',
  72: 'Maximálna autofágia a reset imunity',
};

export const PROTOCOL_GUIDES: Record<Protocol, { emoji: string; title: string; description: string; }[]> = {
  12: [
    { emoji: '☀️', title: 'Ranné Zosúladenie', description: 'Vaše telo sa prebúdza a očakáva svetlo. Hydratácia je kľúčová. Pôst končí skoro, zamerajte sa na ľahké a výživné prvé jedlo.' },
    { emoji: '🍽️', title: 'Jedálenské Okno', description: 'Počas 12-hodinového okna konzumujte vyvážené jedlá. Tento režim skvele podporuje prirodzený cirkadiánny rytmus.' },
    { emoji: '🌙', title: 'Večerný Útlm', description: 'Pôst začína s večerom. Telo sa prepína na trávenie a prípravu na nočnú regeneráciu. Vyhnite sa neskorým jedlám.' },
    { emoji: '😴', title: 'Nočná Regenerácia', description: 'Počas spánku telo dokončuje trávenie a začína s opravnými procesmi. 12-hodinový pôst mu na to dáva dostatok času.' }
  ],
  16: [
    { emoji: '☀️', title: 'Ranná Aktivácia Tuku', description: 'Telo vyčerpalo zásoby glykogénu a začína efektívne spaľovať tuk. Ranná káva (bez cukru/mlieka) môže tento proces podporiť.' },
    { emoji: '🧠', title: 'Mentálna Jasnosť', description: 'Počas dopoludnia môžete cítiť zvýšenú sústredenosť. Telo produkuje ketóny, ktoré sú skvelým palivom pre mozog.' },
    { emoji: '🍽️', title: 'Prerušenie Pôstu', description: 'Prvé jedlo by malo byť bohaté na bielkoviny a zdravé tuky, aby sa stabilizovala hladina cukru v krvi. Vyhnite sa ultra-spracovaným jedlám.' },
    { emoji: '💪', title: 'Anabolické Okno', description: 'Počas 8-hodinového jedálenského okna doplňte všetky potrebné živiny. Ideálny čas na silový tréning je pred prvým jedlom alebo počas okna.' }
  ],
  24: [
    { emoji: '🔥', title: 'Štart Autofágie', description: 'Okolo 18-24 hodiny sa vo vašom tele naplno rozbieha autofágia - proces "upratovania" a recyklácie poškodených buniek.' },
    { emoji: '💧', title: 'Hydratácia a Elektrolyty', description: 'Celodenný pôst si vyžaduje zvýšenú pozornosť na hydratáciu. Pridajte štipku soli do vody na doplnenie elektrolytov.' },
    { emoji: '🧘', title: 'Pokoj a Sústredenie', description: 'Telo šetrí energiu. Vyhnite sa intenzívnemu cvičeniu. Meditácia alebo ľahká prechádzka sú ideálne aktivity.' },
    { emoji: '🍲', title: 'Opatrné Ukončenie', description: 'Prerušte pôst malým, ľahko stráviteľným jedlom, ako je kostný vývar alebo malá porcia dusenej zeleniny. Veľké jedlo by mohlo zaťažiť trávenie.' }
  ],
  36: [
    { emoji: '🚀', title: 'Hlboký Reštart', description: 'Po 24 hodinách sa benefity prehlbujú. Autofágia je na vrchole a produkcia rastového hormónu (HGH) stúpa, čo podporuje opravu tkanív.' },
    { emoji: '⚡', title: 'Manažment Energie', description: 'Môžete pociťovať vlny energie a únavy. Počúvajte svoje telo a odpočívajte, keď je to potrebné. Elektrolyty sú kľúčové.' },
    { emoji: '😴', title: 'Kvalitný Spánok', description: 'Prvá noc pôstu je za vami. Počas druhej noci sa telo zameriava na hĺbkovú regeneráciu bez zaťaženia trávením.' },
    { emoji: '🥑', title: 'Nutričné Zotavenie', description: 'Po 36 hodinách je dôležité pomaly a premyslene doplniť živiny. Začnite vývarom, potom pridajte avokádo alebo varené vajíčko.' }
  ],
  48: [
    { emoji: '🧬', title: 'Bunková Regenerácia', description: 'Telo môže začať aktivovať kmeňové bunky na opravu a tvorbu nových, zdravých buniek. Výrazne sa znižujú zápalové procesy.' },
    { emoji: '📉', title: 'Reset Inzulínu', description: 'Inzulínová citlivosť sa dramaticky zlepšuje. Telo sa učí fungovať extrémne efektívne na tukovom metabolizme.' },
    { emoji: '🧠', title: 'Výzva pre Myseľ', description: 'Druhý deň môže byť psychicky náročný. Sústreďte sa na svoj cieľ a odmeňte sa pocitom disciplíny a kontroly.' },
    { emoji: '🥣', title: 'Plán Ukončenia', description: 'Plánovanie prerušenia je kritické. Pripravte si niekoľko malých, na živiny bohatých jedál, ktoré budete konzumovať postupne v priebehu niekoľkých hodín.' }
  ],
  72: [
    { emoji: '🛡️', title: 'Reset Imunity', description: 'Po 72 hodinách dochádza k významnej recyklácii starých imunitných buniek a tvorbe nových. Tento proces môže posilniť celý imunitný systém.' },
    { emoji: '🧘‍♂️', title: 'Stav Hlbokej Ketózy', description: 'Vaše telo a mozog fungujú výhradne na ketónoch. Mnohí ľudia v tejto fáze zažívajú stav extrémnej mentálnej čistoty a pokoja.' },
    { emoji: '⚠️', title: 'Dohľad a Bezpečnosť', description: 'Takto dlhý pôst by sa mal vykonávať len so skúsenosťami a ideálne po konzultácii s lekárom. Dôsledne sledujte signály svojho tela.' },
    { emoji: '🥗', title: 'Pomalý Návrat', description: 'Návrat k jedlu musí byť veľmi postupný, môže trvať aj niekoľko dní. Začnite tekutinami, pokračujte mäkkou stravou a postupne pridávajte komplexnejšie jedlá.' }
  ]
};

export const FASTING_STAGES: { minHours: number; stage: string; tip: string; process: string; feeling: string; }[] = [
  { minHours: 0, stage: "Trávenie", tip: "Telo trávi jedlo. Stúpa inzulín, bunky prijímajú glukózu na energiu.", process: "Vaše telo aktívne trávi posledné jedlo. Hladina inzulínu stúpa, aby bunky mohli prijať glukózu (cukor) z krvi a využiť ju ako okamžitú energiu.", feeling: "Cítite sa sýti a plní energie. Váš tráviaci systém aktívne pracuje." },
  { minHours: 2, stage: "Ukladanie", tip: "Prebytočná glukóza sa ukladá v pečeni a svaloch ako glykogén.", process: "Prebytočná glukóza, ktorá sa nespotrebovala, sa teraz ukladá vo forme glykogénu v pečeni a svaloch. Sú to vaše krátkodobé zásoby energie.", feeling: "Pocit sýtosti pretrváva. Hladina hormónu hladu (grelínu) je nízka, zatiaľ čo hormón sýtosti (leptín) je aktívny." },
  { minHours: 4, stage: "Útlm", tip: "Cukor a inzulín klesajú. Telo začína čerpať energiu z glykogénu.", process: "Hladina cukru v krvi a inzulínu začína klesať. Telo prechádza do katabolickej fázy a začína čerpať energiu z uloženého glykogénu v pečeni.", feeling: "Môžete pocítiť prvé náznaky hladu. Je to normálny hormonálny signál, že sa vaše telo pripravuje na zmenu paliva. Žalúdok je už prázdny." },
  { minHours: 6, stage: "Mobilizácia", tip: "Glukagón uvoľňuje uloženú glukózu z pečene pre stabilnú energiu.", process: "Pankreas uvoľňuje hormón glukagón, ktorý signalizuje pečeni, aby uvoľňovala uloženú glukózu do krvi a udržiavala tak stabilnú energiu.", feeling: "Pocity hladu sa môžu objavovať vo vlnách, často v čase, keď ste zvyknutí jesť. Skúste sa napiť vody alebo nesladeného čaju." },
  { minHours: 8, stage: "Adaptácia", tip: "Zásoby glykogénu klesajú. Telo sa pripravuje na spaľovanie tukov.", process: "Zásoby glykogénu v pečeni sa výrazne znižujú. Telo to vníma ako signál, že sa blíži zmena paliva a začína sa pripravovať na využívanie tukov.", feeling: "Môžete pociťovať silnejší hlad. Je to naučená hormonálna odpoveď vášho tela, ktoré je zvyknuté na pravidelný prísun jedla. Vydržte, je to len dočasné." },
  { minHours: 10, stage: "Prechod", tip: "Glykogén je vyčerpaný. Telo prechádza na tuky, stúpa rastový hormón (HGH).", process: "Zásoby glykogénu sú takmer vyčerpané. Telo spúšťa \"metabolický prechod\" a začína mobilizovať tukové zásoby. Zvyšuje sa hladina rastového hormónu (HGH) na ochranu svalov.", feeling: "Hlad sa môže zmierniť. Vaše telo sa učí používať nový, efektívnejší zdroj energie. Môžete pocítiť mierny pokles energie, ktorý je dočasný." },
  { minHours: 12, stage: "Ketogenéza", tip: "Pečeň premieňa tuky na ketóny, začína kľúčové spaľovanie tukov.", process: "Pečeň začína premieňať tuky na malé energetické molekuly nazývané ketóny. Tento proces sa nazýva ketogenéza a je kľúčom k spaľovaniu tukov.", feeling: "Najintenzívnejší hlad by mal ustupovať. Telo sa adaptuje na nový zdroj paliva. Udržujte dostatočnú hydratáciu." },
  { minHours: 14, stage: "Spaľovanie", tip: "Vitajte v ketóze! Tuk sa mení na super-palivo – ketóny. HGH ďalej stúpa.", process: "Vitajte v ketóze! Vaše telo teraz aktívne premieňa tuk na ketóny, super-palivo pre váš mozog a telo. Hladina HGH naďalej stúpa.", feeling: "Mnohí ľudia pociťujú nárast mentálnej jasnosti a sústredenia. Hlad je výrazne potlačený." },
  { minHours: 16, stage: "Očista", tip: "Naplno beží ketóza aj autofágia (bunkové upratovanie a recyklácia).", process: "Ketóza je v plnom prúde. Súbežne sa naplno rozbieha aj autofágia – proces, pri ktorom vaše bunky 'upratujú' a recyklujú svoje poškodené časti. Je to hĺbková regenerácia na bunkovej úrovni.", feeling: "Pocit hladu by mal byť minimálny. Mnohí v tejto fáze zažívajú nárast mentálnej energie a lepšie sústredenie vďaka ketónom, ktoré vyživujú mozog." },
  { minHours: 18, stage: "Oprava", tip: "Intenzívna autofágia opravuje poškodené bunky a znižuje zápaly.", process: "Proces autofágie sa zintenzívňuje. Telo sa zameriava na opravu poškodených buniek a znižovanie zápalových procesov.", feeling: "Môžete sa cítiť ľahko a energicky. Telo je v režime hĺbkovej opravy. Apetít je zvyčajne veľmi nízky." },
  { minHours: 20, stage: "Optimalizácia", tip: "Hlboká ketóza. Vysoký HGH chráni svaly a zrýchľuje metabolizmus.", process: "Ste v hlbokej ketóze. Zásoby glykogénu sú vyčerpané. Hladina HGH je výrazne zvýšená, čo chráni svaly a optimalizuje metabolizmus. Autofágia pokračuje.", feeling: "Stabilná energia bez výkyvov. Tento stav je často opisovaný ako pocit \"ľahkosti a bystrosti\"." },
  { minHours: 24, stage: "Prehĺbenie", tip: "Bunková oprava na maximum. Tuky a ketóny sú hlavným palivom.", process: "Bunková oprava pokračuje na plné obrátky. Vaše telo efektívne využíva tukové zásoby a ketóny ako hlavný zdroj energie pre všetky orgány vrátane mozgu.", feeling: "Mentálna jasnosť a sústredenie sú často na vysoké úrovni. Fyzická energia môže byť stabilná, ale nie je určená na extrémne výkony." },
  { minHours: 28, stage: "Maximum HGH", tip: "Vrcholí hladina rastového hormónu, kľúčového pre ochranu svalov.", process: "Hladina rastového hormónu (HGH) sa blíži k svojmu vrcholu. Tento hormón je kľúčový pre ochranu svalovej hmoty a podporu spaľovania tukov.", feeling: "Pocit hladu je takmer neprítomný. Môžete pociťovať stav pokoja a pohody." },
  { minHours: 32, stage: "Autofágia", tip: "Vrcholí bunková recyklácia (+300 %). Telo odstraňuje poškodené bunky.", process: "Dosahujete vrchol autofágie! Tento proces bunkovej recyklácie je teraz až o 300 % intenzívnejší. Vaše telo odstraňuje poškodené bunky, čo je kľúčové pre dlhovekosť.", feeling: "Cítite sa mentálne ostrí a pokojní. Hlad je zvyčajne úplne neprítomný. Vaše telo vykonáva generálne upratovanie." },
  { minHours: 36, stage: "Udržiavanie", tip: "Stále vysoká úroveň autofágie pokračuje v hĺbkovej očiste tela.", process: "Autofágia zostáva na veľmi vysokej úrovni. Telo pokračuje v hĺbkovej očiste a recyklácii bunkového odpadu, čo prispieva k prevencii chorôb.", feeling: "Stav mentálnej jasnosti pretrváva. Telo je plne adaptované na fungovanie na tukoch." },
  { minHours: 42, stage: "Regenerácia", tip: "Maximum HGH (až 5x). Začína sa obnova imunity a odstraňovanie starých buniek.", process: "Hladina rastového hormónu (HGH) vrcholí, môže byť až 5-násobne vyššia. Začína sa proces obnovy imunitného systému odstraňovaním starých buniek.", feeling: "Vaše telo je v stave hlbokej regenerácie. Doprajte si odpočinok a dostatok tekutín. Fyzická aktivita by mala byť minimálna." },
  { minHours: 48, stage: "Aktivácia", tip: "Kmeňové bunky sa aktivujú a pripravujú na sebaobnovu.", process: "Pokles hladiny rastového faktora IGF-1 signalizuje kmeňovým bunkám v kostnej dreni, aby sa prepli z \"režimu spánku\" do stavu aktívnej sebaobnovy.", feeling: "Toto je fáza hlbokých, tichých procesov. Sústreďte sa na pokoj, hydratáciu a ľahký pohyb, ako je prechádzka." },
  { minHours: 54, stage: "Príprava", tip: "Telo čistí priestor od starých imunitných buniek pre nové.", process: "Kmeňové bunky sa pripravujú na regeneráciu. Telo pokračuje v odstraňovaní starých imunitných buniek, čím vytvára priestor pre nové a silnejšie.", feeling: "Môžete sa cítiť pokojne a vyrovnane. Telo vykonáva zásadné procesy na najhlbšej úrovni." },
  { minHours: 60, stage: "Očista Imunity", tip: "Odstraňovanie poškodených imunitných buniek je na maxime.", process: "Proces odstraňovania starých a poškodených imunitných buniek sa maximalizuje. Telo sa pripravuje na kompletný \"reštart\" imunitného systému.", feeling: "Je dôležité odpočívať a umožniť týmto procesom nerušene prebiehať." },
  { minHours: 66, stage: "Reset", tip: "Imunitný systém je pripravený na kompletný reštart a obnovu.", process: "Dosiahli ste kľúčový míľnik. Staré imunitné bunky sú odstránené a kmeňové bunky sú pripravené na vytvorenie nového, silnejšieho imunitného systému po najedení.", feeling: "Cítite hrdosť a úspech. Pripravte sa na fázu obnovy – bezpečné a postupné ukončenie pôstu je rovnako dôležité ako pôst samotný." }
];
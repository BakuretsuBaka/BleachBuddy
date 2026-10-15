// Built-in filter-list catalog.
//
// Structure: topics -> lists. Every list has a kind ("keywords", "studios" or "performers"),
// a default on/off state and an array of items. Items are matched case-insensitively and
// accent-insensitively; keyword lists contain terms in many languages.
//
// Sources: Wikipedia (performer/studio lists, AVN and Urban X award pages) plus hand-written
// vocabulary. Translations are best effort and not reviewed by native speakers, so expect
// gaps and the occasional miss. Only stage names and brand names are listed for people.
// To add a list, append an object to a topic's `lists` array.

const KWF_CATALOG = [
  // ───────────────────────────────────────────────────────────── Interracial & Black
  {
    id: "interracial-black",
    name: "Interracial & Black",
    description: "Interracial pairings and acronyms, Black / Ebony vocabulary, studios and performers.",
    lists: [
      {
        id: "ib-interracial",
        name: "Interracial: terms & acronyms",
        kind: "keywords",
        boorus: ["interracial", "interracial_sex", "interracial_yuri", "interracial_couple", "interracial_fellatio", "interracial_yaoi", "interracial_anal"],
        description: "The word 'interracial' in many languages plus common pairing acronyms.",
        items: [
          // English and shared acronyms
          "Interracial", "Inter-racial", "Inter racial", "Mixed race", "BBC", "BWC", "BMWF", "WFBM", "WMBF",
          "BWWM", "Big Black Cock", "Black on White",
          // de
          "Interrassisch", "Gemischtrassig",
          // es / fr / it / pt / nl / sv
          "Interracial", "Interracialer", "Interrazziale", "Interraciaal", "Interrasowy", "Interracial",
          // pl
          "Międzyrasowy", "Międzyrasowe", "Międzyrasowa",
          // ru
          "Межрасовый", "Межрасовая", "Межрасовое", "Межрасовые",
          // tr
          "Irklararası", "Irklar arası",
          // ja
          "異人種", "異人種間", "インターレイシャル",
          // zh
          "跨种族", "跨種族", "异族", "異族",
          // ko
          "인종간", "인터레이셜",
          // th
          "ต่างเชื้อชาติ",
          // ar
          "بين الأعراق"
        ]
      },
      {
        id: "ib-black",
        name: "Black / Ebony: keywords",
        kind: "keywords",
        boorus: ["dark_skin", "dark-skinned_male", "dark-skinned_female", "dark-skinned_futa", "dark_penis", "black_body", "ebony", "black_skin", "black_cock"],
        description: "Black, Ebony, African and equivalents in many languages. Broad: 'Black' alone also hits non-adult uses.",
        items: [
          // en
          "Black", "Blacked", "Ebony", "African", "Nubian", "Afro", "Black girl", "Black guy", "Black woman",
          // de
          "Schwarze", "Schwarzer", "Schwarzen", "Afrikanerin", "Afrikaner", "Afrikanisch", "Afrikanische",
          "Dunkelhäutig", "Dunkelhäutige",
          // es
          "Negra", "Negras", "Negro", "Negros", "Ébano", "Africana", "Africano", "Africanas",
          // fr
          "Noire", "Noires", "Ébène", "Africaine", "Africaines", "Africain",
          // it
          "Nera", "Nere", "Nero", "Neri", "Ebano", "Africane",
          // pt
          "Preta", "Pretas", "Preto", "Pretos", "Africanas",
          // nl
          "Zwart", "Zwarte", "Afrikaanse", "Afrikaans",
          // ru
          "Чёрная", "Черная", "Чёрные", "Черные", "Негр", "Негры", "Негритянка", "Африканка", "Африканская",
          "Чернокожая", "Чернокожий", "Эбони",
          // pl
          "Czarna", "Czarne", "Murzynka", "Murzyn", "Afrykańska", "Czarnoskóra",
          // tr
          "Siyah", "Zenci", "Afrikalı",
          // ja
          "黒人", "アフリカ系", "エボニー", "ブラック",
          // zh
          "黑人", "黑妹", "非洲", "非裔",
          // ko
          "흑인", "아프리카", "에보니",
          // th
          "คนผิวดำ", "แอฟริกัน",
          // ar
          "سوداء", "أسود", "أفريقية",
          // id
          "Hitam"
        ]
      },
      {
        id: "ib-studios",
        name: "Interracial & Black: studios",
        kind: "studios",
        description: "Studios and sites focused on interracial or Black-performer content.",
        items: [
          "Blacked", "Blacked Raw", "BlackedRaw", "Black Spark", "Dogfart", "Dogfart Network",
          "Interracial Pass", "Blacks On Blondes", "Black Valley Girls"
        ]
      },
      {
        id: "ib-performers",
        name: "Black performers",
        kind: "performers",
        description: "Stage names of well-known Black performers (partial, from award pages and general knowledge).",
        items: [
          "Ana Foxxx", "Misty Stone", "Jada Fire", "Skin Diamond", "Nyomi Banxxx", "Marie Luv", "Capri Styles",
          "Kapri Styles", "Roxy Reynolds", "Imani Rose", "Lacey Duvalle", "Mya Nichole", "Cherokee D'Ass",
          "Sinnamon Love", "Jeannie Pepper", "Diamond Jackson", "Ayana Angel", "Sydnee Capri", "Carmen Hayes",
          "Ebony Ayes", "Daya Knight", "Kira Noir", "Osa Lovely", "Candice Nicole", "Ebony Mystique",
          "Layton Benton", "Crystal Clear", "Lexington Steele", "Mr. Marcus", "Prince Yashua", "Rico Strong",
          "Flash Brown", "Byron Long", "Brian Pumper", "Mr. Pete", "Justin Long", "Miles Long", "Isiah Maxwell",
          "Shane Diesel", "Sean Michaels", "Wesley Pipes", "Tyler Knight", "T.J. Cummings", "D-Snub",
          "Richard Mann"
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────── Asian
  {
    id: "asian",
    name: "Asian",
    description: "Asian vocabulary in many languages, pairing acronyms, nationalities, studios and performers.",
    lists: [
      {
        id: "as-terms",
        name: "Asian: keywords",
        kind: "keywords",
        boorus: ["asian", "asian_female", "asian_male", "asian_futa"],
        description: "'Asian' and related words in many languages, plus JAV.",
        items: [
          // en
          "Asian", "Asians", "Asia", "Oriental", "Asiatic", "JAV", "Jav uncensored",
          // de
          "Asiatisch", "Asiatin", "Asiatinnen", "Asiatische", "Asiate",
          // es / pt / it / fr
          "Asiática", "Asiático", "Asiaticas", "Asiatica", "Asiatico", "Asiatique", "Asiatiques",
          // nl
          "Aziatische", "Aziatisch", "Aziatische vrouw",
          // ru
          "Азиатка", "Азиатки", "Азиатская", "Азиатский", "Азиаты",
          // pl
          "Azjatka", "Azjatki", "Azjatycka",
          // tr
          "Asyalı", "Uzak Doğulu",
          // ja
          "アジア", "アジア人", "アジア系", "東洋人",
          // zh
          "亚洲", "亞洲", "亚洲人", "亞洲人",
          // ko
          "아시아", "아시안", "동양인",
          // th
          "เอเชีย",
          // ar
          "آسيوية", "آسيوي"
        ]
      },
      {
        id: "as-pairings",
        name: "Asian: pairing acronyms",
        kind: "keywords",
        description: "WMAF, AMWF, AFWM, WFAM and similar.",
        items: ["WMAF", "AMWF", "AFWM", "WFAM", "AMBF", "BMAF"]
      },
      {
        id: "as-nationalities",
        name: "Asian: nationalities (broad)",
        kind: "keywords",
        boorus: ["japanese_female", "japanese_male", "chinese_female", "chinese_male", "korean_female", "korean_male", "thai", "vietnamese", "filipina", "taiwanese", "indonesian"],
        description: "East and Southeast Asian nationality words in many languages. Off by default because it is broad.",
        default: false,
        items: [
          // en
          "Japanese", "Korean", "Chinese", "Thai", "Filipina", "Vietnamese", "Indonesian", "Malaysian",
          "Taiwanese", "Cambodian",
          // de
          "Japanerin", "Japanisch", "Chinesin", "Chinesisch", "Koreanerin", "Koreanisch", "Thailänderin",
          "Vietnamesin",
          // es
          "Japonesa", "Coreana", "Tailandesa", "Filipina", "Vietnamita", "Chinita",
          // fr
          "Japonaise", "Chinoise", "Coréenne", "Thaïlandaise", "Vietnamienne",
          // it
          "Giapponese", "Cinese", "Thailandese", "Filippina",
          // pt
          "Chinesa", "Japonesinha",
          // nl
          "Japanse", "Chinese", "Koreaanse", "Thaise",
          // ru
          "Японка", "Японские", "Китаянка", "Китайская", "Кореянка", "Корейская", "Тайка", "Вьетнамка",
          "Филиппинка",
          // pl
          "Japonka", "Chinka", "Koreanka", "Tajka", "Wietnamka",
          // ja
          "日本人", "中国人", "韓国人", "台湾人", "タイ人", "フィリピン人",
          // zh
          "日本人", "中国人", "韩国人", "韓國人", "泰国人", "泰國人", "越南人", "菲律宾人",
          // ko
          "일본인", "중국인", "한국인", "태국인", "베트남인",
          // th
          "สาวญี่ปุ่น", "สาวเกาหลี", "สาวจีน"
        ]
      },
      {
        id: "as-southasian",
        name: "South Asian: keywords",
        kind: "keywords",
        boorus: ["indian", "desi", "south_asian"],
        description: "Desi, Indian and related regional words. Off by default because it is broad.",
        default: false,
        items: [
          "Desi", "Indian", "Bhabhi", "Mallu", "Tamil", "Telugu", "Punjabi", "Pakistani", "Bengali", "Hindi",
          "देसी", "भाभी", "भारतीय"
        ]
      },
      {
        id: "as-studios",
        name: "Asian: studios",
        kind: "studios",
        description: "Japanese AV studios and labels (Latin and native script) plus a few Western sites.",
        items: [
          "Alice Japan", "Atlas21", "CineMagic", "Crystal-Eizou", "Glory Quest", "Hokuto Corporation",
          "IdeaPocket", "Idea Pocket", "Japan Home Video", "KM Produce", "Kuki Inc", "Million Film", "Moodyz",
          "Muteki", "S1 No. 1 Style", "Soft On Demand", "Total Media Agency", "Try-Heart", "Wanz Factory",
          "Tokyo Hot", "Tokyo-Hot", "Caribbeancom", "1Pondo", "Heyzo", "Pacopacomama", "Muramura", "10musume",
          "Kin8tengoku", "Asian Sex Diary",
          "ムーディーズ", "アイデアポケット", "ソフト・オン・デマンド", "エスワン", "一本道", "カリビアンコム",
          "パコパコママ", "天然むすめ"
        ]
      },
      {
        id: "as-performers",
        name: "Asian performers",
        kind: "performers",
        description: "Stage names of well-known Asian performers, including Japanese names in native script (partial).",
        items: [
          "Asa Akira", "Asia Carrera", "Kobe Tai", "Linda Wong", "Katsuni", "Jessica Bangkok", "Annie Cruz",
          "Jade Marcela", "Tera Patrick", "Mika Tan", "Kalina Ryu", "Alina Li", "Vina Sky", "Lulu Chu",
          "Marica Hase", "Kimmy Kimm", "Maria Ozawa", "Sora Aoi", "Yui Hatano", "Eimi Fukada", "Ai Uehara",
          "Saori Hara", "Rin Sakuragi", "Julia Boin", "Miku Ohashi", "Akiho Yoshizawa", "Saki Kozai",
          "Kaoru Kuroki", "An Nanba", "Alala Kurosawa", "Ganari Takahashi",
          "蒼井そら", "波多野結衣", "深田えいみ", "上原亜衣", "原紗央莉", "吉沢明歩", "大橋未久",
          "小澤マリア", "小沢マリア"
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────── Trans
  {
    id: "trans",
    name: "Trans",
    description: "Trans vocabulary in many languages (neutral terms and slang kept separate), studios and performers.",
    lists: [
      {
        id: "tr-terms",
        name: "Trans: neutral terms",
        kind: "keywords",
        boorus: ["transgender", "transgender_woman", "transgender_male", "trans_woman", "trans_man", "trans_girl", "transfem"],
        description: "Trans, transgender, transsexual and equivalents in many languages.",
        items: [
          // en
          "Trans", "Transgender", "Transsexual", "Transexual", "Trans woman", "Trans women", "Trans girl",
          "Transwoman", "Tgirl", "T-Girl",
          // de
          "Transsexuelle", "Transsexuell", "Transfrau", "Transgender",
          // es / pt
          "Transexuales", "Transexuais", "Mujer trans", "Mulher trans", "Transgénero", "Transgênero",
          // fr
          "Transsexuel", "Transgenre",
          // it
          "Transessuale", "Transessuali",
          // nl
          "Transseksueel", "Transseksuele",
          // ru
          "Транс", "Трансы", "Трансгендер", "Транссексуал", "Транссексуалка", "Трансгендерная",
          // pl
          "Transseksualistka", "Transseksualny", "Transpłciowa",
          // tr
          "Transseksüel",
          // ja
          "トランスジェンダー", "トランスセクシャル", "トランス女性",
          // zh
          "跨性别", "跨性別", "变性人", "變性人",
          // ko
          "트랜스젠더", "트랜스", "성전환",
          // th
          "ทรานส์", "ข้ามเพศ",
          // vi
          "Chuyển giới",
          // ar
          "متحول", "متحولة", "ترانس",
          // id
          "Transeksual"
        ]
      },
      {
        id: "tr-slang",
        name: "Trans: slang & slurs",
        kind: "keywords",
        boorus: ["shemale", "newhalf"],
        description: "Slang and derogatory terms commonly used as site tags. Kept separate so you can pick.",
        items: [
          // en
          "Tranny", "Trannies", "Trannys", "Shemale", "Shemales", "She-male", "Ladyboy", "Lady boy", "Lady-boy",
          "He-she", "Heshe", "Newhalf", "New half", "Dickgirl", "Dick girl",
          // de
          "Transe", "Transen",
          // es / pt
          "Travesti", "Travestis", "Trava", "Travas", "Traveco", "Travecos",
          // fr / it / nl / tr
          "Travestito", "Travestiti", "Travestiet",
          // ru
          "Шимейл", "Шемейл", "Трансуха", "Трансушка", "Трансвестит", "Ледибой", "Леди-бой",
          // pl
          "Transwestyta",
          // ja
          "ニューハーフ", "シーメール", "レディボーイ",
          // zh
          "人妖",
          // ko
          "시메일", "쉬메일", "레이디보이",
          // th
          "สาวประเภทสอง", "กะเทย", "เลดี้บอย",
          // ar
          "شيميل", "ليدي بوي",
          // id
          "Waria", "Bencong"
        ]
      },
      {
        id: "tr-studios",
        name: "Trans: studios & sites",
        kind: "studios",
        description: "Studios, labels and sites focused on trans performers.",
        items: [
          "Grooby", "Grooby Girls", "GroobyGirls", "Shemale Yum", "ShemaleYum", "Ladyboy-Ladyboy",
          "Ladyboy Ladyboy", "SheMaleJapan", "Shemale.xxx", "Tgirls.xxx", "Tgirls.porn", "Tranny Vice",
          "Shemale Shenanigans", "Trans-Tastic Four", "Euro-Tgirls", "Trans Angels", "TransAngels",
          "TransSensual", "Transfixed", "Transfuxed", "Trans500", "TS Pussy Hunters", "TS Seduction",
          "Trannywood", "Bonus Hole Boys"
        ]
      },
      {
        id: "tr-performers",
        name: "Trans performers",
        kind: "performers",
        description: "Stage names from AVN award pages and similar (partial).",
        items: [
          "TS Madison", "Vaniity", "Gia Darling", "Vo D'Balm", "Fabiane de la Costa", "Joanna Jet", "Nomi X",
          "Vicki Richter", "Danielle Foxxx", "Fabiola Mebarek", "Buck Angel", "Allanah Starr", "Holly Sweet",
          "Khloe Hart", "Sexy Jade", "Yasmin Lee", "Carla Novaes", "Thays Schiavinato", "Brittany Coxxx",
          "Natassia Dreams", "Jesse Flores", "Jessica Host", "Kimber James", "Olivia Love", "Anna Paula",
          "Hazel Tucker", "Bailey Jay", "Morgan Bailey", "Natalia Coxxx", "Amy Daly", "Mia Isabella",
          "Madison Montag", "Domino Presley", "Aly Sinclair", "Brittany St. Jordan", "Juliette Stray",
          "Danni Daniels", "Eva Lin", "Venus Lux", "Sunshyne Monroe", "Tiffany Starr", "Wendy Summers",
          "Sarina Valentina", "Danika Dreamz", "Kelli Lox", "Carmen Moore", "Jonelle Brooks", "Chanel Couture",
          "James Darling", "Jessy Dubai", "Kelly Klaymour", "Chelsea Poe", "Tyra Scott", "Delia DeLions",
          "Aubrey Kate", "Kylie Maria", "Holly Parker", "Michelle Austin", "Aspen Brooks", "Nina Lawless",
          "Chelsea Marie", "Isabella Sorrenti", "Stefani Special", "Casey Kisses", "Natalie Mars", "Tori Mayes",
          "Marissa Minx", "Mandy Mitchell", "Chanel Santini", "Alexa Scout", "Freya Wynn", "Shiri Allwood",
          "Kayleigh Coxx", "Korra Del Rio", "Khloe Kay", "Lena Kelly", "Annabelle Lane", "Tyler St. Syn",
          "Ella Hollywood", "Lianna Lawson", "Ryder Monroe", "Jenna Gargles", "Lena Moon", "Melanie Brooks",
          "Erica Cherry", "Nicole Knight", "Ivory Mayhem", "Roxxie Moth", "Angelina Please", "Crystal Thayer",
          "Janie Blade", "Ariel Demure", "Kasey Kei", "Pixi Lust", "Cherry Mavrik", "Eva Maxim", "Lola Morena",
          "Jade Venus", "Valeria Atreides", "Zariah Aura", "Asia Belle", "Tori Easton", "Gracie Jane",
          "Brittney Kade", "Ember Fiera", "Angellica Good", "Leilani Li", "Eros Orisha", "Amanda Riley",
          "Victoria Grant", "Blake Lovely", "Avery Lust", "Andylynn Payne", "Autumn Rain", "Grazyeli Silva",
          "Jane Starr", "Cyd St. Vincent", "Nica Noelle", "Tobi Hill-Meyer", "Dex Hardlove", "Billy Castro"
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────── Gay
  {
    id: "gay",
    name: "Gay",
    description: "Gay vocabulary in many languages, studios and performers.",
    lists: [
      {
        id: "gy-terms",
        name: "Gay: keywords",
        kind: "keywords",
        boorus: ["gay", "gay_sex", "yaoi", "male/male", "homosexual"],
        description: "Gay, homosexual and equivalents in many languages.",
        items: [
          // en
          "Gay", "Gays", "Homosexual", "Homosexuals", "Gay porn", "Gayporn", "Gay sex",
          // de
          "Schwul", "Schwule", "Schwuler", "Schwulen", "Homosexuell", "Homo", "Homos",
          // es / pt / it
          "Homosexuales", "Homossexual", "Homossexuais", "Omosessuale", "Omosessuali",
          // fr
          "Homosexuel", "Homosexuels",
          // nl
          "Homoseksueel", "Homofiel",
          // ru
          "Гей", "Геи", "Гомосексуал", "Гомосексуалист", "Гейский", "Гейское",
          // pl
          "Gej", "Geje", "Homoseksualny", "Homoseksualista", "Gejowskie",
          // tr
          "Gey", "Eşcinsel",
          // ja
          "ゲイ", "ホモ", "男同士", "同性愛",
          // zh
          "男同", "男同性恋", "男同性戀", "同性恋", "同性戀", "男男", "基佬",
          // ko
          "게이", "동성애", "동성애자",
          // th
          "เกย์",
          // vi
          "Đồng tính",
          // ar
          "مثلي", "مثليين",
          // id
          "Homoseksual"
        ]
      },
      {
        id: "gy-slang",
        name: "Gay: slang & scene terms",
        kind: "keywords",
        boorus: ["twink"],
        description: "Twink and similar scene vocabulary.",
        items: ["Twink", "Twinks", "Twunk", "Twunks", "Gay for pay", "Gay-for-pay", "M2M", "Man on man"]
      },
      {
        id: "gy-studios",
        name: "Gay: studios",
        kind: "studios",
        description: "Studios and sites focused on gay content.",
        items: [
          "Athletic Model Guild", "BelAmi", "Bel Ami", "Cazzo Film", "Coat Corporation", "Cobra Video",
          "CockyBoys", "Colt Studio", "Corbin Fisher", "Eurocreme", "Falcon Studios", "Flava Works",
          "French Twinks", "Lucas Entertainment", "Nova Studios", "Pink and White Productions",
          "Raging Stallion", "Sean Cody", "Titan Media", "Treasure Island Media", "Triga Films", "Men.com",
          "NakedSword", "Randy Blue", "Hot House", "Helix Studios", "Bromo", "Dominic Ford", "HotMale",
          "Crashpad Series"
        ]
      },
      {
        id: "gy-performers",
        name: "Gay performers",
        kind: "performers",
        description: "Stage names from Wikipedia's list of gay-film performers (partial; generic names removed).",
        items: [
          "Adam Killian", "Adam Ramzi", "Adam Russo", "Aiden Shaw", "Al Parker", "Arad Winwin", "Armond Rizzo",
          "Arpad Miklos", "Austin Wolf", "Bastian Karim", "Billy Herrington", "Blake Harper", "Boomer Banks",
          "Brenner Bolton", "Brent Corrigan", "Brent Everett", "Brody Blomqvist", "Carlo Masi", "Carter Collins",
          "Casey Donovan", "Charlie Cherry", "Chi Chi LaRue", "Christian Duffy", "Colby Jansen", "Colby Keller",
          "Cole Tucker", "Colton Ford", "Dakota Payne", "Dallas Steele", "Dani Robles", "Dante Colle",
          "Danny Wylde", "Darius Ferdynand", "Derek Kage", "Dirk Caber", "Drake Von", "Erik Rhodes",
          "Eric Stryker", "Flex-Deon Blake", "François Sagat", "Francois Sagat", "Fred Halsted", "Gabriel Clark",
          "Griffin Barrows", "Gus Mattox", "Hector de Silva", "Hoyt Kogan", "Igor Natenko", "J.D. Slater",
          "Jack Harrer", "Jack Radcliffe", "Jack Wrangler", "Jake Andrews", "Jeff Stryker", "Jesse Jackman",
          "Jim Steel", "Joe Gage", "Joel Birkin", "Joey Mills", "Joey Stefano", "Johnny Hazzard", "Johnny Rapid",
          "Jon Vincent", "Josh Weston", "Kazuhito Tadano", "Ken Sprague", "Kevin Falk", "Kevin Warhol",
          "Kip Noll", "Koh Masaki", "Kurt Lockwood", "Kurt Marshall", "Lane V. Rogers", "Leo Ford",
          "Legrand Wolf", "Logan McCree", "Louis Ricaute", "Lukas Ridgeston", "Malik Delgaty", "Manuel Skye",
          "Marc Stevens", "Matthew Camp", "Max Konnor", "Michael DelRay", "Michael Lucas", "Mike De Marko",
          "Nick Capra", "Noah Segsy", "Paddy O'Brian", "Paul Barresi", "Peter Berlin", "Quentin Gainz",
          "Reno Gold", "Rich Merritt", "Rick Cassidy", "Rhyheim Shabazz", "Robert Mimra", "Robert Van Damme",
          "Rocco Steele", "Rod Barry", "Rogan Richards", "Roman Todd", "Ryan Driller", "Ryan Idol", "Ryan Orion",
          "Sam Jensen Page", "Scott Masters", "Scott O'Hara", "Sean Zevran", "Seth Peterson", "Seth Santoro",
          "Steve Brockman", "Tag Eriksson", "Teddy Torres", "Tim Kruger", "Tiger Tyson", "Tim Barnett",
          "Topher DiMaggio", "Ty Mitchell", "Viktor Rom", "Wade Nichols", "Will Wikle", "Woody Fox",
          "Yusaf Mack", "Zak Spears", "Zebedy Colt"
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────── Femboy & crossdressing
  {
    id: "femboy",
    name: "Femboy & crossdressing",
    description: "Femboy, sissy and crossdressing vocabulary in many languages.",
    lists: [
      {
        id: "fb-terms",
        name: "Femboy & crossdressing: keywords",
        kind: "keywords",
        boorus: ["femboy", "trap", "otoko_no_ko", "sissy", "crossdressing", "feminine_male"],
        description: "Femboy, crossdresser and equivalents in many languages.",
        items: [
          // en
          "Femboy", "Femboys", "Femboi", "Fem boy", "Femme boy", "Sissy", "Sissies", "Crossdresser",
          "Cross-dresser", "Crossdressers", "Crossdressing", "Cross dressing",
          // de
          "Transvestit", "Transvestiten",
          // ru
          "Фембой", "Фембои", "Кроссдрессер", "Кроссдрессинг", "Сисси",
          // ja
          "男の娘", "女装", "女装子", "女装男子",
          // zh
          "伪娘", "偽娘", "男娘", "女装", "女裝",
          // ko
          "여장", "여장남자", "펨보이",
          // th
          "เฟมบอย"
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────── Step-family
  {
    id: "step-family",
    name: "Step-family",
    description: "The 'step-' category: step-parent, step-sibling and step-child roleplay tags in many languages.",
    lists: [
      {
        id: "sf-parents",
        name: "Step-parents",
        kind: "keywords",
        boorus: ["stepmother", "stepmom", "stepfather", "stepdad", "stepmother_and_stepson", "stepmother_and_stepdaughter", "stepfather_and_stepdaughter", "stepfather_and_stepson"],
        description: "Step-mom, step-dad and equivalents. 'Step mom', 'step-mom' and 'stepmom' all match.",
        items: [
          // en
          "Step mom", "Step mother", "Step mommy", "Step mum", "Step dad", "Step father", "Step daddy",
          "Step parent", "Step parents", "Step milf",
          // de
          "Stiefmutter", "Stiefmama", "Stiefmami", "Stiefvater", "Stiefpapa", "Stiefeltern",
          // es
          "Madrastra", "Padrastro",
          // pt
          "Madrasta", "Padrasto",
          // fr
          "Belle-mère", "Beau-père",
          // it
          "Matrigna", "Patrigno",
          // nl
          "Stiefmoeder", "Stiefvader", "Stiefmama", "Stiefpapa",
          // sv / da / no
          "Styvmamma", "Styvpappa", "Styvmor", "Styvfar", "Stedmor", "Stedfar",
          // ru
          "Мачеха", "Мачехи", "Мачеху", "Мачехой", "Отчим", "Отчима", "Отчиму", "Отчимом",
          // pl
          "Macocha", "Macochy", "Ojczym", "Ojczyma",
          // cs / hu
          "Nevlastní matka", "Nevlastní otec", "Mostohaanya", "Mostohaapa",
          // tr
          "Üvey anne", "Üvey baba", "Üvey ana",
          // ja
          "義母", "義父", "継母", "継父", "義理の母", "義理の父",
          // zh
          "继母", "繼母", "继父", "繼父", "后妈", "後媽", "后爸", "後爸",
          // ko
          "의붓엄마", "의붓아빠", "새엄마", "새아빠", "계모", "계부",
          // th
          "แม่เลี้ยง", "พ่อเลี้ยง",
          // ar
          "زوجة الأب", "زوج الأم",
          // id / vi
          "Ibu tiri", "Ayah tiri", "Mẹ kế", "Bố dượng", "Cha dượng"
        ]
      },
      {
        id: "sf-siblings",
        name: "Step-siblings",
        kind: "keywords",
        boorus: ["stepsibling", "stepsiblings", "stepsister", "stepbrother"],
        description: "Step-sister, step-brother and equivalents.",
        items: [
          // en
          "Step sister", "Step sis", "Step brother", "Step bro", "Step sibling", "Step siblings",
          // de
          "Stiefschwester", "Stiefbruder", "Stiefgeschwister",
          // es
          "Hermanastra", "Hermanastro", "Hermanastros",
          // pt
          "Meia-irmã", "Irmã postiça", "Irmão postiço",
          // fr
          "Demi-sœur", "Demi-soeur", "Demi-frère",
          // it
          "Sorellastra", "Fratellastro",
          // nl
          "Stiefzus", "Stiefzusje", "Stiefbroer", "Stiefbroertje",
          // sv
          "Styvsyster", "Styvbror",
          // ru
          "Сводная сестра", "Сводную сестру", "Сводной сестрой", "Сводная сестричка", "Сводный брат",
          "Сводного брата", "Сводному брату", "Сводным братом", "Сводные",
          // pl
          "Przyrodnia siostra", "Przyrodni brat", "Przyrodnią siostrę", "Przyrodniego brata",
          // cs / hu
          "Nevlastní sestra", "Nevlastní bratr", "Mostohatestvér", "Mostohanővér",
          // tr
          "Üvey kardeş", "Üvey abla", "Üvey abi",
          // ja
          "義姉", "義妹", "義兄", "義弟", "義理の姉", "義理の妹", "義理の兄", "義理の弟",
          // zh
          "继姐", "繼姐", "继妹", "繼妹", "继兄", "繼兄", "继弟", "繼弟",
          // ko
          "의붓누나", "의붓동생", "의붓오빠", "의붓언니", "의붓남매",
          // id
          "Kakak tiri", "Adik tiri", "Saudara tiri"
        ]
      },
      {
        id: "sf-children",
        name: "Step-children",
        kind: "keywords",
        boorus: ["stepson", "stepdaughter"],
        description: "Step-son, step-daughter and equivalents.",
        items: [
          // en
          "Step son", "Step daughter", "Step child", "Step kid", "Step children",
          // de
          "Stiefsohn", "Stieftochter", "Stiefkind",
          // es
          "Hijastra", "Hijastro",
          // pt
          "Enteada", "Enteado",
          // fr
          "Belle-fille", "Beau-fils",
          // it
          "Figliastra", "Figliastro",
          // nl
          "Stiefzoon", "Stiefdochter",
          // sv
          "Styvdotter", "Styvson",
          // ru
          "Падчерица", "Падчерицу", "Падчерицы", "Падчерицей", "Пасынок", "Пасынка",
          // pl
          "Pasierbica", "Pasierb",
          // tr
          "Üvey kız", "Üvey oğul",
          // ja
          "継娘", "継息子", "義理の娘", "義理の息子",
          // zh
          "继女", "繼女", "继子", "繼子",
          // ko
          "의붓딸", "의붓아들",
          // th
          "ลูกเลี้ยง",
          // id
          "Anak tiri"
        ]
      },
      {
        id: "sf-general",
        name: "Step-family: general terms",
        kind: "keywords",
        boorus: ["step-incest", "stepcest"],
        description: "Family-level words such as step-family and step fantasy.",
        items: [
          "Step family", "Step fam", "Step fantasy", "Step incest",
          "Stieffamilie", "Familia por afinidad", "Famille recomposée", "Famiglia allargata",
          "Сводные брат и сестра", "継家族"
        ]
      },
      {
        id: "sf-studios",
        name: "Step-family: series & studios (partial)",
        kind: "studios",
        description: "A few well-known sites and series built around step-family roleplay. Incomplete; most of the category shows up through the keyword lists.",
        items: [
          "Step Siblings Caught", "Family Strokes", "Taboo Heat", "Sis Loves Me", "Dad Crush", "Mommy's Girl",
          "Brother Crush"
        ]
      }
    ]
  }
];

// ───────────────────────────────────────────────────────────── New topics
// A term that starts with "=" is case-sensitive ("=AI" matches "AI" but not "Ai" or "ai").

KWF_CATALOG.push(
  // ─────────────────────────────────────────────────────────── Anal
  {
    id: "anal",
    name: "Anal",
    description: "Anal vocabulary in many languages, studios and dedicated sites.",
    lists: [
      {
        id: "an-terms",
        name: "Anal: keywords",
        kind: "keywords",
        boorus: ["anal", "anal_sex", "anal_penetration", "anal_insertion", "anal_fingering", "anal_beads", "anal_masturbation", "anal_fisting", "anal_creampie", "anal_plug", "rimjob"],
        description: "Anal and related terms in many languages. Terms starting with = are case-sensitive.",
        items: [
          // en
          "Anal", "Anal sex", "Analsex", "Anal fuck", "Anal creampie", "Anal gape", "Anal fisting", "Anal toy",
          "Anal plug", "Anal beads", "Ass fuck", "Assfuck", "Ass to mouth", "A2M", "=DAP", "Double anal",
          "Butt plug", "Buttplug", "Butt fuck", "Buttfuck",
          // de
          "Arschfick", "Arschficken", "Arschgefickt", "In den Arsch",
          // es
          "Sexo anal", "Por el culo", "Enculada",
          // fr
          "Sodomie", "Sodomisée", "Sodomisé", "Enculée", "Enculer", "Sexe anal",
          // it
          "Anale", "Sesso anale", "Sodomia", "Inculata",
          // pt
          "Dando o cu",
          // nl / sv / cs
          "Anaal", "Anale seks", "Anaalseks", "Anální",
          // ru
          "Анал", "Анальный", "Анальная", "Анальное", "Анальные", "Анальный секс", "В попку", "В жопу",
          // pl
          "Analny", "Analna", "Seks analny", "W dupę",
          // tr / id
          "Anal seks", "Seks anal",
          // ja
          "アナル", "アナルセックス", "アナル拡張", "肛門",
          // zh
          "肛交", "后庭", "後庭", "爆菊", "肛门",
          // ko
          "항문", "애널", "애널섹스", "항문섹스",
          // ar
          "شرجي", "الجنس الشرجي"
        ]
      },
      {
        id: "an-studios",
        name: "Anal: studios & series",
        kind: "studios",
        description: "Brands built around anal content (partial).",
        items: ["Analvids", "Analized", "Anal Acrobats"]
      },
      {
        id: "an-sites",
        name: "Anal: whole sites",
        kind: "sites",
        description: "Sites dedicated to anal content. *word* blocks every site whose address contains that word.",
        items: ["analvids.com", "analized.com", "*analporn*", "*analsex*", "*analxxx*", "*analtube*", "*analvid*"]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────── Group sex
  {
    id: "group-sex",
    name: "Group sex",
    description: "Gangbang, orgy, bukkake and similar, in many languages. Threesomes are a separate list.",
    lists: [
      {
        id: "gr-terms",
        name: "Gangbang, orgy, bukkake: keywords",
        kind: "keywords",
        boorus: ["group_sex", "gangbang", "orgy", "double_penetration", "spitroast", "bukkake", "reverse_gangbang", "daisy_chain"],
        description: "Group-sex terms in many languages.",
        items: [
          // en
          "Gangbang", "Gang bang", "Gangbangs", "Gangbanged", "Reverse gangbang", "Orgy", "Orgies", "Bukkake",
          "Bukake", "Gokkun", "Group sex", "Groupsex", "Group orgy", "Sex party", "Sexparty", "Swinger",
          "Swingers", "Swinger party",
          // de
          "Gruppensex", "Orgie", "Orgien", "Gruppenfick",
          // es
          "Orgía", "Orgias", "Sexo en grupo", "Sexo grupal",
          // fr
          "Partouze", "Partouzes", "Sexe en groupe", "Échangisme",
          // it
          "Orgia", "Sesso di gruppo",
          // pt
          "Suruba", "Sexo em grupo",
          // nl
          "Groepsseks",
          // ru
          "Групповуха", "Групповой секс", "Оргия", "Оргии", "Гэнгбэнг", "Гангбанг", "Буккаке", "Свингеры",
          // pl
          "Seks grupowy", "Swingersi",
          // tr
          "Grup seks", "Orgi",
          // ja
          "乱交", "乱交パーティー", "ぶっかけ", "ブッカケ", "スワッピング", "複数プレイ", "ごっくん", "ゴックン",
          // zh
          "群交", "亂交", "多人运动", "多人運動",
          // ko
          "난교", "그룹섹스", "스와핑",
          // ar / id
          "جنس جماعي", "Seks grup"
        ]
      },
      {
        id: "gr-threesome",
        name: "Threesomes & foursomes: keywords",
        kind: "keywords",
        boorus: ["threesome", "foursome", "mmf_threesome", "ffm_threesome", "mmf", "ffm"],
        description: "Threesome vocabulary. Off by default because it is far more common. Terms starting with = are case-sensitive.",
        default: false,
        items: [
          // en
          "Threesome", "Threesomes", "Foursome", "Fivesome", "3some", "=MMF", "=FFM", "=MFM", "Ménage à trois",
          // de
          "Dreier", "Vierer", "Dreiersex",
          // es / it / pt
          "Sexo a tres", "Sesso a tre", "Sexo a três", "Trisal",
          // fr
          "Plan à trois", "Triolisme",
          // nl / ru / pl / tr
          "Triootje", "Тройничок", "Секс втроем", "Trójkąt", "Üçlü seks",
          // ja / zh / ko
          "3P", "4P", "三P", "쓰리섬", "双飞", "雙飛"
        ]
      },
      {
        id: "gr-studios",
        name: "Group sex: studios & series",
        kind: "studios",
        description: "Brands built around group sex (partial).",
        items: ["Gangbang Creampie", "Bound Gangbangs"]
      },
      {
        id: "gr-sites",
        name: "Group sex: whole sites",
        kind: "sites",
        description: "Sites dedicated to group sex. *word* blocks every site whose address contains that word.",
        items: ["gangbangcreampie.com", "*gangbang*", "*bukkake*", "*orgy*", "*groupsex*"]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────── Latina / Latino
  {
    id: "latina",
    name: "Latina / Latino",
    description: "Latina and Latino vocabulary in many languages, nationalities, studios, performers and sites.",
    lists: [
      {
        id: "la-terms",
        name: "Latina / Latino: keywords",
        kind: "keywords",
        boorus: ["latina", "latino", "hispanic"],
        description: "Latina, Latino and equivalents in many languages.",
        items: [
          // en
          "Latina", "Latinas", "Latino", "Latinos", "Latin", "Latin girl", "Latin babe", "Hispanic", "Chicana",
          // es
          "Latinoamericana", "Hispana",
          // de
          "Lateinamerikanerin", "Lateinamerikanische",
          // ru
          "Латина", "Латинка", "Латиноамериканка", "Латино",
          // pl
          "Latynoska", "Latynos",
          // ja
          "ラテン", "ラティーナ", "ラテン系",
          // zh
          "拉丁", "拉美", "拉丁裔", "拉丁美洲",
          // ko
          "라틴", "라티나", "라틴계",
          // th / ar
          "ละติน", "لاتينية"
        ]
      },
      {
        id: "la-nationalities",
        name: "Latin American nationalities (broad)",
        kind: "keywords",
        boorus: ["mexican", "brazilian", "colombian", "cuban", "puerto_rican", "venezuelan", "argentinian"],
        description: "Mexican, Colombian, Brazilian and similar words in many languages. Off by default because it is broad.",
        default: false,
        items: [
          // en
          "Mexican", "Colombian", "Brazilian", "Venezuelan", "Cuban", "Puerto Rican", "Dominican", "Argentinian",
          "Peruvian", "Chilean", "Ecuadorian",
          // es
          "Mexicana", "Colombiana", "Brasileña", "Venezolana", "Cubana", "Dominicana", "Peruana", "Chilena",
          "Ecuatoriana", "Boricua",
          // pt
          "Brasileira", "Brasileirinha", "Brasileiras",
          // fr
          "Mexicaine", "Colombienne", "Brésilienne", "Cubaine",
          // it
          "Messicana", "Brasiliana", "Cubana",
          // de
          "Mexikanerin", "Kolumbianerin", "Brasilianerin", "Kubanerin",
          // ru
          "Мексиканка", "Бразильянка", "Колумбийка", "Кубинка", "Венесуэлка",
          // pl
          "Meksykanka", "Brazylijka", "Kolumbijka", "Kubanka",
          // ja
          "ブラジル人", "メキシコ人", "コロンビア人", "キューバ人",
          // zh
          "巴西人", "墨西哥人", "哥伦比亚人", "哥倫比亞人", "古巴人",
          // ko
          "브라질인", "멕시코인", "콜롬비아인", "쿠바인",
          // tr
          "Meksikalı", "Brezilyalı", "Kolombiyalı", "Kübalı"
        ]
      },
      {
        id: "la-studios",
        name: "Latina: studios & series",
        kind: "studios",
        description: "Studios and series focused on Latina performers (partial).",
        items: ["Latina Sex Tapes", "Muy Caliente", "Brasileirinhas", "Latin Adultery"]
      },
      {
        id: "la-performers",
        name: "Latina performers",
        kind: "performers",
        description: "A few well-known stage names (very partial).",
        items: ["Gina Valentina", "Eva Lovia", "Lupe Fuentes", "Sophia Leone", "Gianna Dior", "Katya Rodriguez"]
      },
      {
        id: "la-sites",
        name: "Latina: whole sites",
        kind: "sites",
        description: "Sites dedicated to Latina content. *word* blocks every site whose address contains that word.",
        items: [
          "brasileirinhas.com", "*latinaporn*", "*latinasex*", "*latinaxxx*", "*latinotube*", "*pornolatino*",
          "*sexolatino*"
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────── AI-generated
  {
    id: "ai",
    name: "AI-generated",
    description: "AI-generated and deepfake content in many languages, plus generator sites. Off by default.",
    lists: [
      {
        id: "ai-terms",
        name: "AI & deepfake: keywords",
        kind: "keywords",
        boorus: ["ai_generated", "ai_assisted", "stable_diffusion", "novelai", "midjourney"],
        description: "AI and deepfake terms in many languages. Terms starting with = are case-sensitive, so '=AI' does not hit names like Ai.",
        default: false,
        items: [
          // en
          "=AI", "AI generated", "AI-generated", "AI porn", "AI art", "AI girl", "AI hentai", "Deepfake",
          "Deepfakes", "Deep fake", "Face swap", "Faceswap", "Stable Diffusion", "Midjourney", "Nudify",
          // de
          "=KI", "KI generiert", "KI-generiert", "Künstliche Intelligenz",
          // es / fr / it / pt
          "=IA", "Generado por IA", "Generada por IA", "Inteligencia artificial", "Générée par IA",
          "Intelligence artificielle", "Generato da IA", "Intelligenza artificiale", "Gerado por IA",
          "Gerada por IA", "Inteligência artificial",
          // nl
          "AI-gegenereerd", "Kunstmatige intelligentie",
          // ru
          "=ИИ", "Нейросеть", "Нейросети", "Нейросетью", "Искусственный интеллект", "Дипфейк",
          // pl
          "Sztuczna inteligencja", "Wygenerowane przez AI",
          // tr
          "Yapay zeka",
          // ja
          "AI生成", "生成AI", "AIポルノ", "AI画像", "AIエロ", "ディープフェイク",
          // zh
          "人工智能", "AI换脸", "AI換臉", "深度伪造", "深度偽造", "换脸", "換臉", "AI绘画",
          // ko
          "AI생성", "AI 생성", "인공지능", "딥페이크",
          // ar
          "ذكاء اصطناعي"
        ]
      },
      {
        id: "ai-sites",
        name: "AI: whole sites",
        kind: "sites",
        description: "AI porn generators, deepfake sites and 'nudify' tools. *word* blocks every site whose address contains that word.",
        default: false,
        items: [
          "pornpen.ai", "promptchan.ai", "candy.ai", "dreamgf.ai", "mrdeepfakes.com", "unstability.ai",
          "clothoff.io", "undress.app", "*aiporn*", "*aihentai*", "*nsfwai*", "*pornai*", "*deepfakeporn*",
          "*porngen*", "*nudify*", "*deepnude*"
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────── Hentai
  {
    id: "hentai",
    name: "Hentai & anime",
    description: "Hentai and animated adult content in many languages, studios and sites. Off by default.",
    lists: [
      {
        id: "hn-terms",
        name: "Hentai: keywords",
        kind: "keywords",
        description: "Hentai and related terms in many languages.",
        default: false,
        items: [
          // en
          "Hentai", "Hentais", "Anime porn", "Anime sex", "Ecchi", "Doujin", "Doujinshi", "Eroge", "Rule 34",
          "Rule34", "R34", "Futanari", "Futa", "Tentacle", "Tentacles", "Yaoi", "Ahegao", "Lolicon", "Shotacon",
          "Loli", "Shota",
          // de / es / fr / it / pt / pl / tr
          "Anime Porno", "Anime porno", "Porno animé", "Hentaí",
          // ru
          "Хентай", "Хэнтай", "Аниме порно", "Додзинси", "Футанари", "Ахегао",
          // ja
          "エロアニメ", "エロ同人", "同人誌", "エロゲ", "触手", "ふたなり", "アヘ顔", "ヘンタイ", "成人アニメ",
          // zh
          "里番", "本子", "工口", "同人志", "成人动画", "成人動畫",
          // ko
          "헨타이", "동인지", "촉수", "야애니"
        ]
      },
      {
        id: "hn-studios",
        name: "Hentai: studios & brands",
        kind: "studios",
        description: "Hentai studios and publishers (partial).",
        default: false,
        items: ["Pink Pineapple", "Lemon Cream", "Bunnywalker", "Hentai Haven", "HentaiHaven", "Hanime", "Fakku", "nhentai"]
      },
      {
        id: "hn-sites",
        name: "Hentai: whole sites",
        kind: "sites",
        description: "Hentai streaming, manga and rule-34 sites. *word* blocks every site whose address contains that word.",
        default: false,
        items: [
          "hentaihaven.xxx", "hentaihaven.com", "hanime.tv", "hanime1.me", "fakku.net", "hitomi.la", "pururin.to",
          "tsumino.com", "exhentai.org", "e-hentai.org", "rule34.xxx", "rule34.paheal.net", "rule34video.com",
          "*hentai*", "*rule34*", "*hanime*"
        ]
      }
    ]
  }
);

// ───────────────────────────────────────────────────────────── Whole-site lists for the older topics
// Items are domains (the domain and all its subdomains) or *word* patterns (any site whose
// address contains the word). They are blocked entirely when their list is switched on.

// "boorus": exact tags used by image-board sites (Rule34, Gelbooru, ...), matched exactly there and added to the
// site's own blacklist where that is possible. They are not translations of the keywords; booru tag names differ.
const KWF_SITE_LISTS = {
  "interracial-black": {
    id: "ib-sites",
    name: "Interracial & Black: whole sites",
    kind: "sites",
    description: "Sites dedicated to interracial or Black-performer content. *word* blocks every site whose address contains that word.",
    items: [
      "blacked.com", "blackedraw.com", "dogfartnetwork.com", "dogfart.com", "interracialpass.com",
      "blacksonblondes.com", "blackvalleygirls.com", "*interracial*", "*blackedraw*", "*ebonyporn*", "*blackporn*",
      "*blackxxx*", "*bigblackcock*"
    ]
  },
  asian: {
    id: "as-sites-whole",
    name: "Asian: whole sites",
    kind: "sites",
    description: "JAV and other Asian-focused sites. *word* blocks every site whose address contains that word.",
    items: [
      "javhd.com", "javbus.com", "javlibrary.com", "javmost.com", "jav.guru", "javdb.com", "supjav.com",
      "missav.com", "missav.ws", "jable.tv", "njav.tv", "caribbeancom.com", "1pondo.tv", "heyzo.com",
      "pacopacomama.com", "10musume.com", "tokyo-hot.com", "muramura.tv", "*asianporn*", "*asiansex*",
      "*asianxxx*", "*japanporn*", "*javporn*"
    ]
  },
  trans: {
    id: "tr-sites",
    name: "Trans: whole sites",
    kind: "sites",
    description: "Sites dedicated to trans performers. *word* blocks every site whose address contains that word.",
    items: [
      "grooby.com", "groobygirls.com", "shemaleyum.com", "ladyboy-ladyboy.com", "transangels.com",
      "transsensual.com", "tgirls.xxx", "tgirls.porn", "transfixed.com", "trans500.com", "tsseduction.com",
      "tspussyhunters.com", "*shemale*", "*tranny*", "*ladyboy*", "*tgirl*"
    ]
  },
  gay: {
    id: "gy-sites",
    name: "Gay: whole sites",
    kind: "sites",
    description: "Sites dedicated to gay content. *word* blocks every site whose address contains that word.",
    items: [
      "nakedsword.com", "corbinfisher.com", "seancody.com", "falconstudios.com", "ragingstallion.com",
      "helixstudios.net", "cockyboys.com", "titanmen.com", "lucasentertainment.com", "belamionline.com",
      "treasureislandmedia.com", "randyblue.com", "men.com", "*gayporn*", "*gaytube*", "*gaysex*", "*gayxxx*",
      "*twinkporn*", "*twinkxxx*"
    ]
  },
  femboy: {
    id: "fb-sites",
    name: "Femboy: whole sites",
    kind: "sites",
    description: "Sites dedicated to femboy content. *word* blocks every site whose address contains that word.",
    items: ["*femboyporn*", "*femboyxxx*", "*femboysex*"]
  },
  "step-family": {
    id: "sf-sites",
    name: "Step-family: whole sites",
    kind: "sites",
    description: "Sites built around step-family roleplay. *word* blocks every site whose address contains that word.",
    items: ["familystrokes.com", "tabooheat.com", "sislovesme.com", "dadcrush.com", "*stepporn*", "*stepsiblingsporn*"]
  }
};

for (const [topicId, list] of Object.entries(KWF_SITE_LISTS)) {
  KWF_CATALOG.find((topic) => topic.id === topicId).lists.push(list);
}

// ───────────────────────────────────────────────────────────── Furry / anthro
KWF_CATALOG.push({
  id: "furry",
  name: "Furry / anthro",
  description: "Furry, anthro and related vocabulary in many languages, plus furry-focused sites.",
  lists: [
    {
      id: "fu-terms",
      name: "Furry / anthro: keywords",
      kind: "keywords",
      boorus: ["furry", "anthro", "anthropomorphic", "feral", "furry_only", "furry_female", "furry_male", "anthro_on_anthro", "anthro_on_feral", "scalie", "canine", "canid", "felid", "equine", "lagomorph", "kemono", "protogen", "fursuit", "yiff"],
      description: "Furry and anthropomorphic-animal terms in many languages (booru-style tags included).",
      items: [
        // en
        "Furry", "Furries", "Fursona", "Fursuit", "Fursuiter", "Fursuits", "Yiff", "Yiffy", "Anthro", "Anthros",
        "Anthropomorphic", "Anthropomorphism", "Anthropomorph", "Feral", "Scalie", "Scalies", "Protogen", "Sergal",
        "Kemono", "Anthro male", "Anthro female", "Furry porn", "Furry yiff", "Furry art", "Furry hentai",
        "Furry fandom", "Furry gay", "Furry feral",
        "Zootopia", "Nick Wilde", "Judy Hopps", "Avali", "Digitigrade",
        // booru-style tags
        "Canine", "Canid", "Felid", "Equine", "Lagomorph",
        // de
        "Furrys", "Fursuiten",
        // es / pt / fr / it
        "Antropomórfico", "Antropomórfica", "Antropomorfo", "Antropomorfa", "Antropomorphe",
        // ru
        "Фурри", "Фури", "Йифф", "Антро", "Антропоморфный", "Антропоморфная", "Фурсьют", "Фурсона",
        // pl / tr / nl
        "Antropomorficzny", "Antropomorfik",
        // ja
        "ケモノ", "ケモナー", "獣人", "ファーリー", "ケモショタ",
        // zh
        "兽人", "獸人", "福瑞", "兽控", "獸控", "兽圈", "獸圈",
        // ko
        "퍼리", "수인", "수인물",
        // th / ar
        "เฟอร์รี่", "فيري", "كائن بشري الحيوان"
      ]
    },
    {
      id: "fu-sites",
      name: "Furry: whole sites",
      kind: "sites",
      description: "Sites dedicated to furry content. *word* blocks every site whose address contains that word.",
      items: [
        "e621.net", "e926.net", "furaffinity.net", "inkbunny.net", "furrynetwork.com", "sofurry.com", "weasyl.com",
        "*furry*", "*yiff*", "*e621*", "*fursuit*"
      ]
    }
  ]
});

// Tags that do not exist on a given site (checked against its own tag search); skipped when writing that site's blacklist.
const KWF_BOORU_SKIP = {
  "gelbooru.com": ["interracial_yuri", "interracial_couple", "interracial_fellatio", "interracial_yaoi", "interracial_anal", "black_body", "ebony", "asian_male", "asian_futa", "chinese_female", "chinese_male", "korean_female", "korean_male", "filipina", "taiwanese", "indonesian", "indian", "transgender_woman", "transgender_male", "trans_man", "trans_girl", "transfem", "shemale", "gay", "homosexual", "twink", "sissy", "stepmom", "stepdad", "stepfather_and_stepson", "stepsibling", "stepbrother", "stepson", "stepdaughter", "stepcest", "anal_masturbation", "daisy_chain", "mmf", "latina", "latino", "hispanic", "cuban", "venezuelan", "novelai", "feral", "anthro_on_feral", "scalie", "canine", "canid", "felid", "equine", "lagomorph", "kemono", "yiff"]
};

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
        default: false,
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
        default: false,
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
        default: false,
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
        default: false,
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
        boorus: ["transgender", "transgender_woman", "transgender_male", "trans_woman", "trans_man", "trans_girl", "transfem", "futanari", "futa", "futa_only", "futa_on_female", "futa_on_male", "futa_on_futa", "futa_with_female", "futa_sans_pussy", "futa_focus", "futadom"],
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
          "Transeksual",
          // futanari (fictional): the word is the same in most languages, plus ja / zh / ko / ru / th / ar
          "Futanari", "Futanarí", "Futa", "ふたなり", "フタナリ", "扶她", "扶他", "후타나리", "Футанари", "ฟุตานาริ", "فوتاناري"
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
        default: false,
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
        default: false,
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
        default: false,
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
        default: false,
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
        default: false,
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
        default: false,
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
        default: false,
        items: ["Analvids", "Analized", "Anal Acrobats"]
      },
      {
        id: "an-sites",
        name: "Anal: whole sites",
        kind: "sites",
        description: "Sites dedicated to anal content. *word* blocks every site whose address contains that word.",
        default: false,
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
        default: false,
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
        default: false,
        items: ["Latina Sex Tapes", "Muy Caliente", "Brasileirinhas", "Latin Adultery"]
      },
      {
        id: "la-performers",
        name: "Latina performers",
        kind: "performers",
        description: "A few well-known stage names (very partial).",
        default: false,
        items: ["Gina Valentina", "Eva Lovia", "Lupe Fuentes", "Sophia Leone", "Gianna Dior", "Katya Rodriguez"]
      },
      {
        id: "la-sites",
        name: "Latina: whole sites",
        kind: "sites",
        description: "Sites dedicated to Latina content. *word* blocks every site whose address contains that word.",
        default: false,
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
// ─────────────────────────────────────────────────────────── BDSM & fetish
// One small list per fetish so each can be switched on or off on its own. All are off by default.
// Words that also have an everyday meaning are left out on purpose (plain "feet", "inflation", "trance").
KWF_CATALOG.push({
  id: "fetish",
  name: "BDSM & fetish",
  description: "One list per fetish, all off by default: bondage, femdom, humiliation, feet, pregnancy, lactation, hypno, giantess, inflation and vore. Switch on only the ones you want gone.",
  lists: [
    {
      id: "ft-bondage",
      name: "Bondage & BDSM: keywords",
      kind: "keywords",
      boorus: ["bondage", "bdsm", "shibari", "rope_bondage", "bound", "bound_wrists", "bound_arms", "bound_legs", "bound_ankles", "tied_up", "restrained", "gagged", "ball_gag", "bit_gag", "ring_gag", "cleave_gag", "tape_gag", "hogtie", "spreader_bar", "armbinder", "handcuffs", "bondage_gear"],
      description: "Bondage, BDSM, shibari and gags in many languages. 'Tied up' and 'handcuffed' are broad.",
      default: false,
      items: [
        // en
        "Bondage", "BDSM", "Shibari", "Kinbaku", "Rope bondage", "Tied up", "Bound and gagged", "Gagged", "Ball gag",
        "Hogtied", "Hogtie", "Handcuffed", "Armbinder", "Spreader bar", "Bondage gear", "Sex slave",
        // de
        "Fesselspiele", "Fesselsex", "Gefesselt", "Fesselung", "Knebel", "Geknebelt",
        // es / pt
        "Amordazada", "Amordazado", "Bondagem", "Amordaçada",
        // fr / it
        "Attachée", "Ligotée", "Bâillonnée", "Imbavagliata",
        // nl
        "Vastgebonden", "Geknevelde",
        // ru
        "Бондаж", "Связанная", "Связывание", "Кляп", "Шибари",
        // pl
        "Związana", "Knebel",
        // ja
        "緊縛", "ボンデージ", "猿ぐつわ", "猿轡", "亀甲縛り", "拘束プレイ",
        // zh
        "捆绑", "捆綁", "绑缚", "口球",
        // ko
        "결박", "속박", "본디지", "재갈",
        // th
        "ชิบาริ", "มัดเชือก"
      ]
    },
    {
      id: "ft-femdom",
      name: "Femdom: keywords",
      kind: "keywords",
      boorus: ["femdom", "female_domination", "dominatrix", "facesitting", "face_sitting", "smothering", "ballbusting", "cock_and_ball_torture", "pegging", "chastity_cage", "chastity_device", "trampling", "financial_domination"],
      description: "Female domination, dominatrix, facesitting, pegging and chastity in many languages.",
      default: false,
      items: [
        // en
        "Femdom", "Female domination", "Female dominance", "Dominatrix", "Domme", "Facesitting", "Face sitting",
        "Smothering", "Ballbusting", "Ball busting", "Cock and ball torture", "Pegging", "Chastity cage",
        "Findom", "Financial domination", "Femdom slave", "Mistress and slave",
        // de
        "Weibliche Dominanz", "Domina", "Keuschhaltung", "Keuschheitskäfig", "Herrin und Sklave",
        // es / pt / fr / it
        "Dominación femenina", "Dominatriz", "Dominação feminina", "Dominadora", "Domination féminine",
        "Dominatrice", "Cage de chasteté", "Dominazione femminile",
        // nl
        "Vrouwelijke dominantie",
        // ru
        "Фемдом", "Женское доминирование", "Доминатрикс", "Фейсситтинг", "Пеггинг",
        // pl / tr
        "Dominacja kobieca", "Kadın egemenliği",
        // ja
        "フェムドム", "女王様", "顔面騎乗", "M男", "ペニバン", "金玉責め",
        // zh
        "女性支配", "坐脸", "坐臉", "女王调教",
        // ko
        "펨돔", "여성 지배", "얼굴 깔고 앉기",
        // th
        "เฟมดอม"
      ]
    },
    {
      id: "ft-humiliation",
      name: "Humiliation: keywords",
      kind: "keywords",
      boorus: ["humiliation", "public_humiliation", "small_penis_humiliation", "sph", "degradation", "verbal_abuse", "forced_humiliation"],
      description: "Humiliation, degradation and SPH in many languages.",
      default: false,
      items: [
        // en
        "Humiliation", "Humiliated", "Humiliating", "Public humiliation", "Degradation", "Degrading",
        "Small penis humiliation", "=SPH", "Sexual humiliation",
        // de
        "Demütigung", "Erniedrigung", "Gedemütigt", "Erniedrigt", "Sexuelle Demütigung",
        // es / pt / fr / it
        "Humillación", "Humillada", "Degradación", "Humilhação", "Humilhada", "Degradação", "Humiliée",
        "Dégradation", "Umiliazione", "Umiliata", "Degradazione",
        // nl
        "Vernedering", "Vernederd",
        // ru
        "Унижение", "Униженная", "Публичное унижение",
        // pl / tr
        "Poniżanie", "Upokorzenie", "Upokorzona", "Aşağılanma",
        // ja
        "屈辱", "羞恥", "辱め", "言葉責め", "公開羞恥",
        // zh
        "羞辱", "凌辱", "公开羞辱", "公開羞辱",
        // ko
        "굴욕", "수치 플레이",
        // ar
        "إذلال"
      ]
    },
    {
      id: "ft-feet",
      name: "Feet: keywords",
      kind: "keywords",
      boorus: ["feet", "foot_focus", "footjob", "foot_worship", "foot_lick", "toe_sucking", "foot_fetish", "soles", "toes", "sole_focus", "foot_licking", "foot_sniffing", "foot_play"],
      description: "Feet, foot fetish, foot worship and footjob in many languages. Plain 'feet' is included, which is fine on adult sites but would also hit ordinary feet talk on Reddit.",
      default: false,
      items: [
        // en
        "Feet", "Foot", "Toes", "Soles", "Foot fetish", "Feet fetish", "Foot worship", "Feet worship", "Footjob", "Foot job", "Feet pics",
        "Foot pics", "Sole fetish", "Toe sucking", "Foot licking", "Foot play", "Footfetish", "Feetfetish",
        // de
        "Füße", "Fuß", "Fußfetisch", "Fußjob", "Fußanbetung", "Fußerotik", "Fuß Fetisch",
        // es / fr / it / pt / nl
        "Pieds", "Piedi", "Voeten", "Fetichismo de pies", "Fetiche de pies", "Adoración de pies", "Fétichisme des pieds", "Fétiche pieds",
        "Adoration des pieds", "Feticismo dei piedi", "Fetiche de pés", "Fetiche por pés", "Adoração de pés",
        "Voetfetisj", "Voeten fetisj",
        // ru / pl / tr
        "Ступни", "Ножки", "Фетиш ног", "Футфетиш", "Фут фетиш", "Поклонение ногам", "Fetysz stóp", "Fetysz stopy", "Ayak fetişi",
        // ja
        "足フェチ", "足コキ", "足舐め", "足の指舐め",
        // zh
        "恋足", "戀足", "足交", "足控", "足恋",
        // ko
        "발 페티쉬", "풋페티쉬", "족페티쉬", "풋잡",
        // th / ar / id
        "ฟุตเฟติช", "عشق الأقدام", "Fetish kaki"
      ]
    },
    {
      id: "ft-pregnancy",
      name: "Pregnancy: keywords",
      kind: "keywords",
      boorus: ["pregnant", "pregnant_female", "pregnant_belly", "pregnancy", "impregnation", "impregnation_fetish", "pregnant_sex", "preggo"],
      description: "Pregnancy and impregnation in many languages.",
      default: false,
      items: [
        // en
        "Pregnant", "Pregnancy", "Preggo", "Preggers", "Impregnation", "Impregnated", "Pregnant sex",
        // de
        "Schwanger", "Schwangere", "Schwangeren", "Schwangerschaft",
        // es / fr / it / pt / nl
        "Embarazada", "Embarazadas", "Embarazo", "Enceinte", "Enceintes", "Grossesse", "Incinta", "Incinte",
        "Gravidanza", "Grávida", "Gravida", "Grávidas", "Gravidez", "Zwanger", "Zwangere", "Zwangerschap",
        // ru
        "Беременная", "Беременные", "Беременность", "Беременна",
        // pl / tr / id
        "Ciężarna", "W ciąży", "Ciąża", "Hamile", "Hamilelik", "Hamil",
        // ja
        "妊婦", "妊娠", "孕ませ", "ボテ腹", "種付け",
        // zh
        "孕妇", "孕婦", "怀孕", "懷孕", "大肚子",
        // ko
        "임산부", "임신", "만삭",
        // th / ar
        "ตั้งครรภ์", "คนท้อง", "حامل"
      ]
    },
    {
      id: "ft-lactation",
      name: "Lactation: keywords",
      kind: "keywords",
      boorus: ["lactation", "lactating", "breast_milk", "lactation_through_clothes", "hucow", "milking_machine", "breast_pump", "nursing_handjob", "adult_nursing"],
      description: "Lactation, breast milk and hucow in many languages.",
      default: false,
      items: [
        // en
        "Lactation", "Lactating", "Breast milk", "Breastmilk", "Adult breastfeeding", "Adult nursing",
        "Hucow", "Human cow", "Milk boobs",
        // de
        "Laktation", "Muttermilch", "Milchtitten", "Milchbrüste",
        // es / fr / it / pt / nl
        "Lactancia", "Lactante", "Leche materna", "Allaitement", "Lait maternel", "Lattazione", "Latte materno",
        "Lactação", "Leite materno", "Amamentação", "Borstvoeding", "Moedermelk", "Lactatie",
        // ru / pl / tr
        "Лактация", "Лактирующая", "Грудное молоко", "Laktacja", "Mleko z piersi", "Emzirme",
        "Anne sütü", "Laktasyon",
        // ja
        "母乳", "授乳", "搾乳",
        // zh
        "哺乳", "泌乳", "乳汁", "喷奶", "噴奶",
        // ko
        "모유", "수유", "착유",
        // th / ar
        "น้ำนม", "ให้นม", "رضاعة", "حليب الأم"
      ]
    },
    {
      id: "ft-hypno",
      name: "Hypno & mind control: keywords",
      kind: "keywords",
      boorus: ["hypnosis", "hypnotized", "mind_control", "brainwashing", "hypnotic_eyes", "hypnofetish", "hypno"],
      description: "Hypnosis, mind control and brainwashing in many languages.",
      default: false,
      items: [
        // en
        "Hypnosis", "Hypnotized", "Hypnotised", "Hypno", "Hypno porn", "Hypnofetish", "Mind control",
        "Brainwashing", "Brainwashed",
        // de
        "Hypnose", "Hypnotisiert", "Gedankenkontrolle", "Gehirnwäsche",
        // es / fr / it / pt / nl
        "Hipnosis", "Hipnotizada", "Control mental", "Lavado de cerebro", "Hypnotisée", "Contrôle mental",
        "Lavage de cerveau", "Ipnosi", "Ipnotizzata", "Controllo mentale", "Hipnose", "Hipnotizada",
        "Controle mental", "Lavagem cerebral", "Gedachtecontrole",
        // ru
        "Гипноз", "Гипнотизированная", "Контроль разума", "Контроль сознания", "Промывание мозгов",
        // pl / tr
        "Hipnoza", "Kontrola umysłu", "Hipnoz", "Zihin kontrolü",
        // ja
        "催眠", "洗脳", "マインドコントロール", "催眠術", "催眠音声",
        // zh
        "洗脑", "洗腦", "精神控制", "心灵控制", "心靈控制",
        // ko
        "최면", "세뇌", "마인드 컨트롤",
        // th / ar
        "สะกดจิต", "تنويم مغناطيسي", "غسيل دماغ"
      ]
    },
    {
      id: "ft-giantess",
      name: "Giantess & macro: keywords",
      kind: "keywords",
      boorus: ["giantess", "macrophilia", "macro", "micro", "shrinking", "giant_woman", "giant_girl"],
      description: "Giantess, macro/micro and shrinking in many languages. The short words macro and micro are only used as image-board tags, not as keywords.",
      default: false,
      items: [
        // en
        "Giantess", "Giantesses", "Giant girl", "Giant woman", "Macrophilia", "Microphilia", "Shrunken man",
        "Shrinking man", "Giantess fetish",
        // de
        "Riesin", "Riesinnen", "Riesenfrau",
        // es / fr / it / pt / nl
        "Giganta", "Gigantas", "Mujer gigante", "Géante", "Femme géante", "Gigantessa", "Donna gigante",
        "Mulher gigante", "Reuzin",
        // ru / pl / tr
        "Гигантша", "Великанша", "Гигантесса", "Gigantka", "Olbrzymka", "Dev kadın",
        // ja
        "巨大娘", "巨人娘", "巨大少女", "ジャイアンテス",
        // zh
        "女巨人", "巨大女",
        // ko
        "거대소녀", "거대녀", "자이언테스",
        // th / ar
        "ยักษ์สาว", "عملاقة"
      ]
    },
    {
      id: "ft-inflation",
      name: "Inflation & expansion: keywords",
      kind: "keywords",
      boorus: ["inflation", "belly_inflation", "body_inflation", "cum_inflation", "air_inflation", "breast_expansion", "belly_expansion", "inflation_fetish", "blueberry_inflation", "bloated"],
      description: "Inflation, body and belly inflation, cum inflation and expansion. Plain 'inflation' is included, which is fine on adult sites but would also hit economy posts on Reddit.",
      default: false,
      items: [
        // en
        "Inflation", "Inflated", "Inflate", "Body inflation", "Belly inflation", "Cum inflation", "Air inflation", "Breast expansion",
        "Belly expansion", "Inflation fetish", "Blueberry inflation", "Inflated belly",
        // de
        "Körperaufblähung", "Bauchaufblähung", "Aufblasfetisch",
        // es / fr / it / pt / nl
        "Inflación corporal", "Inflation corporelle", "Gonfiaggio", "Inflação corporal", "Lichaamsopblazing",
        // ru
        "Надувание тела", "Раздувание тела",
        // ja
        "膨腹", "膨張フェチ", "腹部膨張", "風船化",
        // zh
        "身体膨胀", "身體膨脹", "腹部膨胀", "腹部膨脹",
        // ko
        "팽창 페티쉬", "복부 팽창"
      ]
    },
    {
      id: "ft-vore",
      name: "Vore: keywords",
      kind: "keywords",
      boorus: ["vore", "oral_vore", "anal_vore", "cock_vore", "soft_vore", "hard_vore", "unbirthing", "unbirth", "willing_vore", "same_size_vore", "swallowed_whole"],
      description: "Vore and its variants in many languages. Matched as whole words, so 'carnivore' is not hit.",
      default: false,
      items: [
        // en
        "Vore", "Voreaphilia", "Oral vore", "Anal vore", "Cock vore", "Soft vore", "Hard vore", "Willing vore",
        "Unbirth", "Unbirthing", "Swallowed whole", "Vore fetish",
        // es / fr / it / pt
        "Tragada entera", "Avalée entière", "Inghiottita intera", "Engolida inteira",
        // ru
        "Проглатывание целиком",
        // ja
        "丸呑み", "丸飲み", "捕食", "ヴォア",
        // zh
        "吞食", "吞噬", "活吞",
        // ko
        "보어", "통째로 삼킴"
      ]
    }
  ]
});


// ─────────────────────────────────────────────────────────── NTR & cuckold
KWF_CATALOG.push({
  id: "ntr",
  name: "NTR & cuckold",
  description: "NTR, netorare, cuckold, hotwife and cheating-partner vocabulary in many languages and as image-board tags. Off by default.",
  lists: [
    {
      id: "ntr-terms",
      name: "NTR & cuckold: keywords",
      kind: "keywords",
      boorus: ["ntr", "netorare", "netori", "netorase", "cuckold", "cuckolding", "cuckquean", "hotwife", "cheating_(relationship)", "cheating_wife", "cheating_girlfriend", "infidelity", "adultery", "wife_sharing", "stag_and_vixen"],
      description: "Terms starting with = are case-sensitive, so '=NTR' does not hit lowercase text.",
      default: false,
      items: [
        // en
        "=NTR", "Netorare", "Netori", "Netorase", "Cuckold", "Cuckolding", "Cuckolded", "Cuck", "Cuckquean",
        "Hotwife", "Hot wife", "Cheating wife", "Cheating girlfriend", "Cheating husband", "Cheating boyfriend",
        "Wife sharing", "Stag and vixen", "Cuckold husband",
        // de
        "Hahnrei", "Fremdgehen", "Fremdgeherin", "Ehefrau betrügt", "Betrügt ihren Mann", "Fremdgehende Ehefrau",
        // es
        "Cornudo", "Cornudos", "Esposa infiel", "Mujer infiel", "Novia infiel", "Marido cornudo", "Compartir esposa",
        // fr
        "Cocu", "Cocus", "Cocufiage", "Épouse infidèle", "Femme infidèle", "Tromper son mari",
        // it
        "Cornuto", "Cornuti", "Moglie infedele", "Moglie che tradisce",
        // pt
        "Corno manso", "Esposa infiel", "Mulher infiel",
        // nl
        "Hoorndrager", "Vreemdgaan", "Vreemdgaande vrouw",
        // ru
        "Рогоносец", "Рогоносцы", "Куколд", "Куколдинг", "Хотвайф", "Нетораре", "Жена изменяет", "Изменяет мужу",
        // pl
        "Rogacz", "Rogacze", "Żona zdradza", "Zdradza męża",
        // tr
        "Boynuzlu", "Aldatılan koca", "Eşini aldatan",
        // ja
        "寝取られ", "寝取り", "寝取らせ", "寝取", "ネトラレ", "ネトリ", "ネトラセ", "浮気妻",
        // zh
        "绿帽", "綠帽", "戴绿帽", "戴綠帽", "绿帽癖", "綠帽癖", "绿奴", "綠奴", "淫妻", "献妻", "獻妻", "妻子出轨",
        // ko
        "네토라레", "네토리", "네토라세",
        // th / ar / id
        "เมียนอกใจ", "สามีนอกใจ", "ديوث", "زوجة خائنة", "Istri selingkuh"
      ]
    }
  ]
});

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
    default: false,
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
    default: false,
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
        "e621.net", "furaffinity.net", "inkbunny.net", "furrynetwork.com", "sofurry.com", "weasyl.com",
        "*furry*", "*yiff*", "*e621*", "*fursuit*"
      ]
    }
  ]
});

// Tags that do not exist on a given site (checked against its own tag search); skipped when writing that site's blacklist.
const KWF_BOORU_SKIP = {
  "gelbooru.com": ["interracial_yuri", "interracial_couple", "interracial_fellatio", "interracial_yaoi", "interracial_anal", "black_body", "ebony", "asian_male", "asian_futa", "chinese_female", "chinese_male", "korean_female", "korean_male", "filipina", "taiwanese", "indonesian", "indian", "transgender_woman", "transgender_male", "trans_man", "trans_girl", "transfem", "shemale", "gay", "homosexual", "twink", "sissy", "stepmom", "stepdad", "stepfather_and_stepson", "stepsibling", "stepbrother", "stepson", "stepdaughter", "stepcest", "anal_masturbation", "daisy_chain", "mmf", "latina", "latino", "hispanic", "cuban", "venezuelan", "novelai", "feral", "anthro_on_feral", "scalie", "canine", "canid", "felid", "equine", "lagomorph", "kemono", "yiff"]
};

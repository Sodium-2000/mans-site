const mongoose = require('mongoose');
const WeeklyLetter = require('../models/weekly_letter');
// mongoose.connect('mongodb://localhost:27017/mans-db', {
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
})
const weeklyLetters = [
    {
        title: "نعمة الوقت",
        body: "الوقت هو رأس مال المسلم. من حافظ عليه نال البركة، ومن أضاعه خسر. فلنستغل أوقاتنا في الطاعة والذكر."
    },
    {
        title: "التوكل على الله",
        body: "التوكل لا يعني ترك الأسباب، بل بذل الجهد مع الثقة التامة أن النتائج بيد الله وحده."
    },
    {
        title: "برّ الوالدين",
        body: "رضا الله في رضا الوالدين. كلمة طيبة، نظرة رحمة، ودعوة صادقة هي من أعظم البر."
    },
    {
        title: "الصلاة عماد الدين",
        body: "الصلاة صلة بين العبد وربه، من حافظ عليها سعد، ومن ضيّعها خسر. فلنقمها بخشوع وطمأنينة."
    },
    {
        title: "الإحسان إلى الناس",
        body: "الكلمة الطيبة صدقة، والابتسامة عبادة. أحسن إلى الناس كما تحب أن يُحسن إليك."
    },
    {
        title: "ذكر الله",
        body: "اذكر الله كثيرًا، ففي الذكر طمأنينة القلوب وسكينة النفوس. لا يغفل اللسان عن التسبيح والحمد."
    },
    {
        title: "الصبر على البلاء",
        body: "الدنيا دار ابتلاء، ومن صبر نال الأجر والرفعة. اصبر واحتسب، فبعد العسر يسر."
    },
    {
        title: "الإخلاص في العمل",
        body: "أخلص نيتك لله في كل عمل، فإن الله لا يقبل إلا ما كان خالصًا لوجهه الكريم."
    }
];

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected');
})

const reseedDB = async () => {
    await WeeklyLetter.deleteMany({});
    for (let i = 0; i < weeklyLetters.length; i++) {
        const letter = new WeeklyLetter({
            title: weeklyLetters[i].title,
            body: weeklyLetters[i].body,
        })
        await letter.save();
    }
}

const addSeedDB = async () => {
    const letter = new WeeklyLetter({
        title: "احذر لسانك",
        body: "نسلات سي بتاسل ستال ستلا سملتا سمتلا سمتلاس متالستباشيم تبشتلاب خبلاا ةىس بخس\nع تبىمتب خ بيخست بىىسي ب",
    })
    await letter.save();
}
reseedDB();
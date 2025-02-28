const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GAPI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const gemini = async (prompt) => {

    const result = await model.generateContent(`hey suggest me book title based on my previous books title mentioned here ${prompt}, answer only one title with most relevant genre please`);
    console.log(result.response.text());
    return result.response.text();
}
p = ["atomic habbit, be motivated everyday"]
// gemini(p);

module.exports = { gemini };
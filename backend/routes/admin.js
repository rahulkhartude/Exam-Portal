
const express = require("express")
const router = express.Router()

const Question = require("../models/Question")

router.post("/add-question", async (req, res) => {

    console.log("In admin add que called");
    try {

        const { question, options, answer } = req.body
        console.log("question, options, answer",question, options, answer);

        const newQuestion = new Question({
            question,
            options,
            answer
        })

        await newQuestion.save()

        res.json({ message: "Question added" })

    } catch (err) {

        console.log(err)
        res.status(500).json({ error: "Server error" })

    }

})

module.exports = router
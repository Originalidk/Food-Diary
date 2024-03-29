const express = require("express")
const router = express.Router()
const { photos } = require("../models")
const { Op } = require("sequelize");
const { OpenAI } = require("openai");

const openai = new OpenAI();

const generate_desc = async (url) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What’s in this image?" },
            {
              type: "image_url",
              image_url: {
                "url": url,
              },
            },
          ],
        },
      ],
    });
    const description = response.choices[0].message.content;
    return description;
  }

router.get("/", async (req, res) => {
    const listOfPhotos = await photos.findAll({
        where: {
            createdAt: {
                [Op.gte]: new Date(new Date() - (7 * 24 * 60 * 60 * 1000))
            }
        },
        order: [["createdAt", "DESC"]],
    })
    res.json(listOfPhotos)
})

router.post("/", async (req, res) => {
    const photo = req.body
    photo.description = await generate_desc(photo.url)
    await photos.create(photo)
    res.json(photo)
})

module.exports = router
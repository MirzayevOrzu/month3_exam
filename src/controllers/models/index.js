const express = require("express");
const config=require('../../shared/config')
const path = require("path");
const fs = require("fs");
const db = require("../../db");

/**
 * Modellarni qo'shish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const postModel = async (req, res) => {
  try {
    let elem = req.files.filter((file, index) => {
      return file.mimetype == "application/json";
    });

    let count = 0;
    let images_name = "";
    let images = req.files.filter(
      (file, index) => file.mimetype == "image/jpeg"
    );
    images.forEach((file) => {
      if (count != 0) {
        images_name += " or " + 'http://'+config.db.host+':'+config.port+'/'+ file.originalname;
        count++;
      } else {
        images_name = 'http://'+config.db.host+':'+config.port+'/'+ file.originalname;
        count++;
      }
    });
    console.log(images, images_name, "qqqqqqqqqqqqqqqq");
    let model = {};
    req.files.forEach((file) => {
      fs.writeFile(
        path.join("public", file.originalname),
        file.buffer,
        (err) => {
          if (err) {
            return res.status(500);
          }
        }
      );
    });
    console.log("ssssssssss");

    let data = await (
      await fs.promises.readFile(path.join("public", elem[0].originalname))
    ).toString();
    data = JSON.parse(data);
    console.log(data, "data");
    model = await db("models")
      .insert({
        ...data,
        images: images_name,
      })
      .returning("*");
    console.log("aaaaaaaaaaaaa", data, model);

    res.status(200).json({
      message: "OK",
      model,
    });
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

/**
 * Modellarni olish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const getModel = async (req, res) => {
  try {
    const models=await db('models')

    models.forEach(model => {
      if(model.images){
        model.images=model.images.split(' or ')
      }
    });
    res.status(200).json(models)
  } 
  catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

module.exports = {
  postModel,
  getModel
};

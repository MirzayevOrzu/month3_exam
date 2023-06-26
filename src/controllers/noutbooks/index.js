const express = require("express");
const config = require("../../shared/config");
const path = require("path");
const fs = require("fs");
const db = require("../../db");

/**
 * Modellarni qo'shish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const postNoutbook = async (req, res) => {
  try {
    // if(req.files){
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
        images_name +=
          " or " +
          "http://" +
          config.db.host +
          ":" +
          config.port +
          "/" +
          file.originalname;
        count++;
      } else {
        images_name =
          "http://" +
          config.db.host +
          ":" +
          config.port +
          "/" +
          file.originalname;
        count++;
      }
    });

    let noutbook = {};
    req.files.forEach((file) => {
      fs.writeFile(
        path.join("public", "noutbooks", file.originalname),
        file.buffer,
        (err) => {
          if (err) {
            return res.status(500);
          }
        }
      );
    });

    let data = await (
      await fs.promises.readFile(
        path.join("public", "noutbooks", elem[0].originalname)
      )
    ).toString();

    data = JSON.parse(data);
    noutbook = await db("noutbooks")
      .insert({
        ...data,
        images: images_name,
      })
      .returning("*");

    noutbook.forEach((nout) => {
      if (nout.images) {
        nout.images = nout.images.split(" or ");
      }
    });

    res.status(200).json({
      message: "OK",
      noutbook,
    });
    // }
    // else{
    //     const {...changes}=req.body
    // }
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
const getNoutbooks = async (req, res) => {
  try {
    const noutbooks = await db("noutbooks");

    noutbooks.forEach((noutbook) => {
      if (noutbook.images) {
        noutbook.images = noutbook.images.split(" or ");
      }
    });
    res.status(200).json(noutbooks);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

module.exports = {
  postNoutbook,
  getNoutbooks
};

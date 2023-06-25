const express = require("express");
const db = require("../../db");
/**
 * Category qo'shish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const postCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const a = await db("categories")
    
    res.status(200).json({
      mm: name,
      a
    });
  } catch (error) {
    res.status(400).json({
      mess: error.message,
    });
  }
};

module.exports = {
  postCategory,
};

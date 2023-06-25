const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt=require('bcrypt')
const config = require("../../shared/config");
const db = require("../../db");

/**
 * Login users
 * Adminlar tizimga kirishi uchun login qilish
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await db("users")
      .where({ username })
      .select("id", "password", "role")
      .first();

    if (!existing) {
      return res.status(401).json({
        error: "Username yoki password xato.",
      });
    }
    const comparePassword=await bcrypt.compare(password,existing.password)
    if (!comparePassword) {
      return res.status(401).json({
        error: "Username yoki password xato.",
      });
    }

    const token = jwt.sign(
      { id: existing.id, role: existing.role },
      config.jwt.secret,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  loginUser,
};

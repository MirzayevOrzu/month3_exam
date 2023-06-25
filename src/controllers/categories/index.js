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

    const category = await db("categories").insert(req.body).returning("*");

    res.status(200).json({
      category,
    });
  } catch (error) {
    res.status(400).json({
      mess: error.message,
    });
  }
};

/**
 * Category qo'shish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const getCategory = async (req, res) => {
  try {
    let { order_by='id', q } = req.query;
    let { limit = 4, offset = 0 } = req.body;

      order_by = order_by.split("-");

    let dbQuery = db("categories").select("id", "name");

    if (q) {
      dbQuery.andWhereILike("categories.name", `%${q}%`);
    }

    const total = await dbQuery.clone().count().groupBy("id");

    dbQuery.orderBy(...order_by);
    dbQuery.limit(limit).offset(offset);

    const categories = await dbQuery;

    res.status(200).json({
      data: categories,
      pageInfo: {
        total: total.length,
        limit,
        offset,
      },
    });
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

/**
 * Category o'chirish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db('categories').where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idle category topilmadi`,
      });
    }

    const deleted = await db('categories')
      .where({ id })
      .delete()
      .returning(['id', 'name']);

    res.status(200).json({
      deleted: deleted[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Category tahrirlash uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const patchCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await db('categories').where({ id }).update(req.body).returning('*');

    res.status(200).json({
      updated: updated[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};



module.exports = {
  postCategory,
  getCategory,
  deleteCategory,
  patchCategory
};

const express = require("express");
const db = require("../../db");

/**
 * Brand qo'shish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const postBrand = async (req, res) => {
  try {
    const { name } = req.body;

    const brand = await db("brands").insert(req.body).returning("*");

    res.status(200).json({
      brand,
    });
  } catch (error) {
    res.status(400).json({
      mess: error.message,
    });
  }
};

/**
 * Brandlarning ro'yhatini olish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const getBrands = async (req, res) => {
  try {
    let { order_by = "id", q } = req.query;
    let { limit = 4, offset = 0 } = req.body;

    order_by = order_by.split("-");

    let dbQuery = db("brands").select("id", "name");

    if (q) {
      dbQuery.andWhereILike("brands.name", `%${q}%`);
    }

    const total = await dbQuery.clone().count().groupBy("id");

    dbQuery.orderBy(...order_by);
    dbQuery.limit(limit).offset(offset);

    const brands = await dbQuery;

    res.status(200).json({
      data: brands,
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
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db("brands").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idle brand topilmadi`,
      });
    }

    const deleted = await db("brands")
      .where({ id })
      .delete()
      .returning(["id", "name"]);

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
const patchBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await db("brands")
      .where({ id })
      .update(req.body)
      .returning("*");

    res.status(200).json({
      updated: updated[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Bitta brandning modellarini olish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const showBrand = async (req, res) => {
  try {
    const { name } = req.params;

    const brand = await db("brands")
      .select("id", "name")
      .where({ name })
      .first();

    if (!brand) {
      return res.status(404).json({
        error: "Brand topilmadi.",
      });
    }

    const models = await db("models").where({ brand_id: brand.id });

    models.forEach((model) => {
      if (model.images) {
        model.images = model.images.split(" or ");
      }
    });

    if (!models) {
      res.status(500).json({
        error,
      });
    }

    res.status(200).json({
      brand: {
        ...brand,
        models,
      },
    });
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

module.exports = {
  postBrand,
  getBrands,
  deleteBrand,
  patchBrand,
  showBrand,
};

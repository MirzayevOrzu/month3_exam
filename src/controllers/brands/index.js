const express = require("express");
const db = require("../../db");
const { BadReqqustError, NotFoundError } = require("../../shared/errors");

/**
 * Brand qo'shish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const postBrand = async (req, res, next) => {
  try {
    const { name } = req.body;

    const brand = await db("brands").insert(req.body).returning("*");

    res.status(200).json({
      brand,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Brandlarning ro'yhatini olish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const getBrands = async (req, res, next) => {
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
    next(err);
  }
};

/**
 * Brand o'chirish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await db("brands").where({ id }).first();

    if (!existing) {
      throw new BadReqqustError(` ${id}lik Brand  mavjud emas`);
    }

    const deleted = await db("brands")
      .where({ id })
      .delete()
      .returning(["id", "name"]);

    res.status(200).json({
      deleted: deleted[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Brandni tahrirlash uchun yo'l
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
    if (!updated[0]) {
      throw new NotFoundError(`${id}lik brand mavjud emas`);
    }
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
const showBrand = async (req, res, next) => {
  try {
    const { name } = req.params;

    const brand = await db("brands")
      .select("id", "name")
      .where({ name })
      .first();

    if (!brand) {
      throw new BadReqqustError("Brand mavjud emas");
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
    next(err);
  }
};

/**
 * Bitta modelning noutbooklarini olish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const showBrandModel = async (req, res, next) => {
  try {
    const { brand_name, model_name } = req.params;

    const models = await db("models")
      .leftJoin("brands", "models.brand_id", "brands.id")
      .leftJoin("noutbooks", "models.id", "noutbooks.model_id")
      .select(
        "models.id",
        "models.name as model_name",
        "models.images as model_images",
        "brands.name as brand_name",
        db.raw(`
    COALESCE(
      json_agg(
        json_build_object(
        'id', noutbooks.id,
        'name', noutbooks.name,
        'price',noutbooks.price,
        'description',noutbooks.description,
        'xotirasi',noutbooks.xotirasi,
        'protsessor',noutbooks.protsessor,
        'rangi',noutbooks.rangi,
        'ekran_diagonali',noutbooks.ekran_diagonali,
        'images', noutbooks.images
      ) 
    )filter (where noutbooks.id IS NOT NULL), '[]') as noutbooks
    `)
      )
      .where({ "models.name": model_name, "brands.name": brand_name })
      .groupBy("models.id", "brands.id");

    models[0].noutbooks.forEach((nout) => {
      if (nout.images) {
        nout.images = nout.images.split(" or ");
      }
    });

    res.status(200).json(...models);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postBrand,
  getBrands,
  deleteBrand,
  patchBrand,
  showBrand,
  showBrandModel,
};

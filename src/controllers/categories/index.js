const express = require("express");
const db = require("../../db");
const { NotFoundError,BadReqqustError } = require("../../shared/errors");

/**
 * Category qo'shish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const postCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = await db("categories").insert(req.body).returning("*");

    res.status(200).json({
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Category qo'shish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const getCategory = async (req, res, next) => {
  try {
    let { order_by = "id", q } = req.query;
    let { limit = 14, offset = 0 } = req.body;

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
    next(err);
  }
};

/**
 * Category o'chirish uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await db("categories").where({ id }).first();

    if (!existing) {
      throw new NotFoundError(`Categoriya topilmadi.`);
    }

    const deleted = await db("categories")
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
 * Category tahrirlash uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const patchCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await db("categories").where({ id }).first();

    if (!existing) {
      throw new NotFoundError(`${id} lik Categoriya topilmadi.`);
    }

    const updated = await db("categories")
      .where({ id })
      .update(req.body)
      .returning("*");

    res.status(200).json({
      updated: updated[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Category tahrirlash uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const showCategoryNoutbooks = async (req, res, next) => {
  try {
    const { category_name } = req.params;
    let { order_by = "id", q } = req.query;
    let { limit = 16, offset = 0 } = req.body;
    order_by = order_by.split("-");
    const dbQuery2 = await db("categories").where({ name: category_name });

    if (!dbQuery2[0]) {
      throw new NotFoundError(
        `Categoriyasi ${category_name} bo'lgan categories topimadi`
      );
    }

    const dbQuery3 = db("noutbooks").where({ category_id: dbQuery2[0].id });

    if (!dbQuery3) {
      throw new NotFoundError(
        `Categoriyasi ${category_name} bo'lgan noutbook topimadi`
      );
    }

    /**
     * Izohga olingan kodda data join qilib olingan lekin categoryga noutbooklarni join qilganim
     *  uchun noutbooklarga nisbatan sort qilib bo'lmadi shuning uchun o'zgartirdim
     */

    // let dbQuery = db("categories")
    //   .leftJoin("noutbooks", "categories.id", "noutbooks.category_id")
    //   .select(
    //     "categories.id",
    //     "categories.name as category",
    //     db.raw(`
    // COALESCE(
    //   json_agg(
    //     json_build_object(
    //     'id', noutbooks.id,
    //     'name', noutbooks.name,
    //     'price',noutbooks.price,
    //     'description',noutbooks.description,
    //     'xotirasi',noutbooks.xotirasi,
    //     'protsessor',noutbooks.protsessor,
    //     'rangi',noutbooks.rangi,
    //     'ekran_diagonali',noutbooks.ekran_diagonali,
    //     'images', noutbooks.images
    //   )
    // )filter (where noutbooks.id IS NOT NULL), '[]') as noutbooks
    // `)
    //   )
    //   .where({ "categories.name": category_name })
    //   .groupBy("categories.id");

    if (q) {
      dbQuery3.andWhereILike("noutbooks.name", `%${q}%`);
    }

    const total = await dbQuery3.clone().count();
    dbQuery3.orderBy(...order_by);
    dbQuery3.limit(limit).offset(offset);

    const noutbooks = await dbQuery3;

    noutbooks.forEach((nout) => {
      if (nout.images) {
        nout.images = nout.images.split(" or ");
      }
    });

    // const categories = await dbQuery;
    res.status(200).json({
      // data: { ...categories[0] },
      data: {
        category_name,
        noutbooks,
      },
      pageInfo: {
        total: +total[0].count,
        limit,
        offset,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Category tahrirlash uchun yo'l
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const showCtegoryBrands = async (req, res,next) => {
  try {
    const { category_name, brand_name } = req.params;
    let { order_by = "id", q } = req.query;
    let { limit = 16, offset = 0 } = req.body;

    order_by = order_by.split("-");

    let dbQuery = db("categories")
      .leftJoin("noutbooks", "categories.id", "noutbooks.category_id")
      .select(
        "categories.id",
        "categories.name as category",
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
      .where({ "categories.name": category_name })
      .groupBy("categories.id");

    // if (q) {
    //   dbQuery3.andWhereILike("noutbooks.name", `%${q}%`);
    // }

    // const total = await dbQuery3.clone().count();
    // dbQuery3.orderBy(...order_by);
    // dbQuery3.limit(limit).offset(offset);

    // const noutbooks = await dbQuery3;
    const categories = await dbQuery;
    const category_brand_noutbooks = [];

    categories[0].noutbooks.forEach((nout) => {
      
      if (nout.images) {
        nout.images = nout.images.split(" or ");
      }

      if (nout.name.split(" ")[0] == brand_name) {
        category_brand_noutbooks.push(nout);
      }
    });

    res.status(200).json({
      data: category_brand_noutbooks,
      pageInfo: {
        limit,
        offset,
      },
    });
  } catch (err) {
   next(err)
  }
};

module.exports = {
  postCategory,
  getCategory,
  deleteCategory,
  patchCategory,
  showCategoryNoutbooks,
  showCtegoryBrands,
};

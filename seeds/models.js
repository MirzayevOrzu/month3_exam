/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("models").del();
  await knex("models").insert([
    { brand_id: 1, name: "Envy" },
    { brand_id: 1, name: "Victus" },
    { brand_id: 1, name: "Pavilion" },
    { brand_id: 3, name: "XPS" },
    { brand_id: 3, name: "Inspiron" },
  ]);
};

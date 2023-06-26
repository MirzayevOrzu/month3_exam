/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("models", (table) => {
    table.increments("id").primary();
    table.string("name").unique();
    table.string("images");
    table
      .integer("brand_id")
      .references("id")
      .inTable("brands")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};

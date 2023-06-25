/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("models", (table) => {
    table.increments("id").primary();
    table.string("name").unique();
    table
      .integer("brend_id")
      .references("id")
      .inTable("brends")
      .onDelete("CASCADE");
      table.string('image')
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};

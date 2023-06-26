/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('noutbooks',(table)=>{
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('price');
    table.string('description');
    table.integer('model_id').references('id').inTable('models').onDelete('CASCADE');
    table.integer('category_id').references('id').inTable('categories').onDelete('SET NULL');
    table.string('protsessor').notNullable();
    table.string('xotirasi').notNullable();
    table.string('ekran_diagonali');
    table.string('rangi');
    table.string("images");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('noutbooks')
};

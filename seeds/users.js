const bcrypt=require('bcrypt')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      first_name:"Akram",
      last_name:"G'aniyev",
      role:'admin',
      username:"admin001",
      password: bcrypt.hashSync('12345',10)
    },
    {
      first_name:"Akram",
      last_name:"Usmonov",
      role:'admin',
      username:"admin002",
      password: bcrypt.hashSync('12345',10)
    }
  ]);
};

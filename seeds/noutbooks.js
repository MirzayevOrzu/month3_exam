/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("noutbooks").del();
  await knex("noutbooks").insert([
    {
      name: "HP EliteBook",
      price: 122100,
      description:
        "A high-end business laptop with powerful specs and great build quality",
      model_id: 1,
      category_id: 2,
      protsessor: "Intel Core i7-1165G7",
      xotirasi: "512GB SSD",
      ekran_diagonali: "14 inch",
      rangi: "Silver",
      images: "/images/hp_elitebook.jpg",
    },
    {
      name: "Dell XPS 13",
      price: 1092129,
      description:
        "A premium ultrabook with a stunning design and top-notch performance",
      model_id: 2,
      category_id: 2,
      protsessor: "Intel Core i7-1185G7",
      xotirasi: "512GB SSD",
      ekran_diagonali: "13.4 inch",
      rangi: "Platinum Silver with Black Carbon Fiber Palmrest",
      images: "/images/dell_xps_13.jpg",
    },
    {
      name: "Apple MacBook Air M1 ",
      price:199912,
      description:
        "A slim and lightweight laptop with Apple's new M1 chip for impressive performance and battery life.",
      model_id: 3,
      category_id: 2,
      protsessor: "Apple M1 chip",
      xotirasi: "256GB SSD",
      ekran_diagonali: "13.3 inch",
      rangi: "Rose Gold",
      images: "/images/macbook_air.jpg",
    },
  ]);
};

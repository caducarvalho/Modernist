# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_06_08_021946) do

  create_table "categories", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.string "details"
    t.index ["user_id"], name: "index_categories_on_user_id"
  end

  create_table "icons", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tasks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "task"
    t.datetime "due_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.string "details"
    t.bigint "category_id"
    t.boolean "completed", default: false
    t.bigint "icon_id"
    t.index ["category_id"], name: "index_tasks_on_category_id"
    t.index ["icon_id"], name: "index_tasks_on_icon_id"
  end

  create_table "themes", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "color", limit: 7
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "code"
    t.string "name", limit: 14
    t.string "variation"
  end

  create_table "users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "theme_id"
    t.index ["theme_id"], name: "index_users_on_theme_id"
  end

  add_foreign_key "categories", "users"
  add_foreign_key "tasks", "categories"
  add_foreign_key "tasks", "icons"
  add_foreign_key "users", "themes"
end

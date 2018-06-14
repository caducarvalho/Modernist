class AddDetailsToCategory < ActiveRecord::Migration[5.2]
  def change
    add_column :categories, :details, :string
  end
end
